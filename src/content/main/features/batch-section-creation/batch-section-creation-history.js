import { buildExecutionHistoryInput } from '#src/content/main/features/batch-section-creation/batch-section-creation-history-record.js';

function createRecordedExecution({ executePlan, persistExecution, getMarathonName, now, logger }) {
    return async function executeRecordedCreationPlan(parameters) {
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
            logger.log('Batch section creation history persistence failed:', persistenceError);
        }
    }
}

export { createRecordedExecution };
