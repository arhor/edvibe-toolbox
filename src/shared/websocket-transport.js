const REQUEST_TIMEOUT_MS = 15000;

function createTransportError(code, message, details = {}) {
    const error = new Error(message);
    error.code = code;
    for (const key of [
        'controller',
        'method',
        'requestId',
        'serverErrorCode',
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
            const outcome = data.IsSuccess === true
                ? 'success'
                : `failed (${data.ErrorCode})`;
            log(
                `← ${pending.controller}.${pending.method} `
                + `[${data.RequestId}] ${outcome} in ${elapsedMs}ms`
            );

            if (data.IsSuccess !== true) {
                pending.reject(createTransportError('SERVER_REJECTED',
                    `${data.Class || 'Edvibe'}:${data.Method || 'request'} `
                    + `failed with ErrorCode ${data.ErrorCode}`,
                    {
                        controller: pending.controller,
                        method: pending.method,
                        requestId: data.RequestId,
                        serverErrorCode: data.ErrorCode
                    }
                ));
                return;
            }

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
                        requestId: packet.RequestId
                    }
                ));
            }, requestTimeoutMs);

            pendingRequests.set(packet.RequestId, {
                resolve,
                reject,
                timeoutId,
                controller,
                method,
                startedAt: now()
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
                    cause: error
                }));
            }
        });
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
        getConnectionState
    };
}

export { createWebSocketTransport };
