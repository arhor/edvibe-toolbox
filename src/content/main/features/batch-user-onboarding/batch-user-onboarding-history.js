const OPERATION_TYPE = 'batch_user_onboarding';

function serializeParameters(parameters) {
    return {
        plan: parameters.plan,
        marathonId: parameters.marathonId,
        ...(parameters.requestDelayMs === undefined ? {} : { requestDelayMs: parameters.requestDelayMs })
    };
}

function serializeError(error) {
    return {
        name: error?.name || 'Error',
        code: error?.code || 'EXECUTION_FAILED',
        message: error?.message || 'Batch user onboarding execution failed.',
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
            label: 'executePlan',
            status: failed ? 'failed' : 'success',
            code: failed ? serializedError.code : 'EXECUTION_COMPLETED',
            message: failed ? serializedError.message : 'Batch user onboarding execution completed.',
            attempts: 1,
            data: {
                parameters: serializeParameters(parameters),
                ...(failed ? { error: serializedError } : { result })
            }
        }],
        message: null
    };
}

function createRecordedExecution({ executePlan, persistExecution, getMarathonName, now, logger }) {
    return async function executeRecordedPlan(parameters) {
        const startedAt = now().toISOString();
        try {
            const result = await executePlan(parameters);
            await persistHistory({ parameters, result, startedAt });
            return result;
        } catch (error) {
            await persistHistory({ parameters, error, startedAt });
            throw error;
        }
    };

    async function persistHistory({ parameters, result, error, startedAt }) {
        try {
            await persistExecution(buildExecutionHistoryInput({
                parameters,
                result,
                error,
                startedAt,
                completedAt: now().toISOString(),
                marathonName: getMarathonName()
            }));
        } catch (persistenceError) {
            logger.log('Batch user onboarding history persistence failed:', persistenceError);
        }
    }
}

export { OPERATION_TYPE, buildExecutionHistoryInput, createRecordedExecution };
