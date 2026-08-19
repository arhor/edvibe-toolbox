import { EXECUTION_HISTORY_DIALOG_TAG } from '#src/content/main/features/execution-history/execution-history-dialog.js';
import { WINDOW_MESSAGE_TYPES } from '#src/shared/message-protocol.js';

const HISTORY_OVERLAY_ID = 'edvibe-toolbox-execution-history';

export function createExecutionHistoryFeatureV2({
    operationGuard,
    logFactory,
    executionHistoryService,
}) {
    return createExecutionHistoryFeature({
        service: executionHistoryService,
        canStart: operationGuard.canStart,
        onActiveChange: operationGuard.guardedActiveChange('history'),
        createDialog: () => document.createElement(EXECUTION_HISTORY_DIALOG_TAG),
        log: logFactory('History')
    });
}

function createExecutionHistoryFeature({
    service,
    canStart,
    onActiveChange,
    createDialog,
    log = () => { },
}) {
    let active = false;
    function open({ executionId = null } = {}) {
        if (active || document.getElementById(HISTORY_OVERLAY_ID)) {
            return;
        }
        if (!canStart()) {
            window.alert('Another Edvibe Toolbox operation is already running.');
            return;
        }
        active = true;
        onActiveChange(true);
        try {
            const dialog = createDialog();
            dialog.id = HISTORY_OVERLAY_ID;
            dialog.configure({
                service,
                initialExecutionId: executionId,
                onClose() {
                    dialog.remove();
                    active = false;
                    onActiveChange(false);
                }
            });
            (document.body || document.documentElement).append(dialog);
        } catch (error) {
            active = false;
            onActiveChange(false);
            log('Failed to open execution history:', error);
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
