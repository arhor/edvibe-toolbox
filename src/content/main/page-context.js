const MARATHON_ID_PATTERN = /\/marathon\/(\d+)(?:\/|$)/;

function readMarathonId(href) {
    const match = String(href || '').match(MARATHON_ID_PATTERN);
    return match ? Number(match[1]) : null;
}

function createPageContext({
    windowApi = window,
    documentApi = document,
} = {}) {
    return Object.freeze({
        get href() {
            return String(windowApi.location?.href || '');
        },
        get hostname() {
            return String(windowApi.location?.hostname || '');
        },
        get marathonId() {
            return readMarathonId(windowApi.location?.href);
        },
        get marathonName() {
            const heading = documentApi.querySelector?.('h1')?.textContent?.trim();
            if (heading) {
                return heading;
            }
            const title = String(documentApi.title || '').trim();
            return title || null;
        },
    });
}

export { createPageContext };
