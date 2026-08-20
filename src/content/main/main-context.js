export class MainContext {
    constructor({
        logger,
        transport,
        operationGuard,
        executionHistoryService,
        edvibeApi,
        pageContext,
    }) {
        this.logger = logger;
        this.transport = transport;
        this.operationGuard = operationGuard;
        this.executionHistoryService = executionHistoryService;
        this.edvibeApi = edvibeApi;
        this.pageContext = pageContext;
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
