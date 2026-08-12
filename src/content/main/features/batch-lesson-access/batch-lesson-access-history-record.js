import {
    OPERATION_TYPE,
    freezeObject,
    normalizeEmail,
    lessonKey,
    attemptKey
} from './batch-lesson-access-history-model.js';
import { historyDiagnostics } from '../../infrastructure/history-diagnostics.js';

const REJECTED_WRITE_CODES = new Set(['SERVER_REJECTED', 'INVALID_RESPONSE']);

function resultFromMatrix(item, outcome, attempts, code, message, diagnosticSource = null) {
    const status = {
        opened: 'success',
        already_open: 'noop',
        rejected: 'rejected',
        failed: 'failed',
        not_attempted: 'not_attempted'
    }[outcome];
    return freezeObject({
        itemId: lessonKey(item.resolvedEmail || item.submittedInput, item.marathonLessonId),
        label: `${item.resolvedEmail || item.submittedInput} — ${item.lessonNumber || '?'}. ${item.lessonName}`,
        status,
        code,
        message,
        attempts,
        ...(historyDiagnostics(diagnosticSource) ? { diagnostics: historyDiagnostics(diagnosticSource) } : {}),
        data: freezeObject({
            submittedEmail: item.submittedInput,
            resolvedEmail: item.resolvedEmail,
            pupilId: item.pupilId,
            marathonPupilId: item.marathonPupilId,
            marathonLessonId: item.marathonLessonId,
            lessonNumber: item.lessonNumber,
            lessonName: item.lessonName,
            preflightAccessState: item.preflightAccessState,
            outcome
        })
    });
}

function buildMatrixResults(plan, summary = {}, writeAttempts = new Map()) {
    const openedKeys = new Set((Array.isArray(summary.opened) ? summary.opened : []).map((item) => (
        lessonKey(item.email, item.marathonLessonId)
    )));
    const failuresByKey = new Map();
    for (const failure of Array.isArray(summary.failures) ? summary.failures : []) {
        failuresByKey.set(lessonKey(failure.email, failure.marathonLessonId), failure);
    }

    return plan.matrix.map((item) => {
        if (item.plannedOutcome === 'already_open') {
            return resultFromMatrix(item, 'already_open', 0, 'LESSON_ALREADY_OPEN', 'Lesson access was already open.');
        }
        if (item.plannedOutcome === 'rejected') {
            return resultFromMatrix(item, 'rejected', 0, item.code, item.message);
        }
        if (item.plannedOutcome === 'not_attempted') {
            return resultFromMatrix(item, 'not_attempted', 0, item.code, item.message);
        }

        const key = lessonKey(item.resolvedEmail, item.marathonLessonId);
        if (openedKeys.has(key)) {
            const attempts = writeAttempts.get(attemptKey(item.marathonPupilId, item.marathonLessonId)) || 1;
            return resultFromMatrix(item, 'opened', attempts, 'LESSON_ACCESS_OPENED', 'Lesson access was opened.');
        }
        const failure = failuresByKey.get(key);
        if (failure) {
            const outcome = REJECTED_WRITE_CODES.has(failure.code) ? 'rejected' : 'failed';
            return resultFromMatrix(
                item,
                outcome,
                Number.isInteger(failure.attempts) ? failure.attempts : 1,
                failure.code || 'LESSON_ACCESS_WRITE_FAILED',
                failure.message || 'The lesson access change failed.',
                failure
            );
        }
        return resultFromMatrix(
            item,
            'not_attempted',
            0,
            'LESSON_ACCESS_NOT_ATTEMPTED',
            'The confirmed combination was not attempted.'
        );
    });
}

function inputFailureResults(identities) {
    return identities
        .filter((identity) => identity.resolution !== 'matched')
        .map((identity) => freezeObject({
            itemId: `input:${identity.normalizedEmail || identity.submittedInput}`,
            label: identity.submittedInput,
            status: 'rejected',
            code: identity.code,
            message: identity.message,
            attempts: 0,
            data: freezeObject({
                submittedInput: identity.submittedInput,
                normalizedEmail: identity.normalizedEmail,
                resolution: identity.resolution
            })
        }));
}

function operationFailureResults(failures) {
    return failures.map((failure, index) => freezeObject({
        itemId: `operation:${index + 1}:${failure.code}`,
        label: failure.kind === 'input' ? 'Submitted request' : 'Lesson-access preflight',
        status: failure.kind === 'input' ? 'rejected' : 'failed',
        code: failure.code,
        message: failure.message,
        attempts: failure.attempts,
        ...(historyDiagnostics(failure) ? { diagnostics: historyDiagnostics(failure) } : {}),
        data: freezeObject({ stage: failure.kind === 'input' ? 'input_validation' : 'preflight' })
    }));
}

function discoveryFailureResults(failures) {
    return failures.map((failure) => freezeObject({
        itemId: `discovery:${normalizeEmail(failure.resolvedEmail || failure.submittedEmail)}`,
        label: failure.resolvedEmail || failure.submittedEmail,
        status: 'failed',
        code: failure.code,
        message: failure.message,
        attempts: failure.attempts,
        ...(historyDiagnostics(failure) ? { diagnostics: historyDiagnostics(failure) } : {}),
        data: freezeObject({
            submittedEmail: failure.submittedEmail,
            resolvedEmail: failure.resolvedEmail,
            pupilId: failure.pupilId,
            marathonPupilId: failure.marathonPupilId,
            stage: 'lesson_state_discovery'
        })
    }));
}

function buildSummary(plan, matrixResults) {
    const matchedUsers = plan.identities.filter((identity) => identity.resolution === 'matched').length;
    const countOutcome = (outcome) => matrixResults.filter((result) => result.data.outcome === outcome).length;
    return Object.freeze({
        requestedInputs: plan.identities.length,
        matchedUsers,
        selectedLessons: plan.selectedLessons.length,
        totalCombinations: plan.matrix.length,
        newlyOpened: countOutcome('opened'),
        alreadyOpen: countOutcome('already_open'),
        rejected: countOutcome('rejected'),
        failedWrites: countOutcome('failed'),
        notAttempted: countOutcome('not_attempted'),
        inputFailures: plan.identities.filter((identity) => identity.resolution !== 'matched').length,
        discoveryFailures: plan.discoveryFailures.length,
        operationFailures: plan.operationFailures.length
    });
}

function inferTerminalStatus(explicitStatus, operationSummary) {
    if (explicitStatus === 'cancelled' || explicitStatus === 'interrupted') return explicitStatus;
    return operationSummary.rejected > 0
        || operationSummary.failedWrites > 0
        || operationSummary.notAttempted > 0
        || operationSummary.inputFailures > 0
        || operationSummary.discoveryFailures > 0
        || operationSummary.operationFailures > 0
        ? 'completed_with_failures'
        : 'completed';
}

function buildExecutionHistoryInput({
    plan,
    summary = {},
    writeAttempts = new Map(),
    startedAt,
    completedAt,
    marathonId,
    marathonName = null,
    terminalStatus = null
}) {
    const matrixResults = buildMatrixResults(plan, summary, writeAttempts);
    const inputResults = inputFailureResults(plan.identities);
    const discoveryResults = discoveryFailureResults(plan.discoveryFailures);
    const operationResults = operationFailureResults(plan.operationFailures);
    const operationSummary = buildSummary(plan, matrixResults);
    const attempted = operationSummary.newlyOpened + operationSummary.rejected + operationSummary.failedWrites;
    const failed = operationSummary.rejected + operationSummary.failedWrites;
    return Object.freeze({
        operationType: OPERATION_TYPE,
        startedAt,
        completedAt,
        status: inferTerminalStatus(terminalStatus, operationSummary),
        pageContext: Object.freeze({ marathonId, marathonName }),
        counts: Object.freeze({
            requested: operationSummary.requestedInputs,
            eligible: operationSummary.totalCombinations,
            attempted,
            successful: operationSummary.newlyOpened,
            noOp: operationSummary.alreadyOpen,
            skipped: operationSummary.inputFailures
                + operationSummary.discoveryFailures
                + operationSummary.operationFailures,
            failed,
            notAttempted: operationSummary.notAttempted
        }),
        results: Object.freeze([...inputResults, ...operationResults, ...discoveryResults, ...matrixResults]),
        message: JSON.stringify(operationSummary)
    });
}

export { buildExecutionHistoryInput };
