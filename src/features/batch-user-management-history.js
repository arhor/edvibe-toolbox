(function initializeBatchUserManagementHistory(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.EdVibeBatchUserManagementHistory = factory();
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createModule() {
    'use strict';

    const OPERATION_TYPE = 'batch_user_management';
    const SCHEMA_VERSION = 1;
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

    function clone(value) {
        if (value === undefined) {
            return undefined;
        }
        return JSON.parse(JSON.stringify(value));
    }

    function createExecutionId(now = Date.now, random = Math.random) {
        const timestamp = Number(now()).toString(36);
        const entropy = Math.floor(random() * Number.MAX_SAFE_INTEGER).toString(36);
        return `${OPERATION_TYPE}-${timestamp}-${entropy}`;
    }

    function normalizeIdentity(row) {
        const pupil = row?.pupil || {};
        return {
            email: pupil.Email || row?.normalizedEmail || row?.email || null,
            displayName: pupil.DisplayName || pupil.FullName || pupil.Name || null,
            firstName: pupil.FirstName || null,
            lastName: pupil.LastName || null,
            pupilId: pupil.PupilId ?? pupil.Id ?? null,
            marathonPupilId: row?.marathonPupilId ?? pupil.MarathonPupilId ?? null
        };
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

    function operationResult(result, fallbackStatus = 'not_attempted') {
        if (!result) {
            return {
                status: fallbackStatus,
                attemptCount: 0,
                code: fallbackStatus === 'not_attempted' ? 'NOT_ATTEMPTED' : null,
                message: fallbackStatus === 'not_attempted' ? 'The operation was not attempted.' : null,
                blockedBy: null
            };
        }

        const dependencyBlocked = result.status === 'skipped'
            && /curator removal failed/i.test(result.message || '');
        return {
            status: result.status,
            attemptCount: Number.isInteger(result.attempts) ? result.attempts : 0,
            code: result.code || (dependencyBlocked ? 'DEPENDENCY_FAILED' : null),
            message: result.message || null,
            blockedBy: dependencyBlocked ? OPERATION_NAMES.unassign : null
        };
    }

    function finalOutcome(row, operations) {
        if (row?.status !== 'matched') {
            return 'rejected';
        }
        if (operations.length === 0) {
            return 'skipped';
        }
        const results = Object.values(row?.operations || {});
        if (results.some((result) => result.status === 'failed')) {
            return 'failed';
        }
        if (results.some((result) => result.status === 'not_attempted')) {
            return 'not_attempted';
        }
        if (results.some((result) => result.status === 'skipped')) {
            return 'partially_skipped';
        }
        if (results.every((result) => result.status === 'noop')) {
            return 'noop';
        }
        return 'success';
    }

    function serializeItem(row) {
        const operations = selectedOperations(row);
        const operationResults = {};
        if (operations.includes(OPERATION_NAMES.unassign)) {
            operationResults[OPERATION_NAMES.unassign] = operationResult(row?.unassign);
        }
        if (operations.includes(OPERATION_NAMES.delete)) {
            operationResults[OPERATION_NAMES.delete] = operationResult(row?.delete);
        }

        const item = {
            submitted: row?.email || null,
            normalizedEmail: row?.normalizedEmail || null,
            resolution: row?.status || 'malformed',
            resolutionMessage: row?.message || null,
            user: row?.status === 'matched' ? normalizeIdentity(row) : null,
            curatorPresent: row?.status === 'matched' ? Boolean(row?.hasCurator) : null,
            selectedOperations: operations,
            operations: operationResults
        };
        item.outcome = finalOutcome(item, operations);
        return item;
    }

    function countSummary(items) {
        const userCounts = {
            requested: items.length,
            matched: 0,
            rejected: 0,
            successful: 0,
            failed: 0,
            skipped: 0,
            notAttempted: 0
        };
        const operationCounts = {
            selected: 0,
            attempted: 0,
            successful: 0,
            noop: 0,
            skipped: 0,
            failed: 0,
            notAttempted: 0
        };

        for (const item of items) {
            if (item.resolution === 'matched') {
                userCounts.matched += 1;
            } else {
                userCounts.rejected += 1;
            }
            if (item.outcome === 'success' || item.outcome === 'noop') {
                userCounts.successful += 1;
            } else if (item.outcome === 'failed') {
                userCounts.failed += 1;
            } else if (item.outcome === 'not_attempted') {
                userCounts.notAttempted += 1;
            } else if (item.outcome !== 'rejected') {
                userCounts.skipped += 1;
            }

            for (const result of Object.values(item.operations)) {
                operationCounts.selected += 1;
                if (result.status !== 'not_attempted') {
                    operationCounts.attempted += 1;
                }
                if (result.status === 'success') operationCounts.successful += 1;
                if (result.status === 'noop') operationCounts.noop += 1;
                if (result.status === 'skipped') operationCounts.skipped += 1;
                if (result.status === 'failed') operationCounts.failed += 1;
                if (result.status === 'not_attempted') operationCounts.notAttempted += 1;
            }
        }

        return { users: userCounts, operations: operationCounts };
    }

    function inferTerminalStatus(items, requestedStatus) {
        if (requestedStatus && !TERMINAL_STATUSES.has(requestedStatus)) {
            throw new TypeError(`Unsupported terminal status: ${requestedStatus}`);
        }
        if (requestedStatus) {
            return requestedStatus;
        }
        const hasFailure = items.some((item) =>
            item.outcome === 'failed' || item.outcome === 'partially_skipped'
        );
        return hasFailure ? 'completed_with_failures' : 'completed';
    }

    function createExecutionRecord({
        executionId = createExecutionId(),
        startedAt,
        completedAt,
        terminalStatus,
        marathonId,
        marathonName = null,
        rows,
        interruption = null
    }) {
        const items = (Array.isArray(rows) ? rows : []).map(serializeItem);
        return Object.freeze({
            executionId,
            schemaVersion: SCHEMA_VERSION,
            operationType: OPERATION_TYPE,
            startedAt,
            completedAt,
            terminalStatus: inferTerminalStatus(items, terminalStatus),
            context: Object.freeze({ marathonId, marathonName }),
            summary: Object.freeze(countSummary(items)),
            items: Object.freeze(items.map((item) => Object.freeze(item))),
            interruption: interruption ? Object.freeze(clone(interruption)) : null
        });
    }

    async function persistTerminalRecord({
        record,
        persist,
        onPersistenceError = () => {}
    }) {
        if (typeof persist !== 'function') {
            throw new TypeError('persist must be a function');
        }
        try {
            await persist(record);
            return { record, persisted: true, persistenceError: null };
        } catch (error) {
            try {
                onPersistenceError(error, record);
            } catch (_) {
                // Error reporting must not replace the visible operation result.
            }
            return { record, persisted: false, persistenceError: error };
        }
    }

    return {
        OPERATION_TYPE,
        SCHEMA_VERSION,
        OPERATION_NAMES,
        createExecutionId,
        serializeItem,
        countSummary,
        createExecutionRecord,
        persistTerminalRecord
    };
});