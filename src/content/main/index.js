import { FeatureDispatcher } from '#src/content/main/feature-dispatcher.js';
import features from '#src/content/main/features/index.js';
import { createBrowserExecutionHistoryService } from '#src/content/main/infrastructure/browser-execution-history-service.js';
import { createEdvibeMarathonApi } from '#src/content/main/infrastructure/edvibe-marathon-api.js';
import { OperationGuard } from '#src/content/main/infrastructure/operation-guard.js';
import { createWebSocketTransport } from '#src/content/main/infrastructure/websocket-transport.js';
import { MainContext } from '#src/content/main/main-context.js';
import { PageContext } from '#src/content/main/page-context.js';
import { Logger } from '#src/shared/logger.js';

const logger = new Logger({ namespace: 'MAIN' });

logger.log('Initializing Toolbox modules...');

const operationGuard = new OperationGuard();
const transport = createWebSocketTransport({ logger });
const executionHistoryService = createBrowserExecutionHistoryService();
const edvibeApi = createEdvibeMarathonApi({
    sendRequest: transport.sendRequest
});
const pageContext = new PageContext();
const context = new MainContext({
    logger,
    transport,
    operationGuard,
    executionHistoryService,
    edvibeApi,
    pageContext
});
const dispatcher = new FeatureDispatcher({ context, features });

window.addEventListener('message', ({ source, data }) => {
    if (source !== window) {
        return;
    }
    dispatcher.dispatch(data);
});

logger.log('Toolbox modules ready.');
