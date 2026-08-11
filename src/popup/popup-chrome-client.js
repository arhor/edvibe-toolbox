import {
    isPopupCommandMessage,
    isRuntimeExportStatusMessage
} from '../shared/message-protocol.js';
import { resolvePageContext } from './popup-model.js';

function createPopupChromeClient(chromeApi) {
    return {
        async getPageContext() {
            const [tab] = await chromeApi.tabs.query({ active: true, currentWindow: true });
            return resolvePageContext(tab);
        },

        async getExportInProgress() {
            const result = await chromeApi.storage.local.get('exportInProgress');
            return Boolean(result.exportInProgress);
        },

        sendCommand(tabId, action) {
            const message = { action };
            if (!isPopupCommandMessage(message)) {
                return Promise.reject(new Error('Unsupported Toolbox command.'));
            }

            return new Promise((resolve, reject) => {
                chromeApi.tabs.sendMessage(tabId, message, (response) => {
                    if (chromeApi.runtime.lastError) {
                        reject(new Error(chromeApi.runtime.lastError.message));
                    } else {
                        resolve(response);
                    }
                });
            });
        },

        subscribeToExportStatus(listener) {
            const handleMessage = (message) => {
                if (isRuntimeExportStatusMessage(message)) {
                    listener(message);
                }
            };
            chromeApi.runtime.onMessage.addListener(handleMessage);
            return () => chromeApi.runtime.onMessage.removeListener(handleMessage);
        }
    };
}

export { createPopupChromeClient };
