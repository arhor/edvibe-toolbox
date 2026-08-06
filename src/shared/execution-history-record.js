(function initializeExecutionHistoryRecord(root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.EdVibeExecutionHistoryRecord = factory();
})(typeof globalThis !== 'undefined' ? globalThis : window, function createModule() {
    'use strict';

    const EXECUTION_RECORD_SCHEMA_VERSION = 1;
    const TERMINAL_STATUSES = Object.freeze([
        'completed',
        'completed_with_failures',
        'cancelled',
        'interrupted'
    ]);
    const COUNT_KEYS = Object.freeze([
        'requested',
        'eligible',
        'attempted',
        'successful',
        'noOp',
        'skipped',
        'failed',
        'notAttempted'
    ]);
    const UNSAFE_FIELD_WORDS = new Set([
        'auth', 'authorization', 'binary', 'bytes', 'cookie', 'credential',
        'credentials', 'frame', 'frames', 'image', 'password', 'recording',
        'response', 'session', 'token', 'transport', 'websocket'
    ]);

    function validationError(message, path = '') {
        const error = new TypeError(path ? `${message} (${path})` : message);
        error.code = 'INVALID_EXECUTION_RECORD';
        error.path = path;
        return error;
    }

    function assertPlainObject(value, path) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            throw validationError('Expected an object', path);
        }
        const prototype = Object.getPrototypeOf(value);
        if (prototype !== Object.prototype && prototype !== null) {
            throw validationError('Expected a plain object', path);
        }
    }

    function normalizeIsoTimestamp(value, path) {
        const date = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(date.getTime())) throw validationError('Expected a valid timestamp', path);
        return date.toISOString();
    }

    function normalizeNonEmptyString(value, path, maxLength = 160) {
        const normalized = String(value ?? '').trim();
        if (!normalized) throw validationError('Expected a non-empty string', path);
        if (normalized.length > maxLength) throw validationError(`String exceeds ${maxLength} characters`, path);
        return normalized;
    }

    function normalizeOptionalString(value, path, maxLength = 500) {
        if (value === undefined || value === null || value === '') return null;
        const normalized = String(value).trim();
        if (normalized.length > maxLength) throw validationError(`String exceeds ${maxLength} characters`, path);
        return normalized || null;
    }

    function normalizeCount(value, path) {
        const count = Number(value ?? 0);
        if (!Number.isSafeInteger(count) || count < 0) {
            throw validationError('Expected a non-negative safe integer', path);
        }
        return count;
    }

    function isUnsafeFieldName(key) {
        const words = String(key)
            .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
            .toLowerCase()
            .split(/[^a-z0-9]+/)
            .filter(Boolean);
        return words.includes('raw') || words.some((word) => UNSAFE_FIELD_WORDS.has(word));
    }

    function sanitizeJsonValue(value, path = 'value', seen = new WeakSet()) {
        if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
        if (typeof value === 'number') {
            if (!Number.isFinite(value)) throw validationError('Expected a finite number', path);
            return value;
        }
        if (value === undefined) return null;
        if (typeof value === 'bigint' || typeof value === 'function' || typeof value === 'symbol') {
            throw validationError('Unsupported JSON value', path);
        }
        if (typeof value !== 'object') throw validationError('Unsupported value', path);
        if (seen.has(value)) throw validationError('Circular values are not supported', path);
        seen.add(value);
        try {
            if (Array.isArray(value)) {
                return value.map((entry, index) => sanitizeJsonValue(entry, `${path}[${index}]`, seen));
            }
            assertPlainObject(value, path);
            const output = {};
            for (const [key, entry] of Object.entries(value)) {
                if (isUnsafeFieldName(key)) throw validationError('Unsafe field is not allowed', `${path}.${key}`);
                output[key] = sanitizeJsonValue(entry, `${path}.${key}`, seen);
            }
            return output;
        } finally {
            seen.delete(value);
        }
    }

    function normalizePageContext(value = {}) {
        assertPlainObject(value, 'pageContext');
        const marathonId = value.marathonId === undefined || value.marathonId === null || value.marathonId === ''
            ? null
            : String(value.marathonId).trim();
        return Object.freeze({
            marathonId: marathonId || null,
            marathonName: normalizeOptionalString(value.marathonName, 'pageContext.marathonName', 240)
        });
    }

    function normalizeCounts(value = {}) {
        assertPlainObject(value, 'counts');
        const counts = {};
        for (const key of COUNT_KEYS) counts[key] = normalizeCount(value[key], `counts.${key}`);
        if (counts.successful + counts.failed > counts.attempted) {
            throw validationError('Successful and failed counts cannot exceed attempted count', 'counts');
        }
        if (counts.attempted + counts.notAttempted > counts.eligible) {
            throw validationError('Attempted and not-attempted counts cannot exceed eligible count', 'counts');
        }
        return Object.freeze(counts);
    }

    function normalizeResult(value, index) {
        assertPlainObject(value, `results[${index}]`);
        const attempts = value.attempts === undefined ? 1 : normalizeCount(value.attempts, `results[${index}].attempts`);
        const data = value.data === undefined ? {} : sanitizeJsonValue(value.data, `results[${index}].data`);
        return Object.freeze({
            order: index,
            itemId: normalizeOptionalString(value.itemId, `results[${index}].itemId`, 160),
            label: normalizeNonEmptyString(value.label ?? value.itemId ?? `Item ${index + 1}`, `results[${index}].label`, 500),
            status: normalizeNonEmptyString(value.status, `results[${index}].status`, 80),
            code: normalizeNonEmptyString(value.code, `results[${index}].code`, 120),
            message: normalizeNonEmptyString(value.message, `results[${index}].message`, 1000),
            attempts,
            data: Object.freeze(data)
        });
    }

    function fallbackExecutionId(now, operationType) {
        const random = Math.random().toString(36).slice(2, 10);
        return `${operationType}-${now.getTime().toString(36)}-${random}`;
    }

    function buildExecutionRecord(input, options = {}) {
        assertPlainObject(input, 'record');
        const now = options.now instanceof Date ? options.now : new Date(options.now || Date.now());
        const operationType = normalizeNonEmptyString(input.operationType, 'operationType', 120);
        const cryptoApi = options.cryptoApi;
        const generatedId = typeof cryptoApi?.randomUUID === 'function'
            ? cryptoApi.randomUUID()
            : fallbackExecutionId(now, operationType);
        const id = normalizeNonEmptyString(input.id || generatedId, 'id', 200);
        const status = normalizeNonEmptyString(input.status, 'status', 80);
        if (!TERMINAL_STATUSES.includes(status)) throw validationError('Unsupported terminal status', 'status');
        const startedAt = normalizeIsoTimestamp(input.startedAt, 'startedAt');
        const completedAt = normalizeIsoTimestamp(input.completedAt ?? now, 'completedAt');
        if (new Date(completedAt).getTime() < new Date(startedAt).getTime()) {
            throw validationError('Completion timestamp cannot precede start timestamp', 'completedAt');
        }
        const results = Array.isArray(input.results)
            ? input.results.map(normalizeResult)
            : (() => { throw validationError('Expected an array', 'results'); })();
        const record = {
            schemaVersion: EXECUTION_RECORD_SCHEMA_VERSION,
            id,
            operationType,
            startedAt,
            completedAt,
            status,
            pageContext: normalizePageContext(input.pageContext || {}),
            counts: normalizeCounts(input.counts || {}),
            results: Object.freeze(results),
            message: normalizeOptionalString(input.message, 'message', 1000)
        };
        validateExecutionRecord(record);
        return Object.freeze(record);
    }

    function validateExecutionRecord(record) {
        assertPlainObject(record, 'record');
        if (record.schemaVersion !== EXECUTION_RECORD_SCHEMA_VERSION) {
            throw validationError('Unsupported execution record schema version', 'schemaVersion');
        }
        normalizeNonEmptyString(record.id, 'id', 200);
        normalizeNonEmptyString(record.operationType, 'operationType', 120);
        normalizeIsoTimestamp(record.startedAt, 'startedAt');
        normalizeIsoTimestamp(record.completedAt, 'completedAt');
        if (!TERMINAL_STATUSES.includes(record.status)) throw validationError('Unsupported terminal status', 'status');
        normalizePageContext(record.pageContext || {});
        normalizeCounts(record.counts || {});
        if (!Array.isArray(record.results)) throw validationError('Expected an array', 'results');
        record.results.forEach((result, index) => normalizeResult(result, index));
        sanitizeJsonValue(record, 'record');
        return true;
    }

    function cloneExecutionRecord(record) {
        validateExecutionRecord(record);
        return JSON.parse(JSON.stringify(record));
    }

    return Object.freeze({
        EXECUTION_RECORD_SCHEMA_VERSION,
        TERMINAL_STATUSES,
        COUNT_KEYS,
        buildExecutionRecord,
        validateExecutionRecord,
        cloneExecutionRecord,
        sanitizeJsonValue
    });
});
