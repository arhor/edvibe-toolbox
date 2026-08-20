import assert from 'node:assert/strict';
import test from 'node:test';

import { FeatureDispatcher } from '#src/content/main/feature-dispatcher.js';
import { WINDOW_MESSAGE_TYPES } from '#src/shared/messaging/index.js';

function createLogger(onLog = () => { }) {
    const entries = [];
    return {
        entries,
        log(...args) {
            entries.push(args);
            onLog(args);
        }
    };
}

function createDispatcherHarness(features, logger = createLogger(), dependencies = {}) {
    const runtimeContext = {
        logger,
        ...dependencies,
        dispatch: null
    };
    const dispatcher = new FeatureDispatcher({ runtimeContext });
    runtimeContext.dispatch = dispatcher.dispatch;
    Object.freeze(runtimeContext);
    features.forEach(dispatcher.register);
    return {
        dispatcher,
        logger,
        runtimeContext
    };
}

test('FeatureDispatcher should require a runtime context with a logger', () => {
    // Given
    const missingContext = () => new FeatureDispatcher({});
    const missingLogger = () => new FeatureDispatcher({ runtimeContext: {} });

    // When / Then
    assert.throws(missingContext, /runtimeContext is required/);
    assert.throws(missingLogger, /must provide a logger/);
});

test('FeatureDispatcher should reject feature definitions when type or create is invalid', () => {
    // Given
    const harness = createDispatcherHarness([]);
    const register = () => harness.dispatcher.register({
        type: null,
        create() { }
    });

    // When
    const invoke = () => register();

    // Then
    assert.throws(invoke, /must provide a type and create function/);
});

test('FeatureDispatcher should reject registration when feature type is already registered', () => {
    // Given
    const definition = {
        type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER,
        create: () => () => { }
    };
    const harness = createDispatcherHarness([definition]);
    const register = () => harness.dispatcher.register(definition);

    // When
    const invoke = () => register();

    // Then
    assert.throws(invoke, /already registered/);
});

test('FeatureDispatcher should reject registration when feature factory does not create a handler', () => {
    // Given
    const harness = createDispatcherHarness([]);
    const register = () => harness.dispatcher.register({
        type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER,
        create: () => null
    });

    // When
    const invoke = () => register();

    // Then
    assert.throws(invoke, /must create a command handler/);
});

test('FeatureDispatcher should provide the same runtime context to every registered feature', () => {
    // Given
    const transport = { sendRequest() { } };
    const operationGuard = { canStart() { } };
    const receivedContexts = [];
    const harness = createDispatcherHarness([
        {
            type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER,
            create(context) {
                receivedContexts.push(context);
                return () => { };
            }
        },
        {
            type: WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY,
            create(context) {
                receivedContexts.push(context);
                return () => { };
            }
        }
    ], createLogger(), { transport, operationGuard });

    // When
    const contexts = receivedContexts;

    // Then
    assert.equal(contexts.length, 2);
    assert.equal(contexts[0], harness.runtimeContext);
    assert.equal(contexts[1], harness.runtimeContext);
    assert.equal(contexts[0].transport, transport);
    assert.equal(contexts[0].operationGuard, operationGuard);
    assert.equal(contexts[0].dispatch, harness.dispatcher.dispatch);
});

test('FeatureDispatcher should ignore messages when message contract is invalid', () => {
    // Given
    let calls = 0;
    const harness = createDispatcherHarness([{
        type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER,
        create: () => () => {
            calls += 1;
        }
    }]);
    const invalidMessages = [null, {}, { type: 'UNKNOWN' }];

    // When
    const results = invalidMessages.map((message) => harness.dispatcher.dispatch(message));

    // Then
    assert.deepEqual(results, [false, false, false]);
    assert.equal(calls, 0);
});

test('FeatureDispatcher should return false when valid command has no registered handler', () => {
    // Given
    const harness = createDispatcherHarness([{
        type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER,
        create: () => () => { }
    }]);
    const message = { type: WINDOW_MESSAGE_TYPES.START_EXPORT };

    // When
    const handled = harness.dispatcher.dispatch(message);

    // Then
    assert.equal(handled, false);
});

test('FeatureDispatcher should dispatch message when command type is registered', () => {
    // Given
    let receivedMessage = null;
    const harness = createDispatcherHarness([{
        type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER,
        create: () => (message) => {
            receivedMessage = message;
        }
    }]);
    const message = { type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER };

    // When
    const handled = harness.dispatcher.dispatch(message);

    // Then
    assert.equal(handled, true);
    assert.equal(receivedMessage, message);
});

test('FeatureDispatcher should isolate synchronous failure when later command is dispatched', () => {
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

test('FeatureDispatcher should isolate asynchronous failure when handler promise rejects', async () => {
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
