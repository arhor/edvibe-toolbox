export const MainPlatform = Object.freeze({
    EDVIBE: 'edvibe',
    TELEGRAM_WEB_K: 'telegram-web-k',
    UNSUPPORTED: 'unsupported'
});

function normalizeHostname(hostname) {
    return String(hostname || '').toLowerCase().replace(/\.$/, '');
}

export function detectMainPlatform(location = globalThis.location) {
    const hostname = normalizeHostname(location?.hostname);
    const pathname = String(location?.pathname || '/');

    if (hostname === 'edvibe.com' || hostname.endsWith('.edvibe.com')) {
        return MainPlatform.EDVIBE;
    }

    if (
        hostname === 'web.telegram.org'
        && (pathname === '/k' || pathname.startsWith('/k/'))
    ) {
        return MainPlatform.TELEGRAM_WEB_K;
    }

    return MainPlatform.UNSUPPORTED;
}
