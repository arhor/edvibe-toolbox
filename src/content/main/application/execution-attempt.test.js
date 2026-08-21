import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
    EXECUTION_ATTEMPT_METHODS,
    createExecutionAttemptReporter
} from '#src/content/main/application/execution-attempt.js';

test('execution attempt reporter exposes a stable no-op lifecycle contract', () => {
    // Given / When
    const reporter = createExecutionAttemptReporter();

    // Then
    assert.deepEqual(Object.keys(reporter), [...EXECUTION_ATTEMPT_METHODS]);
    for (const name of EXECUTION_ATTEMPT_METHODS) {
        assert.equal(reporter[name]({ any: 'value' }), undefined);
    }
});

test('execution attempt reporter preserves handler context and return values', async () => {
    // Given
    const source = {
        prefix: 'attempt',
        completeAttempt(value) {
            return Promise.resolve(`${this.prefix}:${value}`);
        }
    };
    const reporter = createExecutionAttemptReporter(source);

    // When
    const result = await reporter.completeAttempt('done');

    // Then
    assert.equal(result, 'attempt:done');
});

test('execution attempt reporter rejects invalid lifecycle handlers', () => {
    assert.throws(
        () => createExecutionAttemptReporter({ beginAttempt: true }),
        /beginAttempt must be a function/
    );
});
