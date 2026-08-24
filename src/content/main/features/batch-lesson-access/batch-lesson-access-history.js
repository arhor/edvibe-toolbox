import { createFeatureSession } from '#src/content/main/application/feature-session.js';
import { BATCH_ACCESS_DIALOG_TAG } from '#src/content/main/features/batch-lesson-access/batch-lesson-access-dialog.js';
import { buildExecutionHistoryInput } from '#src/content/main/features/batch-lesson-access/batch-lesson-access-history-record.js';
import * as batchAccessApi from '#src/content/main/features/batch-lesson-access/batch-lesson-access.js';
import { WINDOW_MESSAGE_TYPES } from '#src/shared/messaging/index.js';

function createRecordedExecution({ executePlan, persistExecution, getMarathonName, now, logger }) {
    return async function executeRecordedAccessPlan(parameters) {
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
            logger.log('Batch lesson access history persistence failed:', persistenceError);
        }
    }
}

export function createHistoryAwareFeatureV2({
    transport,
    operationGuard,
    logger,
    executionHistoryService,
}) {
    const historyLogger = logger.createChildLogger('BatchAccessHistory');
    return batchAccessApi.createBatchLessonAccessFeature({
        sendRequest: transport.sendRequest,
        getConnectionState: transport.getConnectionState,
        executePlan: createRecordedExecution({
            executePlan: batchAccessApi.executeAccessPlan,
            persistExecution: executionHistoryService.persistTerminal,
            getMarathonName: () => document.querySelector('h1')?.textContent?.trim()
                || document.title
                || null,
            now: () => new Date(),
            logger: historyLogger
        }),
        session: createFeatureSession({ operationGuard, operationName: 'batch-access' }),
        createDialog: () => document.createElement(BATCH_ACCESS_DIALOG_TAG),
        copyText: (text) => navigator.clipboard.writeText(text),
        logger: historyLogger
    });
}

const batchLessonAccessFeatureDefinition = Object.freeze({
    type: WINDOW_MESSAGE_TYPES.OPEN_BATCH_LESSON_ACCESS,
    create(context) {
        const feature = createHistoryAwareFeatureV2(context);
        return () => feature.open();
    }
});

export { batchLessonAccessFeatureDefinition, createRecordedExecution };
