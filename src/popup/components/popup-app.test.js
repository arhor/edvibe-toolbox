import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, test } from 'node:test';

import { POPUP_COMMANDS } from '#src/shared/messaging/protocol.js';

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

const originalChrome = globalThis.chrome;
const { PopupApp } = await import('#src/popup/components/popup-app.js');

class TestPopupApp extends PopupApp {
    createRenderRoot() {
        return this;
    }

    scheduleUpdate() {
        return Promise.resolve();
    }
}

function connectApp() {
    const app = new TestPopupApp();
    Object.defineProperty(app, 'isConnected', { configurable: true, value: true });
    app.connectedCallback();
    return app;
}

async function waitForInitialization(app) {
    while (!app.initialized) {
        await new Promise((resolve) => setImmediate(resolve));
    }
}

describe('PopupApp Chrome integration', () => {
    let listeners;

    beforeEach(() => {
        const chromeMock = createChromeApi();
        globalThis.chrome = chromeMock.chromeApi;
        listeners = chromeMock.listeners;
    });

    afterEach(() => {
        globalThis.chrome = originalChrome;
    });

    test('loads page and persisted export context when connected', async () => {
        // Given
        const app = connectApp();

        // When
        await waitForInitialization(app);

        // Then
        assert.deepEqual(app.pageContext, {
            type: 'marathon',
            marathonId: '99',
            tabId: 7
        });
        assert.equal(app.exportInProgress, true);
        assert.equal(app.initialized, true);

        app.disconnectedCallback();
    });

    test('sends a tool command and awaits the Chrome callback', async () => {
        // Given
        let sent;
        let completeDelivery;
        chrome.tabs.sendMessage = (tabId, message, callback) => {
            sent = { tabId, message };
            completeDelivery = () => callback({ accepted: true });
        };
        chrome.storage.local.get = async () => ({ exportInProgress: false });
        const app = connectApp();
        await waitForInitialization(app);

        // When
        const execution = app.executeTool('marathon-export');

        // Then
        assert.equal(app.pendingToolId, 'marathon-export');
        assert.equal(app.exportInProgress, true);
        assert.deepEqual(sent, {
            tabId: 7,
            message: { action: POPUP_COMMANDS.START_EXPORT }
        });

        completeDelivery();
        await execution;
        assert.equal(app.pendingToolId, null);

        app.disconnectedCallback();
    });

    test('reports Chrome runtime delivery errors', async () => {
        // Given
        chrome.storage.local.get = async () => ({ exportInProgress: false });
        chrome.runtime.lastError = { message: 'Receiving end does not exist.' };
        const app = connectApp();
        await waitForInitialization(app);

        // When
        await app.executeTool('marathon-export');

        // Then
        assert.equal(app.exportInProgress, false);
        assert.equal(app.pendingToolId, null);
        assert.deepEqual(app.status, {
            message: 'Receiving end does not exist.',
            isError: true
        });

        app.disconnectedCallback();
    });

    test('filters export status messages and removes its listener when disconnected', () => {
        // Given
        const app = connectApp();
        const [listener] = listeners;

        // When
        listener({ action: 'OTHER' });

        // Then
        assert.equal(app.exportStatusObserved, false);
        assert.equal(app.status, null);

        // When
        listener({ action: 'EXPORT_STATUS', state: 'complete', message: '' });

        // Then
        assert.equal(app.exportStatusObserved, true);
        assert.equal(app.exportInProgress, false);
        assert.deepEqual(app.status, {
            message: 'Экспорт завершён.',
            isError: false
        });

        // When
        app.disconnectedCallback();

        // Then
        assert.equal(listeners.size, 0);
    });
});
