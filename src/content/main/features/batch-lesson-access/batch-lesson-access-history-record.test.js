import test from 'node:test';
import assert from 'node:assert/strict';
import { buildExecutionHistoryInput } from '#src/content/main/features/batch-lesson-access/batch-lesson-access-history-record.js';
import {buildObservedPlan} from '#src/content/main/features/batch-lesson-access/batch-lesson-access-history-model.js';
function attempt(correlationId, requestId, transportCode = 'SERVER_REJECTED') {
    return { correlationId, operationName: 'write', controller: 'C', method: 'POST', projectName: 'P', requestId, attemptNumber: 1, startedAt: '2026-01-01T00:00:00.000Z', completedAt: null, durationMs: null, outcome: 'failure', transportCode, serverErrorCode: 'DENIED', serverErrorMessage: null, requestSummary: null, responseSummary: null };
}
test('correlates server rejection and transport failure diagnostics across result rows', () => {
    const matrix = [1, 2].map((id) => ({ submittedInput: 'a@b.test', resolvedEmail: 'a@b.test', pupilId: 1, marathonPupilId: 2, marathonLessonId: id, lessonNumber: id, lessonName: `L${id}`, preflightAccessState: 'closed', plannedOutcome: 'open' }));
    const failures = [['SERVER_REJECTED', 'reject-1', 1], ['REQUEST_TIMEOUT', 'timeout-2', 2]].map(([code, id, lesson]) => ({ email: 'a@b.test', marathonLessonId: lesson, code, message: code, attempts: 1, diagnostics: { requestAttempts: [attempt(`write:${lesson}`, id, code)] } }));
    const record = buildExecutionHistoryInput({ plan: { matrix, identities: [], selectedLessons: [], discoveryFailures: [], operationFailures: [] }, summary: { failures }, startedAt: '2026-01-01T00:00:00.000Z', completedAt: '2026-01-01T00:00:01.000Z' });
    assert.deepEqual(record.results.map((result) => result.diagnostics.requestAttempts[0].requestId), ['reject-1', 'timeout-2']);
});

test('reconstructs the specific non-ASCII email diagnostic', () => {
    // Given
    const input = 'test@gmail.cоm';

    // When
    const plan = buildObservedPlan({
        submittedEmailInput: input,
        selectedLessonIds: [],
        pupils: [],
        lessonsByPupilId: new Map(),
        lessonCatalogue: []
    });

    // Then
    assert.equal(plan.identities[0].code, 'EMAIL_NON_ASCII');
    assert.match(plan.identities[0].message, /«о» \(кириллица, U\+043E\)/);
});
