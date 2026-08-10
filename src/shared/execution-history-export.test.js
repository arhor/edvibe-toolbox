import test from 'node:test';
import assert from 'node:assert/strict';
import * as recordApi from './execution-history-record.js';
import * as api from './execution-history-export.js';

const record = recordApi.buildExecutionRecord({
    id: 'abcd-1234', operationType: 'Batch Section Deletion',
    startedAt: '2026-08-06T04:00:00.000Z', completedAt: '2026-08-06T04:01:02.345Z',
    status: 'completed', pageContext: {}, counts: {}, results: []
});

test('serializes readable stable UTF-8 JSON payloads', () => {
    assert.equal(api.serializeExecutionRecord(record), `${JSON.stringify(record, null, 2)}\n`);
    assert.equal(api.serializeExecutionRecords([record]), `${JSON.stringify([record], null, 2)}\n`);
});

test('builds deterministic filesystem-friendly filenames', () => {
    assert.equal(api.createExecutionFilename(record), 'edvibe-batch-section-deletion-20260806T040102Z-abcd-1234.json');
    assert.equal(api.createHistoryFilename(new Date('2026-08-06T04:01:02.345Z')), 'edvibe-execution-history-20260806T040102Z.json');
});
