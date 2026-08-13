import * as batchAccessApi from '#src/content/main/features/batch-lesson-access/batch-lesson-access.js';
import * as modelApi from '#src/content/main/features/batch-lesson-access/batch-lesson-access-history-model.js';
import * as recordApi from '#src/content/main/features/batch-lesson-access/batch-lesson-access-history-record.js';

const {
    createCapture,
    recordWriteAttempt,
    observeRequest,
    serializeLesson,
    buildObservedPlan
} = modelApi;
const { buildExecutionHistoryInput } = recordApi;

function appendStatus(dialog, message, isError = false) {
    const current = dialog.elements?.status?.textContent || '';
    dialog.setStatus?.(`${current}${current ? ' ' : ''}${message}`, isError ? 'error' : '');
}

function addHistoryButton(dialog, executionId, openHistory) {
    dialog.shadowRoot?.querySelector?.('.edvibe-batch-access-history')?.remove?.();
    const documentApi = dialog.ownerDocument || globalThis.document;
    const button = documentApi?.createElement?.('button');
    if (!button) return;
    button.type = 'button';
    button.className = 'edvibe-batch-access-history';
    button.textContent = 'Открыть в истории';
    button.addEventListener('click', () => {
        dialog.close?.();
        openHistory(executionId);
    });
    dialog.elements?.footer?.appendChild?.(button);
}

function createHistoryAwareFeature(options = {}) {
    const {
        createFeature = batchAccessApi.createBatchLessonAccessFeature,
        sendRequest,
        createDialog,
        persistExecution,
        openHistory = () => {},
        getLocationHref = () => '',
        getMarathonName = () => null,
        now = () => new Date(),
        log = () => {},
        ...featureOptions
    } = options;

    if (typeof createFeature !== 'function') {
        throw new TypeError('createFeature is required');
    }
    if (typeof sendRequest !== 'function') {
        throw new TypeError('sendRequest is required');
    }
    if (typeof createDialog !== 'function') {
        throw new TypeError('createDialog is required');
    }
    if (typeof persistExecution !== 'function') {
        throw new TypeError('persistExecution is required');
    }

    let capture = null;

    async function trackedSendRequest(controller, method, projectName, value) {
        const current = capture;
        if (current) {
            recordWriteAttempt(current, method, value);
        }

        const result = await sendRequest(controller, method, projectName, value);
        if (current) {
            observeRequest(current, method, value, result);
        }

        return result;
    }

    function createTrackedDialog() {
        const dialog = createDialog();
        const current = createCapture();
        capture = current;
        const originalShowConfigure = dialog.showConfigure.bind(dialog);
        const originalShowConfirmation = dialog.showConfirmation.bind(dialog);
        const originalShowValidationErrors = dialog.showValidationErrors.bind(dialog);
        const originalShowComplete = dialog.showComplete.bind(dialog);
        const originalShowFatalError = dialog.showFatalError.bind(dialog);

        function startAttempt(detail = {}) {
            current.sequence += 1;
            current.writeAttempts.clear();
            current.attempt = {
                sequence: current.sequence,
                startedAt: now().toISOString(),
                submittedEmailInput: String(detail.emailInput || ''),
                selectedLessonIds: Array.isArray(detail.selectedLessonIds) ? [...detail.selectedLessonIds] : [],
                plan: null,
                terminal: false
            };
            dialog.shadowRoot?.querySelector?.('.edvibe-batch-access-history')?.remove?.();
        }

        function buildPlan(errors = []) {
            const attempt = current.attempt;
            if (!attempt) return null;
            return buildObservedPlan({
                submittedEmailInput: attempt.submittedEmailInput,
                selectedLessonIds: attempt.selectedLessonIds,
                pupils: current.pupils,
                lessonsByPupilId: current.lessonsByPupilId,
                lessonCatalogue: current.lessonCatalogue,
                errors
            });
        }

        function persist(summary, terminalStatus, errors = []) {
            const attempt = current.attempt;
            if (!attempt || attempt.terminal) return;
            attempt.terminal = true;
            const sequence = attempt.sequence;
            let input;
            try {
                const completedAt = now().toISOString();
                const plan = attempt.plan || buildPlan(errors);
                if (!plan) return;
                input = buildExecutionHistoryInput({
                    plan,
                    summary,
                    writeAttempts: current.writeAttempts,
                    startedAt: attempt.startedAt,
                    completedAt,
                    marathonId: batchAccessApi.parseMarathonId(getLocationHref()),
                    marathonName: getMarathonName(),
                    terminalStatus
                });
            } catch (error) {
                appendStatus(dialog, 'Экранный результат сохранён, но записать историю не удалось.', true);
                log('Batch lesson access history record creation failed:', error);
                return;
            }
            Promise.resolve()
                .then(() => persistExecution(input))
                .then((history) => {
                    if (sequence !== current.sequence) {
                        return;
                    }
                    if (history?.stored) {
                        appendStatus(dialog, 'Результат сохранён в истории.');
                        if (history.record?.id) {
                            addHistoryButton(dialog, history.record.id, openHistory);
                        }
                    } else {
                        appendStatus(dialog, 'Экранный результат сохранён, но записать историю не удалось.', true);
                        if (history?.persistenceError) {
                            log('Batch lesson access history persistence failed:', history.persistenceError);
                        }
                    }
                })
                .catch((error) => {
                    if (sequence !== current.sequence) return;
                    appendStatus(dialog, 'Экранный результат сохранён, но записать историю не удалось.', true);
                    log('Batch lesson access history persistence failed:', error);
                });
        }
        dialog.showConfigure = (value = {}) => {
            current.lessonCatalogue = Array.isArray(value.lessons) ? value.lessons.map(serializeLesson) : [];
            current.attempt = null;
            current.sequence += 1;
            return originalShowConfigure(value);
        };
        dialog.showConfirmation = (value = {}) => {
            if (current.attempt) current.attempt.plan = buildPlan();
            return originalShowConfirmation(value);
        };
        dialog.showValidationErrors = (errors = []) => {
            const output = originalShowValidationErrors(errors);
            if (current.attempt) persist({}, null, Array.isArray(errors) ? errors : [errors]);
            return output;
        };
        dialog.showComplete = (summary = {}) => {
            const output = originalShowComplete(summary);
            if (current.attempt) {
                if (!current.attempt.plan) current.attempt.plan = buildPlan();
                const interrupted = (summary.failures || []).some((failure) => failure?.code === 'INTERNAL_ERROR');
                persist(summary, interrupted ? 'interrupted' : null);
            }
            return output;
        };
        dialog.showFatalError = (error) => {
            const output = originalShowFatalError(error);
            if (current.attempt) persist({}, 'interrupted', [error]);
            return output;
        };
        dialog.addEventListener('edvibe-batch-access-submit', (event) => startAttempt(event?.detail));
        dialog.addEventListener('edvibe-batch-access-restart', () => {
            current.sequence += 1;
            current.attempt = null;
            dialog.shadowRoot?.querySelector?.('.edvibe-batch-access-history')?.remove?.();
        });
        dialog.addEventListener('edvibe-dialog-close', () => {
            if (current.attempt?.plan && !current.attempt.terminal) persist({}, 'cancelled');
        });
        return dialog;
    }

    return createFeature({
        ...featureOptions,
        sendRequest: trackedSendRequest,
        createDialog: createTrackedDialog,
        log
    });
}

export * from '#src/content/main/features/batch-lesson-access/batch-lesson-access-history-model.js';
export * from '#src/content/main/features/batch-lesson-access/batch-lesson-access-history-record.js';
export { createHistoryAwareFeature };
