const SUPPORTED_STATE = 'supported';
const GROUP_TYPES = new Set(['group', 'supergroup']);

function normalizeOwnedGroup(candidate) {
    if (
        !candidate
        || !candidate.isActive
        || !candidate.isCreator
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

    const groups = Object.freeze([...groupsByPeerId.values()]);
    return Object.freeze({
        groups,
        reason: null,
        state: groups.length === 0 ? 'empty' : 'ready'
    });
}

export {
    loadOwnedTelegramGroups,
    normalizeOwnedGroup
};
