import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { detectMainPlatform, MainPlatform } from '#src/content/main/platform.js';

function location(url) {
    return new URL(url);
}

describe('detectMainPlatform', () => {
    test('should detect Edvibe hosts without changing existing subdomain support', () => {
        assert.equal(detectMainPlatform(location('https://edvibe.com/dashboard')), MainPlatform.EDVIBE);
        assert.equal(detectMainPlatform(location('https://app.edvibe.com/marathon/123')), MainPlatform.EDVIBE);
    });

    test('should detect Telegram Web K only', () => {
        assert.equal(detectMainPlatform(location('https://web.telegram.org/k/')), MainPlatform.TELEGRAM_WEB_K);
        assert.equal(detectMainPlatform(location('https://web.telegram.org/k/#123')), MainPlatform.TELEGRAM_WEB_K);
        assert.equal(detectMainPlatform(location('https://web.telegram.org/k')), MainPlatform.TELEGRAM_WEB_K);
    });

    test('should reject Telegram Web A and lookalike hosts', () => {
        assert.equal(detectMainPlatform(location('https://web.telegram.org/a/')), MainPlatform.UNSUPPORTED);
        assert.equal(detectMainPlatform(location('https://telegram.org/k/')), MainPlatform.UNSUPPORTED);
        assert.equal(detectMainPlatform(location('https://web.telegram.org.example.com/k/')), MainPlatform.UNSUPPORTED);
    });
});
