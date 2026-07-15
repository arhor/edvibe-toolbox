(function initializeLogger(root, factory) {
    const api = factory();
    root.EdVibeLogger = api;

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createLoggerModule() {
    'use strict';

    const ALLOWED_WORLDS = new Set(['POPUP', 'MAIN', 'ISOLATED']);

    function createLoggerFactory(world) {
        if (!ALLOWED_WORLDS.has(world)) {
            throw new Error(`Unsupported logging world: ${String(world)}.`);
        }

        return function createLog(component) {
            if (
                component !== undefined
                && (typeof component !== 'string' || !component.trim())
            ) {
                throw new Error('Component must be a non-empty string.');
            }

            const componentSuffix = component === undefined
                ? ''
                : `[${component.trim()}]`;
            const prefix = `[Edvibe Toolbox][${world}]${componentSuffix}`;

            return (...args) => console.log(prefix, ...args);
        };
    }

    return { createLoggerFactory };
});
