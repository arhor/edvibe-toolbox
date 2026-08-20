const REQUEST_TIMEOUT_MS = 15000;

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

function parseProtocolEnvelope(data) {
    if (typeof data !== 'string') {
        return null;
    }
    try {
        const parsed = JSON.parse(data);
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
            ? parsed
            : null;
    } catch (_) {
        return null;
    }
}

function isEdvibeRequestFrame(data) {
    const envelope = parseProtocolEnvelope(data);
    if (!envelope || envelope.RequestId === undefined || envelope.RequestId === null) {
        return false;
    }

    return typeof envelope.Controller === 'string'
        && typeof envelope.Method === 'string'
        && typeof envelope.ProjectName === 'string';
}

function createWebSocketTransport({
    WebSocketClass = window.WebSocket,
    cryptoApi = window.crypto,
    requestTimeoutMs = REQUEST_TIMEOUT_MS,
    setTimeoutFn = setTimeout,
    clearTimeoutFn = clearTimeout,
    now = Date.now,
    logger: parentLogger,
}) {
    const logger = parentLogger.createChildLogger('Transport');
    let activeSocketRecord = null;
    let latestQualifiedSocketId = 0;
    let nextSocketId = 1;
    const toolboxSendingSockets = new WeakSet();
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
                logger.log('Frame observer failed:', error);
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

    function createRequestDiagnostics(packet, startedAt, valueObject) {
        return {
            controller: packet.Controller,
            method: packet.Method,
            projectName: packet.ProjectName,
            requestId: packet.RequestId,
            startedAt,
            value: valueObject
        };
    }

    function extractServerMessage(data) {
        const candidate = data?.Message ?? data?.ErrorMessage
            ?? data?.Error?.Message ?? data?.Error?.message;
        return candidate;
    }

    function selectSocket(record) {
        if (record.socketId < latestQualifiedSocketId) {
            return;
        }

        latestQualifiedSocketId = record.socketId;
        if (record.socket.readyState !== WebSocketClass.OPEN) {
            return;
        }
        if (activeSocketRecord?.socket !== record.socket) {
            logger.log(`Edvibe WebSocket selected: #${record.socketId}`);
        }
        activeSocketRecord = record;
    }

    function qualifySocket(record, data) {
        if (isEdvibeRequestFrame(data)) {
            selectSocket(record);
        }
    }

    function handleMessage(event, record) {
        let data = null;
        if (typeof event.data === 'string') {
            try {
                data = JSON.parse(event.data);
            } catch (_) {
                // The recorder still needs malformed and non-JSON text frames.
            }
        }

        const pending = data?.RequestId
            ? pendingRequests.get(data.RequestId)
            : null;
        const isToolboxResponse = Boolean(
            pending && pending.socketId === record.socketId
        );
        emitFrame({
            direction: 'inbound',
            socketId: record.socketId,
            data: event.data,
            origin: isToolboxResponse ? 'toolbox' : 'page'
        });

        if (typeof event.data !== 'string') {
            return;
        }
        try {
            if (!data || !pending || pending.socketId !== record.socketId) {
                return;
            }

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
                response.value = data.Value;
            } else {
                response.serverMessage = extractServerMessage(data);
            }
            const diagnostics = { request: pending.diagnostics, response };
            const outcome = data.IsSuccess === true
                ? 'success'
                : `failed (${data.ErrorCode})`;
            logger.log(`← ${pending.controller}.${pending.method} [${data.RequestId}] ${outcome} in ${elapsedMs}ms`);

            if (data.IsSuccess !== true) {
                pending.reject(
                    createTransportError(
                        'SERVER_REJECTED',
                        `${response.className || 'Edvibe'}:${response.method || 'request'} failed with ErrorCode ${response.errorCode ?? 'unknown'}`,
                        {
                            controller: pending.controller,
                            method: pending.method,
                            requestId: data.RequestId,
                            serverErrorCode: response.errorCode,
                            diagnostics
                        }
                    )
                );
                return;
            }

            responseDiagnostics.set(data, diagnostics);
            pending.resolve(data);
        } catch (error) {
            logger.log('Failed parsing WebSocket frame:', error);
        }
    }

    function observeSocket(nativeSocket, url) {
        logger.log('Intercepting WebSocket targeting:', url);
        const socket = nativeSocket;
        const record = {
            socket,
            socketId: nextSocketId
        };
        nextSocketId += 1;
        const nativeSend = socket.send;

        socket.send = function observedSend(data) {
            const origin = toolboxSendingSockets.has(socket) ? 'toolbox' : 'page';
            emitFrame({
                direction: 'outbound',
                socketId: record.socketId,
                data,
                origin
            });
            const result = nativeSend.call(socket, data);
            if (origin === 'page') {
                qualifySocket(record, data);
            }
            return result;
        };
        socket.addEventListener('message', (event) => {
            handleMessage(event, record);
        });
        socket.addEventListener('close', () => {
            if (activeSocketRecord?.socket === socket) {
                activeSocketRecord = null;
                logger.log(`Edvibe WebSocket closed: #${record.socketId}`);
            }
        });
        return socket;
    }

    const InterceptedWebSocket = new Proxy(WebSocketClass, {
        construct(target, args, newTarget) {
            const socket = Reflect.construct(target, args, newTarget);
            return observeSocket(socket, args[0]);
        }
    });

    function install(rootObject) {
        rootObject.WebSocket = InterceptedWebSocket;
    }

    function requireOpenSocket(controller, method) {
        if (
            !activeSocketRecord
            || activeSocketRecord.socket.readyState !== WebSocketClass.OPEN
        ) {
            throw createTransportError(
                'WS_UNAVAILABLE',
                'Active Edvibe WebSocket connection is missing. Please reload the Edvibe tab context.',
                { controller, method }
            );
        }

        return activeSocketRecord;
    }

    function getConnectionState() {
        return {
            isOpen: Boolean(
                activeSocketRecord
                && activeSocketRecord.socket.readyState === WebSocketClass.OPEN
            )
        };
    }

    function sendRequest(controller, method, projectName, valueObject) {
        return new Promise((resolve, reject) => {
            let socketRecord;
            try {
                socketRecord = requireOpenSocket(controller, method);
            } catch (error) {
                logger.log('No active Edvibe WebSocket connection.');
                reject(error);
                return;
            }

            const packet = createPacket(controller, method, projectName, valueObject);
            const startedAt = now();
            const diagnostics = createRequestDiagnostics(packet, startedAt, valueObject);
            const timeoutId = setTimeoutFn(() => {
                pendingRequests.delete(packet.RequestId);
                logger.log(`✕ ${controller}.${method} [${packet.RequestId}] timed out after ${requestTimeoutMs}ms`);
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
                socketId: socketRecord.socketId,
                startedAt,
                requestValue: diagnostics.value,
                diagnostics
            });
            logger.log(`→ ${controller}.${method} [${packet.RequestId}]`);

            try {
                toolboxSendingSockets.add(socketRecord.socket);
                try {
                    socketRecord.socket.send(JSON.stringify(packet));
                } finally {
                    toolboxSendingSockets.delete(socketRecord.socket);
                }
            } catch (error) {
                clearTimeoutFn(timeoutId);
                pendingRequests.delete(packet.RequestId);
                logger.log(`✕ ${controller}.${method} [${packet.RequestId}] send failed: ${error.message}`);
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
        const socketRecord = requireOpenSocket(controller, method);
        const packet = createPacket(controller, method, projectName, valueObject);
        logger.log(`→ ${controller}.${method} [${packet.RequestId}] (no response expected)`);
        toolboxSendingSockets.add(socketRecord.socket);
        try {
            socketRecord.socket.send(JSON.stringify(packet));
        } finally {
            toolboxSendingSockets.delete(socketRecord.socket);
        }
    }

    install(window);

    return {
        install,
        sendRequest,
        sendWithoutResponse,
        subscribeFrames,
        getConnectionState,
        getResponseDiagnostics
    };
}

export { createWebSocketTransport };
