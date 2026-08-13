import { createLoggerFactory } from '#src/shared/logger.js';
import { initializeIsolatedBridge } from '#src/content/isolated/bridge.js';

initializeIsolatedBridge({
    windowApi: window,
    chromeApi: chrome,
    log: createLoggerFactory('ISOLATED')()
});
