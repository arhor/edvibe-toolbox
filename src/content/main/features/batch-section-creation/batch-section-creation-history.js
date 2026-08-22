import { withExecutionHistory } from '#src/content/main/application/execution-history-operation.js';
import * as modelApi from '#src/content/main/features/batch-section-creation/batch-section-creation-history-model.js';
import * as recordApi from '#src/content/main/features/batch-section-creation/batch-section-creation-history-record.js';

function createBatchSectionCreationHistoryOperation({
    execute,
    persistExecution,
    onPersistence = () => {},
    getLocationHref = () => '',
    getMarathonName = () => null,
    now = () => new Date(),
    logger = { log() {} }
} = {}) {
    return withExecutionHistory({
        execute,
        persistExecution,
        onPersistence,
        now,
        logger,
        buildHistoryInput({ input, result, error, startedAt, completedAt }) {
            const plan = input?.plan || {};
            const executionResult = result || error?.partialResult || {
                definition: plan.definition,
                results: Array.isArray(plan.rejected)
                    ? plan.rejected.map((entry) => modelApi.asExecutionResult(entry, 'rejected'))
                    : [],
                fatalError: error || null
            };
            return recordApi.buildExecutionHistoryInput({
                plan,
                result: executionResult,
                startedAt,
                completedAt,
                marathonId: modelApi.parseMarathonId(getLocationHref()),
                marathonName: getMarathonName(),
                terminalStatus: error ? 'interrupted' : null,
                fatalError: error || executionResult?.fatalError || null
            });
        }
    });
}

export * from '#src/content/main/features/batch-section-creation/batch-section-creation-history-model.js';
export * from '#src/content/main/features/batch-section-creation/batch-section-creation-history-record.js';

export { createBatchSectionCreationHistoryOperation };
