import assert from 'node:assert/strict';
import test from 'node:test';

import { buildExecutionHistoryInput } from '#src/content/main/features/batch-lesson-access/batch-lesson-access-history-record.js';

test('buildExecutionHistoryInput should record one successful function call when execution returns', () => {
    // Given
    const parameters = {
        marathonId: '42',
        requestedEmails: ['pupil@example.test'],
        matchedUsers: 1,
        selectedLessons: 1,
        alreadyOpen: [],
        needsOpening: [{ marathonLessonId: 7 }],
        sendRequest() {},
        onProgress() {}
    };
    const result = { opened: [{ marathonLessonId: 7 }], failures: [] };

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
        parameters: {
            marathonId: '42',
            requestedEmails: ['pupil@example.test'],
            matchedUsers: 1,
            selectedLessons: 1,
            alreadyOpen: [],
            needsOpening: [{ marathonLessonId: 7 }]
        },
        result
    });
});

test('buildExecutionHistoryInput should record one failed function call when execution throws', () => {
    // Given
    const error = Object.assign(new Error('Stopped'), {
        code: 'INTERNAL_ERROR',
        partialResult: { opened: [], failures: [{ code: 'INTERNAL_ERROR' }] }
    });

    // When
    const record = buildExecutionHistoryInput({
        parameters: {
            marathonId: '42',
            requestedEmails: [],
            matchedUsers: 0,
            selectedLessons: 0,
            alreadyOpen: [],
            needsOpening: []
        },
        error,
        startedAt: '2026-01-01T00:00:00.000Z',
        completedAt: '2026-01-01T00:00:01.000Z'
    });

    // Then
    assert.equal(record.status, 'interrupted');
    assert.equal(record.counts.failed, 1);
    assert.deepEqual(record.results[0].data.error, {
        name: 'Error',
        code: 'INTERNAL_ERROR',
        message: 'Stopped',
        partialResult: error.partialResult
    });
});
