import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createTelegramWebKAdapter } from '#src/content/main/infrastructure/telegram-web-k-adapter.js';

function getDialogCursor(dialog) {
    return dialog[`index_${dialog.folder_id ?? 0}`];
}

function createCursorRuntime() {
    const calls = [];
    const dialogs = [
        { peerId: -10, top_message: 100, folder_id: 0, index_0: 9000 },
        { peerId: -20, top_message: 200, folder_id: 1, index_1: 7000 },
        { peerId: -30, top_message: 300, folder_id: 0, index_0: 5000 }
    ];
    const dialogsStorage = {
        async getDialogIndex(dialog) {
            const indexKey = `index_${dialog.folder_id ?? 0}`;
            calls.push(['getDialogIndex', dialog.peerId, indexKey]);
            return dialog[indexKey];
        },
        async getDialogs({ limit, offsetIndex }) {
            calls.push(['getDialogs', { limit, offsetIndex }]);
            const cursorStart = offsetIndex === 0
                ? 0
                : dialogs.findIndex((dialog) => getDialogCursor(dialog) < offsetIndex);
            const start = cursorStart < 0 ? dialogs.length : cursorStart;
            const page = dialogs.slice(start, start + limit);
            return {
                count: dialogs.length,
                dialogs: page,
                isEnd: start + page.length >= dialogs.length
            };
        }
    };
    const globalObject = {
        createProxiedManagersForAccount() {
            return { dialogsStorage };
        }
    };
    return { calls, globalObject };
}

test('should follow Telegram dialog index cursors instead of treating offsets as positions', async () => {
    const runtime = createCursorRuntime();
    const adapter = createTelegramWebKAdapter({
        globalObject: runtime.globalObject,
        location: new URL('https://web.telegram.org/k/')
    });

    const firstPage = await adapter.listDialogs({ limit: 2, offset: 0 });
    const secondPage = await adapter.listDialogs({ limit: 2, offset: firstPage.nextOffset });

    assert.deepEqual(firstPage, {
        count: 3,
        items: [
            { peerId: -10, topMessageId: 100 },
            { peerId: -20, topMessageId: 200 }
        ],
        nextOffset: 7000
    });
    assert.deepEqual(secondPage, {
        count: 3,
        items: [{ peerId: -30, topMessageId: 300 }],
        nextOffset: null
    });
    assert.deepEqual(
        runtime.calls.filter(([name]) => name === 'getDialogs'),
        [
            ['getDialogs', { limit: 2, offsetIndex: 0 }],
            ['getDialogs', { limit: 2, offsetIndex: 7000 }]
        ]
    );
    assert.ok(runtime.calls.some((call) => (
        call[0] === 'getDialogIndex'
        && call[1] === -20
        && call[2] === 'index_1'
    )));
    assert.equal('folder_id' in firstPage.items[1], false);
    assert.equal('index_1' in firstPage.items[1], false);
});

test('should reject a Telegram dialog page whose cursor cannot advance', async () => {
    const dialogsStorage = {
        async getDialogIndex(dialog) {
            return dialog.index_0;
        },
        async getDialogs() {
            return {
                count: 2,
                dialogs: [{ peerId: -10, top_message: 100, index_0: 7000 }],
                isEnd: false
            };
        }
    };
    const adapter = createTelegramWebKAdapter({
        globalObject: {
            createProxiedManagersForAccount() {
                return { dialogsStorage };
            }
        },
        location: new URL('https://web.telegram.org/k/')
    });

    await assert.rejects(
        () => adapter.listDialogs({ limit: 1, offset: 7000 }),
        (error) => {
            assert.equal(error.operation, 'list-dialogs');
            assert.match(error.cause?.message || '', /did not advance/);
            return true;
        }
    );
});
