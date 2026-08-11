import assert from 'node:assert/strict';
import test from 'node:test';

import {
    EXECUTION_RECORD_SCHEMA_VERSION,
    buildExecutionRecord,
    cloneExecutionRecord,
    validateExecutionRecord
} from './execution-history-record.js';
import { serializeExecutionRecord } from './execution-history-export.js';
import { createExecutionHistoryRepository } from './execution-history-repository.js';

function recordInput(overrides = {}) {
    return {
        id: 'execution-1',
        operationType: 'archive-lessons',
        startedAt: '2026-08-11T10:00:00.000Z',
        completedAt: '2026-08-11T10:01:00.000Z',
        status: 'completed',
        pageContext: { marathonId: '42', marathonName: 'Summer course' },
        counts: { requested: 1, eligible: 1, attempted: 1, successful: 1 },
        results: [{ itemId: '7', label: 'Lesson', status: 'completed', code: 'OK', message: 'Done' }],
        ...overrides
    };
}

function requestAttempt(overrides = {}) {
    return {
        correlationId: 'execution-1:7',
        operationName: 'archiveLesson',
        controller: 'Lessons',
        method: 'post',
        projectName: 'School',
        requestId: 'request-7',
        attemptNumber: 1,
        startedAt: '2026-08-11T10:00:01.000Z',
        completedAt: '2026-08-11T10:00:01.125Z',
        durationMs: 125,
        outcome: 'success',
        transportCode: 'MESSAGE',
        serverErrorCode: null,
        serverErrorMessage: null,
        requestSummary: { lessonId: 7 },
        responseSummary: { updated: true },
        ...overrides
    };
}

test('keeps legacy version-1 records viewable, exportable, and cloneable', () => {
    const legacy = buildExecutionRecord(recordInput());
    assert.equal(EXECUTION_RECORD_SCHEMA_VERSION, 1);
    assert.equal(validateExecutionRecord(legacy), true);
    assert.deepEqual(cloneExecutionRecord(legacy), JSON.parse(JSON.stringify(legacy)));
    assert.deepEqual(JSON.parse(serializeExecutionRecord(legacy)), legacy);
    assert.equal(legacy.results[0].diagnostics, undefined);
});

test('keeps legacy version-1 records listable and removable from IndexedDB repositories', async () => {
    const legacy = buildExecutionRecord(recordInput());
    const records = new Map([[legacy.id, JSON.parse(JSON.stringify(legacy))]]);
    const repository = createExecutionHistoryRepository({
        indexedDbApi: {
            createIndexedDb: () => ({
                repository: () => ({
                    get: async (id) => records.get(id),
                    newest: async () => [...records.values()],
                    delete: async (id) => records.delete(id),
                    put: async (record) => records.set(record.id, record),
                    clear: async () => records.clear(),
                    count: async () => records.size
                }),
                close() {}
            })
        }
    });
    assert.equal((await repository.list()).length, 1);
    assert.deepEqual(await repository.get(legacy.id), JSON.parse(JSON.stringify(legacy)));
    await repository.delete(legacy.id);
    assert.equal(await repository.get(legacy.id), null);
});

test('normalizes and round-trips bounded request-attempt diagnostics', () => {
    const input = recordInput({
        results: [{
            itemId: '7', label: 'Lesson', status: 'completed', code: 'OK', message: 'Done',
            diagnostics: { requestAttempts: [requestAttempt()] }
        }]
    });
    const record = buildExecutionRecord(input);
    const attempt = record.results[0].diagnostics.requestAttempts[0];
    assert.equal(attempt.method, 'POST');
    assert.equal(attempt.durationMs, 125);
    assert.deepEqual(JSON.parse(serializeExecutionRecord(record)), cloneExecutionRecord(record));
});

test('continues to reject forbidden raw fields and transport objects outside diagnostics', () => {
    assert.throws(() => buildExecutionRecord(recordInput({
        results: [{
            label: 'Lesson', status: 'completed', code: 'OK', message: 'Done',
            data: { rawResponse: { secret: true } }
        }]
    })), /Unsafe field is not allowed/);
    assert.throws(() => buildExecutionRecord(recordInput({ transport: { socket: true } })), /Unsafe field is not allowed/);
});

test('redacts unsafe summary fields and truncates bounded diagnostic content', () => {
    const long = 'x'.repeat(800);
    const record = buildExecutionRecord(recordInput({
        results: [{
            label: 'Lesson', status: 'completed', code: 'OK', message: 'Done',
            diagnostics: { requestAttempts: [requestAttempt({
                serverErrorMessage: long,
                requestSummary: { authorization: 'Bearer secret', nested: { response: { token: 'secret' } } },
                responseSummary: { message: long, values: Array.from({ length: 40 }, (_, index) => index) }
            })] }
        }]
    }));
    const attempt = record.results[0].diagnostics.requestAttempts[0];
    assert.equal(attempt.requestSummary.authorization, '[REDACTED]');
    assert.equal(attempt.requestSummary.nested.response, '[REDACTED]');
    assert.equal(attempt.serverErrorMessage.length, 500);
    assert.equal(attempt.responseSummary.message.length, 500);
    assert.equal(attempt.responseSummary.values.length, 25);
    assert.doesNotMatch(JSON.stringify(record), /Bearer secret/);
});

test('rejects malformed, unknown, oversized, and raw diagnostic fields', () => {
    const withDiagnostics = (diagnostics) => recordInput({
        results: [{ label: 'Lesson', status: 'completed', code: 'OK', message: 'Done', diagnostics }]
    });
    assert.throws(() => buildExecutionRecord(withDiagnostics({ requestAttempts: {} })), /Expected an array/);
    assert.throws(() => buildExecutionRecord(withDiagnostics({ requestAttempts: [requestAttempt({ outcome: 'maybe' })] })), /Unsupported diagnostic outcome/);
    assert.throws(() => buildExecutionRecord(withDiagnostics({ requestAttempts: [requestAttempt({ rawResponse: {} })] })), /Unexpected field/);
    assert.throws(() => buildExecutionRecord(withDiagnostics({ requestAttempts: Array.from({ length: 21 }, requestAttempt) })), /Collection exceeds/);
});

test('exports a sanitized clone rather than the caller-owned diagnostic values', () => {
    const record = buildExecutionRecord(recordInput({
        results: [{
            label: 'Lesson', status: 'completed', code: 'OK', message: 'Done',
            diagnostics: { requestAttempts: [requestAttempt()] }
        }]
    }));
    const storedShape = JSON.parse(JSON.stringify(record));
    storedShape.results[0].diagnostics.requestAttempts[0].method = 'get';
    assert.equal(JSON.parse(serializeExecutionRecord(storedShape)).results[0].diagnostics.requestAttempts[0].method, 'GET');
});
