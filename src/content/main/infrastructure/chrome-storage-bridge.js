import {
    STORAGE_ACTIONS,
    WINDOW_MESSAGE_TYPES,
    createStorageRequest,
    isStorageResponseMessage
} from '../../../shared/message-protocol.js';

const REQUEST_TYPE = WINDOW_MESSAGE_TYPES.STORAGE_REQUEST;
const RESPONSE_TYPE = WINDOW_MESSAGE_TYPES.STORAGE_RESPONSE;

function createStorageBridge(options = {}) {
    const windowApi = options.window || globalThis.window;
    const cryptoApi = options.cryptoApi || globalThis.crypto;
    const timeoutMs = options.timeoutMs || 5000;
    if (!windowApi?.postMessage || !windowApi?.addEventListener) throw new TypeError('Window messaging APIs are required');
    const pending = new Map();
    const onMessage = (event) => {
        if (event.source !== windowApi || !isStorageResponseMessage(event.data)) return;
        const request = pending.get(event.data.requestId);
        if (!request) return;
        pending.delete(event.data.requestId);
        clearTimeout(request.timer);
        if (event.data.ok) request.resolve(event.data.value);
        else request.reject(new Error(event.data.error || 'Storage request failed'));
    };
    windowApi.addEventListener('message', onMessage);

    function request(action, key, value) {
        const requestId = typeof cryptoApi?.randomUUID === 'function'
            ? cryptoApi.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        let message;
        try {
            message = createStorageRequest({ requestId, action, key, value });
        } catch (error) {
            return Promise.reject(error);
        }
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                pending.delete(requestId);
                reject(new Error('Storage request timed out'));
            }, timeoutMs);
            pending.set(requestId, { resolve, reject, timer });
            windowApi.postMessage(message, '*');
        });
    }

    return Object.freeze({
        get(key) { return request(STORAGE_ACTIONS.GET, key); },
        set(key, value) { return request(STORAGE_ACTIONS.SET, key, value); },
        dispose() {
            windowApi.removeEventListener('message', onMessage);
            for (const value of pending.values()) {
                clearTimeout(value.timer);
                value.reject(new Error('Storage bridge disposed'));
            }
            pending.clear();
        }
    });
}

export { REQUEST_TYPE, RESPONSE_TYPE, createStorageBridge };
