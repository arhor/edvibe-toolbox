(function initializeWebSocketTransport(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.EdVibeWebSocketTransport = factory();
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createWebSocketTransportModule() {
    'use strict';

    const REQUEST_TIMEOUT_MS = 15000;

    function createWebSocketTransport({
        WebSocketClass,
        cryptoApi,
        requestTimeoutMs = REQUEST_TIMEOUT_MS,
        setTimeoutFn = setTimeout,
        clearTimeoutFn = clearTimeout,
        log = () => {}
    }) {
        let activeSocket = null;
        const pendingRequests = new Map();

        function createPacket(controller, method, projectName, valueObject) {
            return {
                Controller: controller,
                Method: method,
                ProjectName: projectName,
                RequestId: cryptoApi.randomUUID(),
                Value: JSON.stringify(valueObject)
            };
        }

        function handleMessage(event) {
            if (typeof event.data !== 'string') return;

            try {
                const data = JSON.parse(event.data);
                if (!data.RequestId || !pendingRequests.has(data.RequestId)) return;

                const pending = pendingRequests.get(data.RequestId);
                pendingRequests.delete(data.RequestId);
                clearTimeoutFn(pending.timeoutId);
                const elapsedMs = Date.now() - pending.startedAt;
                const outcome = data.IsSuccess === true
                    ? 'success'
                    : `failed (${data.ErrorCode})`;
                log(
                    `← ${pending.controller}.${pending.method} `
                    + `[${data.RequestId}] ${outcome} in ${elapsedMs}ms`
                );

                if (data.IsSuccess !== true) {
                    pending.reject(new Error(
                        `${data.Class || 'Edvibe'}:${data.Method || 'request'} `
                        + `failed with ErrorCode ${data.ErrorCode}`
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
                activeSocket = socket;
                socket.addEventListener('message', handleMessage);
                return socket;
            }

            InterceptedWebSocket.prototype = WebSocketClass.prototype;
            rootObject.WebSocket = InterceptedWebSocket;
        }

        function requireOpenSocket() {
            if (!activeSocket || activeSocket.readyState !== WebSocketClass.OPEN) {
                throw new Error(
                    'Active WebSocket connection is missing. '
                    + 'Please reload the Edvibe tab context.'
                );
            }

            return activeSocket;
        }

        function sendRequest(controller, method, projectName, valueObject) {
            return new Promise((resolve, reject) => {
                let socket;
                try {
                    socket = requireOpenSocket();
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
                    reject(new Error(
                        `${controller}:${method} timed out after ${requestTimeoutMs}ms.`
                    ));
                }, requestTimeoutMs);

                pendingRequests.set(packet.RequestId, {
                    resolve,
                    reject,
                    timeoutId,
                    controller,
                    method,
                    startedAt: Date.now()
                });
                log(
                    `→ ${controller}.${method} `
                    + `[${packet.RequestId}]`
                );

                try {
                    socket.send(JSON.stringify(packet));
                } catch (error) {
                    clearTimeoutFn(timeoutId);
                    pendingRequests.delete(packet.RequestId);
                    log(
                        `✕ ${controller}.${method} `
                        + `[${packet.RequestId}] send failed: ${error.message}`
                    );
                    reject(error);
                }
            });
        }

        function sendWithoutResponse(controller, method, projectName, valueObject) {
            const socket = requireOpenSocket();
            const packet = createPacket(controller, method, projectName, valueObject);
            log(
                `→ ${controller}.${method} `
                + `[${packet.RequestId}] (no response expected)`
            );
            socket.send(JSON.stringify(packet));
        }

        return { install, sendRequest, sendWithoutResponse };
    }

    return { createWebSocketTransport };
});
