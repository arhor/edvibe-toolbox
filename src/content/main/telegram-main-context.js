import { createTelegramWebKAdapter } from '#src/content/main/infrastructure/telegram-web-k-adapter.js';

export class TelegramMainContext {
    constructor({
        globalObject = globalThis,
        location = globalThis.location,
        logger
    }) {
        this.logger = logger;
        this.telegramWeb = createTelegramWebKAdapter({
            globalObject,
            location
        });
        this.dispatch = null;

        this.registerDispatch = this.registerDispatch.bind(this);
    }

    registerDispatch(dispatch) {
        if (typeof dispatch !== 'function') {
            throw new TypeError('dispatch must be a function');
        }
        if (this.dispatch !== null) {
            throw new Error('dispatch is already registered');
        }

        this.dispatch = dispatch;
    }
}
