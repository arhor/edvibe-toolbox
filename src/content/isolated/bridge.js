import {
    EXPORT_STATES,
    POPUP_COMMANDS,
    STORAGE_ACTIONS,
    createExportStatusMessage,
    createMainCommandMessage,
    createRuntimeExportStatusMessage,
    createStorageResponse,
    getCommandRoute,
    isExportStatusMessage,
    isPopupCommandMessage,
    isStorageRequestMessage
} from '#src/shared/messaging/index.js';

function initializeIsolatedBridge(options = {}) {
    const windowApi = options.windowApi || globalThis.window;
    const chromeApi = options.chromeApi || globalThis.chrome;
    const logger = options.logger || { log() {} };

    if (!windowApi?.addEventListener || !windowApi?.postMessage) {
        throw new TypeError('Window messaging APIs are required');
    }
    if (!chromeApi?.runtime?.onMessage || !chromeApi?.storage?.local) {
        throw new TypeError('Chrome runtime and storage APIs are required');
    }

    logger.log('Script successfully injected and initialized.');

    chromeApi.storage.local.set({ exportInProgress: false }, () => {
        logger.log('Reset stale export state for the loaded page.');
    });

    const onWindowMessage = (event) => {
        if (event.source !== windowApi) {
            return;
        }
        if (isExportStatusMessage(event.data)) {
            relayExportStatus(event.data);
        } else if (isStorageRequestMessage(event.data)) {
            void handleStorageRequest(event.data);
        }
    };

    const onRuntimeMessage = (message, _sender, sendResponse) => {
        logger.log('Incoming message received:', message);
        if (!isPopupCommandMessage(message)) {
            sendResponse({ status: 'ignored' });
            return true;
        }

        const route = getCommandRoute(message.action);
        if (message.action === POPUP_COMMANDS.START_EXPORT) {
            relayExportStatus(createExportStatusMessage(EXPORT_STATES.STARTED));
        }
        windowApi.postMessage(createMainCommandMessage(message.action), '*');
        sendResponse({ status: 'success', info: route.info });
        return true;
    };

    windowApi.addEventListener('message', onWindowMessage);
    chromeApi.runtime.onMessage.addListener(onRuntimeMessage);

    function relayExportStatus(payload) {
        if (!isExportStatusMessage(payload)) {
            return;
        }
        const isActive = payload.state === EXPORT_STATES.STARTED;
        chromeApi.storage.local.set({ exportInProgress: isActive }, () => {
            chromeApi.runtime.sendMessage(createRuntimeExportStatusMessage(
                payload.state,
                payload.message || ''
            ));
        });
    }

    async function handleStorageRequest(request) {
        try {
            let value;
            if (request.action === STORAGE_ACTIONS.GET) {
                const values = await getLocalStorage(request.key);
                value = values[request.key];
            } else {
                await setLocalStorage({ [request.key]: request.value });
                value = request.value;
            }
            windowApi.postMessage(createStorageResponse({
                requestId: request.requestId,
                ok: true,
                value
            }), '*');
        } catch (error) {
            windowApi.postMessage(createStorageResponse({
                requestId: request.requestId,
                ok: false,
                error: error.message || 'Storage request failed'
            }), '*');
        }
    }

    function getLocalStorage(key) {
        return new Promise((resolve, reject) => {
            chromeApi.storage.local.get(key, (values) => {
                if (chromeApi.runtime.lastError) {
                    reject(new Error(chromeApi.runtime.lastError.message));
                } else {
                    resolve(values || {});
                }
            });
        });
    }

    function setLocalStorage(values) {
        return new Promise((resolve, reject) => {
            chromeApi.storage.local.set(values, () => {
                if (chromeApi.runtime.lastError) {
                    reject(new Error(chromeApi.runtime.lastError.message));
                } else {
                    resolve();
                }
            });
        });
    }

    return Object.freeze({
        dispose() {
            windowApi.removeEventListener?.('message', onWindowMessage);
            chromeApi.runtime.onMessage.removeListener?.(onRuntimeMessage);
        }
    });
}

export { initializeIsolatedBridge };
