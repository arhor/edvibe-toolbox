import { createBrowserExecutionHistoryService } from '#src/content/main/infrastructure/browser-execution-history-service.js';
import { OperationGuard } from '#src/content/main/infrastructure/operation-guard.js';
import { createWebSocketTransport } from '#src/content/main/infrastructure/websocket-transport.js';
import { isMainCommandMessage } from '#src/shared/messaging/protocol.js';

export class FeatureDispatcher {
    constructor({ logger, features }) {
        this.features = new Map();
        this.operationGuard = new OperationGuard();

        this.logger = logger;

        this.transport = createWebSocketTransport({ logger });
        this.executionHistoryService = createBrowserExecutionHistoryService();

        this.register = this.register.bind(this);
        this.dispatch = this.dispatch.bind(this);

        features.forEach((feature) => this.register(feature));
    }

    register({ type, create }) {
        if (typeof type !== 'string' || typeof create !== 'function') {
            throw new TypeError('Feature definition must provide a type and create function');
        }
        if (this.features.has(type)) {
            throw new TypeError(`Feature "${type}" is already registered`);
        }

        const handler = create({
            transport: this.transport,
            operationGuard: this.operationGuard,
            executionHistoryService: this.executionHistoryService,
            logger: this.logger,
            dispatch: this.dispatch,
        });

        if (typeof handler !== 'function') {
            throw new TypeError(`Feature "${type}" must create a command handler`);
        }

        this.features.set(type, handler);
    }

    dispatch(message) {
        if (!isMainCommandMessage(message)) {
            return false;
        }
        const handler = this.features.get(message.type);
        if (!handler) {
            return false;
        }
        handler(message);
        return true;
    }
}
