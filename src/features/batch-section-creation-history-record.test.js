import test from 'node:test';
import assert from 'node:assert/strict';
import { serializeResult } from './batch-section-creation-history-record.js';
function attempt(correlationId, requestId, transportCode = 'SERVER_REJECTED') {
    return { correlationId, operationName: 'write', controller: 'C', method: 'POST', projectName: 'P', requestId, attemptNumber: 1, startedAt: '2026-01-01T00:00:00.000Z', completedAt: null, durationMs: null, outcome: 'failure', transportCode, serverErrorCode: 'DENIED', serverErrorMessage: null, requestSummary: null, responseSummary: null };
}
test('preserves server rejection and transport failure diagnostics for recipe requests', () => {
    for (const [code, id] of [['SERVER_REJECTED', 'reject-1'], ['REQUEST_TIMEOUT', 'timeout-2']]) {
        const result = serializeResult({ lessonId: 1, lessonName: 'L', status: 'failed', code, diagnostics: { requestAttempts: [attempt('lesson:1', id, code)] } }, Object.freeze({}), null);
        assert.equal(result.diagnostics.requestAttempts[0].requestId, id);
        assert.equal(result.diagnostics.requestAttempts[0].correlationId, 'lesson:1');
    }
});
