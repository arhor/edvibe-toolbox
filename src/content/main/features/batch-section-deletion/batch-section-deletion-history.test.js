import assert from 'node:assert/strict';
import test from 'node:test';

import { serializeResult } from '#src/content/main/features/batch-section-deletion/batch-section-deletion-history.js';
import { buildExecutionHistoryInput as buildLegacyHistory } from '#src/content/main/features/batch-section-deletion/batch-section-deletion.js';
function attempt(correlationId, requestId, transportCode = 'SERVER_REJECTED') {
    return { correlationId, operationName: 'write', controller: 'C', method: 'POST', projectName: 'P', requestId, attemptNumber: 1, startedAt: '2026-01-01T00:00:00.000Z', completedAt: null, durationMs: null, outcome: 'failure', transportCode, serverErrorCode: 'DENIED', serverErrorMessage: null, requestSummary: null, responseSummary: null };
}
test('preserves server rejection and transport failure diagnostics for deletion requests', () => {
    for (const [code, id] of [['SERVER_REJECTED', 'reject-1'], ['REQUEST_TIMEOUT', 'timeout-2']]) {
        const result = serializeResult({ lessonId: 1, number: 1, name: 'L', status: 'failed', code, attempts: 1, diagnostics: { requestAttempts: [attempt('lesson:1', id, code)] } }, { sectionName: 'S' }, null);
        assert.equal(result.diagnostics.requestAttempts[0].requestId, id);
    }
});

test('the legacy builder converts a transport error and correlates it to its lesson', () => {
    const error = Object.assign(new Error('timeout'), { code: 'REQUEST_TIMEOUT', diagnostics: {
        request: { controller: 'C', method: 'POST', requestId: 'legacy-timeout', startedAt: 1 }
    } });
    const entry = { lessonId: 9, number: 1, name: 'L', status: 'failed', code: error.code,
        message: error.message, diagnosticObservations: [error] };
    const record = buildLegacyHistory({ marathonId: '1', startedAt: '2026-01-01T00:00:00.000Z',
        completedAt: '2026-01-01T00:00:01.000Z', result: { plan: { selectedCount: 1,
            eligible: [entry], sectionName: 'S' }, results: [entry], fatalError: null } });
    assert.equal(record.results[0].diagnostics.requestAttempts[0].requestId, 'legacy-timeout');
    assert.equal(record.results[0].diagnostics.requestAttempts[0].correlationId, 'delete-section:9');
});
