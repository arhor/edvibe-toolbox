import { FeatureDispatcher } from '#src/content/main/feature-dispatcher.js';
import { createMainRuntime } from '#src/content/main/main-runtime.js';
import { Logger } from '#src/shared/logger.js';

const logger = new Logger({ namespace: 'MAIN' });

logger.log('Initializing Toolfox modules...');

const runtime = createMainRuntime({
    globalObject: window,
    location: window.location,
    logger
});

if (runtime) {
    const dispatcher = new FeatureDispatcher({
        context: runtime.context,
        features: runtime.features
    });

    window.addEventListener('message', ({ source, data }) => {
        if (source !== window) {
            return;
        }
        dispatcher.dispatch(data);
    });

    logger.log(`Toolfox modules ready for ${runtime.platform}.`);
} else {
    logger.log('Toolfox MAIN runtime is unsupported on this page.');
}
