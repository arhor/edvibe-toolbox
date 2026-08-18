import assert from 'node:assert/strict';
import test from 'node:test';

import {
    createAuthorizationCapture,
    uploadImageAssets
} from '#src/content/main/features/batch-section-creation/batch-section-image-upload.js';

function storage(keys) {
    return {
        length: keys.length,
        key(index) {
            return keys[index] ?? null;
        }
    };
}

test('authorization capture reports trusted traffic without persisting credentials', async () => {
    const calls = [];
    const root = {
        location: { href: 'https://edvibe.com/cabinet' },
        Headers,
        document: { cookie: 'session=cookie-secret; theme=dark' },
        localStorage: storage(['accessToken', 'locale']),
        sessionStorage: storage(['activeSchool']),
        async fetch(...args) {
            calls.push(args);
            return { ok: true };
        }
    };
    const capture = createAuthorizationCapture(root);

    await root.fetch('https://edvibe.com/api/without-auth?secret=query-secret', {
        method: 'POST'
    });
    let diagnostics = capture.getDiagnostics();
    assert.equal(diagnostics.hasAuthorization, false);
    assert.deepEqual(diagnostics.trustedRequests, {
        total: 1,
        fetch: 1,
        xhr: 0,
        manual: 0
    });
    assert.equal(diagnostics.lastTrustedRequest.url, 'https://edvibe.com/api/without-auth');

    await root.fetch('https://media-files-y.edvibe.com/api/test', {
        headers: { authorization: 'token-secret' }
    });
    diagnostics = capture.getDiagnostics();

    assert.equal(capture.getAuthorization(), 'token-secret');
    assert.equal(diagnostics.hasAuthorization, true);
    assert.equal(diagnostics.authorizationCaptureCount, 1);
    assert.deepEqual(diagnostics.storage.localStorageKeys, ['accessToken', 'locale']);
    assert.deepEqual(diagnostics.storage.sessionStorageKeys, ['activeSchool']);
    assert.deepEqual(diagnostics.storage.cookieNames, ['session', 'theme']);
    assert.equal(calls.length, 2);

    const serialized = JSON.stringify(diagnostics);
    assert.equal(serialized.includes('token-secret'), false);
    assert.equal(serialized.includes('cookie-secret'), false);
    assert.equal(serialized.includes('query-secret'), false);
});

test('missing authorization produces history-compatible diagnostics before upload', async () => {
    const authorizationContext = {
        installedAt: '2026-08-18T08:00:00.000Z',
        hasAuthorization: false,
        hooks: { fetch: true, xhr: true },
        trustedRequests: { total: 0, fetch: 0, xhr: 0, manual: 0 },
        authorizationCaptureCount: 0,
        lastTrustedRequest: null,
        lastAuthorizationCapture: null,
        storage: {
            localStorageKeys: ['accessToken'],
            sessionStorageKeys: [],
            cookieNames: ['session']
        }
    };
    let fetchCalled = false;

    await assert.rejects(
        uploadImageAssets({
            definition: {
                name: 'Announcement',
                blocks: [{
                    id: 'block-1',
                    type: 'image',
                    url: 'https://media-files-y.edvibe.com/local-upload/client-1'
                }]
            },
            registry: { get: () => ({ name: 'banner.png' }) },
            authorization: '',
            authorizationContext,
            fetchFn: async () => {
                fetchCalled = true;
                return { ok: true };
            },
            FormDataCtor: class {}
        }),
        (error) => {
            assert.equal(error.code, 'AUTH_CONTEXT_UNAVAILABLE');
            assert.equal(error.diagnostics.requestAttempts.length, 1);
            const diagnostic = error.diagnostics.requestAttempts[0];
            assert.equal(diagnostic.transportCode, 'AUTH_CONTEXT_UNAVAILABLE');
            assert.equal(diagnostic.operationName, 'resolve-image-upload-authorization');
            assert.equal(diagnostic.requestSummary.imageBlockCount, 1);
            assert.deepEqual(diagnostic.requestSummary.authorizationCapture, authorizationContext);
            return true;
        }
    );

    assert.equal(fetchCalled, false);
});
