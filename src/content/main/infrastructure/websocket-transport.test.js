import assert from 'node:assert/strict';
import test from 'node:test';

import { createWebSocketTransport } from '#src/content/main/infrastructure/websocket-transport.js';

class FakeWebSocket {
    static CONNECTING = 0;
    static OPEN = 1;
    static CLOSING = 2;
    static CLOSED = 3;
    static customStatic = 'preserved';
    static instances = [];

    constructor(url, protocols) {
        this.url = url;
        this.protocols = protocols;
        this.readyState = FakeWebSocket.OPEN;
        this.listeners = new Map();
        this.sent = [];
        FakeWebSocket.instances.push(this);
    }

    addEventListener(type, listener) {
        const listeners = this.listeners.get(type) || [];
        listeners.push(listener);
        this.listeners.set(type, listeners);
    }

    dispatch(type, event = {}) {
        for (const listener of this.listeners.get(type) || []) {
            listener(event);
        }
    }

    send(data) {
        if (this.sendError) {
            throw this.sendError;
        }
        if (this.readyState !== FakeWebSocket.OPEN) {
            throw new Error('socket closed');
        }
        this.sent.push(data);
    }

    respond(data) {
        this.dispatch('message', { data: JSON.stringify(data) });
    }

    receive(data) {
        this.dispatch('message', { data });
    }

    close() {
        this.readyState = FakeWebSocket.CLOSED;
        this.dispatch('close');
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

function pageRequest(requestId = 'page-request') {
    return JSON.stringify({
        Controller: 'Lessons',
        Method: 'Get',
        ProjectName: 'Books',
        RequestId: requestId,
        Value: '{}'
    });
}

function qualify(socket, requestId) {
    socket.send(pageRequest(requestId));
}

function setup(options = {}) {
    let time = 100;
    const timers = [];
    const root = {};
    const previousWindow = globalThis.window;
    FakeWebSocket.instances = [];
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
    qualify(socket, 'bootstrap-request');
    return {
        transport,
        root,
        socket,
        timers,
        advance: (milliseconds) => {
            time += milliseconds;
        }
    };
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

test('createWebSocketTransport should preserve native constructor and static semantics', () => {
    // Given
    const { root } = setup();

    // When
    const socket = new root.WebSocket('wss://compat.test', ['json']);

    // Then
    assert.equal(root.WebSocket.OPEN, FakeWebSocket.OPEN);
    assert.equal(root.WebSocket.CLOSED, FakeWebSocket.CLOSED);
    assert.equal(root.WebSocket.customStatic, 'preserved');
    assert.equal(root.WebSocket.prototype, FakeWebSocket.prototype);
    assert.equal(socket.url, 'wss://compat.test');
    assert.deepEqual(socket.protocols, ['json']);
    assert.ok(socket instanceof root.WebSocket);
    assert.ok(socket instanceof FakeWebSocket);
    assert.throws(() => root.WebSocket('wss://compat.test'), TypeError);
});

test('createWebSocketTransport should not let an unrelated newer socket steal Toolbox traffic', () => {
    // Given
    const { transport, root, socket: edvibeSocket } = setup();
    edvibeSocket.sent = [];
    const unrelatedSocket = new root.WebSocket('wss://unrelated.test');
    unrelatedSocket.send(JSON.stringify({ type: 'presence', RequestId: 'other' }));

    // When
    transport.sendWithoutResponse('Lessons', 'Save', 'Books', { LessonId: 7 });

    // Then
    assert.equal(edvibeSocket.sent.length, 1);
    assert.equal(unrelatedSocket.sent.length, 1);
    assert.equal(JSON.parse(edvibeSocket.sent[0]).Controller, 'Lessons');
});

test('createWebSocketTransport should switch only to a qualified replacement and not fall back to a stale socket', async () => {
    // Given
    const { transport, root, socket: firstSocket } = setup();
    firstSocket.sent = [];
    const replacementSocket = new root.WebSocket('wss://replacement.test');
    qualify(replacementSocket, 'replacement-bootstrap');
    replacementSocket.sent = [];

    // When
    transport.sendWithoutResponse('Lessons', 'Save', 'Books', { LessonId: 8 });
    replacementSocket.close();

    // Then
    assert.equal(firstSocket.sent.length, 0);
    assert.equal(replacementSocket.sent.length, 1);
    assert.deepEqual(transport.getConnectionState(), { isOpen: false });
    await assert.rejects(
        transport.sendRequest('Lessons', 'Get', 'Books', { LessonId: 8 }),
        (error) => error.code === 'WS_UNAVAILABLE'
    );

    // When a reconnect appears
    const reconnectedSocket = new root.WebSocket('wss://reconnected.test');
    qualify(reconnectedSocket, 'reconnected-bootstrap');
    reconnectedSocket.sent = [];
    transport.sendWithoutResponse('Lessons', 'Save', 'Books', { LessonId: 9 });

    // Then the reconnect becomes authoritative
    assert.equal(reconnectedSocket.sent.length, 1);
    assert.deepEqual(transport.getConnectionState(), { isOpen: true });
});

test('createWebSocketTransport should ignore matching request IDs received on another socket', async () => {
    // Given
    const { transport, root, socket: edvibeSocket } = setup();
    const unrelatedSocket = new root.WebSocket('wss://unrelated.test');

    // When
    const promise = transport.sendRequest('Users', 'Get', 'School', { Page: 1 });
    unrelatedSocket.respond({ RequestId: 'request-1', IsSuccess: true, Value: { wrong: true } });
    edvibeSocket.respond({ RequestId: 'request-1', IsSuccess: true, Value: { right: true } });
    const response = await promise;
    edvibeSocket.sent = [];
    unrelatedSocket.sent = [];
    transport.sendWithoutResponse('Lessons', 'Save', 'Books', { LessonId: 11 });

    // Then
    assert.deepEqual(response, {
        RequestId: 'request-1', IsSuccess: true, Value: { right: true }
    });
    assert.equal(edvibeSocket.sent.length, 1);
    assert.equal(unrelatedSocket.sent.length, 0);
});

test('createWebSocketTransport should keep frame observation and Toolbox origin tagging across sockets', () => {
    // Given
    const { transport, root, socket: edvibeSocket } = setup();
    const frames = [];
    transport.subscribeFrames((frame) => frames.push(frame));
    edvibeSocket.sent = [];
    const unrelatedSocket = new root.WebSocket('wss://unrelated.test');

    // When
    unrelatedSocket.send('plain-page-frame');
    transport.sendWithoutResponse('Lessons', 'Save', 'Books', { LessonId: 10 });

    // Then
    assert.equal(frames.length, 2);
    assert.deepEqual(
        frames.map(({ direction, socketId, origin, data }) => ({ direction, socketId, origin, data })),
        [
            {
                direction: 'outbound', socketId: 2, origin: 'page',
                data: 'plain-page-frame'
            },
            {
                direction: 'outbound', socketId: 1, origin: 'toolbox',
                data: edvibeSocket.sent[0]
            }
        ]
    );
});
