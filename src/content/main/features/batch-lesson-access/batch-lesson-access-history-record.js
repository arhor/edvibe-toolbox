const OPERATION_TYPE = 'batch_lesson_access';

function serializeParameters(parameters) {
    return {
        marathonId: parameters.marathonId,
        requestedEmails: parameters.requestedEmails,
        matchedUsers: parameters.matchedUsers,
        selectedLessons: parameters.selectedLessons,
        alreadyOpen: parameters.alreadyOpen,
        needsOpening: parameters.needsOpening
    };
}

function serializeError(error) {
    return {
        name: error?.name || 'Error',
        code: error?.code || 'EXECUTION_FAILED',
        message: error?.message || 'Batch lesson access execution failed.',
        ...(error?.partialResult ? { partialResult: error.partialResult } : {})
    };
}

function buildExecutionHistoryInput({ parameters, result, error, startedAt, completedAt, marathonName = null }) {
    const failed = Boolean(error);
    const serializedError = failed ? serializeError(error) : null;
    return {
        operationType: OPERATION_TYPE,
        startedAt,
        completedAt,
        status: failed ? 'interrupted' : 'completed',
        pageContext: { marathonId: parameters.marathonId, marathonName },
        counts: {
            requested: 1,
            eligible: 1,
            attempted: 1,
            successful: failed ? 0 : 1,
            noOp: 0,
            skipped: 0,
            failed: failed ? 1 : 0,
            notAttempted: 0
        },
        results: [{
            itemId: OPERATION_TYPE,
            label: 'executeAccessPlan',
            status: failed ? 'failed' : 'success',
            code: failed ? serializedError.code : 'EXECUTION_COMPLETED',
            message: failed ? serializedError.message : 'Batch lesson access execution completed.',
            attempts: 1,
            data: {
                parameters: serializeParameters(parameters),
                ...(failed ? { error: serializedError } : { result })
            }
        }],
        message: null
    };
}

export { OPERATION_TYPE, buildExecutionHistoryInput };
