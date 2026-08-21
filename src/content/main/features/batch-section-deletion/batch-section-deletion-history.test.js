import assert from 'node:assert/strict';
import test from 'node:test';

import {
    createBatchSectionDeletionHistoryReporter,
    serializeResult
} from '#src/content/main/features/batch-section-deletion/batch-section-deletion-history.js';

function attempt(correlationId, requestId, transportCode = 'SERVER_REJECTED') {
    return { correlationId, operationName: 'write', controller: 'C', method: 'POST', projectName: 'P', requestId, attemptNumber: 1, startedAt: '2026-01-01T00:00:00.000Z', completedAt: null, durationMs: null, outcome: 'failure', transportCode, serverErrorCode: 'DENIED', serverErrorMessage: null, requestSummary: null, responseSummary: null };
}

function lesson(lessonId, sectionId = lessonId + 100) {
    return {
        lessonId,
        marathonLessonId: lessonId,
        number: lessonId,
        name: `Lesson ${lessonId}`,
        sectionName: 'S',
        sectionId
    };
}

function createReporter({ plan, persistExecution }) {
    const timestamps = [
        new Date('2026-01-01T00:00:00.000Z'),
        new Date('2026-01-01T00:00:01.000Z')
    ];
    const reporter = createBatchSectionDeletionHistoryReporter({
        persistExecution,
        getLocationHref: () => 'https://edvibe.com/marathon/7',
        getMarathonName: () => 'Marathon',
        now: () => timestamps.shift() || new Date('2026-01-01T00:00:02.000Z')
    });
    reporter.beginAttempt({ plan, selectedLessonIds: plan.eligible.map((entry) => entry.lessonId) });
    return reporter;
}

test('preserves server rejection and transport failure diagnostics for deletion requests', () => {
    for (const [code, id] of [['SERVER_REJECTED', 'reject-1'], ['REQUEST_TIMEOUT', 'timeout-2']]) {
        const result = serializeResult({ lessonId: 1, number: 1, name: 'L', status: 'failed', code, attempts: 1, diagnostics: { requestAttempts: [attempt('lesson:1', id, code)] } }, { sectionName: 'S' }, null);
        assert.equal(result.diagnostics.requestAttempts[0].requestId, id);
    }
});

test('persists cancellation, interruption, success, and partial failure without a Lit dialog', async () => {
    // Given
    const inputs = [];
    const persistExecution = async (input) => {
        inputs.push(input);
        return Object.freeze({ stored: true, record: Object.freeze({ id: `history-${inputs.length}` }) });
    };

    // When: cancelled before any write
    const cancelledPlan = { sectionName: 'S', selectedCount: 1, eligible: [lesson(1)], rejected: [] };
    await createReporter({ plan: cancelledPlan, persistExecution }).cancelAttempt();

    // And: interrupted before a terminal result
    const interruptedPlan = { sectionName: 'S', selectedCount: 1, eligible: [lesson(2)], rejected: [] };
    await createReporter({ plan: interruptedPlan, persistExecution }).interruptAttempt({ error: new Error('boom') });

    // And: successful completion
    const successful = lesson(3);
    const successfulPlan = { sectionName: 'S', selectedCount: 1, eligible: [successful], rejected: [] };
    await createReporter({ plan: successfulPlan, persistExecution }).completeAttempt({
        result: { results: [{ ...successful, status: 'deleted', code: 'DELETED', message: 'Section deleted.' }] }
    });

    // And: partial failure
    const deleted = lesson(4);
    const failed = lesson(5);
    const partialPlan = { sectionName: 'S', selectedCount: 2, eligible: [deleted, failed], rejected: [] };
    await createReporter({ plan: partialPlan, persistExecution }).completeAttempt({
        result: {
            results: [
                { ...deleted, status: 'deleted', code: 'DELETED', message: 'Section deleted.' },
                { ...failed, status: 'failed', code: 'SERVER_REJECTED', message: 'Denied.', attempts: 1 }
            ]
        }
    });

    // Then
    assert.deepEqual(inputs.map((input) => input.status), [
        'cancelled',
        'interrupted',
        'completed',
        'completed_with_failures'
    ]);
    assert.equal(inputs[0].counts.notAttempted, 1);
    assert.equal(inputs[1].counts.notAttempted, 1);
    assert.equal(inputs[2].counts.successful, 1);
    assert.equal(inputs[3].counts.successful, 1);
    assert.equal(inputs[3].counts.failed, 1);
});

test('keeps the visible result path usable when history persistence fails', async () => {
    // Given
    const plan = { sectionName: 'S', selectedCount: 1, eligible: [lesson(6)], rejected: [] };
    const persistenceError = new Error('storage unavailable');
    const reporter = createReporter({
        plan,
        persistExecution: async () => {
            throw persistenceError;
        }
    });

    // When
    const history = await reporter.completeAttempt({
        result: { results: [{ ...lesson(6), status: 'deleted', code: 'DELETED', message: 'Section deleted.' }] }
    });

    // Then
    assert.equal(history.stored, false);
    assert.equal(history.persistenceError, persistenceError);
});
