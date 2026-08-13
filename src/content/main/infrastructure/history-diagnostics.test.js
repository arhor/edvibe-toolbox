import test from 'node:test';
import assert from 'node:assert/strict';
import { requestAttemptFromObservation, diagnosticsFromObservations } from '#src/content/main/infrastructure/history-diagnostics.js';

function error(code, requestId, response = {}) {
    return Object.assign(new Error(code), { code, requestId, diagnostics: {
        request: { controller: 'Controller', method: 'Post', projectName: 'Project', requestId, startedAt: 100, value: { Id: 7 } },
        response
    } });
}

test('converts server rejection and transport failure observations to the validated diagnostic contract', () => {
    const diagnostics = diagnosticsFromObservations([
        error('SERVER_REJECTED', 'server-1', { requestId: 'server-1', success: false, errorCode: 'DENIED', serverMessage: 'No', elapsedMs: 5 }),
        error('REQUEST_TIMEOUT', 'transport-2')
    ], { correlationId: 'shared-page-1', operationName: 'load_page' });
    assert.deepEqual(diagnostics.requestAttempts.map(({ requestId, outcome }) => [requestId, outcome]), [
        ['server-1', 'failure'], ['transport-2', 'failure']
    ]);
    assert.equal(diagnostics.requestAttempts[0].correlationId, 'shared-page-1');
    assert.equal(diagnostics.requestAttempts[1].attemptNumber, 2);
    assert.equal(requestAttemptFromObservation(error('REQUEST_TIMEOUT', 'x'), {
        correlationId: 'retry', operationName: 'write'
    }).transportCode, 'REQUEST_TIMEOUT');
});
