const DEFAULT_STARTED_AT = '1970-01-01T00:00:00.000Z';

function isoTimestamp(value, fallback = DEFAULT_STARTED_AT) {
    if (typeof value === 'string' && !Number.isNaN(Date.parse(value))) {
        return new Date(value).toISOString();
    }
    if (Number.isFinite(value)) {
        return new Date(value).toISOString();
    }
    return fallback;
}

function diagnosticSource(observation) {
    return observation?.diagnostics || observation || {};
}

function requestAttemptFromObservation(observation, {
    correlationId,
    operationName,
    attemptNumber = 1,
    outcome
} = {}) {
    const source = diagnosticSource(observation);
    const request = source.request || {};
    const response = source.response || {};
    const startedAt = isoTimestamp(request.startedAt);
    const durationMs = Number.isSafeInteger(response.elapsedMs) && response.elapsedMs >= 0
        ? response.elapsedMs : null;
    const completedAt = response.completedAt == null && durationMs == null
        ? null
        : isoTimestamp(response.completedAt ?? (Date.parse(startedAt) + durationMs), startedAt);
    const failed = observation instanceof Error || response.success === false;
    return Object.freeze({
        correlationId: String(correlationId || request.requestId || observation?.requestId || operationName),
        operationName: String(operationName),
        controller: observation?.controller || request.controller || null,
        method: String(observation?.method || request.method || 'UNKNOWN'),
        projectName: observation?.projectName || request.projectName || null,
        requestId: observation?.requestId || request.requestId || response.requestId || null,
        attemptNumber,
        startedAt,
        completedAt,
        durationMs,
        outcome: outcome || (failed ? 'failure' : 'success'),
        transportCode: failed ? observation?.code || null : null,
        serverErrorCode: observation?.serverErrorCode || response.errorCode || null,
        serverErrorMessage: response.serverMessage || null,
        requestSummary: request.value ?? observation?.requestValue ?? null,
        responseSummary: response.value ?? null
    });
}

function diagnosticsFromAttempts(attempts) {
    const values = (Array.isArray(attempts) ? attempts : []).filter(Boolean);
    return values.length === 0 ? undefined : Object.freeze({ requestAttempts: Object.freeze(values) });
}

function diagnosticsFromObservations(observations, options = {}) {
    return diagnosticsFromAttempts((Array.isArray(observations) ? observations : [observations])
        .filter(Boolean)
        .map((observation, index) => requestAttemptFromObservation(observation, {
            ...options,
            attemptNumber: options.attemptNumber ?? index + 1
        })));
}

function historyDiagnostics(value, options = {}) {
    if (!value) {
        return undefined;
    }
    if (Array.isArray(value.requestAttempts)) {
        return diagnosticsFromAttempts(value.requestAttempts);
    }
    if (value.diagnostics && Array.isArray(value.diagnostics.requestAttempts)) {
        return diagnosticsFromAttempts(value.diagnostics.requestAttempts);
    }
    const observations = value.observations || value.attemptsDiagnostics || value.diagnosticObservations;
    return observations ? diagnosticsFromObservations(observations, options) : undefined;
}

export {
    requestAttemptFromObservation,
    diagnosticsFromAttempts,
    diagnosticsFromObservations,
    historyDiagnostics
};
