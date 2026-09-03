import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
    isFatalTelegramGroupSendError,
    sendMessageToOwnedTelegramGroups
} from '#src/content/main/features/telegram-owned-groups/telegram-owned-groups-messaging.js';

function group(peerId, title, overrides = {}) {
    return Object.freeze({
        canSendText: true,
        kind: 'group',
        peerId,
        title,
        ...overrides
    });
}

describe('sendMessageToOwnedTelegramGroups', () => {
    test('should reject execution without targets or a non-empty message', async () => {
        const adapter = { sendText() {} };

        await assert.rejects(
            () => sendMessageToOwnedTelegramGroups(adapter, [], 'Hello', { confirmed: true }),
            /At least one Telegram group/
        );
        await assert.rejects(
            () => sendMessageToOwnedTelegramGroups(adapter, [group(-10, 'One')], '   ', { confirmed: true }),
            /non-empty text message/
        );
    });

    test('should perform zero send calls without explicit confirmation', async () => {
        const calls = [];
        const adapter = {
            async sendText(peerId, text) {
                calls.push([peerId, text]);
            }
        };

        await assert.rejects(
            () => sendMessageToOwnedTelegramGroups(adapter, [group(-10, 'One')], 'Hello'),
            /Explicit confirmation is required/
        );
        assert.deepEqual(calls, []);
    });

    test('should send the original text sequentially and preserve mixed results', async () => {
        const calls = [];
        let activeCalls = 0;
        let maxActiveCalls = 0;
        const adapter = {
            async sendText(peerId, text) {
                activeCalls += 1;
                maxActiveCalls = Math.max(maxActiveCalls, activeCalls);
                calls.push([peerId, text]);
                await Promise.resolve();
                activeCalls -= 1;
                if (peerId === -20) {
                    const error = new Error('Writing is forbidden.');
                    error.code = 'CHAT_WRITE_FORBIDDEN';
                    throw error;
                }
            }
        };
        const text = '  Same message\nfor everyone  ';
        const targets = [
            group(-10, 'First'),
            group(-20, 'Second'),
            group(-30, 'Third')
        ];

        const summary = await sendMessageToOwnedTelegramGroups(adapter, targets, text, { confirmed: true });

        assert.equal(maxActiveCalls, 1);
        assert.deepEqual(calls, [
            [-10, text],
            [-20, text],
            [-30, text]
        ]);
        assert.deepEqual(summary.results.map(({ status }) => status), [
            'sent',
            'failed',
            'sent'
        ]);
        assert.deepEqual(summary.counts, {
            failed: 1,
            notAttempted: 0,
            pending: 0,
            sent: 2,
            total: 3
        });
        assert.equal(summary.results[1].errorCode, 'CHAT_WRITE_FORBIDDEN');
    });

    test('should stop after a platform-wide flood wait and mark remaining targets not attempted', async () => {
        const calls = [];
        const adapter = {
            async sendText(peerId) {
                calls.push(peerId);
                if (peerId === -20) {
                    const error = new Error('Flood wait.');
                    error.code = 'FLOOD_WAIT_30';
                    throw error;
                }
            }
        };
        const targets = [
            group(-10, 'First'),
            group(-20, 'Second'),
            group(-30, 'Third'),
            group(-40, 'Fourth')
        ];

        const summary = await sendMessageToOwnedTelegramGroups(adapter, targets, 'Hello', { confirmed: true });

        assert.deepEqual(calls, [-10, -20]);
        assert.deepEqual(summary.results.map(({ status }) => status), [
            'sent',
            'failed',
            'not-attempted',
            'not-attempted'
        ]);
        assert.equal(summary.counts.notAttempted, 2);
        assert.equal(summary.results[2].errorCode, 'FLOOD_WAIT_30');
    });

    test('should treat slow mode as target-specific and continue without retrying or bypassing it', async () => {
        const calls = [];
        const adapter = {
            async sendText(peerId) {
                calls.push(peerId);
                if (peerId === -10) {
                    const error = new Error('Slow mode wait.');
                    error.code = 'SLOWMODE_WAIT_15';
                    throw error;
                }
            }
        };

        const summary = await sendMessageToOwnedTelegramGroups(adapter, [
            group(-10, 'Slow'),
            group(-20, 'Next')
        ], 'Hello', { confirmed: true });

        assert.deepEqual(calls, [-10, -20]);
        assert.deepEqual(summary.results.map(({ status }) => status), ['failed', 'sent']);
        assert.equal(summary.results[0].errorCode, 'SLOWMODE_WAIT_15');
    });

    test('should skip groups blocked by the preflight sendability check', async () => {
        const calls = [];
        const adapter = {
            async sendText(peerId) {
                calls.push(peerId);
            }
        };

        const summary = await sendMessageToOwnedTelegramGroups(adapter, [
            group(-10, 'Blocked', { canSendText: false }),
            group(-20, 'Allowed')
        ], 'Hello', { confirmed: true });

        assert.deepEqual(calls, [-20]);
        assert.deepEqual(summary.results.map(({ status }) => status), ['not-attempted', 'sent']);
        assert.equal(summary.results[0].errorCode, 'TELEGRAM_SEND_PREFLIGHT_BLOCKED');
    });

    test('should expose progress snapshots without allowing observer failures to interrupt sends', async () => {
        const snapshots = [];
        let progressCalls = 0;

        const summary = await sendMessageToOwnedTelegramGroups({
            async sendText() {}
        }, [group(-10, 'One')], 'Hello', {
            confirmed: true,
            onProgress(snapshot) {
                snapshots.push(snapshot.results.map(({ status }) => status));
                progressCalls += 1;
                if (progressCalls === 2) {
                    throw new Error('render failed');
                }
            }
        });

        assert.deepEqual(snapshots, [
            ['pending'],
            ['sending'],
            ['sent']
        ]);
        assert.equal(summary.results[0].status, 'sent');
    });
});

describe('Telegram group send failure classification', () => {
    test('should distinguish platform-wide interruption from target-specific restrictions', () => {
        assert.equal(isFatalTelegramGroupSendError({ code: 'FLOOD_WAIT_10' }), true);
        assert.equal(isFatalTelegramGroupSendError({ code: 'FLOOD_PREMIUM_WAIT_10' }), true);
        assert.equal(isFatalTelegramGroupSendError({ code: 'SESSION_REVOKED' }), true);
        assert.equal(isFatalTelegramGroupSendError({ code: 'TELEGRAM_WEB_K_RUNTIME_CALL_FAILED' }), true);
        assert.equal(isFatalTelegramGroupSendError({ code: 'SLOWMODE_WAIT_10' }), false);
        assert.equal(isFatalTelegramGroupSendError({ code: 'CHAT_WRITE_FORBIDDEN' }), false);
        assert.equal(isFatalTelegramGroupSendError({ code: 'USER_BANNED_IN_CHANNEL' }), false);
    });
});
