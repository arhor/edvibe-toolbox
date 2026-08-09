const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TRANSIENT_CODES = new Set([
    'WS_UNAVAILABLE',
    'REQUEST_TIMEOUT',
    'SEND_FAILED'
]);

function createFeatureError(code, message, details = {}) {
    const error = new Error(message);
    error.code = code;
    Object.assign(error, details);
    return error;
}

function parseMarathonId(url) {
    const match = String(url || '').match(/\/marathon\/(\d+)(?:\/|$)/);
    return match ? Number(match[1]) : null;
}

function parseEmailInput(value, { includeItems = false } = {}) {
    const entries = [];
    const malformed = [];
    const items = [];
    const seen = new Set();

    for (const token of String(value || '').split(/[,;\r\n]+/)) {
        const input = token.trim();
        if (!input) continue;
        const normalized = input.toLowerCase();
        if (seen.has(normalized)) continue;
        seen.add(normalized);

        const isValid = EMAIL_PATTERN.test(input);
        if (!isValid) malformed.push(input);
        else entries.push({ input, normalized });
        if (includeItems) items.push({ input, normalized, isValid });
    }

    return includeItems ? { entries, malformed, items } : { entries, malformed };
}

function appendPage(items, total, nextItems, nextTotal, label) {
    if (
        !Array.isArray(nextItems)
        || !Number.isInteger(nextTotal)
        || nextTotal < 0
        || (total !== null && nextTotal !== total)
        || (nextItems.length === 0 && items.length < nextTotal)
        || items.length + nextItems.length > nextTotal
    ) {
        throw createFeatureError('INVALID_RESPONSE', `${label} returned invalid pagination data.`);
    }
    return { items: items.concat(nextItems), total: nextTotal };
}

function isTransientError(error, getConnectionState) {
    if (!TRANSIENT_CODES.has(error?.code)) return false;
    if (error.code !== 'SEND_FAILED') return true;
    return Boolean(error.cause) && !getConnectionState().isOpen;
}

async function runWithRetry(operation, {
    wait,
    getConnectionState,
    retryDelays = [1000, 3000]
}) {
    let attempts = 0;
    while (attempts <= retryDelays.length) {
        attempts += 1;
        try {
            if (attempts > 1 && !getConnectionState().isOpen) {
                throw createFeatureError(
                    'WS_UNAVAILABLE',
                    'The Edvibe connection is unavailable.'
                );
            }
            return { value: await operation(), attempts };
        } catch (error) {
            if (!isTransientError(error, getConnectionState) || attempts > retryDelays.length) {
                error.attempts = attempts;
                throw error;
            }
            await wait(retryDelays[attempts - 1]);
        }
    }
    throw createFeatureError('INTERNAL_ERROR', 'Retry loop ended unexpectedly.');
}

export {
    appendPage,
    createFeatureError,
    parseEmailInput,
    parseMarathonId,
    runWithRetry
};