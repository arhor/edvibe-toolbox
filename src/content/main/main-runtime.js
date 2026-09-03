import features from '#src/content/main/features/index.js';
import { MainContext } from '#src/content/main/main-context.js';
import { detectMainPlatform, MainPlatform } from '#src/content/main/platform.js';
import { TelegramMainContext } from '#src/content/main/telegram-main-context.js';

export function selectMainFeatures(platform) {
    if (platform === MainPlatform.EDVIBE) {
        return features;
    }
    if (platform === MainPlatform.TELEGRAM_WEB_K) {
        return [];
    }
    return [];
}

export function createMainRuntime({
    globalObject = globalThis,
    location = globalThis.location,
    logger
}) {
    const platform = detectMainPlatform(location);

    if (platform === MainPlatform.EDVIBE) {
        return Object.freeze({
            context: new MainContext({ logger }),
            features: selectMainFeatures(platform),
            platform
        });
    }

    if (platform === MainPlatform.TELEGRAM_WEB_K) {
        return Object.freeze({
            context: new TelegramMainContext({
                globalObject,
                location,
                logger
            }),
            features: selectMainFeatures(platform),
            platform
        });
    }

    return null;
}
