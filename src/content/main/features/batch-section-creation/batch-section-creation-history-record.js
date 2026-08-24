const OPERATION_TYPE = 'batch_section_creation';

function serializeParameters(parameters) {
    return {
        marathonId: parameters.marathonId,
        plan: parameters.plan,
        ...(parameters.lessonDelayMs === undefined ? {} : { lessonDelayMs: parameters.lessonDelayMs })
    };
}

function serializeError(error) {
    return {
        name: error?.name || 'Error',
        code: error?.code || 'EXECUTION_FAILED',
        message: error?.message || 'Batch section creation execution failed.',
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
            label: 'executeCreationPlan',
            status: failed ? 'failed' : 'success',
            code: failed ? serializedError.code : 'EXECUTION_COMPLETED',
            message: failed ? serializedError.message : 'Batch section creation execution completed.',
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
