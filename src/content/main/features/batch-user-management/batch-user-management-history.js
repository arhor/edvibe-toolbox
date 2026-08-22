import { createExecutionAttemptReporter } from '#src/content/main/application/execution-attempt.js';
import { diagnosticsFromAttempts, historyDiagnostics } from '#src/content/main/infrastructure/history-diagnostics.js';

const OPERATION_TYPE = 'batch_user_management';
const OPERATION_NAMES = Object.freeze({
    unassign: 'unassign_curator',
    delete: 'delete_user'
});
const TERMINAL_STATUSES = new Set([
    'completed',
    'completed_with_failures',
    'cancelled',
    'interrupted'
]);

function parseMarathonId(url) {
    const match = String(url || '').match(/\/marathon\/(\d+)(?:\/|$)/);
    return match ? String(match[1]) : null;
}

function selectedOperations(row) {
    const operations = [];
    if (row?.unassignSelected) {
        operations.push(OPERATION_NAMES.unassign);
    }
    if (row?.deleteSelected) {
        operations.push(OPERATION_NAMES.delete);
    }
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
            : null,
        ...(historyDiagnostics(result) ? { diagnostics: historyDiagnostics(result) } : {})
    });
}

function inferItemStatus(row, operations) {
    if (row?.status !== 'matched') {
        return 'rejected';
    }
    if (operations.length === 0) {
        return 'skipped';
    }
    const values = operations.map((operation) => operation.status);
    if (values.includes('failed')) {
        return 'failed';
    }
    if (values.includes('not_attempted')) {
        return 'not_attempted';
    }
    if (values.includes('skipped')) {
        return 'skipped';
    }
    if (values.every((status) => status === 'noop')) {
        return 'noop';
    }
    return 'success';
}

function resultCode(row, status) {
    if (status === 'rejected') {
        return {
            malformed: row?.validationCode || 'USER_INPUT_MALFORMED',
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
    if (status === 'rejected') {
        return row?.message || 'The submitted user could not be resolved safely.';
    }
    if (operations.length === 0) {
        return 'No user-management operation was selected.';
    }
    const messages = operations.map((operation) => operation.message).filter(Boolean);
    if (messages.length > 0) {
        return messages.join('; ');
    }
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
    const diagnostics = diagnosticsFromAttempts(operations.flatMap((operation) =>
        historyDiagnostics(operation)?.requestAttempts || []));
    return Object.freeze({
        itemId: row?.normalizedEmail || row?.email || `input-${index + 1}`,
        label: row?.email || row?.normalizedEmail || `Input ${index + 1}`,
        status,
        code: resultCode(row, status),
        message: resultMessage(row, status, operations),
        attempts: operations.reduce((sum, operation) => sum + operation.attemptCount, 0),
        ...(diagnostics ? { diagnostics } : {}),
        data: Object.freeze({
            submittedInput: row?.email || null,
            normalizedEmail: row?.normalizedEmail || null,
            resolution: row?.status || 'malformed',
            validationCode: row?.validationCode || null,
            resolutionMessage: row?.message || null,
            ...(row?.offendingCharacters?.length
                ? {offendingCharacters: Object.freeze([...row.offendingCharacters])}
                : {}),
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

function inferTerminalStatus(summary, results, terminalStatus = null) {
    if (TERMINAL_STATUSES.has(terminalStatus)) {
        return terminalStatus;
    }
    if (summary?.error) {
        return 'interrupted';
    }
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
    marathonName = null,
    terminalStatus = null
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
            if (operation.status !== 'not_attempted') {
                operationCounts.attempted += 1;
            }
            if (operation.status === 'success') {
                operationCounts.successful += 1;
            }
            if (operation.status === 'noop') {
                operationCounts.noOp += 1;
            }
            if (operation.status === 'skipped') {
                operationCounts.skipped += 1;
            }
            if (operation.status === 'failed') {
                operationCounts.failed += 1;
            }
            if (operation.status === 'not_attempted') {
                operationCounts.notAttempted += 1;
            }
        }
    }
    const counts = buildCounts(results);
    return Object.freeze({
        operationType: OPERATION_TYPE,
        startedAt,
        completedAt,
        status: inferTerminalStatus(summary, results, terminalStatus),
        pageContext: Object.freeze({ marathonId, marathonName }),
        counts,
        results: Object.freeze(results),
        message: JSON.stringify({ userCounts: counts, operationCounts })
    });
}

function createBatchUserManagementHistoryReporter({
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

    let startedAt = null;
    let latestRows = [];
    let terminal = false;
    let sequence = 0;

    function notify(history, currentSequence) {
        if (currentSequence !== sequence) {
            return history;
        }
        try {
            onPersistence(history);
        } catch (error) {
            logger.log('Batch user management history presentation failed:', error);
        }
        return history;
    }

    async function persist(summary = {}, terminalStatus = null) {
        if (!startedAt || terminal) {
            return Object.freeze({ stored: false, skipped: true });
        }
        terminal = true;
        const currentSequence = sequence;
        let input;
        try {
            const completedAt = now().toISOString();
            input = buildExecutionHistoryInput({
                rows: latestRows,
                summary,
                startedAt,
                completedAt,
                marathonId: parseMarathonId(getLocationHref()),
                marathonName: getMarathonName(),
                terminalStatus
            });
        } catch (persistenceError) {
            logger.log('Batch user management history record creation failed:', persistenceError);
            return notify(Object.freeze({ stored: false, persistenceError }), currentSequence);
        }
        try {
            const history = await persistExecution(input);
            if (!history?.stored && history?.persistenceError) {
                logger.log('Batch user management history persistence failed:', history.persistenceError);
            }
            return notify(history, currentSequence);
        } catch (persistenceError) {
            logger.log('Batch user management history persistence failed:', persistenceError);
            return notify(Object.freeze({ stored: false, persistenceError }), currentSequence);
        }
    }

    return createExecutionAttemptReporter({
        reset() {
            sequence += 1;
            startedAt = null;
            latestRows = [];
            terminal = false;
        },
        begin({ rows = [] } = {}) {
            sequence += 1;
            startedAt = now().toISOString();
            latestRows = Array.isArray(rows) ? rows : [];
            terminal = false;
        },
        observe({ rows } = {}) {
            if (Array.isArray(rows)) {
                latestRows = rows;
            }
        },
        complete({ summary = {}, rows = null } = {}) {
            if (Array.isArray(rows)) {
                latestRows = rows;
            }
            return persist(summary);
        },
        cancel({ rows = null } = {}) {
            if (Array.isArray(rows)) {
                latestRows = rows;
            }
            return persist({}, 'cancelled');
        },
        interrupt({ summary = {}, rows = null, error = null } = {}) {
            if (Array.isArray(rows)) {
                latestRows = rows;
            }
            return persist(error ? { ...summary, error } : summary, 'interrupted');
        }
    });
}

export {
    OPERATION_TYPE,
    OPERATION_NAMES,
    parseMarathonId,
    serializeRow,
    buildCounts,
    buildExecutionHistoryInput,
    createBatchUserManagementHistoryReporter
};
