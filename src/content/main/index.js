import { FeatureDispatcher } from '#src/content/main/feature-dispatcher.js';
import features from '#src/content/main/features/index.js';
import { MainContext } from '#src/content/main/main-context.js';
import { Logger } from '#src/shared/logger.js';

const logger = new Logger({ namespace: 'MAIN' });

logger.log('Initializing Toolbox modules...');

const dispatcher = new FeatureDispatcher({
    features, 
    context: new MainContext({
        logger,
    })
});

window.addEventListener('message', ({ source, data }) => {
    if (source !== window) {
        return;
    }
    dispatcher.dispatch(data);
});

logger.log('Toolbox modules ready.');
