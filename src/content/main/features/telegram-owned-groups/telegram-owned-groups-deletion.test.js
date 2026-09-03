import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
    deleteOwnedTelegramGroups,
    isFatalTelegramGroupDeleteError,
    reconcileDeletedOwnedGroups
} from '#src/content/main/features/telegram-owned-groups/telegram-owned-groups-deletion.js';

function group(peerId, title, kind = 'group') {
    return Object.freeze({ kind, peerId, title });
}

describe('deleteOwnedTelegramGroups', () => {
    test('should reject execution without selected targets', async () => {
        await assert.rejects(
            () => deleteOwnedTelegramGroups({ deleteGroup() {} }, [], { confirmed: true }),
            /At least one Telegram group/
        );
    });

    test('should perform zero deletion calls without explicit confirmation', async () => {
        const calls = [];
        const adapter = {
            async deleteGroup(peerId) {
                calls.push(peerId);
            }
        };

        await assert.rejects(
            () => deleteOwnedTelegramGroups(adapter, [group(-10, 'One')]),
            /Explicit confirmation is required/
        );
        assert.deepEqual(calls, []);
    });

    test('should delete groups sequentially and preserve mixed results', async () => {
        const calls = [];
        let activeCalls = 0;
        let maxActiveCalls = 0;
        const adapter = {
            async deleteGroup(peerId, kind) {
                activeCalls += 1;
                maxActiveCalls = Math.max(maxActiveCalls, activeCalls);
                calls.push([peerId, kind]);
                await Promise.resolve();
                activeCalls -= 1;
                if (peerId === -20) {
                    const error = new Error('Creator permission was lost.');
                    error.code = 'CHAT_ADMIN_REQUIRED';
                    throw error;
                }
            }
        };
        const targets = [
            group(-10, 'First'),
            group(-20, 'Second', 'supergroup'),
            group(-30, 'Third')
        ];

        const summary = await deleteOwnedTelegramGroups(adapter, targets, { confirmed: true });

        assert.equal(maxActiveCalls, 1);
        assert.deepEqual(calls, [
            [-10, 'group'],
            [-20, 'supergroup'],
            [-30, 'group']
        ]);
        assert.deepEqual(summary.results.map(({ status }) => status), [
            'deleted',
            'failed',
            'deleted'
        ]);
        assert.deepEqual(summary.counts, {
            deleted: 2,
            failed: 1,
            notAttempted: 0,
            pending: 0,
            total: 3
        });
        assert.equal(summary.results[1].errorCode, 'CHAT_ADMIN_REQUIRED');
    });

    test('should stop after a platform-wide failure and mark remaining targets not attempted', async () => {
        const calls = [];
        const adapter = {
            async deleteGroup(peerId) {
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

        const summary = await deleteOwnedTelegramGroups(adapter, targets, { confirmed: true });

        assert.deepEqual(calls, [-10, -20]);
        assert.deepEqual(summary.results.map(({ status }) => status), [
            'deleted',
            'failed',
            'not-attempted',
            'not-attempted'
        ]);
        assert.equal(summary.counts.notAttempted, 2);
        assert.equal(summary.results[2].errorCode, 'FLOOD_WAIT_30');
    });

    test('should expose progress snapshots without allowing observer failures to interrupt deletion', async () => {
        const snapshots = [];
        const adapter = {
            async deleteGroup() {}
        };
        let progressCalls = 0;

        const summary = await deleteOwnedTelegramGroups(adapter, [group(-10, 'One')], {
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
            ['deleting'],
            ['deleted']
        ]);
        assert.equal(summary.results[0].status, 'deleted');
    });
});

describe('Telegram group deletion result helpers', () => {
    test('should treat only platform-wide error families as fatal', () => {
        assert.equal(isFatalTelegramGroupDeleteError({ code: 'FLOOD_WAIT_10' }), true);
        assert.equal(isFatalTelegramGroupDeleteError({ code: 'SESSION_REVOKED' }), true);
        assert.equal(isFatalTelegramGroupDeleteError({ code: 'TELEGRAM_WEB_K_UNSUPPORTED_RUNTIME' }), true);
        assert.equal(isFatalTelegramGroupDeleteError({ code: 'CHAT_ADMIN_REQUIRED' }), false);
    });

    test('should remove only successfully deleted groups from the loaded collection', () => {
        const groups = [
            group(-10, 'Deleted'),
            group(-20, 'Failed'),
            group(-30, 'Not attempted')
        ];
        const reconciled = reconcileDeletedOwnedGroups(groups, [
            { peerId: -10, status: 'deleted' },
            { peerId: -20, status: 'failed' },
            { peerId: -30, status: 'not-attempted' }
        ]);

        assert.deepEqual(reconciled.map(({ peerId }) => peerId), [-20, -30]);
        assert.deepEqual(groups.map(({ peerId }) => peerId), [-10, -20, -30]);
    });
});
