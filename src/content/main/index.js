import { FeatureDispatcher } from '#src/content/main/feature-dispatcher.js';
import features from '#src/content/main/features/index.js';
import { createLoggerFactory } from '#src/shared/logger.js';

const logFactory = createLoggerFactory('MAIN');
const log = logFactory();

log('Initializing Toolbox modules...');

const dispatcher = new FeatureDispatcher({
    logFactory,
    features,
});

window.addEventListener('message', ({ source, data }) => {
    if (source !== window) {
        return;
    }
    dispatcher.dispatch(data);
});

log('Toolbox modules ready.');
