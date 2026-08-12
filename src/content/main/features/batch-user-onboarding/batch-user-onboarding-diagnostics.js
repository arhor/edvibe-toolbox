const MAX_DIAGNOSTIC_ATTEMPTS = 3;
const MAX_DIAGNOSTIC_STRING = 256;
const SENSITIVE_DIAGNOSTIC_KEY = /(?:authorization|cookie|token|credential|password|secret|session|email|user|pupil|binary|image|photo|file|blob)/i;

function sanitizeDiagnostics(value, depth = 0, seen = new WeakSet()) {
    if (typeof value === 'string') return value.length <= MAX_DIAGNOSTIC_STRING
        ? value : `${value.slice(0, MAX_DIAGNOSTIC_STRING)}…[truncated]`;
    if (value === null || ['number', 'boolean'].includes(typeof value)) return value;
    if (!value || typeof value !== 'object') return `[${typeof value}]`;
    if (depth >= 4) return '[depth limit]';
    if (seen.has(value)) return '[circular]';
    seen.add(value);
    const output = Array.isArray(value) ? [] : {};
    const entries = Object.entries(value);
    for (const [key, child] of entries.slice(0, 25)) {
        output[key] = SENSITIVE_DIAGNOSTIC_KEY.test(key)
            ? '[redacted]'
            : sanitizeDiagnostics(child, depth + 1, seen);
    }
    if (entries.length > 25) output.__truncatedEntries = entries.length - 25;
    seen.delete(value);
    return output;
}

function diagnosticAttempt(error, operation, attempt) {
    const source = error?.diagnostics || {};
    return sanitizeDiagnostics({
        operation,
        attempt,
        code: error?.code,
        controller: error?.controller || source.request?.controller,
        method: error?.method || source.request?.method,
        requestId: error?.requestId || source.request?.requestId,
        serverErrorCode: error?.serverErrorCode || source.response?.errorCode,
        serverMessage: source.response?.serverMessage,
        startedAt: source.request?.startedAt,
        elapsedMs: source.response?.elapsedMs,
        requestSummary: source.request?.value,
        responseSummary: source.response?.value
    });
}

function diagnosticEnvelope(operation, attempts) {
    return attempts.length ? sanitizeDiagnostics({
        operation,
        attempts: attempts.slice(-MAX_DIAGNOSTIC_ATTEMPTS)
    }) : null;
}

export {
    diagnosticAttempt,
    diagnosticEnvelope,
    sanitizeDiagnostics
};
