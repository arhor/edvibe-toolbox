const SUPPORTED_WORLDS = new Set(['POPUP', 'MAIN', 'ISOLATED']);

/**
 * Creates component-scoped loggers for one explicit execution world.
 *
 * @param {string} world The execution world.
 * @returns {(module: string | null | undefined) => (...args: any[]) => void} A function that creates a logger function.
 */
function createLoggerFactory(world) {
    if (!SUPPORTED_WORLDS.has(world)) {
        throw new Error(`Unsupported logging world: ${world}`);
    }

    return function createLogger(component) {
        if (
            component !== undefined
            && (typeof component !== 'string' || !component.trim())
        ) {
            throw new Error('Component must be a non-empty string.');
        }

        const suffix = component ? `[${component.trim()}]` : '';
        const namespace = `[Edvibe Toolbox][${world}]${suffix}`;

        return (...args) => console.log(namespace, ...args);
    };
}

export { createLoggerFactory };
