const SEND_STATUSES = Object.freeze({
    FAILED: 'failed',
    NOT_ATTEMPTED: 'not-attempted',
    PENDING: 'pending',
    SENDING: 'sending',
    SENT: 'sent'
});

const FATAL_SEND_ERROR_CODES = new Set([
    'AUTH_KEY_DUPLICATED',
    'AUTH_KEY_UNREGISTERED',
    'PEER_FLOOD',
    'SESSION_EXPIRED',
    'SESSION_REVOKED',
    'TELEGRAM_WEB_K_OPERATION_UNAVAILABLE',
    'TELEGRAM_WEB_K_RUNTIME_CALL_FAILED',
    'TELEGRAM_WEB_K_UNSUPPORTED_RUNTIME'
]);

function normalizeError(error) {
    return Object.freeze({
        code: typeof error?.code === 'string' ? error.code : 'TELEGRAM_SEND_FAILED',
        message: error instanceof Error
            ? error.message
            : typeof error?.message === 'string'
                ? error.message
                : 'Не удалось отправить сообщение.'
    });
}

function isFatalTelegramGroupSendError(error) {
    const code = typeof error?.code === 'string' ? error.code : '';
    return FATAL_SEND_ERROR_CODES.has(code)
        || /^FLOOD(?:_[A-Z0-9]+)*_WAIT_\d+$/.test(code);
}

function createSendResult(group, status, error = null) {
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

function summarizeSendResults(results) {
    const snapshot = Object.freeze(Array.from(results || []));
    const counts = Object.freeze({
        failed: snapshot.filter(({ status }) => status === SEND_STATUSES.FAILED).length,
        notAttempted: snapshot.filter(({ status }) => status === SEND_STATUSES.NOT_ATTEMPTED).length,
        pending: snapshot.filter(({ status }) => (
            status === SEND_STATUSES.PENDING || status === SEND_STATUSES.SENDING
        )).length,
        sent: snapshot.filter(({ status }) => status === SEND_STATUSES.SENT).length,
        total: snapshot.length
    });
    return Object.freeze({ counts, results: snapshot });
}

function emitProgress(onProgress, results) {
    if (typeof onProgress !== 'function') {
        return;
    }
    try {
        onProgress(summarizeSendResults(results));
    } catch {
        // Progress rendering must never change externally visible send semantics.
    }
}

function createPreflightBlockedResult(group) {
    return createSendResult(group, SEND_STATUSES.NOT_ATTEMPTED, {
        code: 'TELEGRAM_SEND_PREFLIGHT_BLOCKED',
        message: 'Не выполнено: Telegram сообщает, что отправка текста в эту группу сейчас недоступна.'
    });
}

async function sendMessageToOwnedTelegramGroups(adapter, groups, text, {
    confirmed = false,
    onProgress
} = {}) {
    if (!adapter || typeof adapter.sendText !== 'function') {
        throw new TypeError('Telegram adapter with sendText() is required.');
    }

    const targets = Array.from(groups || []);
    if (targets.length === 0) {
        throw new TypeError('At least one Telegram group must be selected for sending.');
    }
    if (typeof text !== 'string' || text.trim() === '') {
        throw new TypeError('A non-empty text message is required before sending.');
    }
    if (confirmed !== true) {
        throw new TypeError('Explicit confirmation is required before sending Telegram messages.');
    }

    const results = targets.map((group) => (
        group?.canSendText === false
            ? createPreflightBlockedResult(group)
            : createSendResult(group, SEND_STATUSES.PENDING)
    ));
    emitProgress(onProgress, results);

    for (let index = 0; index < targets.length; index += 1) {
        if (results[index].status === SEND_STATUSES.NOT_ATTEMPTED) {
            continue;
        }

        const group = targets[index];
        results[index] = createSendResult(group, SEND_STATUSES.SENDING);
        emitProgress(onProgress, results);

        try {
            await adapter.sendText(group.peerId, text);
            results[index] = createSendResult(group, SEND_STATUSES.SENT);
            emitProgress(onProgress, results);
        } catch (error) {
            results[index] = createSendResult(group, SEND_STATUSES.FAILED, error);
            if (isFatalTelegramGroupSendError(error)) {
                for (let remaining = index + 1; remaining < targets.length; remaining += 1) {
                    if (results[remaining].status !== SEND_STATUSES.PENDING) {
                        continue;
                    }
                    results[remaining] = createSendResult(
                        targets[remaining],
                        SEND_STATUSES.NOT_ATTEMPTED,
                        {
                            code: error.code || 'TELEGRAM_SEND_INTERRUPTED',
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

    return summarizeSendResults(results);
}

export {
    isFatalTelegramGroupSendError,
    SEND_STATUSES,
    sendMessageToOwnedTelegramGroups,
    summarizeSendResults
};
