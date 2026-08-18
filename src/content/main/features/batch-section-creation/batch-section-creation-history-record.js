import * as modelApi from '#src/content/main/features/batch-section-creation/batch-section-creation-history-model.js';
import { historyDiagnostics } from '#src/content/main/infrastructure/history-diagnostics.js';

const TERMINAL_STATUSES = new Set(modelApi.TERMINAL_STATUSES);

function resultCode(result, terminalStatus) {
    if (result?.code) {
        return modelApi.text(result.code, 'UNKNOWN_ERROR', 120);
    }
    return {
        created: 'SECTION_CREATED',
        rejected: 'PREFLIGHT_REJECTED',
        failed: 'SECTION_CREATION_FAILED',
        partially_created: 'SECTION_PARTIALLY_CREATED',
        not_attempted: terminalStatus === 'cancelled'
            ? 'OPERATION_CANCELLED'
            : 'OPERATION_INTERRUPTED'
    }[result?.status] || 'UNKNOWN_RESULT';
}

function resultMessage(result, terminalStatus) {
    if (result?.message) {
        return modelApi.text(result.message, 'No message was provided.', 1000);
    }
    return {
        created: 'Section created successfully.',
        rejected: 'The lesson was rejected during preflight.',
        failed: 'Section creation failed.',
        partially_created: 'Section creation failed after the section had been created.',
        not_attempted: terminalStatus === 'cancelled'
            ? 'Not attempted because the confirmed run was cancelled.'
            : 'Not attempted because the confirmed run was interrupted.'
    }[result?.status] || 'The operation produced an unknown result.';
}

function serializeCleanup(result, terminalStatus) {
    if (result?.status !== 'partially_created') {
        return null;
    }
    const cleanup = result?.cleanup;
    if (!cleanup) {
        return Object.freeze({
            attempted: false,
            status: 'unavailable',
            code: terminalStatus === 'interrupted'
                ? 'CLEANUP_UNAVAILABLE_AFTER_INTERRUPTION'
                : 'CLEANUP_UNAVAILABLE',
            message: terminalStatus === 'interrupted'
                ? 'Cleanup was unavailable after the batch was interrupted.'
                : 'Cleanup was unavailable for this partially created section.'
        });
    }
    const attempted = Boolean(cleanup.attempted);
    const status = ['success', 'failed', 'unavailable'].includes(cleanup.status)
        ? cleanup.status
        : attempted ? 'failed' : 'unavailable';
    return Object.freeze({
        attempted,
        status,
        code: cleanup.code
            ? modelApi.text(cleanup.code, 'CLEANUP_FAILED', 120)
            : status === 'success'
                ? 'CLEANUP_SUCCEEDED'
                : status === 'unavailable'
                    ? 'CLEANUP_UNAVAILABLE'
                    : 'CLEANUP_FAILED',
        message: cleanup.message
            ? modelApi.text(cleanup.message, 'Cleanup failed.', 1000)
            : status === 'success'
                ? 'Cleanup completed successfully.'
                : status === 'unavailable'
                    ? 'Cleanup was unavailable.'
                    : 'Cleanup failed.'
    });
}

function serializeCreationFailure(result, terminalStatus) {
    if (!modelApi.isFailureStatus(result?.status)) {
        return null;
    }
    return Object.freeze({
        code: resultCode(result, terminalStatus),
        message: resultMessage(result, terminalStatus),
        attemptCount: Number.isSafeInteger(result?.attempts) && result.attempts >= 0
            ? result.attempts
            : 1
    });
}

function serializeResult(result, definitionSummary, terminalStatus) {
    const lesson = modelApi.normalizeLesson(result);
    const status = modelApi.text(result?.status, 'not_attempted', 80);
    const attempts = Number.isSafeInteger(result?.attempts) && result.attempts >= 0
        ? result.attempts
        : modelApi.isAttemptedStatus(status) ? 1 : 0;
    const normalizedResult = { ...result, status };
    const code = resultCode(normalizedResult, terminalStatus);
    const message = resultMessage(normalizedResult, terminalStatus);
    return Object.freeze({
        itemId: lesson.lessonId === null ? null : String(lesson.lessonId),
        label: `${lesson.number ?? '?'}. ${lesson.name}`,
        status,
        code,
        message,
        attempts,
        ...(historyDiagnostics(result) ? { diagnostics: historyDiagnostics(result) } : {}),
        data: Object.freeze({
            lesson,
            section: definitionSummary,
            preflight: Object.freeze({
                status: status === 'rejected' ? 'rejected' : 'eligible',
                code: status === 'rejected' ? code : 'PREFLIGHT_ELIGIBLE',
                message: status === 'rejected'
                    ? message
                    : 'The lesson passed preflight and was included in the confirmed plan.'
            }),
            creationFailure: serializeCreationFailure(normalizedResult, terminalStatus),
            cleanup: serializeCleanup(normalizedResult, terminalStatus),
            identifiers: modelApi.serializeIdentifiers(result)
        })
    });
}

function inferTerminalStatus(explicitStatus, fatalError, results) {
    if (TERMINAL_STATUSES.has(explicitStatus)) {
        return explicitStatus;
    }
    if (fatalError) {
        return 'interrupted';
    }
    return results.some((result) => [
        'rejected',
        'failed',
        'partially_created',
        'not_attempted'
    ].includes(result.status))
        ? 'completed_with_failures'
        : 'completed';
}

function buildExecutionHistoryInput({
    plan,
    result = {},
    startedAt,
    completedAt,
    marathonId,
    marathonName = null,
    terminalStatus = null,
    fatalError = null
}) {
    const materializationStatus = TERMINAL_STATUSES.has(terminalStatus)
        ? terminalStatus
        : fatalError ? 'interrupted' : null;
    const definitionSummary = modelApi.serializeSectionDefinition(
        plan?.definition || result?.definition || {}
    );
    const materialized = modelApi.materializeResults(plan, result, materializationStatus);
    const results = materialized.map((entry) => serializeResult(
        entry,
        definitionSummary,
        materializationStatus
    ));
    const status = inferTerminalStatus(terminalStatus, fatalError || result?.fatalError, results);
    const counts = modelApi.buildCounts(results, plan);
    return Object.freeze({
        operationType: modelApi.OPERATION_TYPE,
        startedAt,
        completedAt,
        status,
        pageContext: Object.freeze({ marathonId, marathonName }),
        counts,
        results: Object.freeze(results),
        message: JSON.stringify({
            sectionName: definitionSummary.name,
            blockCount: definitionSummary.blocks.length,
            counts
        })
    });
}

export {
    resultCode,
    resultMessage,
    serializeCleanup,
    serializeResult,
    inferTerminalStatus,
    buildExecutionHistoryInput
};
