import { FeatureDispatcher } from '#src/content/main/feature-dispatcher.js';
import { createBrowserExecutionHistoryService } from '#src/content/main/infrastructure/browser-execution-history-service.js';
import { createEdvibeMarathonApi } from '#src/content/main/infrastructure/edvibe-marathon-api.js';
import { OperationGuard } from '#src/content/main/infrastructure/operation-guard.js';
import { createWebSocketTransport } from '#src/content/main/infrastructure/websocket-transport.js';
import { createPageContext } from '#src/content/main/page-context.js';

function createMainRuntime({ logger, features }) {
    const operationGuard = new OperationGuard();
    const transport = createWebSocketTransport({ logger });
    const executionHistoryService = createBrowserExecutionHistoryService();
    const edvibeApi = createEdvibeMarathonApi({
        sendRequest: transport.sendRequest
    });
    const pageContext = createPageContext();

    const runtimeContext = {
        logger,
        operationGuard,
        transport,
        edvibeApi,
        executionHistoryService,
        pageContext,
        dispatch: null,
    };
    const dispatcher = new FeatureDispatcher({ runtimeContext });
    runtimeContext.dispatch = dispatcher.dispatch;
    Object.freeze(runtimeContext);

    for (const feature of features) {
        dispatcher.register(feature);
    }

    return Object.freeze({
        dispatcher,
        runtimeContext,
    });
}

export { createMainRuntime };
