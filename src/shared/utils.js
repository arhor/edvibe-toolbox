export function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
export function isRecord(value) {
    return value !== undefined
        && value !== null
        && typeof value === 'object'
        && !Array.isArray(value);
}

export function hasOnlyKeys(value, allowedKeys) {
    return Object.keys(value).every((key) => allowedKeys.has(key));
}

export function isNonEmptyString(value) {
    return typeof value === 'string'
        && value.length > 0;
}
