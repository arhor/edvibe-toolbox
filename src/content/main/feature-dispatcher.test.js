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

function createLogger() {
    const entries = [];
    const logger = {
        entries,
        createChildLogger() {
            return logger;
        },
        log(...args) {
            entries.push(args);
        }
    };
    return logger;
}

function withDispatcher(features, callback) {
    const restore = installBrowserGlobals();
    const logger = createLogger();
    try {
        return callback(new FeatureDispatcher({ logger, features }), logger);
    } finally {
        restore();
    }
}

test('rejects invalid and duplicate feature definitions', () => {
    const restore = installBrowserGlobals();
    const logger = createLogger();
    try {
        assert.throws(
            () => new FeatureDispatcher({ logger, features: [{ type: null, create() { } }] }),
            /must provide a type and create function/
        );
        assert.throws(
            () => new FeatureDispatcher({
                logger,
                features: [
                    { type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER, create: () => () => { } },
                    { type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER, create: () => () => { } }
                ]
            }),
            /already registered/
        );
        assert.throws(
            () => new FeatureDispatcher({
                logger,
                features: [{ type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER, create: () => null }]
            }),
            /must create a command handler/
        );
    } finally {
        restore();
    }
});

test('registers features with the shared runtime context', () => {
    let receivedContext;
    withDispatcher([
        {
            type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER,
            create(context) {
                receivedContext = context;
                return () => { };
            }
        }
    ], (dispatcher, logger) => {
        assert.equal(receivedContext.logger, logger);
        assert.equal(receivedContext.transport, dispatcher.transport);
        assert.equal(receivedContext.operationGuard, dispatcher.operationGuard);
        assert.equal(receivedContext.executionHistoryService, dispatcher.executionHistoryService);
        assert.equal(receivedContext.dispatch, dispatcher.dispatch);
    });
});

test('rejects malformed and unregistered messages without invoking a handler', () => {
    let calls = 0;
    withDispatcher([
        {
            type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER,
            create: () => () => {
                calls += 1;
            }
        }
    ], (dispatcher) => {
        assert.equal(dispatcher.dispatch(null), false);
        assert.equal(dispatcher.dispatch({}), false);
        assert.equal(dispatcher.dispatch({ type: 'UNKNOWN' }), false);
        assert.equal(dispatcher.dispatch({ type: WINDOW_MESSAGE_TYPES.START_EXPORT }), false);
        assert.equal(calls, 0);
    });
});

test('dispatches a valid registered command to its handler', () => {
    let receivedMessage = null;
    withDispatcher([
        {
            type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER,
            create: () => (message) => {
                receivedMessage = message;
            }
        }
    ], (dispatcher) => {
        const message = { type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER };
        assert.equal(dispatcher.dispatch(message), true);
        assert.equal(receivedMessage, message);
    });
});

test('isolates synchronous handler failures and continues dispatching', () => {
    const failure = new Error('feature exploded');
    let healthyCalls = 0;
    withDispatcher([
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
    ], (dispatcher, logger) => {
        assert.equal(dispatcher.dispatch({ type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER }), true);
        assert.equal(dispatcher.dispatch({ type: WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY }), true);
        assert.equal(healthyCalls, 1);
        assert.equal(logger.entries.length, 1);
        assert.match(logger.entries[0][0], /OPEN_RECORDER/);
        assert.equal(logger.entries[0][1], failure);
    });
});

test('isolates rejected asynchronous handlers', async () => {
    const failure = new Error('async feature exploded');
    const restore = installBrowserGlobals();
    const logger = createLogger();
    try {
        const dispatcher = new FeatureDispatcher({
            logger,
            features: [{
                type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER,
                create: () => async () => {
                    throw failure;
                }
            }]
        });

        assert.equal(dispatcher.dispatch({ type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER }), true);
        await Promise.resolve();
        await Promise.resolve();

        assert.equal(logger.entries.length, 1);
        assert.match(logger.entries[0][0], /OPEN_RECORDER/);
        assert.equal(logger.entries[0][1], failure);
    } finally {
        restore();
    }
});
