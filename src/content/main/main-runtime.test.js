import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import features from '#src/content/main/features/index.js';
import { createMainRuntime, selectMainFeatures } from '#src/content/main/main-runtime.js';
import { MainPlatform } from '#src/content/main/platform.js';

function createLogger() {
    const logger = {
        createChildLogger() {
            return logger;
        },
        log() { }
    };
    return logger;
}

describe('MAIN runtime composition', () => {
    test('should preserve the existing Edvibe feature set', () => {
        assert.equal(selectMainFeatures(MainPlatform.EDVIBE), features);
        assert.ok(features.length > 0);
    });

    test('should not compose Edvibe features on Telegram Web K', () => {
        const runtime = createMainRuntime({
            globalObject: {},
            location: new URL('https://web.telegram.org/k/'),
            logger: createLogger()
        });

        assert.equal(runtime.platform, MainPlatform.TELEGRAM_WEB_K);
        assert.deepEqual(runtime.features, []);
        assert.equal('edvibeApi' in runtime.context, false);
        assert.equal(typeof runtime.context.telegramWeb.listDialogs, 'function');
    });

    test('should not create a MAIN runtime for unsupported pages', () => {
        const runtime = createMainRuntime({
            globalObject: {},
            location: new URL('https://example.com/'),
            logger: createLogger()
        });

        assert.equal(runtime, null);
    });
});
