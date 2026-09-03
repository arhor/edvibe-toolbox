const SUPPORTED_STATE = 'supported';
const GROUP_TYPES = new Set(['group', 'supergroup']);

function normalizeActivityTimestamp(value) {
    if (!value) {
        return null;
    }

    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp) ? timestamp : null;
}

function normalizeOwnedGroup(candidate) {
    if (
        !candidate
        || !candidate.isActive
        || !candidate.isCreator
        || candidate.canSendText === false
        || !GROUP_TYPES.has(candidate.groupType)
        || !Number.isFinite(Number(candidate.peerId))
    ) {
        return null;
    }

    return Object.freeze({
        canSendText: typeof candidate.canSendText === 'boolean' ? candidate.canSendText : null,
        isCreator: true,
        kind: candidate.groupType,
        lastActivityAt: candidate.lastActivityAt || null,
        peerId: Number(candidate.peerId),
        title: String(candidate.title || '').trim() || 'Без названия'
    });
}

function compareOwnedTelegramGroups(left, right) {
    const leftActivity = normalizeActivityTimestamp(left?.lastActivityAt);
    const rightActivity = normalizeActivityTimestamp(right?.lastActivityAt);

    if (leftActivity !== rightActivity) {
        if (leftActivity === null) {
            return 1;
        }
        if (rightActivity === null) {
            return -1;
        }
        return rightActivity - leftActivity;
    }

    const leftTitle = String(left?.title || '').toLowerCase();
    const rightTitle = String(right?.title || '').toLowerCase();
    if (leftTitle !== rightTitle) {
        return leftTitle < rightTitle ? -1 : 1;
    }

    return Number(left?.peerId) - Number(right?.peerId);
}

function sortOwnedTelegramGroups(groups) {
    return Object.freeze(Array.from(groups || []).sort(compareOwnedTelegramGroups));
}

function filterOwnedTelegramGroups(groups, query = '') {
    const source = Array.from(groups || []);
    const normalizedQuery = String(query || '').trim().toLowerCase();
    if (!normalizedQuery) {
        return Object.freeze(source);
    }

    return Object.freeze(source.filter((group) => String(group?.title || '')
        .toLowerCase()
        .includes(normalizedQuery)));
}

function normalizeSelectedPeerIds(selectedPeerIds) {
    return new Set(Array.from(selectedPeerIds || [])
        .map((peerId) => Number(peerId))
        .filter(Number.isFinite));
}

function toggleOwnedGroupSelection(selectedPeerIds, peerId, selected) {
    const normalizedPeerId = Number(peerId);
    const next = normalizeSelectedPeerIds(selectedPeerIds);
    if (!Number.isFinite(normalizedPeerId)) {
        return Object.freeze([...next]);
    }

    const shouldSelect = typeof selected === 'boolean'
        ? selected
        : !next.has(normalizedPeerId);
    if (shouldSelect) {
        next.add(normalizedPeerId);
    } else {
        next.delete(normalizedPeerId);
    }
    return Object.freeze([...next]);
}

function getSelectedOwnedGroups(groups, selectedPeerIds) {
    const selected = normalizeSelectedPeerIds(selectedPeerIds);
    return Object.freeze(Array.from(groups || [])
        .filter(({ peerId }) => selected.has(Number(peerId))));
}

function createOwnedTelegramGroupsView(groups, query = '') {
    const source = Array.from(groups || []);
    if (source.length === 0) {
        return Object.freeze({
            groups: Object.freeze([]),
            state: 'empty'
        });
    }

    const visibleGroups = filterOwnedTelegramGroups(source, query);
    return Object.freeze({
        groups: visibleGroups,
        state: visibleGroups.length === 0 ? 'filtered-empty' : 'ready'
    });
}

function createUnsupportedResult(compatibility) {
    return Object.freeze({
        groups: Object.freeze([]),
        reason: compatibility?.reason || 'unsupported-runtime',
        state: 'unsupported'
    });
}

async function loadOwnedTelegramGroups(adapter, { pageSize = 100 } = {}) {
    if (!adapter || typeof adapter.getCompatibility !== 'function') {
        throw new TypeError('Telegram adapter is required.');
    }

    const compatibility = adapter.getCompatibility();
    if (compatibility?.state !== SUPPORTED_STATE) {
        return createUnsupportedResult(compatibility);
    }

    const groupsByPeerId = new Map();
    const visitedOffsets = new Set();
    let offset = 0;

    while (offset !== null) {
        if (visitedOffsets.has(offset)) {
            throw new Error('Telegram dialog pagination repeated an offset.');
        }
        visitedOffsets.add(offset);

        const page = await adapter.listDialogs({ limit: pageSize, offset });
        for (const dialog of page.items || []) {
            if (!Number.isFinite(Number(dialog.peerId)) || Number(dialog.peerId) >= 0) {
                continue;
            }

            const candidate = await adapter.resolveGroupCandidate(dialog);
            const group = normalizeOwnedGroup(candidate);
            if (group) {
                groupsByPeerId.set(group.peerId, group);
            }
        }

        offset = page.nextOffset;
    }

    const groups = sortOwnedTelegramGroups(groupsByPeerId.values());
    return Object.freeze({
        groups,
        reason: null,
        state: groups.length === 0 ? 'empty' : 'ready'
    });
}

export {
    compareOwnedTelegramGroups,
    createOwnedTelegramGroupsView,
    filterOwnedTelegramGroups,
    getSelectedOwnedGroups,
    loadOwnedTelegramGroups,
    normalizeOwnedGroup,
    sortOwnedTelegramGroups,
    toggleOwnedGroupSelection
};
