import assert from 'node:assert/strict';
import test from 'node:test';

import { createWebSocketTransport } from '#src/content/main/infrastructure/websocket-transport.js';

class FakeWebSocket {
    static OPEN = 1;

    constructor() {
        this.readyState = FakeWebSocket.OPEN;
        this.listeners = new Map();
        this.sent = [];
        FakeWebSocket.instance = this;
    }

    addEventListener(type, listener) {
        this.listeners.set(type, listener);
    }

    send(data) {
        if (this.sendError) {
            throw this.sendError;
        }
        this.sent.push(data);
    }

    respond(data) {
        this.listeners.get('message')({ data: JSON.stringify(data) });
    }
}

function createLogger() {
    const logger = {
        createChildLogger() {
            return logger;
        },
        log() { }
    };
    return logger;
}

function setup(options = {}) {
    let time = 100;
    const timers = [];
    const root = {};
    const previousWindow = globalThis.window;
    globalThis.window = root;
    let transport;
    try {
        transport = createWebSocketTransport({
            WebSocketClass: FakeWebSocket,
            cryptoApi: { randomUUID: () => 'request-1' },
            logger: createLogger(),
            now: () => time,
            setTimeoutFn: (callback) => {
                timers.push(callback);
                return timers.length;
            },
            clearTimeoutFn: () => { },
            ...options
        });
    } finally {
        if (previousWindow === undefined) {
            delete globalThis.window;
        } else {
            globalThis.window = previousWindow;
        }
    }
    const socket = new root.WebSocket('wss://example.test');
    return { transport, socket, timers, advance: (milliseconds) => {
        time += milliseconds;
    } };
}

test('createWebSocketTransport should preserve successful response when diagnostics are recorded', async () => {
    // Given
    const { transport, socket, advance } = setup();
    const response = { RequestId: 'request-1', IsSuccess: true, Value: { Count: 2 } };

    // When
    const promise = transport.sendRequest('Users', 'Get', 'School', { Page: 1 });
    advance(12);
    socket.respond(response);
    const resolved = await promise;
    const diagnostics = transport.getResponseDiagnostics(resolved);

    // Then
    assert.deepEqual(resolved, response);
    assert.deepEqual(diagnostics, {
        request: {
            controller: 'Users', method: 'Get', projectName: 'School',
            requestId: 'request-1', startedAt: 100, value: { Page: 1 }
        },
        response: {
            requestId: 'request-1', success: true, errorCode: null,
            className: null, method: null, elapsedMs: 12, value: { Count: 2 }
        }
    });
    assert.deepEqual(Object.keys(resolved), Object.keys(response));
});

test('createWebSocketTransport should attach response diagnostics when server rejects request', async () => {
    // Given
    const { transport, socket, advance } = setup();

    // When
    const promise = transport.sendRequest('Users', 'Create', 'School', { Name: 'Sam' });
    advance(5);
    socket.respond({
        RequestId: 'request-1', IsSuccess: false, ErrorCode: 'DUPLICATE',
        Class: 'UserService', Method: 'Create', Message: 'Already exists'
    });

    // Then
    await assert.rejects(promise, (error) => {
        assert.equal(error.code, 'SERVER_REJECTED');
        assert.deepEqual(error.diagnostics.response, {
            requestId: 'request-1', success: false, errorCode: 'DUPLICATE',
            className: 'UserService', method: 'Create', elapsedMs: 5,
            serverMessage: 'Already exists'
        });
        return true;
    });
});

test('createWebSocketTransport should attach request diagnostics when request times out', async () => {
    // Given
    const { transport, timers } = setup({ requestTimeoutMs: 9 });

    // When
    const promise = transport.sendRequest('Lessons', 'Get', 'Books', { LessonId: 7 });
    timers[0]();

    // Then
    await assert.rejects(promise, (error) => {
        assert.equal(error.code, 'REQUEST_TIMEOUT');
        assert.equal(error.diagnostics.request.requestId, 'request-1');
        assert.deepEqual(error.diagnostics.request.value, { LessonId: 7 });
        return true;
    });
});

test('createWebSocketTransport should attach request diagnostics when socket send fails synchronously', async () => {
    // Given
    const { transport, socket } = setup();
    socket.sendError = new Error('socket closed');

    // When
    const promise = transport.sendRequest('Lessons', 'Save', 'Books', { LessonId: 7 });

    // Then
    await assert.rejects(
        promise,
        (error) => error.code === 'SEND_FAILED'
            && error.diagnostics.request.controller === 'Lessons'
    );
});

test('createWebSocketTransport should preserve complete fields when diagnostics contain sensitive or large values', async () => {
    // Given
    const { transport, socket } = setup();
    const long = 'x'.repeat(800);
    const deep = { a: { b: { c: { d: { token: 'deep-secret' } } } } };
    const wide = Object.fromEntries(Array.from({ length: 40 }, (_, index) => [`k${index}`, index]));

    // When
    const promise = transport.sendRequest('Users', 'Onboard', 'School', {
        Email: 'learner@example.test', Password: 'nope', UserDetails: { Name: 'Lee' },
        Authorization: 'Bearer token', SessionId: 'session', SafeCount: 3, long, deep, wide
    });
    socket.respond({
        RequestId: 'request-1', IsSuccess: true,
        Value: { Cookie: 'raw', ImageData: 'raw', SafeCount: 3, long, deep, wide }
    });
    const diagnostics = transport.getResponseDiagnostics(await promise);

    // Then
    assert.equal(diagnostics.request.value.Authorization, 'Bearer token');
    assert.equal(diagnostics.request.value.long, long);
    assert.deepEqual(diagnostics.request.value.deep, deep);
    assert.deepEqual(diagnostics.request.value.wide, wide);
    assert.equal(diagnostics.response.value.Cookie, 'raw');
    assert.deepEqual(diagnostics.response.value, { Cookie: 'raw', ImageData: 'raw', SafeCount: 3, long, deep, wide });
});

test('createWebSocketTransport should preserve malformed server payload when rejection diagnostics are recorded', async () => {
    // Given
    const { transport, socket } = setup();

    // When
    const promise = transport.sendRequest('Users', 'Create', 'School', {});
    socket.respond({
        RequestId: 'request-1', IsSuccess: false,
        ErrorCode: { unexpected: true }, Message: { private: 'payload' }
    });

    // Then
    await assert.rejects(promise, (error) => {
        assert.equal(error.code, 'SERVER_REJECTED');
        assert.deepEqual(error.diagnostics.response.serverMessage, { private: 'payload' });
        assert.deepEqual(Object.keys(error.diagnostics.response), [
            'requestId', 'success', 'errorCode', 'className', 'method',
            'elapsedMs', 'serverMessage'
        ]);
        return true;
    });
});
