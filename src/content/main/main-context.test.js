import assert from 'node:assert/strict';
import test from 'node:test';

import { MainContext } from '#src/content/main/main-context.js';

function createDependencies() {
    return {
        logger: { createChildLogger() { } },
        transport: { sendRequest() { } },
        operationGuard: { canStart() { } },
        executionHistoryService: { persistTerminal() { } },
        edvibeApi: { loadAllPupils() { } },
        pageContext: { marathonId: 123 }
    };
}

test('MainContext should expose composed MAIN dependencies', () => {
    // Given
    const dependencies = createDependencies();

    // When
    const context = new MainContext(dependencies);

    // Then
    assert.equal(context.logger, dependencies.logger);
    assert.equal(context.transport, dependencies.transport);
    assert.equal(context.operationGuard, dependencies.operationGuard);
    assert.equal(context.executionHistoryService, dependencies.executionHistoryService);
    assert.equal(context.edvibeApi, dependencies.edvibeApi);
    assert.equal(context.pageContext, dependencies.pageContext);
    assert.equal(context.dispatch, null);
});

test('MainContext should register dispatch exactly once', () => {
    // Given
    const context = new MainContext(createDependencies());
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

test('MainContext should reject invalid dispatch capability', () => {
    // Given
    const context = new MainContext(createDependencies());

    // When
    const register = () => context.registerDispatch(null);

    // Then
    assert.throws(register, /must be a function/);
});
