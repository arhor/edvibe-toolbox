(function initializeExecutionHistoryFeature(root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.EdVibeExecutionHistory = factory();
})(typeof globalThis !== 'undefined' ? globalThis : window, function createModule() {
    'use strict';

    const HISTORY_OVERLAY_ID = 'edvibe-toolbox-execution-history';

    function createExecutionHistoryFeature({ service, canStart, onActiveChange, createDialog, log = () => {} }) {
        let active = false;
        function open({ stylesheetUrl = '', executionId = null } = {}) {
            if (active || document.getElementById(HISTORY_OVERLAY_ID)) return;
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
                    stylesheetUrl,
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
        return Object.freeze({ open });
    }

    return Object.freeze({ HISTORY_OVERLAY_ID, createExecutionHistoryFeature });
});
