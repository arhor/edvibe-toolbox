const EXECUTION_RECORD_SCHEMA_VERSION = 2;
const SUPPORTED_EXECUTION_RECORD_SCHEMA_VERSIONS = new Set([1, 2]);
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
const DIAGNOSTIC_FIELDS = new Set(['requestAttempts']);
const REQUEST_ATTEMPT_FIELDS = new Set([
    'correlationId', 'operationName', 'controller', 'method', 'projectName', 'requestId',
    'attemptNumber', 'startedAt', 'completedAt', 'durationMs', 'outcome', 'transportCode',
    'serverErrorCode', 'serverErrorMessage', 'requestSummary', 'responseSummary'
]);
const DIAGNOSTIC_OUTCOMES = new Set(['success', 'failure', 'timeout', 'cancelled', 'retry']);

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

function assertAllowedFields(value, allowedFields, path) {
    for (const key of Object.keys(value)) {
        if (!allowedFields.has(key)) throw validationError('Unexpected field is not allowed', `${path}.${key}`);
    }
}

function normalizeDiagnosticInteger(value, path, { minimum = 0 } = {}) {
    const number = Number(value);
    if (!Number.isSafeInteger(number) || number < minimum) throw validationError('Expected a safe integer', path);
    return number;
}

function normalizeRequestAttempt(value, index, resultIndex) {
    const path = `results[${resultIndex}].diagnostics.requestAttempts[${index}]`;
    assertPlainObject(value, path);
    assertAllowedFields(value, REQUEST_ATTEMPT_FIELDS, path);
    const startedAt = normalizeIsoTimestamp(value.startedAt, `${path}.startedAt`);
    const completedAt = value.completedAt == null ? null : normalizeIsoTimestamp(value.completedAt, `${path}.completedAt`);
    if (completedAt && new Date(completedAt) < new Date(startedAt)) {
        throw validationError('Completion timestamp cannot precede start timestamp', `${path}.completedAt`);
    }
    const outcome = normalizeNonEmptyString(value.outcome, `${path}.outcome`, 40);
    if (!DIAGNOSTIC_OUTCOMES.has(outcome)) throw validationError('Unsupported diagnostic outcome', `${path}.outcome`);
    const attempt = {
        correlationId: normalizeNonEmptyString(value.correlationId, `${path}.correlationId`, 160),
        operationName: normalizeNonEmptyString(value.operationName, `${path}.operationName`, 160),
        controller: normalizeOptionalString(value.controller, `${path}.controller`, 160),
        method: normalizeNonEmptyString(value.method, `${path}.method`, 20).toUpperCase(),
        projectName: normalizeOptionalString(value.projectName, `${path}.projectName`, 240),
        requestId: normalizeOptionalString(value.requestId, `${path}.requestId`, 160),
        attemptNumber: normalizeDiagnosticInteger(value.attemptNumber, `${path}.attemptNumber`, { minimum: 1 }),
        startedAt,
        completedAt,
        durationMs: value.durationMs == null ? null : normalizeDiagnosticInteger(value.durationMs, `${path}.durationMs`),
        outcome,
        transportCode: normalizeOptionalString(value.transportCode, `${path}.transportCode`, 120),
        serverErrorCode: normalizeOptionalString(value.serverErrorCode, `${path}.serverErrorCode`, 120),
        serverErrorMessage: value.serverErrorMessage == null ? null : String(value.serverErrorMessage),
        requestSummary: normalizeJsonValue(value.requestSummary ?? null, `${path}.requestSummary`),
        responseSummary: normalizeJsonValue(value.responseSummary ?? null, `${path}.responseSummary`)
    };
    return Object.freeze(attempt);
}

function normalizeDiagnostics(value, resultIndex) {
    const path = `results[${resultIndex}].diagnostics`;
    assertPlainObject(value, path);
    assertAllowedFields(value, DIAGNOSTIC_FIELDS, path);
    if (!Array.isArray(value.requestAttempts)) throw validationError('Expected an array', `${path}.requestAttempts`);
    const diagnostics = Object.freeze({
        requestAttempts: Object.freeze(value.requestAttempts.map((attempt, index) =>
            normalizeRequestAttempt(attempt, index, resultIndex)))
    });
    return diagnostics;
}

function normalizeJsonValue(value, path = 'value', seen = new WeakSet()) {
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
            return value.map((entry, index) => normalizeJsonValue(entry, `${path}[${index}]`, seen));
        }
        assertPlainObject(value, path);
        const output = {};
        for (const [key, entry] of Object.entries(value)) {
            output[key] = normalizeJsonValue(entry, `${path}.${key}`, seen);
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
    const data = value.data === undefined ? {} : normalizeJsonValue(value.data, `results[${index}].data`);
    const result = {
        order: index,
        itemId: normalizeOptionalString(value.itemId, `results[${index}].itemId`, 160),
        label: normalizeNonEmptyString(value.label ?? value.itemId ?? `Item ${index + 1}`, `results[${index}].label`, 500),
        status: normalizeNonEmptyString(value.status, `results[${index}].status`, 80),
        code: normalizeNonEmptyString(value.code, `results[${index}].code`, 120),
        message: normalizeNonEmptyString(value.message, `results[${index}].message`, 1000),
        attempts,
        data: Object.freeze(data)
    };
    if (value.diagnostics !== undefined) result.diagnostics = normalizeDiagnostics(value.diagnostics, index);
    return Object.freeze(result);
}

function withoutDiagnostics(record) {
    return {
        ...record,
        results: Array.isArray(record.results)
            ? record.results.map(({ diagnostics: _diagnostics, ...result }) => result)
            : record.results
    };
}

function fallbackExecutionId(now, operationType) {
    const random = Math.random().toString(36).slice(2, 10);
    return `${operationType}-${now.getTime().toString(36)}-${random}`;
}

function buildExecutionRecord(input, options = {}) {
    assertPlainObject(input, 'record');
    normalizeJsonValue(withoutDiagnostics(input), 'record');
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
    if (!SUPPORTED_EXECUTION_RECORD_SCHEMA_VERSIONS.has(record.schemaVersion)) {
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
    normalizeJsonValue(withoutDiagnostics(record), 'record');
    return true;
}

function cloneExecutionRecord(record) {
    validateExecutionRecord(record);
    return JSON.parse(JSON.stringify(record));
}

export {
    EXECUTION_RECORD_SCHEMA_VERSION,
    TERMINAL_STATUSES,
    COUNT_KEYS,
    buildExecutionRecord,
    validateExecutionRecord,
    cloneExecutionRecord
};
