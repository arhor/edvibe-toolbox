import test from 'node:test';
import assert from 'node:assert/strict';
import { serializeRow } from '#src/content/main/features/batch-user-management/batch-user-management-history.js';
function attempt(correlationId, requestId, transportCode = 'SERVER_REJECTED') {
    return { correlationId, operationName: 'write', controller: 'C', method: 'POST', projectName: 'P', requestId, attemptNumber: 1, startedAt: '2026-01-01T00:00:00.000Z', completedAt: null, durationMs: null, outcome: 'failure', transportCode, serverErrorCode: 'DENIED', serverErrorMessage: null, requestSummary: null, responseSummary: null };
}
test('preserves correlated server rejection and transport failure diagnostics', () => {
    const operation = (code, id) => ({ status: 'failed', code, attempts: 1, diagnostics: { requestAttempts: [attempt('user:a', id, code)] } });
    const row = serializeRow({ email: 'a@b.test', normalizedEmail: 'a@b.test', status: 'matched', unassignSelected: true, deleteSelected: true, unassign: operation('SERVER_REJECTED', 'reject-1'), delete: operation('REQUEST_TIMEOUT', 'timeout-2') }, 0);
    assert.deepEqual(row.diagnostics.requestAttempts.map(({ requestId }) => requestId), ['reject-1', 'timeout-2']);
    assert.equal(row.diagnostics.requestAttempts[0].correlationId, 'user:a');
});
