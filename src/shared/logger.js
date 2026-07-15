(function initializeLoggerModule(root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.EdVibeLogger = factory();
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function loggerModuleFactory() {
    'use strict';

    /**
     * Returns the execution context of the current module.
     * 
     * @returns {string | null} The execution context of the current module.
     */
    function getExecutionContext() {
        if (typeof ServiceWorkerGlobalScope !== "undefined" && self instanceof ServiceWorkerGlobalScope) {
            return "BACKGROUND";
        }
        if (typeof window !== "undefined") {
            return typeof window.chrome?.runtime?.id === "string"
                ? "ISOLATED"
                : "MAIN";
        }
        return null;
    }

    /**
     * Creates a logger factory function.
     * 
     * @returns {(module: string | null | undefined) => (...args: any[]) => void} A function that creates a logger function.
     */
    function createLoggerFactory() {
        return function createLogger(module) {
            if (
                module !== undefined &&
                module !== null &&
                (typeof module !== 'string' || !module.trim())
            ) {
                throw new Error('Module must be a non-empty string.');
            }
            const context = getExecutionContext();

            const prefix = context ? `[${context}]` : '';
            const suffix = module ? `[${module.trim()}]` : '';

            const namespace = `[Edvibe Toolbox]${prefix}${suffix}`;

            return (...args) => console.log(namespace, ...args);
        };
    }

    return { createLoggerFactory };
});
