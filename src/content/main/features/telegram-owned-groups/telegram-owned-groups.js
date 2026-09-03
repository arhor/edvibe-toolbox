import { TELEGRAM_OWNED_GROUPS_DIALOG_TAG } from '#src/content/main/features/telegram-owned-groups/telegram-owned-groups-dialog.js';
import { loadOwnedTelegramGroups } from '#src/content/main/features/telegram-owned-groups/telegram-owned-groups-service.js';
import { WINDOW_MESSAGE_TYPES } from '#src/shared/messaging/index.js';

function createTelegramOwnedGroupsFeature({
    adapter,
    documentApi = globalThis.document,
    logger = { log() {} }
}) {
    if (!adapter) {
        throw new TypeError('Telegram adapter is required.');
    }
    if (!documentApi?.createElement) {
        throw new TypeError('Document API is required.');
    }

    let dialog = null;

    function close() {
        dialog?.remove();
        dialog = null;
    }

    function open() {
        if (dialog?.isConnected) {
            void dialog.load?.();
            return dialog;
        }

        dialog = documentApi.createElement(TELEGRAM_OWNED_GROUPS_DIALOG_TAG);
        dialog.configure({
            onClose: close,
            onLoad: () => loadOwnedTelegramGroups(adapter)
        });
        (documentApi.body || documentApi.documentElement).append(dialog);
        logger.log('Telegram owned-group browser opened.');
        return dialog;
    }

    return Object.freeze({ close, open });
}

const telegramOwnedGroupsFeatureDefinition = Object.freeze({
    type: WINDOW_MESSAGE_TYPES.OPEN_TELEGRAM_GROUP_BROWSER,
    create(context) {
        const feature = createTelegramOwnedGroupsFeature({
            adapter: context.telegramWeb,
            logger: context.logger.createChildLogger('TelegramOwnedGroups')
        });
        return () => feature.open();
    }
});

export {
    createTelegramOwnedGroupsFeature,
    telegramOwnedGroupsFeatureDefinition
};
