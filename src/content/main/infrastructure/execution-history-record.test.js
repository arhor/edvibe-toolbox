import assert from 'node:assert/strict';
import test from 'node:test';

import { serializeExecutionRecord } from '#src/content/main/infrastructure/execution-history-export.js';
import {
    EXECUTION_RECORD_SCHEMA_VERSION,
    buildExecutionRecord,
    cloneExecutionRecord,
    validateExecutionRecord
} from '#src/content/main/infrastructure/execution-history-record.js';
import { createExecutionHistoryRepository } from '#src/content/main/infrastructure/execution-history-repository.js';

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
    // Given
    const legacy = { ...JSON.parse(JSON.stringify(buildExecutionRecord(recordInput()))), schemaVersion: 1 };

    // When
    const clone = cloneExecutionRecord(legacy);

    // Then
    assert.equal(EXECUTION_RECORD_SCHEMA_VERSION, 2);
    assert.equal(validateExecutionRecord(legacy), true);
    assert.deepEqual(clone, JSON.parse(JSON.stringify(legacy)));
    assert.deepEqual(JSON.parse(serializeExecutionRecord(legacy)), legacy);
    assert.equal(legacy.results[0].diagnostics, undefined);
});

test('keeps legacy version-1 records listable and removable from IndexedDB repositories', async () => {
    const legacy = { ...JSON.parse(JSON.stringify(buildExecutionRecord(recordInput()))), schemaVersion: 1 };
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

test('normalizes and round-trips request-attempt diagnostics', () => {
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

test('preserves credential, response, image, session, and transport fields in result data', () => {
    // Given
    const data = {
        authorization: 'Bearer secret', token: 'token', response: { ok: true },
        rawResponse: { session: 'session' }, image: 'data:image/png;base64,AAAA',
        transport: { socketId: 3 }
    };

    // When
    const record = buildExecutionRecord(recordInput({
        results: [{
            label: 'Lesson', status: 'completed', code: 'OK', message: 'Done',
            data
        }]
    }));

    // Then
    assert.deepEqual(record.results[0].data, data);
});

test('preserves complete diagnostic content', () => {
    // Given
    const long = 'x'.repeat(800);
    const values = Array.from({ length: 40 }, (_, index) => index);

    // When
    const record = buildExecutionRecord(recordInput({
        results: [{
            label: 'Lesson', status: 'completed', code: 'OK', message: 'Done',
            diagnostics: { requestAttempts: [requestAttempt({
                serverErrorMessage: long,
                requestSummary: { authorization: 'Bearer secret', nested: { response: { token: 'secret' } } },
                responseSummary: { message: long, values }
            })] }
        }]
    }));
    const attempt = record.results[0].diagnostics.requestAttempts[0];
    // Then
    assert.equal(attempt.requestSummary.authorization, 'Bearer secret');
    assert.equal(attempt.requestSummary.nested.response.token, 'secret');
    assert.equal(attempt.serverErrorMessage, long);
    assert.equal(attempt.responseSummary.message, long);
    assert.deepEqual(attempt.responseSummary.values, values);
});

test('rejects malformed and unknown diagnostic fields while allowing unlimited attempts', () => {
    // Given
    const withDiagnostics = (diagnostics) => recordInput({
        results: [{ label: 'Lesson', status: 'completed', code: 'OK', message: 'Done', diagnostics }]
    });
    // When
    const record = buildExecutionRecord(withDiagnostics({ requestAttempts: Array.from({ length: 30 }, (_, index) => requestAttempt({ attemptNumber: index + 1 })) }));

    // Then
    assert.throws(() => buildExecutionRecord(withDiagnostics({ requestAttempts: {} })), /Expected an array/);
    assert.throws(() => buildExecutionRecord(withDiagnostics({ requestAttempts: [requestAttempt({ outcome: 'maybe' })] })), /Unsupported diagnostic outcome/);
    assert.throws(() => buildExecutionRecord(withDiagnostics({ requestAttempts: [requestAttempt({ rawResponse: {} })] })), /Unexpected field/);
    assert.equal(record.results[0].diagnostics.requestAttempts.length, 30);
});

test('exports an exact clone of persisted diagnostic values', () => {
    // Given
    const record = buildExecutionRecord(recordInput({
        results: [{
            label: 'Lesson', status: 'completed', code: 'OK', message: 'Done',
            diagnostics: { requestAttempts: [requestAttempt()] }
        }]
    }));
    const storedShape = JSON.parse(JSON.stringify(record));
    storedShape.results[0].diagnostics.requestAttempts[0].method = 'get';
    // When
    const exported = JSON.parse(serializeExecutionRecord(storedShape));

    // Then
    assert.equal(exported.results[0].diagnostics.requestAttempts[0].method, 'get');
});
