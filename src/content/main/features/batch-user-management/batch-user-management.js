/* eslint-disable perfectionist/sort-imports */
import { createFeatureSession } from '#src/content/main/application/feature-session.js';
import {
    appendPage,
    createFeatureError,
    parseEmailInput as parseSharedEmailInput,
    parseMarathonId,
    runWithRetry
} from '#src/content/main/features/batch-workflow-primitives.js';
import { loadAllPupils } from '#src/content/main/infrastructure/edvibe-marathon-api.js';
import { WINDOW_MESSAGE_TYPES } from '#src/shared/messaging/index.js';
import { wait } from '#src/shared/utils.js';
import { USER_MANAGEMENT_DIALOG_TAG, USER_MANAGEMENT_OVERLAY_ID } from '#src/content/main/features/batch-user-management/batch-user-management-dialog.js';
import { createRecordedExecution } from '#src/content/main/features/batch-user-management/batch-user-management-history.js';

function parseEmailInput(value) {
    return parseSharedEmailInput(value, { includeItems: true });
}

function resolveUsersByEmail(entries, pupils) {
    const pupilsByEmail = new Map();
    for (const pupil of Array.isArray(pupils) ? pupils : []) {
        const email = String(pupil?.Email || '').trim().toLowerCase();
        const candidates = pupilsByEmail.get(email) || [];
        candidates.push(pupil);
        pupilsByEmail.set(email, candidates);
    }

    const rows = [];
    const errors = [];
    for (const entry of Array.isArray(entries) ? entries : []) {
        const candidates = pupilsByEmail.get(entry.normalized) || [];
        if (candidates.length === 1) {
            rows.push({
                email: entry.input,
                normalizedEmail: entry.normalized,
                pupil: candidates[0],
                status: 'matched',
                message: ''
            });
            continue;
        }
        const type = candidates.length === 0 ? 'missing' : 'ambiguous';
        const message = candidates.length === 0
            ? `No marathon pupil found for ${entry.input}.`
            : `Multiple marathon pupils found for ${entry.input}.`;
        rows.push({
            email: entry.input,
            normalizedEmail: entry.normalized,
            pupil: null,
            status: type,
            message
        });
        errors.push({ type, input: entry.input, count: candidates.length, message });
    }
    return { rows, errors };
}

function buildUserPlan({ rows }) {
    return (Array.isArray(rows) ? rows : []).map((row) => {
        const matched = row.status === 'matched' && row.pupil;
        const hasCurator = Boolean(
            matched && Array.isArray(row.pupil.Moderators) && row.pupil.Moderators.length > 0
        );
        return {
            email: row.email,
            normalizedEmail: row.normalizedEmail,
            pupil: matched ? row.pupil : null,
            marathonPupilId: matched ? row.pupil.MarathonPupilId : null,
            hasCurator,
            actionable: Boolean(matched),
            status: row.status,
            message: row.message,
            unassignSelected: false,
            deleteSelected: false,
            unassign: null,
            delete: null,
            result: {
                status: 'pending',
                message: matched ? 'Not started' : row.message
            }
        };
    });
}

function cloneUserRow(row) {
    return {
        ...row,
        unassign: null,
        delete: null,
        result: { ...row.result }
    };
}

function createOperationFailure(error) {
    return {
        status: 'failed',
        attempts: error?.attempts || 1,
        code: error?.code || 'UNKNOWN_ERROR',
        message: error?.message || 'The operation failed.'
    };
}

function createSuccessOperation(attempts) {
    return { status: 'success', attempts };
}

function createNoopOperation() {
    return { status: 'noop', attempts: 0, message: 'No curator was assigned.' };
}

function createSkippedOperation(message) {
    return { status: 'skipped', attempts: 0, message };
}

function getSelectedOperations(row) {
    const operations = [];
    if (row.unassignSelected) {
        operations.push('unassign');
    }
    if (row.deleteSelected) {
        operations.push('delete');
    }
    return operations;
}

function describeOperation(operation, result) {
    if (!result) {
        return '';
    }
    if (operation === 'unassign') {
        if (result.status === 'noop') {
            return 'Curator already absent';
        }
        if (result.status === 'success') {
            return 'Curator removed';
        }
        return `Curator removal failed (${result.code || 'UNKNOWN_ERROR'}): `
            + `${result.message || 'The operation failed.'}`;
    }
    if (result.status === 'success') {
        return 'User deleted';
    }
    if (result.status === 'skipped') {
        return `Deletion skipped: ${result.message || 'The operation was skipped.'}`;
    }
    return `Deletion failed (${result.code || 'UNKNOWN_ERROR'}): `
        + `${result.message || 'The operation failed.'}`;
}

function setRowResult(row) {
    const operations = getSelectedOperations(row);
    const failed = operations.some((operation) => row[operation]?.status === 'failed');
    row.result = {
        status: failed ? 'failed' : 'success',
        message: operations
            .map((operation) => describeOperation(operation, row[operation]))
            .filter(Boolean)
            .join('; ')
    };
}

async function executeUserPlan({
    marathonId,
    rows,
    sendRequest,
    wait,
    getConnectionState,
    onProgress = () => { }
}) {
    const executionRows = (Array.isArray(rows) ? rows : [])
        .filter((row) => row.actionable !== false && getSelectedOperations(row).length > 0)
        .map(cloneUserRow);
    const total = executionRows.length;
    let completed = 0;
    let successes = 0;
    let failures = 0;
    let attempts = 0;

    function report(row, operation) {
        try {
            onProgress(Object.freeze({
                completed,
                total,
                successes,
                failures,
                current: Object.freeze({ email: row.email, operation })
            }));
        } catch (_) {
            // Rendering must not change mutation bookkeeping.
        }
    }

    for (const row of executionRows) {
        const selectedOperations = getSelectedOperations(row);
        try {
            if (row.unassignSelected) {
                report(row, 'unassign');
                if (!row.hasCurator) {
                    row.unassign = createNoopOperation();
                } else {
                    try {
                        const result = await runWithRetry(
                            async () => {
                                const response = await sendRequest(
                                    'MarathonPupilsWsController',
                                    'AddModeratorsToPupil',
                                    'Marathons',
                                    {
                                        MarathonId: marathonId,
                                        MarathonPupilId: row.marathonPupilId,
                                        SelectedModeratorsIds: []
                                    }
                                );
                                if (response?.Value?.IsSuccess !== true) {
                                    throw createFeatureError(
                                        'INVALID_RESPONSE',
                                        'The curator removal was not confirmed.'
                                    );
                                }
                                return response;
                            },
                            { wait, getConnectionState }
                        );
                        row.unassign = createSuccessOperation(result.attempts);
                        attempts += result.attempts;
                    } catch (error) {
                        row.unassign = createOperationFailure(error);
                        attempts += row.unassign.attempts;
                    }
                }
            }

            if (row.deleteSelected) {
                if (row.unassign?.status === 'failed') {
                    row.delete = createSkippedOperation('Skipped because curator removal failed.');
                } else {
                    report(row, 'delete');
                    try {
                        const result = await runWithRetry(
                            async () => {
                                const response = await sendRequest(
                                    'MarathonPupilsWsController',
                                    'DeleteMarathonPupil',
                                    'Marathons',
                                    { MarathonPupilId: row.marathonPupilId }
                                );
                                if (response?.Value !== row.marathonPupilId) {
                                    throw createFeatureError(
                                        'INVALID_RESPONSE',
                                        'The user deletion was not confirmed.'
                                    );
                                }
                                return response;
                            },
                            { wait, getConnectionState }
                        );
                        row.delete = createSuccessOperation(result.attempts);
                        attempts += result.attempts;
                    } catch (error) {
                        row.delete = createOperationFailure(error);
                        attempts += row.delete.attempts;
                    }
                }
            }
        } catch (error) {
            const operation = row.unassign?.status !== 'success'
                && row.unassign?.status !== 'noop'
                ? 'unassign'
                : 'delete';
            row[operation] ||= createOperationFailure(error);
        }

        setRowResult(row);
        if (row.result.status === 'failed') {
            failures += 1;
        } else {
            successes += 1;
        }
        completed += 1;
        const finalOperation = row.delete?.status === 'skipped'
            ? 'unassign'
            : selectedOperations[selectedOperations.length - 1];
        report(row, finalOperation);
    }

    return { rows: executionRows, completed, total, successes, failures, attempts };
}

function createInputErrors(parsed) {
    if (parsed.entries.length === 0 && parsed.malformed.length === 0) {
        return [createFeatureError('EMAILS_REQUIRED', 'Enter at least one email address.')];
    }
    return [];
}

function orderResolvedRows(parsed, resolution) {
    const resolvedRows = new Map(
        resolution.rows.map((row) => [row.normalizedEmail, row])
    );
    return parsed.items.map((item) => item.isValid
        ? resolvedRows.get(item.normalized)
        : {
            email: item.input,
            normalizedEmail: item.normalized,
            pupil: null,
            status: 'malformed',
            validationCode: item.validation?.code || 'INVALID_EMAIL_FORMAT',
            offendingCharacters: item.validation?.offendingCharacters || [],
            message: item.validation?.message || 'Некорректный формат email.'
        });
}

export function createBatchUserManagementFeatureV2({
    transport,
    operationGuard,
    logger,
    executionHistoryService,
}) {
    const historyLogger = logger.createChildLogger('BatchUserManagementHistory');
    const recordedExecution = createRecordedExecution({
        executePlan: executeUserPlan,
        persistExecution: executionHistoryService.persistTerminal,
        getMarathonName: () => document.querySelector('h1')?.textContent?.trim()
            || document.title
            || null,
        now: () => new Date(),
        logger: historyLogger
    });

    return createBatchUserManagementFeature({
        sendRequest: transport.sendRequest,
        getConnectionState: transport.getConnectionState,
        session: createFeatureSession({
            operationGuard,
            operationName: 'batch-user-management'
        }),
        executePlan: recordedExecution,
        createDialog: () => document.createElement(USER_MANAGEMENT_DIALOG_TAG),
        logger: logger.createChildLogger('BatchUserManagement')
    });
}

const batchUserManagementFeatureDefinition = Object.freeze({
    type: WINDOW_MESSAGE_TYPES.OPEN_BATCH_USER_MANAGEMENT,
    create(context) {
        const feature = createBatchUserManagementFeatureV2(context);
        return () => feature.open();
    }
});

function createBatchUserManagementFeature({
    sendRequest,
    getConnectionState,
    session,
    executePlan = executeUserPlan,
    createDialog = () => document.createElement(USER_MANAGEMENT_DIALOG_TAG),
    logger = { log() {} }
}) {
    let running = false;
    let pupils = [];
    let currentRows = [];
    let marathonId = null;
    let dialog = null;

    function handleClose() {
        running = false;
        pupils = [];
        currentRows = [];
        marathonId = null;
        dialog = null;
        session.close();
    }

    function getErrorCode(error) {
        return typeof error?.code === 'string' ? error.code : 'UNKNOWN_ERROR';
    }

    function handleInput(event) {
        const parsed = parseEmailInput(event?.detail?.emailInput);
        dialog.setEmailState({
            validCount: parsed.entries.length,
            malformedCount: parsed.malformed.length,
            invalidEntries: parsed.invalidEntries
        });
    }

    function applySelections(rows) {
        const selectionsByEmail = new Map(
            (Array.isArray(rows) ? rows : []).map((row) => [
                row.normalizedEmail,
                {
                    unassignSelected: Boolean(row.unassignSelected),
                    deleteSelected: Boolean(row.deleteSelected)
                }
            ])
        );
        return currentRows.map((row) => ({
            ...row,
            ...(selectionsByEmail.get(row.normalizedEmail) || {
                unassignSelected: false,
                deleteSelected: false
            }),
            result: { ...row.result }
        }));
    }

    function updateCachedPupils(executedRows) {
        const deletedIds = new Set(
            executedRows
                .filter((row) => row.delete?.status === 'success')
                .map((row) => row.marathonPupilId)
        );
        const unassignedIds = new Set(
            executedRows
                .filter((row) => row.unassign?.status === 'success' || row.unassign?.status === 'noop')
                .map((row) => row.marathonPupilId)
        );
        pupils = pupils
            .filter((pupil) => !deletedIds.has(pupil.MarathonPupilId))
            .map((pupil) => unassignedIds.has(pupil.MarathonPupilId)
                ? { ...pupil, Moderators: [] }
                : pupil);
    }

    async function handleCheck(event) {
        if (running) {
            return;
        }
        running = true;
        try {
            const parsed = parseEmailInput(event?.detail?.emailInput);
            const inputErrors = createInputErrors(parsed);
            if (inputErrors.length > 0) {
                dialog.showValidationErrors(inputErrors);
                return;
            }
            dialog.showChecking('Проверяем пользователей…');
            const resolution = resolveUsersByEmail(parsed.entries, pupils);
            currentRows = buildUserPlan({ rows: orderResolvedRows(parsed, resolution) });
            dialog.showReview({ rows: currentRows });
            logger.log(`Batch user management checked ${currentRows.length} row(s) for MarathonId ${marathonId}.`);
        } catch (error) {
            dialog.showValidationErrors([error]);
        } finally {
            running = false;
        }
    }

    function handleSelectionChange(event) {
        if (Array.isArray(event?.detail?.rows)) {
            currentRows = applySelections(event.detail.rows);
        }
    }

    async function handleStart(event) {
        if (running) {
            return;
        }
        const selectedRows = applySelections(event?.detail?.rows || currentRows);
        if (!selectedRows.some((row) =>
            row.actionable !== false && (row.unassignSelected || row.deleteSelected)
        )) {
            return;
        }

        running = true;
        try {
            const result = await executePlan({
                marathonId,
                rows: selectedRows,
                sendRequest,
                wait,
                getConnectionState,
                onProgress: (progress) => dialog.showExecution(progress)
            });
            const completedByEmail = new Map(
                result.rows.map((row) => [row.normalizedEmail, row])
            );
            updateCachedPupils(result.rows);
            currentRows = selectedRows.map((row) =>
                completedByEmail.get(row.normalizedEmail) || row
            );
            dialog.showComplete({ ...result, rows: currentRows });
        } catch (error) {
            dialog.showComplete({
                rows: currentRows,
                completed: 0,
                total: 0,
                successes: 0,
                failures: 1,
                attempts: error?.attempts || 1,
                error
            });
        } finally {
            running = false;
        }
    }

    function handleRestart() {
        currentRows = [];
        running = false;
    }

    async function open() {
        if (session.isOpen() || document.getElementById(USER_MANAGEMENT_OVERLAY_ID)) {
            return;
        }
        if (!session.activate()) {
            window.alert('Another Edvibe Toolbox operation is already running.');
            return;
        }
        marathonId = parseMarathonId(window.location.href);
        if (!marathonId) {
            session.release();
            window.alert('Open an Edvibe marathon page before managing users.');
            return;
        }

        try {
            dialog = session.ownDialog(createDialog());
            dialog.addEventListener('edvibe-dialog-close', handleClose);
            dialog.addEventListener('edvibe-batch-user-management-input-change', handleInput);
            dialog.addEventListener('edvibe-batch-user-management-check', handleCheck);
            dialog.addEventListener('edvibe-batch-user-management-selection-change', handleSelectionChange);
            dialog.addEventListener('edvibe-batch-user-management-start', handleStart);
            dialog.addEventListener('edvibe-batch-user-management-restart', handleRestart);
            dialog.configure();
            (document.body || document.documentElement).appendChild(dialog);
            dialog.showChecking('Загружаем пользователей…');

            logger.log(`Initializing batch user management for MarathonId ${marathonId}.`);
            pupils = await loadAllPupils({ sendRequest, marathonId });
            if (pupils.length === 0) {
                throw createFeatureError('EMPTY_ROSTER', 'No pupils were found in this marathon.');
            }
            dialog.showConfigure();
        } catch (error) {
            logger.log(
                `Batch user management initialization failed for MarathonId ${marathonId} `
                + `(${getErrorCode(error)}).`
            );
            try {
                dialog?.showFatalError?.(error);
            } catch (renderError) {
                logger.log(`Batch user management error rendering failed (${getErrorCode(renderError)}).`);
            } finally {
                session.release();
            }
        }
    }

    return { open, isRunning: () => running };
}

export {
    batchUserManagementFeatureDefinition,
    parseMarathonId,
    parseEmailInput,
    appendPage,
    loadAllPupils,
    resolveUsersByEmail,
    buildUserPlan,
    createFeatureError,
    runWithRetry,
    executeUserPlan,
    createBatchUserManagementFeature,
    USER_MANAGEMENT_DIALOG_TAG,
    USER_MANAGEMENT_OVERLAY_ID
};
