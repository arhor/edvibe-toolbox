(function initializeOperationGuard(root, factory) {
    const api = factory();
    root.EdVibeOperationGuard = api;

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createOperationGuardModule() {
    'use strict';

    function createOperationGuard() {
        let activeOperation = null;

        return {
            canStart() {
                return activeOperation === null;
            },
            activate(operationName) {
                if (activeOperation !== null) return false;

                activeOperation = operationName;
                return true;
            },
            release(operationName) {
                if (activeOperation !== operationName) return false;

                activeOperation = null;
                return true;
            },
            getActiveOperation() {
                return activeOperation;
            }
        };
    }

    return { createOperationGuard };
});
