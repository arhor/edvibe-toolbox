const MARATHON_ID_PATTERN = /\/marathon\/(\d+)(?:\/|$)/;

function parseMarathonId(href) {
    const match = String(href || '').match(MARATHON_ID_PATTERN);
    return match ? Number(match[1]) : null;
}

class PageContext {
    constructor({
        windowApi = window,
        documentApi = document,
    } = {}) {
        this.windowApi = windowApi;
        this.documentApi = documentApi;

        Object.freeze(this);
    }

    get href() {
        return String(this.windowApi.location?.href || '');
    }

    get hostname() {
        return String(this.windowApi.location?.hostname || '');
    }

    get marathonId() {
        return parseMarathonId(this.windowApi.location?.href);
    }

    get marathonName() {
        const heading = this.documentApi.querySelector?.('h1')?.textContent?.trim();
        if (heading) {
            return heading;
        }
        const title = String(this.documentApi.title || '').trim();
        return title || null;
    }
}

export { PageContext, parseMarathonId };
