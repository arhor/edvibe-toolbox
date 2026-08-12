import { createLoggerFactory } from '@/shared/logger.js';
import { initializeIsolatedBridge } from './bridge.js';

initializeIsolatedBridge({
    windowApi: window,
    chromeApi: chrome,
    log: createLoggerFactory('ISOLATED')()
});
