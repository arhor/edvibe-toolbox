import test from 'node:test';
import assert from 'node:assert/strict';
import * as api from './execution-history-record.js';

function input(overrides = {}) {
    return {
        operationType: 'batch-section-deletion',
        startedAt: '2026-08-06T04:00:00.000Z',
        completedAt: '2026-08-06T04:01:00.000Z',
        status: 'completed_with_failures',
        pageContext: { marathonId: 42, marathonName: 'Autumn course' },
        counts: { requested: 3, eligible: 2, attempted: 2, successful: 1, noOp: 0, skipped: 1, failed: 1, notAttempted: 0 },
        results: [
            { itemId: 'lesson-1', label: 'Lesson 1', status: 'deleted', code: 'DELETED', message: 'Section deleted.', attempts: 1, data: { lessonId: 1 } },
            { itemId: 'lesson-2', label: 'Lesson 2', status: 'failed', code: 'SERVER_REJECTED', message: 'Rejected.', attempts: 2, data: { lessonId: 2 } }
        ],
        ...overrides
    };
}

test('builds a canonical immutable execution envelope', () => {
    const record = api.buildExecutionRecord(input(), { cryptoApi: { randomUUID: () => 'execution-1' } });
    assert.equal(record.schemaVersion, 1);
    assert.equal(record.id, 'execution-1');
    assert.equal(record.pageContext.marathonId, '42');
    assert.equal(record.results[1].order, 1);
    assert.ok(Object.isFrozen(record));
    assert.ok(Object.isFrozen(record.results));
    assert.equal(api.validateExecutionRecord(record), true);
});

test('supports every terminal status', () => {
    for (const status of api.TERMINAL_STATUSES) {
        assert.equal(api.buildExecutionRecord(input({ status }), { cryptoApi: { randomUUID: () => status } }).status, status);
    }
});

test('rejects unsafe transport and credential-like fields before persistence', () => {
    assert.throws(() => api.buildExecutionRecord(input({
        results: [{ label: 'Lesson', status: 'failed', code: 'X', message: 'Nope', data: { rawResponse: { token: 'secret' } } }]
    })), /Unsafe field/);
    assert.throws(() => api.buildExecutionRecord(input({
        results: [{ label: 'Lesson', status: 'failed', code: 'X', message: 'Nope', data: { sessionData: 'secret' } }]
    })), /Unsafe field/);
    assert.throws(() => api.buildExecutionRecord(input({ counts: { requested: 1, eligible: 1, attempted: 1, successful: 1, failed: 1 } })), /cannot exceed attempted/);
});

test('stored and exported clone remains canonical JSON', () => {
    const record = api.buildExecutionRecord(input(), { cryptoApi: { randomUUID: () => 'execution-2' } });
    assert.deepEqual(api.cloneExecutionRecord(record), JSON.parse(JSON.stringify(record)));
});
