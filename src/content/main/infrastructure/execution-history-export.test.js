import assert from 'node:assert/strict';
import { test } from 'node:test';

import { buildExecutionRecord } from '#src/content/main/infrastructure/execution-history-record.js';
import { createExecutionHistoryService } from '#src/content/main/infrastructure/execution-history-service.js';

function input({ id = 'execution-1', diagnostics = true } = {}) {
    const result = { label: 'Lesson', status: 'failed', code: 'ERROR', message: 'Failed' };
    if (diagnostics) result.diagnostics = { requestAttempts: [{
        correlationId: `${id}:1`, operationName: 'archiveLesson', controller: 'Lessons',
        method: 'POST', requestId: 'request-1', attemptNumber: 1,
        startedAt: '2026-08-11T10:00:00.000Z', completedAt: '2026-08-11T10:00:00.010Z',
        durationMs: 10, outcome: 'failure', serverErrorCode: 'ERROR',
        requestSummary: { lessonId: 1, authorization: 'Bearer secret', note: 'x'.repeat(800) },
        responseSummary: { token: 'secret-token', values: Array.from({ length: 100 }, (_, index) => index) }
    }] };
    return {
        id, operationType: 'archive-lessons', startedAt: '2026-08-11T10:00:00.000Z',
        completedAt: '2026-08-11T10:00:01.000Z', status: 'completed_with_failures',
        pageContext: {}, counts: { requested: 1, eligible: 1, attempted: 1, failed: 1 },
        results: [result]
    };
}

function serviceHarness(records, autoExport = false) {
    const downloads = [];
    const service = createExecutionHistoryService({
        repository: {
            persist: async (record) => records.push(record),
            list: async () => records,
            get: async (id) => records.find((record) => record.id === id) || null,
            delete: async () => {}, clear: async () => {}, count: async () => records.length,
            deleteMany: async () => {}
        },
        preferenceStore: { get: async () => ({ mode: 'indefinite', autoExport }), set: async () => {} },
        downloader: { download: (download) => downloads.push(download) },
        now: () => new Date('2026-08-11T12:00:00.000Z')
    });
    return { service, downloads };
}

function assertFullDiagnosticExport(json) {
    const text = json;
    const record = Array.isArray(JSON.parse(text)) ? JSON.parse(text)[0] : JSON.parse(text);
    const attempt = record.results[0].diagnostics.requestAttempts[0];
    assert.equal(attempt.requestSummary.authorization, 'Bearer secret');
    assert.equal(attempt.responseSummary.token, 'secret-token');
    assert.equal(attempt.requestSummary.note.length, 800);
    assert.equal(attempt.responseSummary.values.length, 100);
}

test('individual and filtered exports contain exact diagnostics and preserve legacy records', async () => {
    const diagnosticRecord = buildExecutionRecord(input());
    const legacyRecord = buildExecutionRecord(input({ id: 'legacy', diagnostics: false }));
    const { service, downloads } = serviceHarness([diagnosticRecord, legacyRecord]);

    await service.exportRecord(diagnosticRecord.id);
    await service.exportFiltered({ status: 'completed_with_failures' });

    assertFullDiagnosticExport(downloads[0].json);
    assertFullDiagnosticExport(downloads[1].json);
    const filtered = JSON.parse(downloads[1].json);
    assert.equal(filtered[1].id, 'legacy');
    assert.equal(filtered[1].results[0].diagnostics, undefined);
});

test('automatic exports contain the same full diagnostics as the persisted record', async () => {
    const records = [];
    const { service, downloads } = serviceHarness(records, true);
    const persisted = await service.persistTerminal(input({ id: 'automatic' }));

    assert.equal(persisted.stored, true);
    assert.equal(downloads.length, 1);
    assertFullDiagnosticExport(downloads[0].json);
    assert.deepEqual(JSON.parse(downloads[0].json), JSON.parse(JSON.stringify(persisted.record)));
});
