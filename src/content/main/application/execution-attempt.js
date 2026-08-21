const EXECUTION_ATTEMPT_METHODS = Object.freeze([
    'resetAttempt',
    'beginAttempt',
    'observeAttempt',
    'completeAttempt',
    'cancelAttempt',
    'interruptAttempt'
]);

function noop() { }

const NOOP_EXECUTION_ATTEMPT_REPORTER = Object.freeze(Object.fromEntries(
    EXECUTION_ATTEMPT_METHODS.map((name) => [name, noop])
));

function createExecutionAttemptReporter(reporter = {}) {
    if (reporter === null || typeof reporter !== 'object') {
        throw new TypeError('Execution attempt reporter must be an object');
    }
    const methods = {};
    for (const name of EXECUTION_ATTEMPT_METHODS) {
        const handler = reporter[name];
        if (handler !== undefined && typeof handler !== 'function') {
            throw new TypeError(`Execution attempt reporter ${name} must be a function`);
        }
        methods[name] = handler ? handler.bind(reporter) : noop;
    }
    return Object.freeze(methods);
}

export {
    EXECUTION_ATTEMPT_METHODS,
    NOOP_EXECUTION_ATTEMPT_REPORTER,
    createExecutionAttemptReporter
};
