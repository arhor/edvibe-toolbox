export function createFeatureSession({ operationGuard, operationName }) {
    if (
        typeof operationGuard?.activate !== 'function'
        || typeof operationGuard?.release !== 'function'
    ) {
        throw new TypeError('operationGuard with activate/release is required');
    }

    const name = String(operationName || '').trim();
    if (!name) {
        throw new TypeError('operationName is required');
    }

    let active = false;
    let dialog = null;

    function isOpen() {
        return active || dialog !== null;
    }

    function activate() {
        if (isOpen() || !operationGuard.activate(name)) {
            return false;
        }
        active = true;
        return true;
    }

    function ownDialog(nextDialog) {
        if (!active) {
            throw new Error('Feature session must be active before owning a dialog.');
        }
        if (!nextDialog) {
            throw new TypeError('dialog is required');
        }
        if (dialog && dialog !== nextDialog) {
            throw new Error('Feature session already owns a dialog.');
        }
        dialog = nextDialog;
        return nextDialog;
    }

    function release() {
        if (!active) {
            return false;
        }
        active = false;
        if (!operationGuard.release(name)) {
            throw new Error(`Operation guard ownership for "${name}" was lost.`);
        }
        return true;
    }

    function close({ removeDialog = true } = {}) {
        const currentDialog = dialog;
        dialog = null;
        try {
            if (removeDialog) {
                currentDialog?.remove?.();
            }
        } finally {
            release();
        }
        return currentDialog;
    }

    return Object.freeze({
        activate,
        ownDialog,
        release,
        close,
        isActive: () => active,
        isOpen,
        getDialog: () => dialog
    });
}
