function diagnosticAttempt(error, operation, attempt) {
    const source = error?.diagnostics || {};
    return {
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
    };
}

function diagnosticEnvelope(operation, attempts) {
    return attempts.length ? {
        operation,
        attempts
    } : null;
}

export {
    diagnosticAttempt,
    diagnosticEnvelope
};
