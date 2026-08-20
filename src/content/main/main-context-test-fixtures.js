const FIXTURE_MARATHON_ID = 42;
const FIXTURE_MARATHON_HREF = `https://edvibe.com/marathon/${FIXTURE_MARATHON_ID}/lessons`;
const FIXTURE_MARATHON_NAME = 'Demo marathon';

class FakeWebSocket {
    static OPEN = 1;

    constructor(url) {
        this.url = url;
        this.readyState = FakeWebSocket.OPEN;
    }

    addEventListener() { }

    send() { }
}

function createDocumentStub() {
    return {
        title: FIXTURE_MARATHON_NAME,
        createElement() {
            return { append() { }, click() { }, remove() { } };
        },
        querySelector() {
            return null;
        }
    };
}

function createWindowStub() {
    return {
        Blob: class FakeBlob { },
        URL: {
            createObjectURL() {
                return 'blob:fixture';
            },
            revokeObjectURL() { }
        },
        WebSocket: FakeWebSocket,
        addEventListener() { },
        crypto: {
            randomUUID() {
                return 'fixture-uuid';
            }
        },
        indexedDB: {
            open() {
                return {};
            }
        },
        location: { href: FIXTURE_MARATHON_HREF, hostname: 'edvibe.com' },
        postMessage() { },
        removeEventListener() { }
    };
}

function restoreGlobal(name, previousValue) {
    if (previousValue === undefined) {
        delete globalThis[name];
    } else {
        globalThis[name] = previousValue;
    }
}

/**
 * MainContext composes real MAIN infrastructure from page globals, so tests need a
 * page-like environment installed for the duration of the composition call.
 */
function withMainBrowserEnvironment(run) {
    const previousWindow = globalThis.window;
    const previousDocument = globalThis.document;
    const windowStub = createWindowStub();
    const documentStub = createDocumentStub();

    globalThis.window = windowStub;
    globalThis.document = documentStub;
    try {
        return run({ documentStub, windowStub });
    } finally {
        restoreGlobal('window', previousWindow);
        restoreGlobal('document', previousDocument);
    }
}

export {
    FIXTURE_MARATHON_HREF,
    FIXTURE_MARATHON_ID,
    FIXTURE_MARATHON_NAME,
    withMainBrowserEnvironment
};
