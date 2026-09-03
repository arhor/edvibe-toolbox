import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
    loadOwnedTelegramGroups,
    normalizeOwnedGroup
} from '#src/content/main/features/telegram-owned-groups/telegram-owned-groups-service.js';

describe('normalizeOwnedGroup', () => {
    test('should keep active creator-owned basic groups and supergroups', () => {
        const basic = normalizeOwnedGroup({
            canSendText: true,
            groupType: 'group',
            isActive: true,
            isCreator: true,
            lastActivityAt: '2026-09-03T08:00:00.000Z',
            peerId: -10,
            title: 'Basic group'
        });
        const supergroup = normalizeOwnedGroup({
            canSendText: true,
            groupType: 'supergroup',
            isActive: true,
            isCreator: true,
            lastActivityAt: null,
            peerId: -20,
            title: 'Supergroup'
        });

        assert.deepEqual(basic, {
            canSendText: true,
            isCreator: true,
            kind: 'group',
            lastActivityAt: '2026-09-03T08:00:00.000Z',
            peerId: -10,
            title: 'Basic group'
        });
        assert.equal(supergroup.kind, 'supergroup');
        assert.equal(supergroup.canSendText, true);
    });

    test('should exclude non-creator, inactive, non-sendable, channel, and direct-chat shapes', () => {
        const cases = [
            { groupType: 'group', isActive: true, isCreator: false, canSendText: true, peerId: -1 },
            { groupType: 'group', isActive: false, isCreator: true, canSendText: true, peerId: -2 },
            { groupType: 'group', isActive: true, isCreator: true, canSendText: false, peerId: -3 },
            { groupType: 'channel', isActive: true, isCreator: true, canSendText: true, peerId: -4 },
            { groupType: 'user', isActive: true, isCreator: true, canSendText: true, peerId: 5 },
            null
        ];

        assert.deepEqual(cases.map(normalizeOwnedGroup), [null, null, null, null, null, null]);
    });
});

describe('loadOwnedTelegramGroups', () => {
    test('should paginate all dialogs and retain only owned active groups', async () => {
        const calls = [];
        const candidates = new Map([
            [-10, { groupType: 'group', isActive: true, isCreator: true, peerId: -10, title: 'Owned basic', canSendText: true, lastActivityAt: '2026-09-03T08:00:00.000Z' }],
            [-20, { groupType: 'supergroup', isActive: true, isCreator: true, peerId: -20, title: 'Owned supergroup', canSendText: true, lastActivityAt: '2026-09-02T08:00:00.000Z' }],
            [-30, { groupType: 'group', isActive: true, isCreator: false, peerId: -30, title: 'Admin only' }],
            [-40, { groupType: 'group', isActive: false, isCreator: true, peerId: -40, title: 'Left group' }],
            [-50, null]
        ]);
        const adapter = {
            getCompatibility: () => ({ state: 'supported' }),
            async listDialogs({ limit, offset }) {
                calls.push(['listDialogs', limit, offset]);
                if (offset === 0) {
                    return {
                        items: [{ peerId: 101 }, { peerId: -10 }, { peerId: -30 }],
                        nextOffset: 3
                    };
                }
                return {
                    items: [{ peerId: -20 }, { peerId: -40 }, { peerId: -50 }],
                    nextOffset: null
                };
            },
            async resolveGroupCandidate(dialog) {
                calls.push(['resolveGroupCandidate', dialog.peerId]);
                return candidates.get(dialog.peerId) ?? null;
            }
        };

        const result = await loadOwnedTelegramGroups(adapter, { pageSize: 3 });

        assert.equal(result.state, 'ready');
        assert.deepEqual(result.groups.map(({ peerId }) => peerId), [-10, -20]);
        assert.deepEqual(calls.filter(([name]) => name === 'listDialogs'), [
            ['listDialogs', 3, 0],
            ['listDialogs', 3, 3]
        ]);
        assert.equal(calls.some((call) => call[0] === 'resolveGroupCandidate' && call[1] === 101), false);
    });

    test('should expose explicit empty and unsupported states', async () => {
        const empty = await loadOwnedTelegramGroups({
            getCompatibility: () => ({ state: 'supported' }),
            listDialogs: async () => ({ items: [], nextOffset: null }),
            resolveGroupCandidate: async () => null
        });
        const unsupported = await loadOwnedTelegramGroups({
            getCompatibility: () => ({ state: 'unsupported', reason: 'manager-factory-unavailable' })
        });

        assert.deepEqual(empty, { groups: [], reason: null, state: 'empty' });
        assert.deepEqual(unsupported, {
            groups: [],
            reason: 'manager-factory-unavailable',
            state: 'unsupported'
        });
    });

    test('should reject repeated pagination offsets instead of looping forever', async () => {
        const adapter = {
            getCompatibility: () => ({ state: 'supported' }),
            listDialogs: async () => ({ items: [], nextOffset: 0 }),
            resolveGroupCandidate: async () => null
        };

        await assert.rejects(
            () => loadOwnedTelegramGroups(adapter),
            /repeated an offset/
        );
    });
});
