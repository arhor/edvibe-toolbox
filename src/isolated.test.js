const test = require('node:test');
const assert = require('node:assert/strict');

const { initializeIsolatedBridge } = require('./runtime/isolated.js');
const {
    EXPORT_STATES,
    POPUP_COMMANDS,
    STORAGE_ACTIONS,
    STORAGE_KEYS,
    WINDOW_MESSAGE_TYPES,
    createExportStatusMessage,
    createStorageRequest,
    isRuntimeExportStatusMessage,
    isStorageResponseMessage
} = require('./shared/message-protocol.js');

function createHarness(initialStorage = {}) {
    const windowListeners = new Set();
    const runtimeListeners = new Set();
    const postedMessages = [];
    const runtimeMessages = [];
    const storage = new Map(Object.entries(initialStorage));
    const storageWrites = [];

    const windowApi = {
        addEventListener(type, listener) {
            if (type === 'message') windowListeners.add(listener);
        },
        removeEventListener(type, listener) {
            if (type === 'message') windowListeners.delete(listener);
        },
        postMessage(message) {
            postedMessages.push(message);
        }
    };
    const chromeApi = {
        runtime: {
            lastError: null,
            onMessage: {
                addListener(listener) { runtimeListeners.add(listener); },
                removeListener(listener) { runtimeListeners.delete(listener); }
            },
            sendMessage(message) { runtimeMessages.push(message); }
        },
        storage: {
            local: {
                get(key, callback) {
                    callback({ [key]: storage.get(key) });
                },
                set(values, callback) {
                    storageWrites.push(values);
                    for (const [key, value] of Object.entries(values)) storage.set(key, value);
                    callback?.();
                }
            }
        }
    };

    function emitWindow(message, source = windowApi) {
        for (const listener of windowListeners) listener({ source, data: message });
    }

    function emitRuntime(message) {
        const responses = [];
        for (const listener of runtimeListeners) {
            listener(message, {}, (response) => responses.push(response));
        }
        return responses;
    }

    return {
        chromeApi,
        emitRuntime,
        emitWindow,
        postedMessages,
        runtimeMessages,
        storage,
        storageWrites,
        windowApi
    };
}

test('isolated initialization clears stale export progress', () => {
    const harness = createHarness({ exportInProgress: true });
    const bridge = initializeIsolatedBridge({
        windowApi: harness.windowApi,
        chromeApi: harness.chromeApi
    });

    assert.equal(harness.storage.get('exportInProgress'), false);
    assert.deepEqual(harness.storageWrites[0], { exportInProgress: false });
    bridge.dispose();
});

test('isolated bridge routes only validated popup commands to MAIN', () => {
    const harness = createHarness();
    const bridge = initializeIsolatedBridge({ windowApi: harness.windowApi, chromeApi: harness.chromeApi });

    assert.deepEqual(harness.emitRuntime({ action: 'UNKNOWN_COMMAND' }), [{ status: 'ignored' }]);
    assert.deepEqual(harness.emitRuntime({ action: POPUP_COMMANDS.OPEN_LESSON_RESET, payload: 'extra' }), [{ status: 'ignored' }]);
    assert.equal(harness.postedMessages.length, 0);

    const responses = harness.emitRuntime({ action: POPUP_COMMANDS.OPEN_LESSON_RESET });
    assert.equal(responses[0].status, 'success');
    assert.deepEqual(harness.postedMessages, [{ type: WINDOW_MESSAGE_TYPES.OPEN_LESSON_RESET }]);
    bridge.dispose();
});

test('starting export preserves busy-state relay and posts the centralized MAIN command', () => {
    const harness = createHarness();
    const bridge = initializeIsolatedBridge({ windowApi: harness.windowApi, chromeApi: harness.chromeApi });

    harness.emitRuntime({ action: POPUP_COMMANDS.START_EXPORT });

    assert.equal(harness.storage.get('exportInProgress'), true);
    assert.equal(harness.runtimeMessages.length, 1);
    assert.equal(isRuntimeExportStatusMessage(harness.runtimeMessages[0]), true);
    assert.equal(harness.runtimeMessages[0].state, EXPORT_STATES.STARTED);
    assert.deepEqual(harness.postedMessages, [{ type: WINDOW_MESSAGE_TYPES.START_EXPORT }]);
    bridge.dispose();
});

test('isolated bridge validates export status before relaying it to the extension runtime', () => {
    const harness = createHarness();
    const bridge = initializeIsolatedBridge({ windowApi: harness.windowApi, chromeApi: harness.chromeApi });

    harness.emitWindow({ type: WINDOW_MESSAGE_TYPES.EXPORT_STATUS, state: 'unknown' });
    harness.emitWindow({ ...createExportStatusMessage(EXPORT_STATES.ERROR, 'failed'), internal: true });
    assert.equal(harness.runtimeMessages.length, 0);

    harness.emitWindow(createExportStatusMessage(EXPORT_STATES.ERROR, 'failed'));
    assert.equal(harness.runtimeMessages.length, 1);
    assert.equal(harness.runtimeMessages[0].state, EXPORT_STATES.ERROR);
    assert.equal(harness.storage.get('exportInProgress'), false);
    bridge.dispose();
});

test('isolated storage routing accepts only validated actions and keys', async () => {
    const preferences = { maxCount: 100 };
    const harness = createHarness({ executionHistoryPreferences: preferences });
    const bridge = initializeIsolatedBridge({ windowApi: harness.windowApi, chromeApi: harness.chromeApi });

    harness.emitWindow({
        type: WINDOW_MESSAGE_TYPES.STORAGE_REQUEST,
        requestId: 'invalid-1',
        action: STORAGE_ACTIONS.GET,
        key: 'arbitraryKey'
    });
    await Promise.resolve();
    assert.equal(harness.postedMessages.length, 0);

    harness.emitWindow(createStorageRequest({
        requestId: 'get-1',
        action: STORAGE_ACTIONS.GET,
        key: STORAGE_KEYS.EXECUTION_HISTORY_PREFERENCES
    }));
    await Promise.resolve();
    await Promise.resolve();

    assert.equal(harness.postedMessages.length, 1);
    assert.equal(isStorageResponseMessage(harness.postedMessages[0]), true);
    assert.deepEqual(harness.postedMessages[0].value, preferences);
    bridge.dispose();
});