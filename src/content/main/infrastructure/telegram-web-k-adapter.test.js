import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
    createTelegramWebKAdapter,
    inspectTelegramWebKCompatibility,
    normalizeTelegramGroupCandidate,
    normalizeTelegramPeer,
    resolveTelegramWebKAccountNumber,
    TelegramWebKCompatibilityState
} from '#src/content/main/infrastructure/telegram-web-k-adapter.js';

function createRuntime({
    dialogs = [],
    peers = {},
    messages = {},
    canSend = true
} = {}) {
    const calls = [];
    const managers = {
        appChatsManager: {
            async hasRights(chatId, right) {
                calls.push(['hasRights', chatId, right]);
                return canSend;
            }
        },
        appMessagesManager: {
            async getMessageByPeer(peerId, messageId) {
                calls.push(['getMessageByPeer', peerId, messageId]);
                return messages[`${peerId}:${messageId}`] || null;
            },
            async sendText(payload) {
                calls.push(['sendText', payload]);
            }
        },
        appPeersManager: {
            async getPeer(peerId) {
                calls.push(['getPeer', peerId]);
                return peers[peerId] || null;
            }
        },
        dialogsStorage: {
            async getDialogs(options) {
                calls.push(['getDialogs', options]);
                return {
                    count: dialogs.length,
                    dialogs: dialogs.slice(options.offsetIndex, options.offsetIndex + options.limit)
                };
            }
        }
    };
    const globalObject = {
        createProxiedManagersForAccount(accountNumber) {
            calls.push(['createManagers', accountNumber]);
            return managers;
        }
    };
    return { calls, globalObject };
}

describe('Telegram Web K runtime detection', () => {
    test('should resolve the active account from the Web K account query parameter', () => {
        assert.equal(resolveTelegramWebKAccountNumber(new URL('https://web.telegram.org/k/')), 1);
        assert.equal(resolveTelegramWebKAccountNumber(new URL('https://web.telegram.org/k/?account=3')), 3);
        assert.equal(resolveTelegramWebKAccountNumber(new URL('https://web.telegram.org/k/?account=9')), 1);
    });

    test('should report an explicit unsupported result before the manager factory is available', () => {
        const compatibility = inspectTelegramWebKCompatibility({
            globalObject: {},
            location: new URL('https://web.telegram.org/k/')
        });

        assert.equal(compatibility.state, TelegramWebKCompatibilityState.UNSUPPORTED);
        assert.equal(compatibility.reason, 'manager-factory-unavailable');
    });
});

describe('Telegram Web K normalization', () => {
    test('should normalize basic groups and megagroups without leaking Telegram flags', () => {
        const group = normalizeTelegramPeer(-10, {
            _: 'chat',
            title: 'Small group',
            pFlags: { creator: true }
        });
        const supergroup = normalizeTelegramPeer(-20, {
            _: 'channel',
            title: 'Large group',
            pFlags: { creator: true, megagroup: true }
        });

        assert.deepEqual(group, {
            isBroadcast: false,
            isCreator: true,
            isGroup: true,
            peerId: -10,
            title: 'Small group',
            type: 'group'
        });
        assert.equal(supergroup.type, 'supergroup');
        assert.equal(supergroup.isGroup, true);
        assert.equal('pFlags' in supergroup, false);
    });

    test('should create only group candidates', () => {
        const candidate = normalizeTelegramGroupCandidate({
            canSendText: true,
            dialog: { peerId: -10, topMessageId: 2 },
            lastActivityAt: '2026-09-03T07:00:00.000Z',
            peer: {
                isCreator: true,
                isGroup: true,
                peerId: -10,
                title: 'Owned group',
                type: 'group'
            }
        });

        assert.deepEqual(candidate, {
            canSendText: true,
            groupType: 'group',
            isCreator: true,
            lastActivityAt: '2026-09-03T07:00:00.000Z',
            peerId: -10,
            title: 'Owned group'
        });
        assert.equal(normalizeTelegramGroupCandidate({ dialog: {}, peer: { isGroup: false } }), null);
    });
});

describe('TelegramWebKAdapter', () => {
    test('should page dialogs and expose normalized summaries only', async () => {
        const runtime = createRuntime({
            dialogs: [
                { peerId: -10, top_message: 100, unread_count: 5 },
                { peerId: -20, top_message: 200, unread_count: 1 }
            ]
        });
        const adapter = createTelegramWebKAdapter({
            globalObject: runtime.globalObject,
            location: new URL('https://web.telegram.org/k/?account=2')
        });

        const page = await adapter.listDialogs({ limit: 1, offset: 0 });

        assert.deepEqual(page, {
            count: 2,
            items: [{ peerId: -10, topMessageId: 100 }],
            nextOffset: 1
        });
        assert.deepEqual(runtime.calls[0], ['createManagers', 2]);
        assert.equal('unread_count' in page.items[0], false);
    });

    test('should preserve missing message ids and advance by the raw Telegram page size', async () => {
        const runtime = createRuntime({
            dialogs: [
                { peerId: null, top_message: null },
                { peerId: -10, top_message: null },
                { peerId: -20, top_message: 200 }
            ]
        });
        const adapter = createTelegramWebKAdapter({
            globalObject: runtime.globalObject,
            location: new URL('https://web.telegram.org/k/')
        });

        const page = await adapter.listDialogs({ limit: 2, offset: 0 });

        assert.deepEqual(page, {
            count: 3,
            items: [{ peerId: -10, topMessageId: null }],
            nextOffset: 2
        });
    });

    test('should resolve an owned group candidate with last activity and send capability', async () => {
        const runtime = createRuntime({
            dialogs: [{ peerId: -10, top_message: 100 }],
            messages: { '-10:100': { date: 1788422400 } },
            peers: {
                '-10': {
                    _: 'channel',
                    title: 'Toolfox test group',
                    pFlags: { creator: true, megagroup: true }
                }
            }
        });
        const adapter = createTelegramWebKAdapter({
            globalObject: runtime.globalObject,
            location: new URL('https://web.telegram.org/k/')
        });
        const [dialog] = (await adapter.listDialogs()).items;

        const candidate = await adapter.resolveGroupCandidate(dialog);

        assert.equal(candidate.peerId, -10);
        assert.equal(candidate.title, 'Toolfox test group');
        assert.equal(candidate.groupType, 'supergroup');
        assert.equal(candidate.isCreator, true);
        assert.equal(candidate.canSendText, true);
        assert.equal(candidate.lastActivityAt, new Date(1788422400 * 1000).toISOString());
        assert.ok(runtime.calls.some((call) => call[0] === 'hasRights' && call[1] === 10 && call[2] === 'send_plain'));
    });

    test('should send text through the existing Telegram manager facade', async () => {
        const runtime = createRuntime();
        const adapter = createTelegramWebKAdapter({
            globalObject: runtime.globalObject,
            location: new URL('https://web.telegram.org/k/')
        });

        const result = await adapter.sendText(-10, 'Toolfox adapter check');

        assert.deepEqual(result, { ok: true });
        assert.ok(runtime.calls.some((call) => (
            call[0] === 'sendText'
            && call[1].peerId === -10
            && call[1].text === 'Toolfox adapter check'
        )));
    });

    test('should fail explicitly when the Telegram runtime boundary is unavailable', async () => {
        const adapter = createTelegramWebKAdapter({
            globalObject: {},
            location: new URL('https://web.telegram.org/k/')
        });

        await assert.rejects(
            () => adapter.listDialogs(),
            (error) => {
                assert.equal(error.code, 'TELEGRAM_WEB_K_UNSUPPORTED_RUNTIME');
                assert.equal(error.compatibility.reason, 'manager-factory-unavailable');
                return true;
            }
        );
    });

    test('should re-check globals instead of caching a document-start failure', async () => {
        const globalObject = {};
        const adapter = createTelegramWebKAdapter({
            globalObject,
            location: new URL('https://web.telegram.org/k/')
        });
        assert.equal(adapter.getCompatibility().state, TelegramWebKCompatibilityState.UNSUPPORTED);

        const runtime = createRuntime();
        globalObject.createProxiedManagersForAccount = runtime.globalObject.createProxiedManagersForAccount;

        assert.equal(adapter.getCompatibility().state, TelegramWebKCompatibilityState.SUPPORTED);
        assert.deepEqual(await adapter.listDialogs(), { count: 0, items: [], nextOffset: null });
    });
});
