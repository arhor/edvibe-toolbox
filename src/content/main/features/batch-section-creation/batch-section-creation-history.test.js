import assert from 'node:assert/strict';
import test from 'node:test';

import { createRecordedExecution } from '#src/content/main/features/batch-section-creation/batch-section-creation-history.js';

function clock(...timestamps) {
    let index = 0;
    return () => new Date(timestamps[index++]);
}

test('recorded execution should persist only after executeCreationPlan returns', async () => {
    // Given
    const events = [];
    const parameters = { marathonId: '42', plan: { eligible: [], rejected: [] } };
    const result = { results: [] };
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

test('recorded execution should persist the thrown error and preserve rejection when executeCreationPlan fails', async () => {
    // Given
    const records = [];
    const error = Object.assign(new Error('Stopped'), { code: 'WS_UNAVAILABLE' });
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
    const rejection = await execute({ marathonId: '42', plan: {} }).catch((caught) => caught);

    // Then
    assert.equal(rejection, error);
    assert.equal(records.length, 1);
    assert.equal(records[0].results[0].data.error.code, 'WS_UNAVAILABLE');
});
