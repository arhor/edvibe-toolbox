import assert from 'node:assert/strict';
import test from 'node:test';

import { buildExecutionHistoryInput } from '#src/content/main/features/batch-section-creation/batch-section-creation-history-record.js';

test('buildExecutionHistoryInput should record one successful function call when execution returns', () => {
    // Given
    const plan = {
        definition: { name: 'Introduction', blocks: [{ type: 'text', text: 'Hello' }] },
        eligible: [{ lessonId: 1, name: 'Lesson' }],
        rejected: []
    };
    const parameters = {
        marathonId: '42',
        plan,
        lessonDelayMs: 100,
        adapter: {},
        sendRequest() {},
        onProgress() {}
    };
    const result = { definition: plan.definition, results: [{ lessonId: 1, status: 'created' }] };

    // When
    const record = buildExecutionHistoryInput({
        parameters,
        result,
        startedAt: '2026-01-01T00:00:00.000Z',
        completedAt: '2026-01-01T00:00:01.000Z',
        marathonName: 'Marathon'
    });

    // Then
    assert.equal(record.status, 'completed');
    assert.equal(record.results.length, 1);
    assert.deepEqual(record.results[0].data, {
        parameters: { marathonId: '42', plan, lessonDelayMs: 100 },
        result
    });
});

test('buildExecutionHistoryInput should record one failed function call when execution throws', () => {
    // Given
    const error = Object.assign(new Error('Connection lost'), {
        code: 'WS_UNAVAILABLE',
        partialResult: { results: [{ lessonId: 1, status: 'not_attempted' }] }
    });

    // When
    const record = buildExecutionHistoryInput({
        parameters: { marathonId: '42', plan: { eligible: [], rejected: [] } },
        error,
        startedAt: '2026-01-01T00:00:00.000Z',
        completedAt: '2026-01-01T00:00:01.000Z'
    });

    // Then
    assert.equal(record.status, 'interrupted');
    assert.equal(record.counts.failed, 1);
    assert.deepEqual(record.results[0].data.error, {
        name: 'Error',
        code: 'WS_UNAVAILABLE',
        message: 'Connection lost',
        partialResult: error.partialResult
    });
});
