import { createExecutionAttemptReporter } from '#src/content/main/application/execution-attempt.js';
import * as modelApi from '#src/content/main/features/batch-section-creation/batch-section-creation-history-model.js';
import * as recordApi from '#src/content/main/features/batch-section-creation/batch-section-creation-history-record.js';

function createBatchSectionCreationHistoryReporter({
    persistExecution,
    onPersistence = () => {},
    getLocationHref = () => '',
    getMarathonName = () => null,
    now = () => new Date(),
    logger = { log() {} }
} = {}) {
    if (typeof persistExecution !== 'function') {
        throw new TypeError('persistExecution is required');
    }
    if (typeof onPersistence !== 'function') {
        throw new TypeError('onPersistence must be a function');
    }

    let confirmedPlan = null;
    let latestResult = null;
    let startedAt = null;
    let terminal = false;
    let sequence = 0;

    function notify(history, currentSequence) {
        if (currentSequence !== sequence) {
            return history;
        }
        try {
            onPersistence(history);
        } catch (error) {
            logger.log('Batch section creation history presentation failed:', error);
        }
        return history;
    }

    function reset() {
        sequence += 1;
        confirmedPlan = null;
        latestResult = null;
        startedAt = null;
        terminal = false;
    }

    function begin({ plan } = {}) {
        sequence += 1;
        confirmedPlan = plan || null;
        latestResult = confirmedPlan
            ? {
                definition: confirmedPlan.definition,
                results: Array.isArray(confirmedPlan.rejected)
                    ? confirmedPlan.rejected.map((entry) => modelApi.asExecutionResult(entry, 'rejected'))
                    : []
            }
            : null;
        startedAt = now().toISOString();
        terminal = false;
    }

    function observe({ progress, result } = {}) {
        if (!confirmedPlan) {
            return;
        }
        if (result) {
            latestResult = result;
            return;
        }
        if (Array.isArray(progress?.results)) {
            latestResult = {
                definition: confirmedPlan.definition,
                results: [...progress.results]
            };
        }
    }

    async function persist(result, terminalStatus = null, fatalError = null) {
        if (!confirmedPlan || terminal) {
            return Object.freeze({ stored: false, skipped: true });
        }
        terminal = true;
        const currentSequence = sequence;
        let input;
        try {
            const completedAt = now().toISOString();
            input = recordApi.buildExecutionHistoryInput({
                plan: confirmedPlan,
                result: result || latestResult || {},
                startedAt: startedAt || completedAt,
                completedAt,
                marathonId: modelApi.parseMarathonId(getLocationHref()),
                marathonName: getMarathonName(),
                terminalStatus,
                fatalError
            });
        } catch (persistenceError) {
            logger.log('Batch section creation history record creation failed:', persistenceError);
            return notify(Object.freeze({ stored: false, persistenceError }), currentSequence);
        }
        try {
            const history = await persistExecution(input);
            if (!history?.stored && history?.persistenceError) {
                logger.log('Batch section creation history persistence failed:', history.persistenceError);
            }
            return notify(history, currentSequence);
        } catch (persistenceError) {
            logger.log('Batch section creation history persistence failed:', persistenceError);
            return notify(Object.freeze({ stored: false, persistenceError }), currentSequence);
        }
    }

    return createExecutionAttemptReporter({
        reset,
        begin,
        observe,
        complete({ result = null, fatalError = null } = {}) {
            if (result) {
                latestResult = result;
            }
            return persist(latestResult, fatalError ? 'interrupted' : null, fatalError);
        },
        cancel() {
            return persist(latestResult, 'cancelled');
        },
        interrupt({ result = null, error = null } = {}) {
            if (result) {
                latestResult = result;
            }
            return persist(latestResult, 'interrupted', error);
        }
    });
}

export * from '#src/content/main/features/batch-section-creation/batch-section-creation-history-model.js';
export * from '#src/content/main/features/batch-section-creation/batch-section-creation-history-record.js';

export { createBatchSectionCreationHistoryReporter };
