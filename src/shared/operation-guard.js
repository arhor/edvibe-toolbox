(function initializeOperationGuardModule(root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.EdVibeOperationGuard = factory();
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function operationGuardModuleFactory() {
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
