(function initializeBatchUserManagementHistory(root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.EdVibeBatchUserManagementHistory = factory();
})(typeof globalThis !== 'undefined' ? globalThis : window, function createModule() {
    'use strict';

    const OPERATION_TYPE = 'batch_user_management';
    const OPERATION_NAMES = Object.freeze({
        unassign: 'unassign_curator',
        delete: 'delete_user'
    });

    function parseMarathonId(url) {
        const match = String(url || '').match(/\/marathon\/(\d+)(?:\/|$)/);
        return match ? String(match[1]) : null;
    }

    function selectedOperations(row) {
        const operations = [];
        if (row?.unassignSelected) operations.push(OPERATION_NAMES.unassign);
        if (row?.deleteSelected) operations.push(OPERATION_NAMES.delete);
        return operations;
    }

    function serializeIdentity(row) {
        const pupil = row?.pupil || {};
        return Object.freeze({
            email: pupil.Email || row?.normalizedEmail || row?.email || null,
            displayName: pupil.DisplayName || pupil.FullName || pupil.Name || null,
            firstName: pupil.FirstName || null,
            lastName: pupil.LastName || null,
            pupilId: pupil.PupilId ?? pupil.Id ?? null,
            marathonPupilId: row?.marathonPupilId ?? pupil.MarathonPupilId ?? null
        });
    }

    function serializeOperation(name, result) {
        if (!result) {
            return Object.freeze({
                name,
                status: 'not_attempted',
                attemptCount: 0,
                code: 'NOT_ATTEMPTED',
                message: 'The operation was not attempted.',
                dependency: null
            });
        }
        const dependencyBlocked = result.status === 'skipped'
            && /curator removal failed/i.test(result.message || '');
        return Object.freeze({
            name,
            status: result.status,
            attemptCount: Number.isInteger(result.attempts) ? result.attempts : 0,
            code: result.code || (dependencyBlocked ? 'DEPENDENCY_FAILED' : null),
            message: result.message || null,
            dependency: dependencyBlocked
                ? Object.freeze({ blockedBy: OPERATION_NAMES.unassign })
                : null
        });
    }

    function inferItemStatus(row, operations) {
        if (row?.status !== 'matched') return 'rejected';
        if (operations.length === 0) return 'skipped';
        const values = operations.map((operation) => operation.status);
        if (values.includes('failed')) return 'failed';
        if (values.includes('not_attempted')) return 'not_attempted';
        if (values.includes('skipped')) return 'skipped';
        if (values.every((status) => status === 'noop')) return 'noop';
        return 'success';
    }

    function resultCode(row, status) {
        if (status === 'rejected') {
            return {
                malformed: 'USER_INPUT_MALFORMED',
                missing: 'USER_NOT_FOUND',
                ambiguous: 'USER_AMBIGUOUS'
            }[row?.status] || 'USER_REJECTED';
        }
        return {
            success: 'USER_OPERATIONS_COMPLETED',
            noop: 'USER_OPERATIONS_NOOP',
            skipped: 'USER_OPERATIONS_SKIPPED',
            failed: 'USER_OPERATIONS_FAILED',
            not_attempted: 'USER_OPERATIONS_NOT_ATTEMPTED'
        }[status];
    }

    function resultMessage(row, status, operations) {
        if (status === 'rejected') return row?.message || 'The submitted user could not be resolved safely.';
        if (operations.length === 0) return 'No user-management operation was selected.';
        const messages = operations.map((operation) => operation.message).filter(Boolean);
        if (messages.length > 0) return messages.join('; ');
        return {
            success: 'All selected operations completed successfully.',
            noop: 'All selected operations were already satisfied.',
            skipped: 'One or more selected operations were skipped.',
            failed: 'One or more selected operations failed.',
            not_attempted: 'One or more selected operations were not attempted.'
        }[status];
    }

    function serializeRow(row, index) {
        const names = selectedOperations(row);
        const operations = names.map((name) => name === OPERATION_NAMES.unassign
            ? serializeOperation(name, row?.unassign)
            : serializeOperation(name, row?.delete));
        const status = inferItemStatus(row, operations);
        return Object.freeze({
            itemId: row?.normalizedEmail || row?.email || `input-${index + 1}`,
            label: row?.email || row?.normalizedEmail || `Input ${index + 1}`,
            status,
            code: resultCode(row, status),
            message: resultMessage(row, status, operations),
            attempts: operations.reduce((sum, operation) => sum + operation.attemptCount, 0),
            data: Object.freeze({
                submittedInput: row?.email || null,
                normalizedEmail: row?.normalizedEmail || null,
                resolution: row?.status || 'malformed',
                resolutionMessage: row?.message || null,
                user: row?.status === 'matched' ? serializeIdentity(row) : null,
                curatorPresent: row?.status === 'matched' ? Boolean(row?.hasCurator) : null,
                selectedOperations: Object.freeze(names),
                operations: Object.freeze(operations)
            })
        });
    }

    function buildCounts(results) {
        const eligible = results.filter((result) => result.data.resolution === 'matched'
            && result.data.selectedOperations.length > 0).length;
        const notAttempted = results.filter((result) => result.status === 'not_attempted').length;
        const attempted = results.filter((result) => result.data.resolution === 'matched'
            && result.data.selectedOperations.length > 0
            && result.status !== 'not_attempted').length;
        return Object.freeze({
            requested: results.length,
            eligible,
            attempted,
            successful: results.filter((result) => result.status === 'success').length,
            noOp: results.filter((result) => result.status === 'noop').length,
            skipped: results.filter((result) => result.status === 'skipped' || result.status === 'rejected').length,
            failed: results.filter((result) => result.status === 'failed').length,
            notAttempted
        });
    }

    function inferTerminalStatus(summary, results) {
        if (summary?.error) return 'interrupted';
        return results.some((result) => result.status === 'failed'
            || result.status === 'skipped'
            || result.status === 'rejected')
            ? 'completed_with_failures'
            : 'completed';
    }

    function buildExecutionHistoryInput({
        rows,
        summary = {},
        startedAt,
        completedAt,
        marathonId,
        marathonName = null
    }) {
        const results = (Array.isArray(rows) ? rows : []).map(serializeRow);
        const operationCounts = {
            selected: 0,
            attempted: 0,
            successful: 0,
            noOp: 0,
            skipped: 0,
            failed: 0,
            notAttempted: 0
        };
        for (const result of results) {
            for (const operation of result.data.operations) {
                operationCounts.selected += 1;
                if (operation.status !== 'not_attempted') operationCounts.attempted += 1;
                if (operation.status === 'success') operationCounts.successful += 1;
                if (operation.status === 'noop') operationCounts.noOp += 1;
                if (operation.status === 'skipped') operationCounts.skipped += 1;
                if (operation.status === 'failed') operationCounts.failed += 1;
                if (operation.status === 'not_attempted') operationCounts.notAttempted += 1;
            }
        }
        return Object.freeze({
            operationType: OPERATION_TYPE,
            startedAt,
            completedAt,
            status: inferTerminalStatus(summary, results),
            pageContext: Object.freeze({ marathonId, marathonName }),
            counts: buildCounts(results),
            results: Object.freeze(results),
            message: JSON.stringify({
                userCounts: buildCounts(results),
                operationCounts
            })
        });
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
            let startedAt = null;
            let stylesheetUrl = '';
            let persistenceSequence = 0;
            const originalConfigure = dialog.configure.bind(dialog);
            const originalShowComplete = dialog.showComplete.bind(dialog);
            const originalShowReview = dialog.showReview.bind(dialog);
            const originalShowConfigure = dialog.showConfigure.bind(dialog);

            function clearHistoryButton() {
                dialog.shadowRoot?.querySelector?.('.edvibe-batch-user-management-history')?.remove?.();
            }

            function appendStatus(message) {
                const current = dialog.elements?.status?.textContent || '';
                dialog.setStatus?.(`${current}${current ? ' ' : ''}${message}`);
            }

            function addHistoryButton(executionId) {
                clearHistoryButton();
                const document = dialog.ownerDocument || root.document;
                const button = document?.createElement?.('button');
                if (!button) return;
                button.type = 'button';
                button.className = 'edvibe-batch-user-management-history';
                button.textContent = 'Открыть в истории';
                button.addEventListener('click', () => {
                    dialog.close?.();
                    openHistory(executionId, stylesheetUrl);
                });
                dialog.elements?.footer?.appendChild?.(button);
                if (!dialog.elements?.footer) {
                    dialog.shadowRoot?.querySelector?.('.edvibe-batch-user-management-footer')?.appendChild?.(button);
                }
            }

            dialog.configure = (options = {}) => {
                stylesheetUrl = String(options?.stylesheetUrl || stylesheetUrl || '');
                return originalConfigure(options);
            };
            dialog.showReview = (value) => {
                startedAt = null;
                persistenceSequence += 1;
                clearHistoryButton();
                return originalShowReview(value);
            };
            dialog.showConfigure = (...args) => {
                startedAt = null;
                persistenceSequence += 1;
                clearHistoryButton();
                return originalShowConfigure(...args);
            };
            dialog.addEventListener('edvibe-batch-user-management-start', () => {
                startedAt = now().toISOString();
                persistenceSequence += 1;
                clearHistoryButton();
            });
            dialog.showComplete = (summary = {}) => {
                const output = originalShowComplete(summary);
                const sequence = persistenceSequence;
                const completedAt = now().toISOString();
                const input = buildExecutionHistoryInput({
                    rows: summary.rows || dialog.rows,
                    summary,
                    startedAt: startedAt || completedAt,
                    completedAt,
                    marathonId: parseMarathonId(getLocationHref()),
                    marathonName: getMarathonName()
                });
                Promise.resolve()
                    .then(() => persistExecution(input))
                    .then((history) => {
                        if (sequence !== persistenceSequence) return;
                        if (history?.stored) {
                            appendStatus('Результат сохранён в истории.');
                            if (history.record?.id) addHistoryButton(history.record.id);
                        } else {
                            appendStatus('Экранный результат сохранён, но записать историю не удалось.');
                            if (history?.persistenceError) log('Batch user management history persistence failed:', history.persistenceError);
                        }
                    })
                    .catch((error) => {
                        if (sequence !== persistenceSequence) return;
                        appendStatus('Экранный результат сохранён, но записать историю не удалось.');
                        log('Batch user management history persistence failed:', error);
                    });
                return output;
            };
            return dialog;
        };
    }

    return Object.freeze({
        OPERATION_TYPE,
        OPERATION_NAMES,
        parseMarathonId,
        serializeRow,
        buildCounts,
        buildExecutionHistoryInput,
        createHistoryAwareDialog
    });
});