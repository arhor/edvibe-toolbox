const REQUEST_TIMEOUT_MS = 15000;
const DIAGNOSTIC_LIMITS = Object.freeze({
    maxDepth: 4,
    maxEntries: 25,
    maxStringLength: 256
});
const SENSITIVE_KEY_PATTERN = /(?:authorization|cookie|token|credential|password|secret|session(?:id)?|email|userdetails?|pupildetails?|binary|image|photo|avatar|file|blob)/i;

function sanitizeDiagnosticValue(value, depth = 0, seen = new WeakSet()) {
    if (typeof value === 'string') {
        return value.length <= DIAGNOSTIC_LIMITS.maxStringLength
            ? value
            : `${value.slice(0, DIAGNOSTIC_LIMITS.maxStringLength)}…[truncated]`;
    }
    if (value === null || typeof value === 'number' || typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'bigint') {
        return `${value}n`;
    }
    if (typeof value !== 'object') {
        return `[${typeof value}]`;
    }
    if (
        (typeof ArrayBuffer !== 'undefined' && (
            value instanceof ArrayBuffer || ArrayBuffer.isView(value)
        ))
        || (typeof Blob !== 'undefined' && value instanceof Blob)
    ) {
        return '[binary data redacted]';
    }
    if (depth >= DIAGNOSTIC_LIMITS.maxDepth) {
        return '[depth limit]';
    }
    if (seen.has(value)) {
        return '[circular]';
    }
    seen.add(value);

    const result = Array.isArray(value) ? [] : {};
    const entries = Object.entries(value);
    for (const [key, child] of entries.slice(0, DIAGNOSTIC_LIMITS.maxEntries)) {
        result[key] = SENSITIVE_KEY_PATTERN.test(key)
            ? '[redacted]'
            : sanitizeDiagnosticValue(child, depth + 1, seen);
    }
    if (entries.length > DIAGNOSTIC_LIMITS.maxEntries) {
        result.__truncatedEntries = entries.length - DIAGNOSTIC_LIMITS.maxEntries;
    }
    seen.delete(value);
    return result;
}

function createTransportError(code, message, details = {}) {
    const error = new Error(message);
    error.code = code;
    for (const key of [
        'controller',
        'method',
        'requestId',
        'serverErrorCode',
        'diagnostics',
        'cause'
    ]) {
        if (details[key] !== undefined) {
            error[key] = details[key];
        }
    }
    return error;
}

function createWebSocketTransport({
    WebSocketClass,
    cryptoApi,
    requestTimeoutMs = REQUEST_TIMEOUT_MS,
    setTimeoutFn = setTimeout,
    clearTimeoutFn = clearTimeout,
    now = Date.now,
    log = () => {}
}) {
    let activeSocket = null;
    let nextSocketId = 1;
    let internalSendDepth = 0;
    const pendingRequests = new Map();
    const responseDiagnostics = new WeakMap();
    const frameObservers = new Set();

    function getByteLength(data) {
        if (typeof data === 'string') {
            if (typeof TextEncoder !== 'undefined') {
                return new TextEncoder().encode(data).byteLength;
            }
            return unescape(encodeURIComponent(data)).length;
        }
        if (typeof Blob !== 'undefined' && data instanceof Blob) {
            return data.size;
        }
        if (typeof ArrayBuffer !== 'undefined') {
            if (data instanceof ArrayBuffer) {
                return data.byteLength;
            }
            if (ArrayBuffer.isView(data)) {
                return data.byteLength;
            }
        }
        return null;
    }

    function getDataType(data) {
        if (typeof data === 'string') {
            return 'text';
        }
        if (typeof Blob !== 'undefined' && data instanceof Blob) {
            return 'blob';
        }
        if (
            typeof ArrayBuffer !== 'undefined'
            && (data instanceof ArrayBuffer || ArrayBuffer.isView(data))
        ) {
            return 'array-buffer';
        }
        return 'other';
    }

    function emitFrame({ direction, socketId, data, origin }) {
        if (frameObservers.size === 0) {
            return;
        }

        const dataType = getDataType(data);
        const frame = {
            direction,
            socketId,
            capturedAt: now(),
            dataType,
            byteLength: getByteLength(data),
            origin
        };
        if (dataType === 'text') {
            frame.data = data;
        }

        for (const observer of [...frameObservers]) {
            try {
                observer(frame);
            } catch (error) {
                log('Frame observer failed:', error);
            }
        }
    }

    function subscribeFrames(observer) {
        if (typeof observer !== 'function') {
            throw new TypeError('Frame observer must be a function.');
        }

        frameObservers.add(observer);
        return () => frameObservers.delete(observer);
    }

    function createPacket(controller, method, projectName, valueObject) {
        return {
            Controller: controller,
            Method: method,
            ProjectName: projectName,
            RequestId: cryptoApi.randomUUID(),
            Value: JSON.stringify(valueObject)
        };
    }

    // Request metadata is retained verbatim, while Value is bounded and sanitized.
    // Emails, user/pupil details, authentication/session fields, and binary data are
    // always summarized or redacted rather than retained in diagnostic envelopes.
    function createRequestDiagnostics(packet, startedAt, valueObject) {
        return {
            controller: packet.Controller,
            method: packet.Method,
            projectName: packet.ProjectName,
            requestId: packet.RequestId,
            startedAt,
            value: sanitizeDiagnosticValue(valueObject)
        };
    }

    function extractServerMessage(data) {
        const candidate = data?.Message ?? data?.ErrorMessage
            ?? data?.Error?.Message ?? data?.Error?.message;
        return typeof candidate === 'string'
            ? sanitizeDiagnosticValue(candidate)
            : undefined;
    }

    function handleMessage(event, socketId) {
        let data = null;
        if (typeof event.data === 'string') {
            try {
                data = JSON.parse(event.data);
            } catch (_) {
                // The recorder still needs malformed and non-JSON text frames.
            }
        }

        const isToolboxResponse = Boolean(
            data?.RequestId && pendingRequests.has(data.RequestId)
        );
        emitFrame({
            direction: 'inbound',
            socketId,
            data: event.data,
            origin: isToolboxResponse ? 'toolbox' : 'page'
        });

        if (typeof event.data !== 'string') {
            return;
        }
        try {
            if (!data) {
                return;
            }
            if (!data.RequestId || !pendingRequests.has(data.RequestId)) {
                return;
            }

            const pending = pendingRequests.get(data.RequestId);
            pendingRequests.delete(data.RequestId);
            clearTimeoutFn(pending.timeoutId);
            const elapsedMs = now() - pending.startedAt;
            const response = {
                requestId: data.RequestId,
                success: data.IsSuccess === true,
                errorCode: typeof data.ErrorCode === 'string'
                    || typeof data.ErrorCode === 'number'
                    ? data.ErrorCode
                    : null,
                className: typeof data.Class === 'string' ? data.Class : null,
                method: typeof data.Method === 'string' ? data.Method : null,
                elapsedMs
            };
            if (data.IsSuccess === true) {
                response.value = sanitizeDiagnosticValue(data.Value);
            } else {
                response.serverMessage = extractServerMessage(data);
            }
            const diagnostics = { request: pending.diagnostics, response };
            const outcome = data.IsSuccess === true
                ? 'success'
                : `failed (${data.ErrorCode})`;
            log(
                `← ${pending.controller}.${pending.method} `
                + `[${data.RequestId}] ${outcome} in ${elapsedMs}ms`
            );

            if (data.IsSuccess !== true) {
                pending.reject(createTransportError('SERVER_REJECTED',
                    `${response.className || 'Edvibe'}:${response.method || 'request'} `
                    + `failed with ErrorCode ${response.errorCode ?? 'unknown'}`,
                    {
                        controller: pending.controller,
                        method: pending.method,
                        requestId: data.RequestId,
                        serverErrorCode: response.errorCode,
                        diagnostics
                    }
                ));
                return;
            }

            responseDiagnostics.set(data, diagnostics);
            pending.resolve(data);
        } catch (error) {
            log('Failed parsing WebSocket frame:', error);
        }
    }

    function install(rootObject) {
        function InterceptedWebSocket(url, protocols) {
            log('Intercepting WebSocket targeting:', url);
            const socket = protocols === undefined
                ? new WebSocketClass(url)
                : new WebSocketClass(url, protocols);
            const socketId = nextSocketId;
            nextSocketId += 1;
            activeSocket = socket;
            const nativeSend = socket.send;

            socket.send = function observedSend(data) {
                emitFrame({
                    direction: 'outbound',
                    socketId,
                    data,
                    origin: internalSendDepth > 0 ? 'toolbox' : 'page'
                });
                return nativeSend.call(socket, data);
            };
            socket.addEventListener('message', (event) => {
                handleMessage(event, socketId);
            });
            return socket;
        }

        InterceptedWebSocket.prototype = WebSocketClass.prototype;
        rootObject.WebSocket = InterceptedWebSocket;
    }

    function requireOpenSocket(controller, method) {
        if (!activeSocket || activeSocket.readyState !== WebSocketClass.OPEN) {
            throw createTransportError('WS_UNAVAILABLE',
                'Active WebSocket connection is missing. '
                + 'Please reload the Edvibe tab context.',
                { controller, method }
            );
        }

        return activeSocket;
    }

    function getConnectionState() {
        return {
            isOpen: Boolean(
                activeSocket && activeSocket.readyState === WebSocketClass.OPEN
            )
        };
    }

    function sendRequest(controller, method, projectName, valueObject) {
        return new Promise((resolve, reject) => {
            let socket;
            try {
                socket = requireOpenSocket(controller, method);
            } catch (error) {
                log('No active WebSocket connection.');
                reject(error);
                return;
            }

            const packet = createPacket(controller, method, projectName, valueObject);
            const startedAt = now();
            const diagnostics = createRequestDiagnostics(packet, startedAt, valueObject);
            const timeoutId = setTimeoutFn(() => {
                pendingRequests.delete(packet.RequestId);
                log(
                    `✕ ${controller}.${method} `
                    + `[${packet.RequestId}] timed out after ${requestTimeoutMs}ms`
                );
                reject(createTransportError(
                    'REQUEST_TIMEOUT',
                    `${controller}:${method} timed out after ${requestTimeoutMs}ms.`,
                    {
                        controller,
                        method,
                        requestId: packet.RequestId,
                        diagnostics: { request: diagnostics }
                    }
                ));
            }, requestTimeoutMs);

            pendingRequests.set(packet.RequestId, {
                resolve,
                reject,
                timeoutId,
                controller,
                method,
                projectName,
                requestId: packet.RequestId,
                startedAt,
                requestValue: diagnostics.value,
                diagnostics
            });
            log(
                `→ ${controller}.${method} `
                + `[${packet.RequestId}]`
            );

            try {
                internalSendDepth += 1;
                try {
                    socket.send(JSON.stringify(packet));
                } finally {
                    internalSendDepth -= 1;
                }
            } catch (error) {
                clearTimeoutFn(timeoutId);
                pendingRequests.delete(packet.RequestId);
                log(
                    `✕ ${controller}.${method} `
                    + `[${packet.RequestId}] send failed: ${error.message}`
                );
                reject(createTransportError('SEND_FAILED', error.message, {
                    controller,
                    method,
                    requestId: packet.RequestId,
                    diagnostics: { request: diagnostics },
                    cause: error
                }));
            }
        });
    }

    function getResponseDiagnostics(response) {
        return response && typeof response === 'object'
            ? responseDiagnostics.get(response)
            : undefined;
    }

    function sendWithoutResponse(controller, method, projectName, valueObject) {
        const socket = requireOpenSocket(controller, method);
        const packet = createPacket(controller, method, projectName, valueObject);
        log(
            `→ ${controller}.${method} `
            + `[${packet.RequestId}] (no response expected)`
        );
        internalSendDepth += 1;
        try {
            socket.send(JSON.stringify(packet));
        } finally {
            internalSendDepth -= 1;
        }
    }

    return {
        install,
        sendRequest,
        sendWithoutResponse,
        subscribeFrames,
        getConnectionState,
        getResponseDiagnostics
    };
}

export { createWebSocketTransport, sanitizeDiagnosticValue };
