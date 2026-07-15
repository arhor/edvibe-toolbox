const test = require('node:test');
const assert = require('node:assert/strict');

const { createWebSocketTransport } = require('../src/shared/websocket-transport.js');

class FakeWebSocket {
    static OPEN = 1;

    constructor(url) {
        this.url = url;
        this.readyState = FakeWebSocket.OPEN;
        this.listeners = new Map();
        this.sent = [];
    }

    addEventListener(type, listener) {
        this.listeners.set(type, listener);
    }

    send(payload) {
        this.sent.push(payload);
    }

    receive(payload) {
        this.listeners.get('message')?.({ data: JSON.stringify(payload) });
    }
}

test('transport intercepts a socket and resolves its correlated response', async () => {
    const root = { WebSocket: FakeWebSocket };
    const transport = createWebSocketTransport({
        WebSocketClass: FakeWebSocket,
        cryptoApi: { randomUUID: () => 'request-1' },
        log() {}
    });
    transport.install(root);

    const socket = new root.WebSocket('wss://example.test');
    const responsePromise = transport.sendRequest(
        'LessonWsController',
        'GetLessonWithId',
        'Books',
        { LessonId: 42 }
    );
    const packet = JSON.parse(socket.sent[0]);

    assert.deepEqual(packet, {
        Controller: 'LessonWsController',
        Method: 'GetLessonWithId',
        ProjectName: 'Books',
        RequestId: 'request-1',
        Value: JSON.stringify({ LessonId: 42 })
    });

    socket.receive({
        RequestId: 'request-1',
        IsSuccess: true,
        Value: { Id: 42 }
    });

    assert.deepEqual(await responsePromise, {
        RequestId: 'request-1',
        IsSuccess: true,
        Value: { Id: 42 }
    });
});

test('transport rejects when no intercepted socket is open', async () => {
    const transport = createWebSocketTransport({
        WebSocketClass: FakeWebSocket,
        cryptoApi: { randomUUID: () => 'request-2' },
        log() {}
    });

    await assert.rejects(
        transport.sendRequest('Controller', 'Method', 'Project', {}),
        /Active WebSocket connection is missing/
    );
});

test('transport sends fire-and-forget packets through the active socket', () => {
    const root = { WebSocket: FakeWebSocket };
    const transport = createWebSocketTransport({
        WebSocketClass: FakeWebSocket,
        cryptoApi: { randomUUID: () => 'request-3' },
        log() {}
    });
    transport.install(root);
    const socket = new root.WebSocket('wss://example.test');

    transport.sendWithoutResponse('Controller', 'Method', 'Project', { Id: 7 });

    assert.equal(JSON.parse(socket.sent[0]).RequestId, 'request-3');
});

test('transport writes messages through its injected log function', () => {
    const root = { WebSocket: FakeWebSocket };
    const calls = [];
    const transport = createWebSocketTransport({
        WebSocketClass: FakeWebSocket,
        cryptoApi: { randomUUID: () => 'request-log' },
        log: (...args) => calls.push(args)
    });

    transport.install(root);
    new root.WebSocket('wss://example.test');

    assert.deepEqual(calls, [[
        'Intercepting WebSocket targeting:',
        'wss://example.test'
    ]]);
});
