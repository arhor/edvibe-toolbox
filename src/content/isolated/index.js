import { initializeIsolatedBridge } from '#src/content/isolated/bridge.js';
import { createLoggerFactory } from '#src/shared/logger.js';

initializeIsolatedBridge({
    windowApi: window,
    chromeApi: chrome,
    log: createLoggerFactory('ISOLATED')()
});
