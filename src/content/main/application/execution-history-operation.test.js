import assert from 'node:assert/strict';
import { test } from 'node:test';

import { withExecutionHistory } from '#src/content/main/application/execution-history-operation.js';

function timestamps() {
    const values = [
        new Date('2026-01-01T00:00:00.000Z'),
        new Date('2026-01-01T00:00:01.000Z')
    ];
    return () => values.shift() || new Date('2026-01-01T00:00:02.000Z');
}

test('records an operation while preserving its returned result', async () => {
    // Given
    const input = Object.freeze({ id: 7 });
    const result = Object.freeze({ ok: true });
    const persisted = [];
    const execute = withExecutionHistory({
        execute: async (value) => {
            assert.equal(value, input);
            return result;
        },
        persistExecution: async (historyInput) => {
            persisted.push(historyInput);
            return Object.freeze({ stored: true, record: Object.freeze({ id: 'history-1' }) });
        },
        buildHistoryInput: (context) => context,
        now: timestamps()
    });

    // When
    const output = await execute(input);

    // Then
    assert.equal(output, result);
    assert.equal(persisted.length, 1);
    assert.equal(persisted[0].input, input);
    assert.equal(persisted[0].result, result);
    assert.equal(persisted[0].error, null);
    assert.equal(persisted[0].startedAt, '2026-01-01T00:00:00.000Z');
    assert.equal(persisted[0].completedAt, '2026-01-01T00:00:01.000Z');
});

test('records an interrupted operation and rethrows the same execution error', async () => {
    // Given
    const partialResult = Object.freeze({ completed: 2 });
    const executionError = Object.assign(new Error('boom'), { partialResult });
    const persisted = [];
    const execute = withExecutionHistory({
        execute: async () => {
            throw executionError;
        },
        persistExecution: async (historyInput) => {
            persisted.push(historyInput);
            return Object.freeze({ stored: true });
        },
        buildHistoryInput: (context) => context,
        now: timestamps()
    });

    // When / Then
    await assert.rejects(() => execute({ id: 1 }), (error) => error === executionError);
    assert.equal(persisted.length, 1);
    assert.equal(persisted[0].result, partialResult);
    assert.equal(persisted[0].error, executionError);
});

test('history serialization and persistence failures do not replace operation results', async () => {
    // Given
    const result = Object.freeze({ ok: true });
    const outcomes = [];
    const serializationError = new Error('cannot serialize');
    const persistenceError = new Error('storage unavailable');
    const serializeFailure = withExecutionHistory({
        execute: async () => result,
        persistExecution: async () => Object.freeze({ stored: true }),
        buildHistoryInput() {
            throw serializationError;
        },
        onPersistence: (outcome) => outcomes.push(outcome)
    });
    const persistFailure = withExecutionHistory({
        execute: async () => result,
        persistExecution: async () => {
            throw persistenceError;
        },
        buildHistoryInput: (context) => context,
        onPersistence: (outcome) => outcomes.push(outcome)
    });

    // When
    const serializedOutput = await serializeFailure({});
    const persistedOutput = await persistFailure({});

    // Then
    assert.equal(serializedOutput, result);
    assert.equal(persistedOutput, result);
    assert.equal(outcomes[0].persistenceError, serializationError);
    assert.equal(outcomes[1].persistenceError, persistenceError);
});

test('history failures do not replace an execution error', async () => {
    // Given
    const executionError = new Error('execution failed');
    const persistenceError = new Error('history failed');
    const execute = withExecutionHistory({
        execute: async () => {
            throw executionError;
        },
        persistExecution: async () => {
            throw persistenceError;
        },
        buildHistoryInput: (context) => context
    });

    // When / Then
    await assert.rejects(() => execute({}), (error) => error === executionError);
});
