import assert from 'node:assert/strict';
import test from 'node:test';

import { FeatureDispatcher } from '#src/content/main/feature-dispatcher.js';
import { WINDOW_MESSAGE_TYPES } from '#src/shared/messaging/index.js';

class FakeWebSocket {
    static OPEN = 1;
}

function installBrowserGlobals() {
    const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
    const previousDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
    const windowApi = {
        WebSocket: FakeWebSocket,
        Blob: class Blob { },
        URL: {},
        crypto: { randomUUID: () => 'test-id' },
        indexedDB: { open() { } },
        addEventListener() { },
        removeEventListener() { },
        postMessage() { }
    };
    Object.defineProperty(globalThis, 'window', {
        configurable: true,
        writable: true,
        value: windowApi
    });
    Object.defineProperty(globalThis, 'document', {
        configurable: true,
        writable: true,
        value: {}
    });
    return () => {
        if (previousWindow) {
            Object.defineProperty(globalThis, 'window', previousWindow);
        } else {
            delete globalThis.window;
        }
        if (previousDocument) {
            Object.defineProperty(globalThis, 'document', previousDocument);
        } else {
            delete globalThis.document;
        }
    };
}

function createLogger(onLog = () => { }) {
    const entries = [];
    const logger = {
        entries,
        createChildLogger() {
            return logger;
        },
        log(...args) {
            entries.push(args);
            onLog(args);
        }
    };
    return logger;
}

function createDispatcherHarness(features, logger = createLogger()) {
    const restore = installBrowserGlobals();
    try {
        return {
            dispatcher: new FeatureDispatcher({ logger, features }),
            logger,
            restore
        };
    } catch (error) {
        restore();
        throw error;
    }
}

test('FeatureDispatcher should reject feature definitions when type or create is invalid', (t) => {
    // Given
    const restore = installBrowserGlobals();
    t.after(restore);
    const logger = createLogger();
    const construct = () => new FeatureDispatcher({
        logger,
        features: [{ type: null, create() { } }]
    });

    // When
    const invoke = () => construct();

    // Then
    assert.throws(invoke, /must provide a type and create function/);
});

test('FeatureDispatcher should reject registration when feature type is already registered', (t) => {
    // Given
    const restore = installBrowserGlobals();
    t.after(restore);
    const logger = createLogger();
    const definition = {
        type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER,
        create: () => () => { }
    };
    const construct = () => new FeatureDispatcher({
        logger,
        features: [definition, definition]
    });

    // When
    const invoke = () => construct();

    // Then
    assert.throws(invoke, /already registered/);
});

test('FeatureDispatcher should reject registration when feature factory does not create a handler', (t) => {
    // Given
    const restore = installBrowserGlobals();
    t.after(restore);
    const logger = createLogger();
    const construct = () => new FeatureDispatcher({
        logger,
        features: [{
            type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER,
            create: () => null
        }]
    });

    // When
    const invoke = () => construct();

    // Then
    assert.throws(invoke, /must create a command handler/);
});

test('FeatureDispatcher should provide runtime dependencies when feature is registered', (t) => {
    // Given
    let receivedContext;
    const harness = createDispatcherHarness([{
        type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER,
        create(context) {
            receivedContext = context;
            return () => { };
        }
    }]);
    t.after(harness.restore);

    // When
    const context = receivedContext;

    // Then
    assert.equal(context.logger, harness.logger);
    assert.equal(context.dispatch, harness.dispatcher.dispatch);
    assert.equal(typeof context.transport.sendRequest, 'function');
    assert.equal(typeof context.operationGuard.canStart, 'function');
    assert.equal(typeof context.executionHistoryService.persistTerminal, 'function');
});

test('FeatureDispatcher should ignore messages when message contract is invalid', (t) => {
    // Given
    let calls = 0;
    const harness = createDispatcherHarness([{
        type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER,
        create: () => () => {
            calls += 1;
        }
    }]);
    t.after(harness.restore);
    const invalidMessages = [null, {}, { type: 'UNKNOWN' }];

    // When
    const results = invalidMessages.map((message) => harness.dispatcher.dispatch(message));

    // Then
    assert.deepEqual(results, [false, false, false]);
    assert.equal(calls, 0);
});

test('FeatureDispatcher should return false when valid command has no registered handler', (t) => {
    // Given
    const harness = createDispatcherHarness([{
        type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER,
        create: () => () => { }
    }]);
    t.after(harness.restore);
    const message = { type: WINDOW_MESSAGE_TYPES.START_EXPORT };

    // When
    const handled = harness.dispatcher.dispatch(message);

    // Then
    assert.equal(handled, false);
});

test('FeatureDispatcher should dispatch message when command type is registered', (t) => {
    // Given
    let receivedMessage = null;
    const harness = createDispatcherHarness([{
        type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER,
        create: () => (message) => {
            receivedMessage = message;
        }
    }]);
    t.after(harness.restore);
    const message = { type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER };

    // When
    const handled = harness.dispatcher.dispatch(message);

    // Then
    assert.equal(handled, true);
    assert.equal(receivedMessage, message);
});

test('FeatureDispatcher should isolate synchronous failure when later command is dispatched', (t) => {
    // Given
    const failure = new Error('feature exploded');
    let healthyCalls = 0;
    const harness = createDispatcherHarness([
        {
            type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER,
            create: () => () => {
                throw failure;
            }
        },
        {
            type: WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY,
            create: () => () => {
                healthyCalls += 1;
            }
        }
    ]);
    t.after(harness.restore);

    // When
    const failedHandled = harness.dispatcher.dispatch({
        type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER
    });
    const healthyHandled = harness.dispatcher.dispatch({
        type: WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY
    });

    // Then
    assert.equal(failedHandled, true);
    assert.equal(healthyHandled, true);
    assert.equal(healthyCalls, 1);
    assert.equal(harness.logger.entries.length, 1);
    assert.match(harness.logger.entries[0][0], /OPEN_RECORDER/);
    assert.equal(harness.logger.entries[0][1], failure);
});

test('FeatureDispatcher should isolate asynchronous failure when handler promise rejects', async (t) => {
    // Given
    const failure = new Error('async feature exploded');
    let resolveLogged;
    const logged = new Promise((resolve) => {
        resolveLogged = resolve;
    });
    const logger = createLogger(resolveLogged);
    const harness = createDispatcherHarness([{
        type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER,
        create: () => async () => {
            throw failure;
        }
    }], logger);
    t.after(harness.restore);

    // When
    const handled = harness.dispatcher.dispatch({
        type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER
    });
    const loggedEntry = await logged;

    // Then
    assert.equal(handled, true);
    assert.match(loggedEntry[0], /OPEN_RECORDER/);
    assert.equal(loggedEntry[1], failure);
});
