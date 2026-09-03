export const TelegramWebKCompatibilityState = Object.freeze({
    SUPPORTED: 'supported',
    UNSUPPORTED: 'unsupported'
});

export const TelegramWebKUnsupportedReason = Object.freeze({
    MANAGER_FACTORY_UNAVAILABLE: 'manager-factory-unavailable',
    MANAGER_FACADE_UNAVAILABLE: 'manager-facade-unavailable'
});

export class TelegramWebKRuntimeError extends Error {
    constructor(message, { code, cause, compatibility, operation } = {}) {
        super(message, { cause });
        this.name = 'TelegramWebKRuntimeError';
        this.code = code;
        this.compatibility = compatibility;
        this.operation = operation;
    }
}

function isRecord(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function toFiniteNumber(value) {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const number = Number(value);
    return Number.isFinite(number) ? number : null;
}

function normalizeAccountNumber(value) {
    const parsed = Number.parseInt(String(value || '1'), 10);
    return parsed >= 1 && parsed <= 4 ? parsed : 1;
}

export function resolveTelegramWebKAccountNumber(location = globalThis.location) {
    try {
        const url = new URL(location?.href || 'https://web.telegram.org/k/');
        return normalizeAccountNumber(url.searchParams.get('account'));
    } catch {
        return 1;
    }
}

function unsupportedCompatibility(reason, accountNumber) {
    return Object.freeze({
        accountNumber,
        reason,
        state: TelegramWebKCompatibilityState.UNSUPPORTED
    });
}

function supportedCompatibility(accountNumber) {
    return Object.freeze({
        accountNumber,
        reason: null,
        state: TelegramWebKCompatibilityState.SUPPORTED
    });
}

export function inspectTelegramWebKCompatibility({
    globalObject = globalThis,
    location = globalThis.location
} = {}) {
    const accountNumber = resolveTelegramWebKAccountNumber(location);
    if (typeof globalObject?.createProxiedManagersForAccount !== 'function') {
        return unsupportedCompatibility(
            TelegramWebKUnsupportedReason.MANAGER_FACTORY_UNAVAILABLE,
            accountNumber
        );
    }

    return supportedCompatibility(accountNumber);
}

function normalizeDialogSummary(dialog) {
    if (!isRecord(dialog)) {
        return null;
    }

    const peerId = toFiniteNumber(dialog.peerId);
    if (peerId === null) {
        return null;
    }

    const topMessageId = toFiniteNumber(dialog.top_message);
    return Object.freeze({
        peerId,
        topMessageId
    });
}

function normalizePeerType(peer) {
    if (peer?._ === 'chat') {
        return 'group';
    }
    if (peer?._ === 'channel' && peer.pFlags?.megagroup) {
        return 'supergroup';
    }
    if (peer?._ === 'channel') {
        return 'channel';
    }
    if (peer?._ === 'user') {
        return 'user';
    }
    return 'unknown';
}

function isActiveGroupPeer(peer, type) {
    if (type !== 'group' && type !== 'supergroup') {
        return false;
    }

    const flags = peer?.pFlags || {};
    if (flags.left || flags.kicked || flags.deactivated) {
        return false;
    }
    return !(type === 'group' && peer?.migrated_to);
}

export function normalizeTelegramPeer(peerId, peer) {
    if (!isRecord(peer)) {
        return Object.freeze({
            isActive: false,
            isBroadcast: false,
            isCreator: false,
            isGroup: false,
            peerId,
            title: '',
            type: 'unknown'
        });
    }

    const type = normalizePeerType(peer);
    return Object.freeze({
        isActive: isActiveGroupPeer(peer, type),
        isBroadcast: type === 'channel' && Boolean(peer.pFlags?.broadcast),
        isCreator: Boolean(peer.pFlags?.creator),
        isGroup: type === 'group' || type === 'supergroup',
        peerId,
        title: typeof peer.title === 'string' ? peer.title : '',
        type
    });
}

export function normalizeTelegramGroupCandidate({
    canSendText = null,
    dialog,
    lastActivityAt = null,
    peer
}) {
    if (!peer?.isGroup || !dialog) {
        return null;
    }

    return Object.freeze({
        canSendText: typeof canSendText === 'boolean' ? canSendText : null,
        groupType: peer.type,
        isActive: Boolean(peer.isActive),
        isCreator: peer.isCreator,
        lastActivityAt,
        peerId: peer.peerId,
        title: peer.title
    });
}

function normalizeLastActivity(message) {
    const unixSeconds = toFiniteNumber(message?.date);
    if (unixSeconds === null || unixSeconds < 0) {
        return null;
    }

    return new Date(unixSeconds * 1000).toISOString();
}

function createRuntimeCallError(operation, cause) {
    return new TelegramWebKRuntimeError(
        `Telegram Web K operation "${operation}" failed.`,
        {
            cause,
            code: 'TELEGRAM_WEB_K_RUNTIME_CALL_FAILED',
            operation
        }
    );
}

export class TelegramWebKAdapter {
    constructor({
        globalObject = globalThis,
        location = globalThis.location
    } = {}) {
        this.globalObject = globalObject;
        this.location = location;
        this.cachedManagers = null;
        this.cachedAccountNumber = null;
        this.cachedManagerFactory = null;
    }

    getCompatibility() {
        return inspectTelegramWebKCompatibility({
            globalObject: this.globalObject,
            location: this.location
        });
    }

    getManagers() {
        const compatibility = this.getCompatibility();
        if (compatibility.state !== TelegramWebKCompatibilityState.SUPPORTED) {
            throw new TelegramWebKRuntimeError(
                'Telegram Web K runtime adapter is unavailable.',
                {
                    code: 'TELEGRAM_WEB_K_UNSUPPORTED_RUNTIME',
                    compatibility,
                    operation: 'resolve-runtime'
                }
            );
        }

        const managerFactory = this.globalObject.createProxiedManagersForAccount;
        if (
            this.cachedManagers
            && this.cachedAccountNumber === compatibility.accountNumber
            && this.cachedManagerFactory === managerFactory
        ) {
            return this.cachedManagers;
        }

        let managers;
        try {
            managers = managerFactory(compatibility.accountNumber);
        } catch (cause) {
            throw createRuntimeCallError('resolve-runtime', cause);
        }

        if (!managers || (typeof managers !== 'object' && typeof managers !== 'function')) {
            const incompatible = unsupportedCompatibility(
                TelegramWebKUnsupportedReason.MANAGER_FACADE_UNAVAILABLE,
                compatibility.accountNumber
            );
            throw new TelegramWebKRuntimeError(
                'Telegram Web K manager facade is unavailable.',
                {
                    code: 'TELEGRAM_WEB_K_UNSUPPORTED_RUNTIME',
                    compatibility: incompatible,
                    operation: 'resolve-runtime'
                }
            );
        }

        this.cachedManagers = managers;
        this.cachedAccountNumber = compatibility.accountNumber;
        this.cachedManagerFactory = managerFactory;
        return managers;
    }

    async listDialogs({ limit = 50, offset = 0 } = {}) {
        const safeLimit = Math.max(1, Math.trunc(limit));
        const safeOffset = Math.max(0, Math.trunc(offset));
        try {
            const managers = this.getManagers();
            const result = await managers.dialogsStorage.getDialogs({
                limit: safeLimit,
                offsetIndex: safeOffset
            });
            if (!isRecord(result) || !Array.isArray(result.dialogs)) {
                throw new TypeError('Unexpected Telegram dialog page shape.');
            }

            const rawPageSize = result.dialogs.length;
            const items = result.dialogs
                .map(normalizeDialogSummary)
                .filter(Boolean);
            const count = toFiniteNumber(result.count);
            const nextOffset = rawPageSize === 0
                || (count !== null && safeOffset + rawPageSize >= count)
                ? null
                : safeOffset + rawPageSize;

            return Object.freeze({
                count,
                items: Object.freeze(items),
                nextOffset
            });
        } catch (cause) {
            if (cause instanceof TelegramWebKRuntimeError) {
                throw cause;
            }
            throw createRuntimeCallError('list-dialogs', cause);
        }
    }

    async resolvePeer(peerId) {
        const normalizedPeerId = toFiniteNumber(peerId);
        if (normalizedPeerId === null) {
            throw new TypeError('peerId must be a finite number');
        }

        try {
            const managers = this.getManagers();
            const peer = await managers.appPeersManager.getPeer(normalizedPeerId);
            return normalizeTelegramPeer(normalizedPeerId, peer);
        } catch (cause) {
            if (cause instanceof TelegramWebKRuntimeError) {
                throw cause;
            }
            throw createRuntimeCallError('resolve-peer', cause);
        }
    }

    async getLastActivity({ peerId, topMessageId }) {
        if (topMessageId === null || topMessageId === undefined) {
            return null;
        }

        try {
            const managers = this.getManagers();
            const message = await managers.appMessagesManager.getMessageByPeer(peerId, topMessageId);
            return normalizeLastActivity(message);
        } catch (cause) {
            if (cause instanceof TelegramWebKRuntimeError) {
                throw cause;
            }
            throw createRuntimeCallError('get-last-activity', cause);
        }
    }

    async canSendText(peerId) {
        const normalizedPeerId = toFiniteNumber(peerId);
        if (normalizedPeerId === null || normalizedPeerId >= 0) {
            return false;
        }

        try {
            const managers = this.getManagers();
            return Boolean(await managers.appChatsManager.hasRights(
                Math.abs(normalizedPeerId),
                'send_plain'
            ));
        } catch (cause) {
            if (cause instanceof TelegramWebKRuntimeError) {
                throw cause;
            }
            throw createRuntimeCallError('check-send-text', cause);
        }
    }

    async resolveGroupCandidate(dialog) {
        const peer = await this.resolvePeer(dialog.peerId);
        if (!peer.isGroup) {
            return null;
        }
        if (!peer.isActive || !peer.isCreator) {
            return normalizeTelegramGroupCandidate({ dialog, peer });
        }

        const [lastActivityAt, canSendText] = await Promise.all([
            this.getLastActivity(dialog),
            this.canSendText(dialog.peerId)
        ]);
        return normalizeTelegramGroupCandidate({
            canSendText,
            dialog,
            lastActivityAt,
            peer
        });
    }

    async sendText(peerId, text) {
        const normalizedPeerId = toFiniteNumber(peerId);
        if (normalizedPeerId === null) {
            throw new TypeError('peerId must be a finite number');
        }
        if (typeof text !== 'string' || text.trim() === '') {
            throw new TypeError('text must be a non-empty string');
        }

        try {
            const managers = this.getManagers();
            await managers.appMessagesManager.sendText({
                peerId: normalizedPeerId,
                text
            });
            return Object.freeze({ ok: true });
        } catch (cause) {
            if (cause instanceof TelegramWebKRuntimeError) {
                throw cause;
            }
            throw createRuntimeCallError('send-text', cause);
        }
    }

    async probe() {
        const compatibility = this.getCompatibility();
        if (compatibility.state !== TelegramWebKCompatibilityState.SUPPORTED) {
            return compatibility;
        }

        try {
            const page = await this.listDialogs({ limit: 1, offset: 0 });
            if (page.items.length > 0) {
                const dialog = page.items[0];
                await this.resolvePeer(dialog.peerId);
                await this.getLastActivity(dialog);
            }
            return Object.freeze({
                ...compatibility,
                capabilities: Object.freeze({
                    dialogDiscovery: true,
                    lastActivity: true,
                    peerResolution: true
                }),
                requiresLiveValidation: Object.freeze(['sendText'])
            });
        } catch (cause) {
            return Object.freeze({
                accountNumber: compatibility.accountNumber,
                reason: 'runtime-contract-rejected',
                state: TelegramWebKCompatibilityState.UNSUPPORTED,
                errorCode: cause?.code || 'TELEGRAM_WEB_K_RUNTIME_CALL_FAILED'
            });
        }
    }
}

export function createTelegramWebKAdapter(options) {
    return new TelegramWebKAdapter(options);
}
