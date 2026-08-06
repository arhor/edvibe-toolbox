const test = require('node:test');
const assert = require('node:assert/strict');

const { REQUEST_TYPE, RESPONSE_TYPE, createStorageBridge } = require('./chrome-storage-bridge.js');

function createWindowHarness() {
    const listeners = new Set();
    const windowApi = {
        addEventListener(type, listener) {
            if (type === 'message') listeners.add(listener);
        },
        removeEventListener(type, listener) {
            if (type === 'message') listeners.delete(listener);
        },
        postMessage(data) {
            queueMicrotask(() => {
                for (const listener of listeners) listener({ source: windowApi, data });
            });
        }
    };
    return { windowApi, listeners };
}

test('bridges get and set requests through correlated window messages', async () => {
    const { windowApi } = createWindowHarness();
    const values = new Map([['executionHistoryPreferences', { maxCount: 100 }]]);
    windowApi.addEventListener('message', (event) => {
        if (event.data?.type !== REQUEST_TYPE) return;
        const { requestId, action, key, value } = event.data;
        if (action === 'set') values.set(key, value);
        windowApi.postMessage({
            type: RESPONSE_TYPE,
            requestId,
            ok: true,
            value: values.get(key)
        }, '*');
    });
    const bridge = createStorageBridge({
        window: windowApi,
        cryptoApi: { randomUUID: () => 'request-1' },
        timeoutMs: 100
    });

    assert.deepEqual(await bridge.get('executionHistoryPreferences'), { maxCount: 100 });
    assert.deepEqual(await bridge.set('executionHistoryPreferences', { maxCount: 50 }), { maxCount: 50 });
    bridge.dispose();
});

test('rejects pending requests when disposed', async () => {
    const { windowApi } = createWindowHarness();
    const bridge = createStorageBridge({ window: windowApi, cryptoApi: { randomUUID: () => 'request-2' }, timeoutMs: 100 });
    const pending = bridge.get('executionHistoryPreferences');
    bridge.dispose();
    await assert.rejects(pending, /disposed/);
});
