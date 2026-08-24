import { createFeatureSession } from '#src/content/main/application/feature-session.js';
import { BATCH_SECTION_DELETION_DIALOG_TAG } from '#src/content/main/features/batch-section-deletion/batch-section-deletion-dialog.js';
import * as coreApi from '#src/content/main/features/batch-section-deletion/batch-section-deletion.js';
import { WINDOW_MESSAGE_TYPES } from '#src/shared/messaging/index.js';

const OPERATION_TYPE = 'batch-section-deletion';

function serializeParameters(parameters) {
    return {
        plan: parameters.plan,
        ...(parameters.requestDelayMs === undefined ? {} : { requestDelayMs: parameters.requestDelayMs })
    };
}

function serializeError(error) {
    return {
        name: error?.name || 'Error',
        code: error?.code || 'EXECUTION_FAILED',
        message: error?.message || 'Batch section deletion execution failed.',
        ...(error?.partialResult ? { partialResult: error.partialResult } : {})
    };
}

function buildExecutionHistoryInput({ parameters, result, error, startedAt, completedAt, marathonId, marathonName = null }) {
    const failed = Boolean(error);
    const serializedError = failed ? serializeError(error) : null;
    return {
        operationType: OPERATION_TYPE,
        startedAt,
        completedAt,
        status: failed ? 'interrupted' : 'completed',
        pageContext: { marathonId, marathonName },
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
            message: failed ? serializedError.message : 'Batch section deletion execution completed.',
            attempts: 1,
            data: {
                parameters: serializeParameters(parameters),
                ...(failed ? { error: serializedError } : { result })
            }
        }],
        message: null
    };
}

function createRecordedExecution({ executeOperation, persistExecution, getMarathonId, getMarathonName, now, logger }) {
    return async function executeRecordedPlan(parameters) {
        const startedAt = now().toISOString();
        try {
            const result = await executeOperation(parameters);
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
                marathonId: getMarathonId(),
                marathonName: getMarathonName()
            }));
        } catch (persistenceError) {
            logger.log('Batch section deletion history persistence failed:', persistenceError);
        }
    }
}

export function createBatchSectionDeletionFeatureV2({
    transport,
    operationGuard,
    logger,
    executionHistoryService,
}) {
    const historyLogger = logger.createChildLogger('BatchSectionDeletionHistory');
    return coreApi.createBatchSectionDeletionFeature({
        sendRequest: transport.sendRequest,
        getConnectionState: transport.getConnectionState,
        session: createFeatureSession({ operationGuard, operationName: 'batch-section-deletion' }),
        executeOperation: createRecordedExecution({
            executeOperation: coreApi.executePlan,
            persistExecution: executionHistoryService.persistTerminal,
            getMarathonId: () => coreApi.parseMarathonId(window.location.href),
            getMarathonName: () => document.querySelector('h1')?.textContent?.trim()
                || document.title
                || null,
            now: () => new Date(),
            logger: historyLogger
        }),
        createDialog: () => document.createElement(BATCH_SECTION_DELETION_DIALOG_TAG),
        copyText: (text) => navigator.clipboard.writeText(text),
        logger: historyLogger
    });
}

const batchSectionDeletionFeatureDefinition = Object.freeze({
    type: WINDOW_MESSAGE_TYPES.OPEN_BATCH_SECTION_DELETION,
    create(context) {
        const feature = createBatchSectionDeletionFeatureV2(context);
        return () => feature.open();
    }
});

export {
    OPERATION_TYPE,
    batchSectionDeletionFeatureDefinition,
    buildExecutionHistoryInput,
    createRecordedExecution
};
