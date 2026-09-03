const DELETE_STATUSES = Object.freeze({
    DELETED: 'deleted',
    DELETING: 'deleting',
    FAILED: 'failed',
    NOT_ATTEMPTED: 'not-attempted',
    PENDING: 'pending'
});

const FATAL_DELETE_ERROR_CODES = new Set([
    'AUTH_KEY_UNREGISTERED',
    'SESSION_EXPIRED',
    'SESSION_REVOKED',
    'TELEGRAM_WEB_K_OPERATION_UNAVAILABLE',
    'TELEGRAM_WEB_K_UNSUPPORTED_RUNTIME'
]);

function normalizeError(error) {
    return Object.freeze({
        code: typeof error?.code === 'string' ? error.code : 'TELEGRAM_DELETE_FAILED',
        message: error instanceof Error
            ? error.message
            : typeof error?.message === 'string'
                ? error.message
                : 'Не удалось удалить группу.'
    });
}

function isFatalTelegramGroupDeleteError(error) {
    const code = typeof error?.code === 'string' ? error.code : '';
    return FATAL_DELETE_ERROR_CODES.has(code)
        || code === 'AUTH_KEY_DUPLICATED'
        || code.startsWith('FLOOD_WAIT_');
}

function createDeleteResult(group, status, error = null) {
    const normalizedError = error ? normalizeError(error) : null;
    return Object.freeze({
        errorCode: normalizedError?.code || null,
        errorMessage: normalizedError?.message || null,
        kind: group.kind,
        peerId: group.peerId,
        status,
        title: group.title
    });
}

function summarizeDeleteResults(results) {
    const snapshot = Object.freeze(Array.from(results || []));
    const counts = Object.freeze({
        deleted: snapshot.filter(({ status }) => status === DELETE_STATUSES.DELETED).length,
        failed: snapshot.filter(({ status }) => status === DELETE_STATUSES.FAILED).length,
        notAttempted: snapshot.filter(({ status }) => status === DELETE_STATUSES.NOT_ATTEMPTED).length,
        pending: snapshot.filter(({ status }) => (
            status === DELETE_STATUSES.PENDING || status === DELETE_STATUSES.DELETING
        )).length,
        total: snapshot.length
    });
    return Object.freeze({ counts, results: snapshot });
}

function emitProgress(onProgress, results) {
    if (typeof onProgress !== 'function') {
        return;
    }
    try {
        onProgress(summarizeDeleteResults(results));
    } catch {
        // Progress rendering must never change external deletion semantics.
    }
}

async function deleteOwnedTelegramGroups(adapter, groups, { onProgress } = {}) {
    if (!adapter || typeof adapter.deleteGroup !== 'function') {
        throw new TypeError('Telegram adapter with deleteGroup() is required.');
    }

    const targets = Array.from(groups || []);
    if (targets.length === 0) {
        throw new TypeError('At least one Telegram group must be selected for deletion.');
    }

    const results = targets.map((group) => createDeleteResult(group, DELETE_STATUSES.PENDING));
    emitProgress(onProgress, results);

    for (let index = 0; index < targets.length; index += 1) {
        const group = targets[index];
        results[index] = createDeleteResult(group, DELETE_STATUSES.DELETING);
        emitProgress(onProgress, results);

        try {
            await adapter.deleteGroup(group.peerId, group.kind);
            results[index] = createDeleteResult(group, DELETE_STATUSES.DELETED);
            emitProgress(onProgress, results);
        } catch (error) {
            results[index] = createDeleteResult(group, DELETE_STATUSES.FAILED, error);
            if (isFatalTelegramGroupDeleteError(error)) {
                for (let remaining = index + 1; remaining < targets.length; remaining += 1) {
                    results[remaining] = createDeleteResult(
                        targets[remaining],
                        DELETE_STATUSES.NOT_ATTEMPTED,
                        {
                            code: error.code || 'TELEGRAM_DELETE_INTERRUPTED',
                            message: 'Не выполнено: очередь остановлена после общей ошибки Telegram.'
                        }
                    );
                }
                emitProgress(onProgress, results);
                break;
            }
            emitProgress(onProgress, results);
        }
    }

    return summarizeDeleteResults(results);
}

function reconcileDeletedOwnedGroups(groups, results) {
    const deletedPeerIds = new Set(
        Array.from(results || [])
            .filter(({ status }) => status === DELETE_STATUSES.DELETED)
            .map(({ peerId }) => Number(peerId))
    );
    return Object.freeze(Array.from(groups || [])
        .filter(({ peerId }) => !deletedPeerIds.has(Number(peerId))));
}

export {
    DELETE_STATUSES,
    deleteOwnedTelegramGroups,
    isFatalTelegramGroupDeleteError,
    reconcileDeletedOwnedGroups,
    summarizeDeleteResults
};
