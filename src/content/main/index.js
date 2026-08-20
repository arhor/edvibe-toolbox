import features from '#src/content/main/features/index.js';
import { createMainRuntime } from '#src/content/main/main-runtime.js';
import { Logger } from '#src/shared/logger.js';

const logger = new Logger({ namespace: 'MAIN' });

logger.log('Initializing Toolbox modules...');

const { dispatcher } = createMainRuntime({
    logger,
    features,
});

window.addEventListener('message', ({ source, data }) => {
    if (source !== window) {
        return;
    }
    dispatcher.dispatch(data);
});

logger.log('Toolbox modules ready.');
