import { createFeatureSession } from '#src/content/main/application/feature-session.js';
import { EXECUTION_HISTORY_DIALOG_TAG } from '#src/content/main/features/execution-history/execution-history-dialog.js';
import { WINDOW_MESSAGE_TYPES } from '#src/shared/messaging/index.js';

const HISTORY_OVERLAY_ID = 'toolfox-execution-history';

export function createExecutionHistoryFeatureV2({
    operationGuard,
    logger,
    executionHistoryService,
}) {
    return createExecutionHistoryFeature({
        service: executionHistoryService,
        session: createFeatureSession({ operationGuard, operationName: 'history' }),
        createDialog: () => document.createElement(EXECUTION_HISTORY_DIALOG_TAG),
        logger: logger.createChildLogger('History')
    });
}

function createExecutionHistoryFeature({
    service,
    session,
    createDialog,
    logger = { log() {} },
}) {
    function open({ executionId = null } = {}) {
        if (session.isOpen() || document.getElementById(HISTORY_OVERLAY_ID)) {
            return;
        }
        if (!session.activate()) {
            window.alert('Another Toolfox operation is already running.');
            return;
        }
        try {
            const dialog = session.ownDialog(createDialog());
            dialog.id = HISTORY_OVERLAY_ID;
            dialog.configure({
                service,
                initialExecutionId: executionId,
                onClose() {
                    session.close();
                }
            });
            (document.body || document.documentElement).append(dialog);
        } catch (error) {
            session.close();
            logger.log('Failed to open execution history:', error);
            window.alert(error.message || 'Could not open execution history.');
        }
    }
    return Object.freeze({ open, service });
}

const executionHistoryFeatureDefinition = Object.freeze({
    type: WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY,
    create(context) {
        const feature = createExecutionHistoryFeatureV2(context);
        return ({ executionId }) => feature.open({ executionId: executionId ?? null });
    }
});

export {
    HISTORY_OVERLAY_ID,
    createExecutionHistoryFeature,
    executionHistoryFeatureDefinition
};
