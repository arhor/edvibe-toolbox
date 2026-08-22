function createPersistenceFailure(persistenceError) {
    return Object.freeze({ stored: false, persistenceError });
}

function withExecutionHistory({
    execute,
    persistExecution,
    buildHistoryInput,
    onPersistence = () => {},
    now = () => new Date(),
    logger = { log() {} }
} = {}) {
    if (typeof execute !== 'function') {
        throw new TypeError('execute is required');
    }
    if (typeof persistExecution !== 'function') {
        throw new TypeError('persistExecution is required');
    }
    if (typeof buildHistoryInput !== 'function') {
        throw new TypeError('buildHistoryInput is required');
    }
    if (typeof onPersistence !== 'function') {
        throw new TypeError('onPersistence must be a function');
    }

    function notify(outcome, context) {
        try {
            onPersistence(outcome, context);
        } catch (error) {
            logger.log('Execution history presentation failed:', error);
        }
        return outcome;
    }

    async function persist(context) {
        let input;
        try {
            input = buildHistoryInput(context);
        } catch (persistenceError) {
            logger.log('Execution history record creation failed:', persistenceError);
            return notify(createPersistenceFailure(persistenceError), context);
        }

        try {
            const outcome = await persistExecution(input);
            if (!outcome?.stored && outcome?.persistenceError) {
                logger.log('Execution history persistence failed:', outcome.persistenceError);
            }
            return notify(outcome, context);
        } catch (persistenceError) {
            logger.log('Execution history persistence failed:', persistenceError);
            return notify(createPersistenceFailure(persistenceError), context);
        }
    }

    return async function executeWithHistory(input) {
        const startedAt = now().toISOString();
        let result;
        try {
            result = await execute(input);
        } catch (error) {
            await persist(Object.freeze({
                input,
                result: error?.partialResult || null,
                error,
                startedAt,
                completedAt: now().toISOString()
            }));
            throw error;
        }

        await persist(Object.freeze({
            input,
            result,
            error: null,
            startedAt,
            completedAt: now().toISOString()
        }));
        return result;
    };
}

export { withExecutionHistory };
