import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { initializeIsolatedBridge } from '#src/content/isolated/bridge.js';
import {
    EXPORT_STATES,
    POPUP_COMMANDS,
    STORAGE_ACTIONS,
    STORAGE_KEYS,
    createExportStatusMessage,
    createMainCommandMessage,
    createRuntimeExportStatusMessage,
    createStorageRequest,
    createStorageResponse
} from '#src/shared/messaging/protocol.js';

function createHarness(initialStorage = {}) {
    const windowListeners = new Set();
    const runtimeListeners = new Set();
    const postedMessages = [];
    const runtimeMessages = [];
    const storageValues = { ...initialStorage };
    const storageWrites = [];

    const windowApi = {
        addEventListener(type, listener) {
            if (type === 'message') {
                windowListeners.add(listener);
            }
        },
        removeEventListener(type, listener) {
            if (type === 'message') {
                windowListeners.delete(listener);
            }
        },
        postMessage(message, targetOrigin) {
            postedMessages.push({ message, targetOrigin });
        }
    };
    const chromeApi = {
        runtime: {
            lastError: null,
            onMessage: {
                addListener(listener) {
                    runtimeListeners.add(listener);
                },
                removeListener(listener) {
                    runtimeListeners.delete(listener);
                }
            },
            sendMessage(message) {
                runtimeMessages.push(message);
            }
        },
        storage: {
            local: {
                get(key, callback) {
                    callback({ [key]: storageValues[key] });
                },
                set(values, callback) {
                    storageWrites.push(values);
                    Object.assign(storageValues, values);
                    callback?.();
                }
            }
        }
    };

    return {
        chromeApi,
        postedMessages,
        runtimeMessages,
        storageValues,
        storageWrites,
        windowApi,
        dispatchRuntime(message) {
            const responses = [];
            const results = [...runtimeListeners].map((listener) => listener(
                message,
                {},
                (response) => responses.push(response)
            ));
            return { responses, results };
        },
        dispatchWindow(data, source = windowApi) {
            for (const listener of windowListeners) {
                listener({ data, source });
            }
        },
        listenerCounts() {
            return { runtime: runtimeListeners.size, window: windowListeners.size };
        }
    };
}

function flushPromises() {
    return new Promise((resolve) => setImmediate(resolve));
}

describe('initializeIsolatedBridge', () => {
    test('initializes export state and disposes every listener', () => {
        // Given
        const harness = createHarness({ exportInProgress: true });
        const logs = [];

        // When
        const bridge = initializeIsolatedBridge({
            windowApi: harness.windowApi,
            chromeApi: harness.chromeApi,
            logger: { log: (...args) => logs.push(args) }
        });

        // Then
        assert.deepEqual(harness.listenerCounts(), { runtime: 1, window: 1 });
        assert.equal(harness.storageValues.exportInProgress, false);
        assert.deepEqual(harness.storageWrites, [{ exportInProgress: false }]);
        assert.deepEqual(logs.map(([message]) => message), [
            'Script successfully injected and initialized.',
            'Reset stale export state for the loaded page.'
        ]);

        // When
        bridge.dispose();

        // Then
        assert.deepEqual(harness.listenerCounts(), { runtime: 0, window: 0 });
    });

    test('routes valid popup commands to MAIN and responds to the popup', () => {
        // Given
        const harness = createHarness();
        initializeIsolatedBridge(harness);

        // When
        const result = harness.dispatchRuntime({ action: POPUP_COMMANDS.OPEN_LESSON_RESET });

        // Then
        assert.deepEqual(harness.postedMessages, [{
            message: createMainCommandMessage(POPUP_COMMANDS.OPEN_LESSON_RESET),
            targetOrigin: '*'
        }]);
        assert.deepEqual(result.responses, [{
            status: 'success',
            info: 'Lesson reset workflow opened.'
        }]);
        assert.deepEqual(result.results, [true]);
    });

    test('marks export active before routing the start command', () => {
        // Given
        const harness = createHarness();
        initializeIsolatedBridge(harness);

        // When
        harness.dispatchRuntime({ action: POPUP_COMMANDS.START_EXPORT });

        // Then
        assert.equal(harness.storageValues.exportInProgress, true);
        assert.deepEqual(harness.runtimeMessages, [
            createRuntimeExportStatusMessage(EXPORT_STATES.STARTED)
        ]);
        assert.deepEqual(harness.postedMessages[0], {
            message: createMainCommandMessage(POPUP_COMMANDS.START_EXPORT),
            targetOrigin: '*'
        });
    });

    test('relays valid MAIN export status and ignores invalid window messages', () => {
        // Given
        const harness = createHarness();
        initializeIsolatedBridge(harness);

        // When
        harness.dispatchWindow(createExportStatusMessage(EXPORT_STATES.ERROR, 'Network failed'));
        harness.dispatchWindow({ type: 'EDVIBE_TOOLBOX_EXPORT_STATUS', state: 'unknown' });
        harness.dispatchWindow(
            createExportStatusMessage(EXPORT_STATES.STARTED),
            { differentWindow: true }
        );

        // Then
        assert.equal(harness.storageValues.exportInProgress, false);
        assert.deepEqual(harness.runtimeMessages, [
            createRuntimeExportStatusMessage(EXPORT_STATES.ERROR, 'Network failed')
        ]);
    });

    test('handles storage get and set requests from MAIN', async () => {
        // Given
        const preferences = { retentionDays: 30 };
        const harness = createHarness({
            [STORAGE_KEYS.EXECUTION_HISTORY_PREFERENCES]: preferences
        });
        initializeIsolatedBridge(harness);

        // When
        harness.dispatchWindow(createStorageRequest({
            requestId: 'get-preferences',
            action: STORAGE_ACTIONS.GET,
            key: STORAGE_KEYS.EXECUTION_HISTORY_PREFERENCES
        }));
        harness.dispatchWindow(createStorageRequest({
            requestId: 'set-preferences',
            action: STORAGE_ACTIONS.SET,
            key: STORAGE_KEYS.EXECUTION_HISTORY_PREFERENCES,
            value: { retentionDays: 60 }
        }));
        await flushPromises();

        // Then
        assert.deepEqual(harness.postedMessages, [
            {
                message: createStorageResponse({
                    requestId: 'get-preferences',
                    ok: true,
                    value: preferences
                }),
                targetOrigin: '*'
            },
            {
                message: createStorageResponse({
                    requestId: 'set-preferences',
                    ok: true,
                    value: { retentionDays: 60 }
                }),
                targetOrigin: '*'
            }
        ]);
    });

    test('returns storage failures to MAIN', async () => {
        // Given
        const harness = createHarness();
        harness.chromeApi.storage.local.get = (_key, callback) => {
            harness.chromeApi.runtime.lastError = { message: 'Storage unavailable' };
            callback({});
            harness.chromeApi.runtime.lastError = null;
        };
        initializeIsolatedBridge(harness);

        // When
        harness.dispatchWindow(createStorageRequest({
            requestId: 'failed-get',
            action: STORAGE_ACTIONS.GET,
            key: STORAGE_KEYS.EXECUTION_HISTORY_PREFERENCES
        }));
        await flushPromises();

        // Then
        assert.deepEqual(harness.postedMessages, [{
            message: createStorageResponse({
                requestId: 'failed-get',
                ok: false,
                error: 'Storage unavailable'
            }),
            targetOrigin: '*'
        }]);
    });

    test('rejects invalid runtime messages without crossing the bridge', () => {
        // Given
        const harness = createHarness();
        initializeIsolatedBridge(harness);

        // When
        const result = harness.dispatchRuntime({ action: 'UNKNOWN_COMMAND' });

        // Then
        assert.deepEqual(harness.postedMessages, []);
        assert.deepEqual(result.responses, [{ status: 'ignored' }]);
        assert.deepEqual(result.results, [true]);
    });

    test('validates required injected browser APIs', () => {
        // When / Then
        assert.throws(
            () => initializeIsolatedBridge({ windowApi: {}, chromeApi: {} }),
            /Window messaging APIs are required/
        );
        assert.throws(
            () => initializeIsolatedBridge({
                windowApi: { addEventListener() {}, postMessage() {} },
                chromeApi: {}
            }),
            /Chrome runtime and storage APIs are required/
        );
    });
});
