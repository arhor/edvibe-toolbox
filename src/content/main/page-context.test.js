import assert from 'node:assert/strict';
import test from 'node:test';

import { PageContext, parseMarathonId } from '#src/content/main/page-context.js';

test('parseMarathonId should parse marathon ID from Edvibe page URLs', () => {
    // Given
    const urls = [
        'https://edvibe.com/marathon/123',
        'https://edvibe.com/marathon/456/lessons',
        'https://edvibe.com/dashboard',
        null
    ];

    // When
    const ids = urls.map(parseMarathonId);

    // Then
    assert.deepEqual(ids, [123, 456, null, null]);
});

test('PageContext should expose current marathon page values', () => {
    // Given
    const windowApi = {
        location: {
            href: 'https://edvibe.com/marathon/123/lessons',
            hostname: 'edvibe.com'
        }
    };
    const documentApi = {
        title: 'Fallback title',
        querySelector(selector) {
            assert.equal(selector, 'h1');
            return { textContent: '  Polish B1  ' };
        }
    };
    const context = new PageContext({ windowApi, documentApi });

    // When
    const snapshot = {
        href: context.href,
        hostname: context.hostname,
        marathonId: context.marathonId,
        marathonName: context.marathonName
    };

    // Then
    assert.deepEqual(snapshot, {
        href: 'https://edvibe.com/marathon/123/lessons',
        hostname: 'edvibe.com',
        marathonId: 123,
        marathonName: 'Polish B1'
    });
    assert.equal(Object.isFrozen(context), true);
});

test('PageContext should read live page state and fall back to document title', () => {
    // Given
    const windowApi = {
        location: {
            href: 'https://edvibe.com/dashboard',
            hostname: 'edvibe.com'
        }
    };
    const documentApi = {
        title: '  Edvibe Dashboard  ',
        querySelector() {
            return null;
        }
    };
    const context = new PageContext({ windowApi, documentApi });

    // When
    const initialMarathonId = context.marathonId;
    windowApi.location.href = 'https://edvibe.com/marathon/456';
    const currentMarathonId = context.marathonId;

    // Then
    assert.equal(initialMarathonId, null);
    assert.equal(currentMarathonId, 456);
    assert.equal(context.marathonName, 'Edvibe Dashboard');
});
