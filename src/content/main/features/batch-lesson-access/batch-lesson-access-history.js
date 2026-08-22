import { createExecutionAttemptReporter } from '#src/content/main/application/execution-attempt.js';
import { createFeatureSession } from '#src/content/main/application/feature-session.js';
import { BATCH_ACCESS_DIALOG_TAG } from '#src/content/main/features/batch-lesson-access/batch-lesson-access-dialog.js';
import * as modelApi from '#src/content/main/features/batch-lesson-access/batch-lesson-access-history-model.js';
import * as recordApi from '#src/content/main/features/batch-lesson-access/batch-lesson-access-history-record.js';
import * as batchAccessApi from '#src/content/main/features/batch-lesson-access/batch-lesson-access.js';
import { WINDOW_MESSAGE_TYPES } from '#src/shared/messaging/index.js';

const {
    createCapture,
    recordWriteAttempt,
    observeRequest,
    serializeLesson,
    buildObservedPlan
} = modelApi;
const { buildExecutionHistoryInput } = recordApi;

function clearHistoryButton(dialog) {
    dialog?.shadowRoot?.querySelector?.('.edvibe-batch-access-history')?.remove?.();
}

function appendStatus(dialog, message, isError = false) {
    const current = dialog?.elements?.status?.textContent || '';
    dialog?.setStatus?.(`${current}${current ? ' ' : ''}${message}`, isError ? 'error' : '');
}

function addHistoryButton(dialog, executionId, openHistory) {
    clearHistoryButton(dialog);
    const documentApi = dialog?.ownerDocument || globalThis.document;
    const button = documentApi?.createElement?.('button');
    if (!button) {
        return;
    }
    button.type = 'button';
    button.className = 'edvibe-batch-access-history';
    button.textContent = 'Открыть в истории';
    button.addEventListener('click', () => openHistory(executionId));
    dialog?.elements?.footer?.appendChild?.(button);
}

function createBatchLessonAccessHistory({
    sendRequest,
    persistExecution,
    onPersistence = () => {},
    getLocationHref = () => '',
    getMarathonName = () => null,
    now = () => new Date(),
    logger = { log() {} }
} = {}) {
    if (typeof sendRequest !== 'function') {
        throw new TypeError('sendRequest is required');
    }
    if (typeof persistExecution !== 'function') {
        throw new TypeError('persistExecution is required');
    }
    if (typeof onPersistence !== 'function') {
        throw new TypeError('onPersistence must be a function');
    }

    const capture = createCapture();

    async function trackedSendRequest(controller, method, projectName, value) {
        recordWriteAttempt(capture, method, value);
        const result = await sendRequest(controller, method, projectName, value);
        observeRequest(capture, method, value, result);
        return result;
    }

    function buildPlan(errors = []) {
        const attempt = capture.attempt;
        if (!attempt) {
            return null;
        }
        return buildObservedPlan({
            submittedEmailInput: attempt.submittedEmailInput,
            selectedLessonIds: attempt.selectedLessonIds,
            pupils: capture.pupils,
            lessonsByPupilId: capture.lessonsByPupilId,
            lessonCatalogue: capture.lessonCatalogue,
            errors
        });
    }

    function notify(history, sequence) {
        if (sequence !== capture.sequence) {
            return history;
        }
        try {
            onPersistence(history);
        } catch (error) {
            logger.log('Batch lesson access history presentation failed:', error);
        }
        return history;
    }

    async function persist(summary = {}, terminalStatus = null, errors = []) {
        const attempt = capture.attempt;
        if (!attempt || attempt.terminal) {
            return Object.freeze({ stored: false, skipped: true });
        }
        attempt.terminal = true;
        const sequence = attempt.sequence;
        let input;
        try {
            const completedAt = now().toISOString();
            const plan = attempt.plan || buildPlan(errors);
            if (!plan) {
                return Object.freeze({ stored: false, skipped: true });
            }
            input = buildExecutionHistoryInput({
                plan,
                summary,
                writeAttempts: capture.writeAttempts,
                startedAt: attempt.startedAt,
                completedAt,
                marathonId: batchAccessApi.parseMarathonId(getLocationHref()),
                marathonName: getMarathonName(),
                terminalStatus
            });
        } catch (persistenceError) {
            logger.log('Batch lesson access history record creation failed:', persistenceError);
            return notify(Object.freeze({ stored: false, persistenceError }), sequence);
        }
        try {
            const history = await persistExecution(input);
            if (!history?.stored && history?.persistenceError) {
                logger.log('Batch lesson access history persistence failed:', history.persistenceError);
            }
            return notify(history, sequence);
        } catch (persistenceError) {
            logger.log('Batch lesson access history persistence failed:', persistenceError);
            return notify(Object.freeze({ stored: false, persistenceError }), sequence);
        }
    }

    const executionAttempt = createExecutionAttemptReporter({
        reset({ lessons } = {}) {
            if (Array.isArray(lessons)) {
                capture.lessonCatalogue = lessons.map(serializeLesson);
            }
            capture.attempt = null;
            capture.sequence += 1;
        },
        begin(detail = {}) {
            capture.sequence += 1;
            capture.writeAttempts.clear();
            capture.attempt = {
                sequence: capture.sequence,
                startedAt: now().toISOString(),
                submittedEmailInput: String(detail.emailInput || ''),
                selectedLessonIds: Array.isArray(detail.selectedLessonIds)
                    ? [...detail.selectedLessonIds]
                    : [],
                plan: null,
                terminal: false
            };
        },
        observe({ phase, errors = [] } = {}) {
            if (phase === 'plan' && capture.attempt) {
                capture.attempt.plan = buildPlan(errors);
            }
        },
        complete({ summary = {}, errors = [] } = {}) {
            if (capture.attempt && !capture.attempt.plan) {
                capture.attempt.plan = buildPlan(errors);
            }
            const interrupted = (summary.failures || []).some((failure) =>
                failure?.code === 'INTERNAL_ERROR');
            return persist(summary, interrupted ? 'interrupted' : null, errors);
        },
        cancel() {
            if (!capture.attempt?.plan || capture.attempt.terminal) {
                return Object.freeze({ stored: false, skipped: true });
            }
            return persist({}, 'cancelled');
        },
        interrupt({ summary = {}, error = null } = {}) {
            return persist(summary, 'interrupted', error ? [error] : []);
        }
    });

    return Object.freeze({
        sendRequest: trackedSendRequest,
        executionAttempt
    });
}

export function createBatchLessonAccessFeatureV2({
    transport,
    operationGuard,
    logger,
    executionHistoryService,
    dispatch,
}) {
    let activeDialog = null;
    const historyLogger = logger.createChildLogger('BatchAccessHistory');
    const openHistory = (executionId) => {
        activeDialog?.close?.();
        dispatch({
            type: WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY,
            executionId
        });
    };
    const history = createBatchLessonAccessHistory({
        sendRequest: transport.sendRequest,
        persistExecution: executionHistoryService.persistTerminal,
        getLocationHref: () => window.location.href,
        getMarathonName: () => document.querySelector('h1')?.textContent?.trim()
            || document.title
            || null,
        onPersistence(outcome) {
            if (outcome?.stored) {
                appendStatus(activeDialog, 'Результат сохранён в истории.');
                if (outcome.record?.id) {
                    addHistoryButton(activeDialog, outcome.record.id, openHistory);
                }
                return;
            }
            if (outcome?.skipped) {
                return;
            }
            appendStatus(
                activeDialog,
                'Экранный результат сохранён, но записать историю не удалось.',
                true
            );
        },
        logger: historyLogger
    });
    const executionAttempt = Object.freeze({
        ...history.executionAttempt,
        reset(context) {
            clearHistoryButton(activeDialog);
            return history.executionAttempt.reset(context);
        },
        begin(context) {
            clearHistoryButton(activeDialog);
            return history.executionAttempt.begin(context);
        }
    });

    return batchAccessApi.createBatchLessonAccessFeature({
        sendRequest: history.sendRequest,
        getConnectionState: transport.getConnectionState,
        session: createFeatureSession({ operationGuard, operationName: 'batch-access' }),
        createDialog: () => {
            activeDialog = document.createElement(BATCH_ACCESS_DIALOG_TAG);
            return activeDialog;
        },
        copyText: (text) => navigator.clipboard.writeText(text),
        executionAttempt,
        logger: logger.createChildLogger('BatchAccess')
    });
}

const batchLessonAccessFeatureDefinition = Object.freeze({
    type: WINDOW_MESSAGE_TYPES.OPEN_BATCH_LESSON_ACCESS,
    create(context) {
        const feature = createBatchLessonAccessFeatureV2(context);
        return () => feature.open();
    }
});

export * from '#src/content/main/features/batch-lesson-access/batch-lesson-access-history-model.js';
export * from '#src/content/main/features/batch-lesson-access/batch-lesson-access-history-record.js';
export { batchLessonAccessFeatureDefinition, createBatchLessonAccessHistory };
