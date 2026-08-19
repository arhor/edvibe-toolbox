import { initializeIsolatedBridge } from '#src/content/isolated/bridge.js';
import { Logger } from '#src/shared/logger.js';

initializeIsolatedBridge({
    windowApi: window,
    chromeApi: chrome,
    logger: new Logger({ namespace: 'ISOLATED' }),
});
