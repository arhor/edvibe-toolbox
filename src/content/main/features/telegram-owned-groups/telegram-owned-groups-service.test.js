import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
    createOwnedTelegramGroupsView,
    filterOwnedTelegramGroups,
    getSelectedOwnedGroups,
    loadOwnedTelegramGroups,
    normalizeOwnedGroup,
    sortOwnedTelegramGroups,
    TELEGRAM_GROUP_SORT_ORDERS,
    toggleOwnedGroupSelection
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

    test('should keep non-sendable owned groups available for non-send actions', () => {
        const group = normalizeOwnedGroup({
            canSendText: false,
            groupType: 'group',
            isActive: true,
            isCreator: true,
            peerId: -30,
            title: 'Read-only right now'
        });

        assert.equal(group.peerId, -30);
        assert.equal(group.canSendText, false);
    });

    test('should exclude non-creator, inactive, channel, and direct-chat shapes', () => {
        const cases = [
            { groupType: 'group', isActive: true, isCreator: false, canSendText: true, peerId: -1 },
            { groupType: 'group', isActive: false, isCreator: true, canSendText: true, peerId: -2 },
            { groupType: 'channel', isActive: true, isCreator: true, canSendText: true, peerId: -4 },
            { groupType: 'user', isActive: true, isCreator: true, canSendText: true, peerId: 5 },
            null
        ];

        assert.deepEqual(cases.map(normalizeOwnedGroup), [null, null, null, null, null]);
    });
});

describe('owned Telegram group list presentation', () => {
    test('should sort newest activity first without treating pinned order as activity', () => {
        const source = Object.freeze([
            Object.freeze({
                lastActivityAt: '2026-09-01T08:00:00.000Z',
                peerId: -10,
                pinned: true,
                title: 'Pinned but older'
            }),
            Object.freeze({
                lastActivityAt: null,
                peerId: -30,
                title: 'No activity'
            }),
            Object.freeze({
                lastActivityAt: '2026-09-03T08:00:00.000Z',
                peerId: -20,
                title: 'Newest'
            })
        ]);

        const sorted = sortOwnedTelegramGroups(source);

        assert.deepEqual(sorted.map(({ peerId }) => peerId), [-20, -10, -30]);
        assert.deepEqual(source.map(({ peerId }) => peerId), [-10, -30, -20]);
    });

    test('should sort oldest activity first while keeping missing activity last', () => {
        const source = Object.freeze([
            Object.freeze({
                lastActivityAt: '2026-09-03T08:00:00.000Z',
                peerId: -20,
                title: 'Newest'
            }),
            Object.freeze({
                lastActivityAt: null,
                peerId: -30,
                title: 'No activity'
            }),
            Object.freeze({
                lastActivityAt: '2026-09-01T08:00:00.000Z',
                peerId: -10,
                title: 'Oldest'
            })
        ]);

        const sorted = sortOwnedTelegramGroups(
            source,
            TELEGRAM_GROUP_SORT_ORDERS.OLDEST_FIRST
        );

        assert.deepEqual(sorted.map(({ peerId }) => peerId), [-10, -20, -30]);
        assert.deepEqual(source.map(({ peerId }) => peerId), [-20, -30, -10]);
    });

    test('should use deterministic title and peer-id fallbacks for equal or missing activity', () => {
        const equalActivity = '2026-09-03T08:00:00.000Z';
        const groups = [
            { lastActivityAt: null, peerId: -4, title: 'Zulu' },
            { lastActivityAt: equalActivity, peerId: -2, title: 'Beta' },
            { lastActivityAt: null, peerId: -3, title: 'Alpha' },
            { lastActivityAt: equalActivity, peerId: -1, title: 'alpha' },
            { lastActivityAt: equalActivity, peerId: -5, title: 'Alpha' }
        ];

        const forward = sortOwnedTelegramGroups(groups);
        const reverse = sortOwnedTelegramGroups([...groups].reverse());

        assert.deepEqual(forward.map(({ peerId }) => peerId), [-5, -1, -2, -3, -4]);
        assert.deepEqual(reverse.map(({ peerId }) => peerId), [-5, -1, -2, -3, -4]);
    });

    test('should filter titles case-insensitively after trimming the query', () => {
        const groups = Object.freeze([
            Object.freeze({ peerId: -1, title: 'Alpha Team' }),
            Object.freeze({ peerId: -2, title: 'Beta group' }),
            Object.freeze({ peerId: -3, title: 'ALPHABET' })
        ]);

        const filtered = filterOwnedTelegramGroups(groups, '  alpha  ');
        const restored = filterOwnedTelegramGroups(groups, '   ');

        assert.deepEqual(filtered.map(({ peerId }) => peerId), [-1, -3]);
        assert.deepEqual(restored.map(({ peerId }) => peerId), [-1, -2, -3]);
        assert.equal(groups.length, 3);
    });

    test('should apply the requested sort order to the filtered local view', () => {
        const groups = [
            { lastActivityAt: '2026-09-03T08:00:00.000Z', peerId: -1, title: 'Alpha newer' },
            { lastActivityAt: '2026-09-01T08:00:00.000Z', peerId: -2, title: 'Alpha older' },
            { lastActivityAt: '2026-08-01T08:00:00.000Z', peerId: -3, title: 'Beta' }
        ];

        const view = createOwnedTelegramGroupsView(
            groups,
            'alpha',
            TELEGRAM_GROUP_SORT_ORDERS.OLDEST_FIRST
        );

        assert.deepEqual(view.groups.map(({ peerId }) => peerId), [-2, -1]);
        assert.deepEqual(groups.map(({ peerId }) => peerId), [-1, -2, -3]);
    });

    test('should distinguish an empty filter result from an account with no owned groups', () => {
        const filteredEmpty = createOwnedTelegramGroupsView([
            { peerId: -1, title: 'Alpha Team' }
        ], 'missing');
        const accountEmpty = createOwnedTelegramGroupsView([], 'missing');

        assert.deepEqual(filteredEmpty, { groups: [], state: 'filtered-empty' });
        assert.deepEqual(accountEmpty, { groups: [], state: 'empty' });
    });
});

describe('owned Telegram group selection', () => {
    test('should keep selected peer ids independent from the filtered visible collection', () => {
        const groups = [
            { peerId: -10, title: 'Alpha' },
            { peerId: -20, title: 'Beta' },
            { peerId: -30, title: 'Gamma' }
        ];
        let selected = toggleOwnedGroupSelection([], -10, true);
        selected = toggleOwnedGroupSelection(selected, -30, true);

        const filtered = createOwnedTelegramGroupsView(groups, 'alpha');
        const targets = getSelectedOwnedGroups(groups, selected);

        assert.deepEqual(filtered.groups.map(({ peerId }) => peerId), [-10]);
        assert.deepEqual(selected, [-10, -30]);
        assert.deepEqual(targets.map(({ peerId }) => peerId), [-10, -30]);
    });

    test('should select and deselect without mutating the previous selection', () => {
        const initial = Object.freeze([-10]);
        const added = toggleOwnedGroupSelection(initial, -20, true);
        const removed = toggleOwnedGroupSelection(added, -10, false);

        assert.deepEqual(initial, [-10]);
        assert.deepEqual(added, [-10, -20]);
        assert.deepEqual(removed, [-20]);
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
                        items: [{ peerId: 101 }, { peerId: -20 }, { peerId: -30 }],
                        nextOffset: 3
                    };
                }
                return {
                    items: [{ peerId: -10 }, { peerId: -40 }, { peerId: -50 }],
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
