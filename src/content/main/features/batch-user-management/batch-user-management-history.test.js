import assert from 'node:assert/strict';
import test from 'node:test';

import {
    buildExecutionHistoryInput,
    createRecordedExecution
} from '#src/content/main/features/batch-user-management/batch-user-management-history.js';

function clock(...timestamps) {
    let index = 0;
    return () => new Date(timestamps[index++]);
}

test('buildExecutionHistoryInput should record one successful function call when execution returns', () => {
    // Given
    const rows = [{
        email: 'user@example.test',
        normalizedEmail: 'user@example.test',
        unassignSelected: true,
        deleteSelected: false
    }];
    const parameters = {
        marathonId: '42',
        rows,
        sendRequest() {},
        onProgress() {}
    };
    const result = { rows: [{ ...rows[0], result: { status: 'success' } }], successes: 1 };

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
        parameters: { marathonId: '42', rows },
        result
    });
});

test('buildExecutionHistoryInput should record one failed function call when execution throws', () => {
    // Given
    const error = Object.assign(new Error('Stopped'), {
        code: 'INTERNAL_ERROR',
        partialResult: { rows: [], failures: 1 }
    });

    // When
    const record = buildExecutionHistoryInput({
        parameters: { marathonId: '42', rows: [] },
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

test('recorded execution should persist only after executeUserPlan returns', async () => {
    // Given
    const events = [];
    const parameters = { marathonId: '42', rows: [] };
    const result = { rows: [], successes: 0 };
    const execute = createRecordedExecution({
        executePlan: async (received) => {
            events.push(['execute', received]);
            return result;
        },
        persistExecution: async (record) => events.push(['persist', record]),
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

test('recorded execution should persist the thrown error and preserve rejection when executeUserPlan fails', async () => {
    // Given
    const records = [];
    const error = Object.assign(new Error('Stopped'), { code: 'INTERNAL_ERROR' });
    const execute = createRecordedExecution({
        executePlan: async () => {
            throw error;
        },
        persistExecution: async (record) => records.push(record),
        getMarathonName: () => null,
        now: clock('2026-01-01T00:00:00.000Z', '2026-01-01T00:00:01.000Z'),
        logger: { log() {} }
    });

    // When
    const rejection = await execute({ marathonId: '42', rows: [] }).catch((caught) => caught);

    // Then
    assert.equal(rejection, error);
    assert.equal(records.length, 1);
    assert.equal(records[0].results[0].data.error.code, 'INTERNAL_ERROR');
});
