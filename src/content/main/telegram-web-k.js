import { FeatureDispatcher } from '#src/content/main/feature-dispatcher.js';
import { telegramOwnedGroupsFeatureDefinition } from '#src/content/main/features/telegram-owned-groups/telegram-owned-groups.js';
import { detectMainPlatform, MainPlatform } from '#src/content/main/platform.js';
import { TelegramMainContext } from '#src/content/main/telegram-main-context.js';
import { Logger } from '#src/shared/logger.js';

const logger = new Logger({ namespace: 'MAIN:TELEGRAM_WEB_K' });
const platform = detectMainPlatform(window.location);

if (platform === MainPlatform.TELEGRAM_WEB_K) {
    const dispatcher = new FeatureDispatcher({
        context: new TelegramMainContext({
            globalObject: window,
            location: window.location,
            logger
        }),
        features: [telegramOwnedGroupsFeatureDefinition]
    });

    window.addEventListener('message', ({ source, data }) => {
        if (source !== window) {
            return;
        }
        dispatcher.dispatch(data);
    });

    logger.log('Toolfox Telegram Web K runtime ready.');
} else {
    logger.log('Telegram Web K MAIN entry loaded on an unsupported page.');
}
