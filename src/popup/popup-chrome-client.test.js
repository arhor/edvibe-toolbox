import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { POPUP_COMMANDS } from '../shared/message-protocol.js';
import { createPopupChromeClient } from './popup-chrome-client.js';

function createChromeApi() {
    const listeners = new Set();
    const chromeApi = {
        tabs: {
            query: async () => [{ id: 7, url: 'https://app.edvibe.com/marathon/99' }],
            sendMessage: (_tabId, _message, callback) => callback({ ok: true })
        },
        storage: {
            local: {
                get: async () => ({ exportInProgress: true })
            }
        },
        runtime: {
            lastError: null,
            onMessage: {
                addListener: (listener) => listeners.add(listener),
                removeListener: (listener) => listeners.delete(listener)
            }
        }
    };
    return { chromeApi, listeners };
}

describe('createPopupChromeClient', () => {
    describe('context loading', () => {
        test('loads page and persisted export context', async () => {
            // Given
            const { chromeApi } = createChromeApi();
            const client = createPopupChromeClient(chromeApi);

            // When
            const pageContext = await client.getPageContext();
            const exportInProgress = await client.getExportInProgress();

            // Then
            assert.deepEqual(pageContext, {
                type: 'marathon',
                marathonId: '99',
                tabId: 7
            });
            assert.equal(exportInProgress, true);
        });
    });

    describe('sendCommand', () => {
        test('awaits the Chrome callback and returns its response', async () => {
            // Given
            const { chromeApi } = createChromeApi();
            let sent;
            chromeApi.tabs.sendMessage = (tabId, message, callback) => {
                sent = { tabId, message };
                callback({ accepted: true });
            };
            const client = createPopupChromeClient(chromeApi);

            // When
            const response = await client.sendCommand(7, POPUP_COMMANDS.OPEN_EXECUTION_HISTORY);

            // Then
            assert.deepEqual(response, { accepted: true });
            assert.deepEqual(sent, {
                tabId: 7,
                message: { action: POPUP_COMMANDS.OPEN_EXECUTION_HISTORY }
            });
        });

        test('rejects unsupported commands and runtime delivery errors', async () => {
            // Given
            const { chromeApi } = createChromeApi();
            const client = createPopupChromeClient(chromeApi);

            // When
            const unsupportedCommand = client.sendCommand(7, 'UNKNOWN');
            chromeApi.runtime.lastError = { message: 'Receiving end does not exist.' };
            const deliveryFailure = client.sendCommand(7, POPUP_COMMANDS.OPEN_EXECUTION_HISTORY);

            // Then
            await assert.rejects(unsupportedCommand, /Unsupported Toolbox command/);
            await assert.rejects(deliveryFailure, /Receiving end does not exist/);
        });
    });

    describe('subscribeToExportStatus', () => {
        test('filters messages and cleans up listeners', () => {
            // Given
            const { chromeApi, listeners } = createChromeApi();
            const client = createPopupChromeClient(chromeApi);
            const received = [];
            const unsubscribe = client.subscribeToExportStatus((message) => received.push(message));
            const [listener] = listeners;

            // When
            listener({ action: 'OTHER' });
            listener({ action: 'EXPORT_STATUS', state: 'complete', message: '' });
            unsubscribe();

            // Then
            assert.deepEqual(received, [{ action: 'EXPORT_STATUS', state: 'complete', message: '' }]);
            assert.equal(listeners.size, 0);
        });
    });
});
