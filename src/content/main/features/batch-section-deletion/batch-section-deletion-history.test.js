import assert from 'node:assert/strict';
import test from 'node:test';

import {
    buildExecutionHistoryInput,
    createRecordedExecution
} from '#src/content/main/features/batch-section-deletion/batch-section-deletion-history.js';

function clock(...timestamps) {
    let index = 0;
    return () => new Date(timestamps[index++]);
}

test('buildExecutionHistoryInput should record one successful function call when execution returns', () => {
    // Given
    const plan = {
        sectionName: 'Introduction',
        eligible: [{ lessonId: 1, sectionId: 7 }],
        rejected: []
    };
    const parameters = {
        plan,
        requestDelayMs: 100,
        sendRequest() {},
        onProgress() {}
    };
    const result = { plan, results: [{ lessonId: 1, status: 'deleted' }], fatalError: null };

    // When
    const record = buildExecutionHistoryInput({
        parameters,
        result,
        startedAt: '2026-01-01T00:00:00.000Z',
        completedAt: '2026-01-01T00:00:01.000Z',
        marathonId: '42',
        marathonName: 'Marathon'
    });

    // Then
    assert.equal(record.status, 'completed');
    assert.equal(record.results.length, 1);
    assert.deepEqual(record.results[0].data, {
        parameters: { plan, requestDelayMs: 100 },
        result
    });
});

test('buildExecutionHistoryInput should record one failed function call when execution throws', () => {
    // Given
    const error = Object.assign(new Error('Stopped'), {
        code: 'INTERNAL_ERROR',
        partialResult: { results: [{ lessonId: 1, status: 'not_attempted' }] }
    });

    // When
    const record = buildExecutionHistoryInput({
        parameters: { plan: { eligible: [], rejected: [] } },
        error,
        startedAt: '2026-01-01T00:00:00.000Z',
        completedAt: '2026-01-01T00:00:01.000Z',
        marathonId: '42'
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

test('recorded execution should persist only after executePlan returns', async () => {
    // Given
    const events = [];
    const parameters = { plan: { eligible: [], rejected: [] } };
    const result = { results: [] };
    const execute = createRecordedExecution({
        executeOperation: async (received) => {
            events.push(['execute', received]);
            return result;
        },
        persistExecution: async (record) => events.push(['persist', record]),
        getMarathonId: () => '42',
        getMarathonName: () => 'Marathon',
        now: clock('2026-01-01T00:00:00.000Z', '2026-01-01T00:00:01.000Z'),
        logger: { log() {} }
    });

    // When
    const actual = await execute(parameters);

    // Then
    assert.equal(actual, result);
    assert.deepEqual(events.map(([event]) => event), ['execute', 'persist']);
    assert.equal(events[1][1].results[0].data.result, result);
});

test('recorded execution should persist the thrown error and preserve rejection when executePlan fails', async () => {
    // Given
    const records = [];
    const error = Object.assign(new Error('Stopped'), { code: 'INTERNAL_ERROR' });
    const execute = createRecordedExecution({
        executeOperation: async () => {
            throw error;
        },
        persistExecution: async (record) => records.push(record),
        getMarathonId: () => '42',
        getMarathonName: () => null,
        now: clock('2026-01-01T00:00:00.000Z', '2026-01-01T00:00:01.000Z'),
        logger: { log() {} }
    });

    // When
    const rejection = await execute({ plan: {} }).catch((caught) => caught);

    // Then
    assert.equal(rejection, error);
    assert.equal(records.length, 1);
    assert.equal(records[0].results[0].data.error.code, 'INTERNAL_ERROR');
});
