import { createBrowserExecutionHistoryService } from '#src/content/main/infrastructure/browser-execution-history-service.js';
import { createEdvibeMarathonApi } from '#src/content/main/infrastructure/edvibe-marathon-api.js';
import { OperationGuard } from '#src/content/main/infrastructure/operation-guard.js';
import { createWebSocketTransport } from '#src/content/main/infrastructure/websocket-transport.js';
import { PageContext } from '#src/content/main/page-context.js';

export class MainContext {
    constructor({
        logger,
    }) {
        this.logger = logger;
        this.transport = createWebSocketTransport({ logger });
        this.operationGuard = new OperationGuard();
        this.executionHistoryService = createBrowserExecutionHistoryService();
        this.edvibeApi = createEdvibeMarathonApi({ sendRequest: this.transport.sendRequest });
        this.pageContext = new PageContext();
        this.dispatch = null;

        this.registerDispatch = this.registerDispatch.bind(this);
    }

    registerDispatch(dispatch) {
        if (typeof dispatch !== 'function') {
            throw new TypeError('dispatch must be a function');
        }
        if (this.dispatch !== null) {
            throw new Error('dispatch is already registered');
        }

        this.dispatch = dispatch;
    }
}
