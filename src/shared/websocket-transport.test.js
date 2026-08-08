const test = require('node:test');
const assert = require('node:assert/strict');

const { createWebSocketTransport } = require('./websocket-transport.js');

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
        return this.sent.length;
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

test('transport exposes connection state and typed unavailable errors', async () => {
    const root = { WebSocket: FakeWebSocket };
    const transport = createWebSocketTransport({
        WebSocketClass: FakeWebSocket,
        cryptoApi: { randomUUID: () => 'request-state' },
        log() {}
    });

    assert.deepEqual(transport.getConnectionState(), { isOpen: false });
    await assert.rejects(
        transport.sendRequest('Controller', 'Method', 'Project', {}),
        (error) => error.code === 'WS_UNAVAILABLE'
            && error.controller === 'Controller'
            && error.method === 'Method'
    );

    transport.install(root);
    new root.WebSocket('wss://example.test');
    assert.deepEqual(transport.getConnectionState(), { isOpen: true });
});

test('transport rejects timed out requests with typed request metadata', async () => {
    const root = { WebSocket: FakeWebSocket };
    let timeoutCallback;
    const transport = createWebSocketTransport({
        WebSocketClass: FakeWebSocket,
        cryptoApi: { randomUUID: () => 'request-timeout' },
        requestTimeoutMs: 20,
        setTimeoutFn(callback) {
            timeoutCallback = callback;
            return 'timeout-id';
        },
        clearTimeoutFn() {},
        log() {}
    });
    transport.install(root);
    new root.WebSocket('wss://example.test');

    const response = transport.sendRequest('Controller', 'Method', 'Project', {});
    timeoutCallback();

    await assert.rejects(response, (error) => error.code === 'REQUEST_TIMEOUT'
        && error.controller === 'Controller'
        && error.method === 'Method'
        && error.requestId === 'request-timeout');
});

test('transport rejects server errors with typed request and server metadata', async () => {
    const root = { WebSocket: FakeWebSocket };
    const transport = createWebSocketTransport({
        WebSocketClass: FakeWebSocket,
        cryptoApi: { randomUUID: () => 'request-rejected' },
        log() {}
    });
    transport.install(root);
    const socket = new root.WebSocket('wss://example.test');

    const response = transport.sendRequest('Controller', 'Method', 'Project', {});
    socket.receive({
        RequestId: 'request-rejected',
        IsSuccess: false,
        ErrorCode: 403
    });

    await assert.rejects(response, (error) => {
        assert.equal(error.code, 'SERVER_REJECTED');
        assert.equal(error.controller, 'Controller');
        assert.equal(error.method, 'Method');
        assert.equal(error.requestId, 'request-rejected');
        assert.equal(error.serverErrorCode, 403);
        return true;
    });
});

test('transport rejects send failures with typed request metadata and cause', async () => {
    class ThrowingWebSocket extends FakeWebSocket {
        send() {
            throw new Error('socket write failed');
        }
    }

    const root = { WebSocket: ThrowingWebSocket };
    const transport = createWebSocketTransport({
        WebSocketClass: ThrowingWebSocket,
        cryptoApi: { randomUUID: () => 'request-send-failed' },
        log() {}
    });
    transport.install(root);
    new root.WebSocket('wss://example.test');

    await assert.rejects(
        transport.sendRequest('Controller', 'Method', 'Project', {}),
        (error) => error.code === 'SEND_FAILED'
            && error.controller === 'Controller'
            && error.method === 'Method'
            && error.requestId === 'request-send-failed'
            && error.cause?.message === 'socket write failed'
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

test('transport observes page frames and correlates socket IDs', () => {
    const root = { WebSocket: FakeWebSocket };
    let currentTime = 100;
    const frames = [];
    const transport = createWebSocketTransport({
        WebSocketClass: FakeWebSocket,
        cryptoApi: { randomUUID: () => 'unused' },
        now: () => currentTime,
        log() {}
    });
    transport.subscribeFrames((frame) => frames.push(frame));
    transport.install(root);
    const first = new root.WebSocket('wss://first.example');
    const second = new root.WebSocket('wss://second.example');

    first.send('{"RequestId":"page-1","Controller":"Page"}');
    currentTime = 120;
    second.receive({ RequestId: 'push-1', Value: true });

    assert.equal(frames.length, 2);
    assert.deepEqual(
        frames.map(({ direction, socketId, origin, capturedAt, dataType }) => ({
            direction,
            socketId,
            origin,
            capturedAt,
            dataType
        })),
        [
            {
                direction: 'outbound',
                socketId: 1,
                origin: 'page',
                capturedAt: 100,
                dataType: 'text'
            },
            {
                direction: 'inbound',
                socketId: 2,
                origin: 'page',
                capturedAt: 120,
                dataType: 'text'
            }
        ]
    );
});

test('transport labels its own request and response frames', async () => {
    const root = { WebSocket: FakeWebSocket };
    const frames = [];
    const transport = createWebSocketTransport({
        WebSocketClass: FakeWebSocket,
        cryptoApi: { randomUUID: () => 'toolbox-1' },
        log() {}
    });
    transport.subscribeFrames((frame) => frames.push(frame));
    transport.install(root);
    const socket = new root.WebSocket('wss://example.test');

    const response = transport.sendRequest('Controller', 'Method', 'Project', {});
    socket.receive({ RequestId: 'toolbox-1', IsSuccess: true, Value: {} });
    await response;

    assert.deepEqual(frames.map((frame) => frame.origin), ['toolbox', 'toolbox']);
});

test('transport isolates observer failures and supports unsubscribe', () => {
    const root = { WebSocket: FakeWebSocket };
    const calls = [];
    const transport = createWebSocketTransport({
        WebSocketClass: FakeWebSocket,
        cryptoApi: { randomUUID: () => 'unused' },
        log: (...args) => calls.push(args)
    });
    const unsubscribeFailing = transport.subscribeFrames(() => {
        throw new Error('observer failure');
    });
    let observed = 0;
    const unsubscribe = transport.subscribeFrames(() => {
        observed += 1;
    });
    transport.install(root);
    const socket = new root.WebSocket('wss://example.test');

    socket.send('one');
    unsubscribeFailing();
    unsubscribe();
    socket.send('two');

    assert.equal(observed, 1);
    assert.match(calls[1][0], /Frame observer failed/);
    assert.deepEqual(socket.sent, ['one', 'two']);
});

test('transport preserves send results and reports binary metadata only', () => {
    const root = { WebSocket: FakeWebSocket };
    const frames = [];
    const transport = createWebSocketTransport({
        WebSocketClass: FakeWebSocket,
        cryptoApi: { randomUUID: () => 'unused' },
        log() {}
    });
    transport.subscribeFrames((frame) => frames.push(frame));
    transport.install(root);
    const socket = new root.WebSocket('wss://example.test');

    assert.equal(socket.send('text'), 1);
    socket.listeners.get('message')?.({ data: new Uint8Array([1, 2, 3]) });

    assert.equal(frames[1].dataType, 'array-buffer');
    assert.equal(frames[1].byteLength, 3);
    assert.equal('data' in frames[1], false);
});
