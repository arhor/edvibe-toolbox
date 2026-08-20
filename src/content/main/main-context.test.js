import assert from 'node:assert/strict';
import { test, describe } from 'node:test';

import {
    FIXTURE_MARATHON_ID,
    withMainBrowserEnvironment
} from '#src/content/main/main-context-test-fixtures.js';
import { MainContext } from '#src/content/main/main-context.js';

function createLogger() {
    return {
        createChildLogger() {
            return { log() { } };
        },
        log() { }
    };
}

function createContext(logger = createLogger()) {
    return withMainBrowserEnvironment(() => new MainContext({ logger }));
}

describe('MainContext', () => {
    test('should expose composed MAIN dependencies', () => {
        // Given
        const logger = createLogger();

        // When
        const context = createContext(logger);

        // Then
        assert.equal(context.logger, logger);
        assert.equal(typeof context.transport.sendRequest, 'function');
        assert.equal(typeof context.operationGuard.canStart, 'function');
        assert.equal(typeof context.executionHistoryService.persistTerminal, 'function');
        assert.equal(typeof context.edvibeApi.loadAllPupils, 'function');
        assert.equal(context.pageContext.marathonId, FIXTURE_MARATHON_ID);
        assert.equal(context.dispatch, null);
    });

    test('should register dispatch exactly once', () => {
        // Given
        const context = createContext();
        const dispatch = () => true;

        // When
        context.registerDispatch(dispatch);

        // Then
        assert.equal(context.dispatch, dispatch);
        assert.throws(
            () => context.registerDispatch(() => false),
            /already registered/
        );
    });

    test('should reject invalid dispatch capability', () => {
        // Given
        const context = createContext();

        // When
        const register = () => context.registerDispatch(null);

        // Then
        assert.throws(register, /must be a function/);
    });
});
