import { isRecord } from '#src/shared/utils.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CYRILLIC_PATTERN = /\p{Script=Cyrillic}/u;
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

function describeNonAsciiCharacters(value) {
    const characters = [];
    let index = 0;
    for (const character of value) {
        const codePoint = character.codePointAt(0);
        if (codePoint > 0x7F) {
            characters.push(Object.freeze({
                character,
                index,
                codePoint: `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`,
                script: CYRILLIC_PATTERN.test(character) ? 'кириллица' : 'не-ASCII символ'
            }));
        }
        index += character.length;
    }
    return Object.freeze(characters);
}

function validateEmail(input) {
    const offendingCharacters = describeNonAsciiCharacters(input);
    if (offendingCharacters.length > 0) {
        const details = offendingCharacters
            .map(({ character, script }) => `«${character}» (${script})`)
            .join(', ');
        return Object.freeze({
            isValid: false,
            code: 'EMAIL_NON_ASCII',
            message: `Недопустимые символы: ${details}.`,
            offendingCharacters
        });
    }
    if (!EMAIL_PATTERN.test(input)) {
        return Object.freeze({
            isValid: false,
            code: 'INVALID_EMAIL_FORMAT',
            message: 'Некорректный формат email.',
            offendingCharacters
        });
    }
    return Object.freeze({
        isValid: true,
        code: null,
        message: null,
        offendingCharacters
    });
}

function parseEmailInput(value, { includeItems = false } = {}) {
    const entries = [];
    const malformed = [];
    const invalidEntries = [];
    const items = [];
    const seen = new Set();

    for (const token of String(value || '').split(/[,;\r\n]+/)) {
        const input = token.trim();
        if (!input) {
            continue;
        }

        const normalized = input.toLowerCase();
        if (seen.has(normalized)) {
            continue;
        }
        seen.add(normalized);

        const validation = validateEmail(input);
        if (!validation.isValid) {
            malformed.push(input);
            invalidEntries.push({ input, normalized, ...validation });
        } else {
            entries.push({ input, normalized });
        }

        if (includeItems) {
            items.push({ input, normalized, isValid: validation.isValid, validation });
        }
    }

    return includeItems
        ? { entries, malformed, invalidEntries, items }
        : { entries, malformed, invalidEntries };
}

function readPage(response) {
    if (!isRecord(response)) {
        return { items: undefined, total: undefined };
    }
    const value = isRecord(response.Value)
        ? response.Value
        : isRecord(response.value)
            ? response.value
            : null;
    if (!value) {
        return { items: undefined, total: undefined };
    }
    const page = isRecord(value.Page) ? value.Page : null;
    return {
        items: value.Items,
        total: page?.Count
    };
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
    if (!TRANSIENT_CODES.has(error?.code)) {
        return false;
    }
    if (error.code !== 'SEND_FAILED') {
        return true;
    }
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
    TRANSIENT_CODES,
    appendPage,
    createFeatureError,
    parseEmailInput,
    readPage,
    runWithRetry,
    validateEmail
};
