import * as modelApi from './batch-section-creation-history-model.js';
import * as recordApi from './batch-section-creation-history-record.js';

function appendStatus(dialog, message, isError = false) {
    const current = dialog.elements?.status?.textContent || '';
    dialog.setStatus?.(
        `${current}${current ? ' ' : ''}${message}`,
        isError ? 'error' : ''
    );
}

function addHistoryButton(dialog, executionId, stylesheetUrl, openHistory) {
    dialog.shadowRoot?.querySelector?.('.edvibe-batch-section-history')?.remove?.();
    const documentApi = dialog.ownerDocument || globalThis.document;
    const button = documentApi?.createElement?.('button');
    if (!button) return;
    button.type = 'button';
    button.className = 'edvibe-batch-section-history';
    button.textContent = 'Открыть в истории';
    button.addEventListener('click', () => {
        dialog.close?.();
        openHistory(executionId, stylesheetUrl);
    });
    const footer = dialog.elements?.footer
        || dialog.shadowRoot?.querySelector?.('.edvibe-batch-section-footer');
    footer?.appendChild?.(button);
}

function createHistoryAwareDialog({
    createDialog,
    persistExecution,
    openHistory = () => {},
    getLocationHref = () => '',
    getMarathonName = () => null,
    now = () => new Date(),
    log = () => {}
}) {
    if (typeof createDialog !== 'function') throw new TypeError('createDialog is required');
    if (typeof persistExecution !== 'function') throw new TypeError('persistExecution is required');

    return function createPatchedDialog() {
        const dialog = createDialog();
        let confirmedPlan = null;
        let latestResult = null;
        let startedAt = null;
        let terminal = false;
        let stylesheetUrl = '';
        let sequence = 0;

        const originalConfigure = dialog.configure.bind(dialog);
        const originalShowConfigure = dialog.showConfigure.bind(dialog);
        const originalShowConfirmation = dialog.showConfirmation.bind(dialog);
        const originalShowExecution = dialog.showExecution.bind(dialog);
        const originalShowComplete = dialog.showComplete.bind(dialog);
        const originalShowFatalError = dialog.showFatalError.bind(dialog);

        function clearHistoryButton() {
            dialog.shadowRoot?.querySelector?.('.edvibe-batch-section-history')?.remove?.();
        }

        function resetAttempt() {
            sequence += 1;
            confirmedPlan = null;
            latestResult = null;
            startedAt = null;
            terminal = false;
            clearHistoryButton();
        }

        function persist(result, terminalStatus = null, fatalError = null) {
            if (!confirmedPlan || terminal) return;
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
            } catch (error) {
                appendStatus(dialog, 'Экранный результат сохранён, но записать историю не удалось.', true);
                log('Batch section creation history record creation failed:', error);
                return;
            }
            Promise.resolve()
                .then(() => persistExecution(input))
                .then((history) => {
                    if (currentSequence !== sequence) return;
                    if (history?.stored) {
                        appendStatus(dialog, 'Результат сохранён в истории.');
                        if (history.record?.id) {
                            addHistoryButton(dialog, history.record.id, stylesheetUrl, openHistory);
                        }
                    } else {
                        appendStatus(dialog, 'Экранный результат сохранён, но записать историю не удалось.', true);
                        if (history?.persistenceError) {
                            log('Batch section creation history persistence failed:', history.persistenceError);
                        }
                    }
                })
                .catch((error) => {
                    if (currentSequence !== sequence) return;
                    appendStatus(dialog, 'Экранный результат сохранён, но записать историю не удалось.', true);
                    log('Batch section creation history persistence failed:', error);
                });
        }

        dialog.configure = (options = {}) => {
            stylesheetUrl = String(options?.stylesheetUrl || stylesheetUrl || '');
            return originalConfigure(options);
        };
        dialog.showConfigure = (...args) => {
            resetAttempt();
            return originalShowConfigure(...args);
        };
        dialog.showConfirmation = (plan) => {
            sequence += 1;
            clearHistoryButton();
            confirmedPlan = plan;
            latestResult = {
                definition: plan?.definition,
                results: Array.isArray(plan?.rejected)
                    ? plan.rejected.map((entry) => modelApi.asExecutionResult(entry, 'rejected'))
                    : []
            };
            startedAt = now().toISOString();
            terminal = false;
            const output = originalShowConfirmation(plan);
            if (!plan?.eligible?.length) persist(latestResult);
            return output;
        };
        dialog.showExecution = (progress = {}) => {
            if (confirmedPlan && Array.isArray(progress?.results)) {
                latestResult = {
                    definition: confirmedPlan.definition,
                    results: [...progress.results]
                };
            }
            return originalShowExecution(progress);
        };
        dialog.showComplete = (result = {}, fatalError = null) => {
            const output = originalShowComplete(result, fatalError);
            latestResult = result;
            persist(result, fatalError ? 'interrupted' : null, fatalError);
            return output;
        };
        dialog.showFatalError = (error) => {
            const output = originalShowFatalError(error);
            if (confirmedPlan) persist(latestResult, 'interrupted', error);
            return output;
        };
        dialog.addEventListener('edvibe-batch-section-restart', resetAttempt);
        dialog.addEventListener('edvibe-dialog-close', () => {
            if (confirmedPlan && !terminal) persist(latestResult, 'cancelled');
        });
        return dialog;
    };
}

export * from './batch-section-creation-history-model.js';
export * from './batch-section-creation-history-record.js';
export { createHistoryAwareDialog };
