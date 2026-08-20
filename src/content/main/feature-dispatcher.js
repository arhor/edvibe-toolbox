import { isMainCommandMessage } from '#src/shared/messaging/protocol.js';

export class FeatureDispatcher {
    constructor({ runtimeContext }) {
        if (!runtimeContext || typeof runtimeContext !== 'object') {
            throw new TypeError('runtimeContext is required');
        }
        if (typeof runtimeContext.logger?.log !== 'function') {
            throw new TypeError('runtimeContext must provide a logger');
        }

        this.features = new Map();
        this.runtimeContext = runtimeContext;
        this.logger = runtimeContext.logger;

        this.register = this.register.bind(this);
        this.dispatch = this.dispatch.bind(this);
    }

    register({ type, create }) {
        if (typeof type !== 'string' || typeof create !== 'function') {
            throw new TypeError('Feature definition must provide a type and create function');
        }
        if (this.features.has(type)) {
            throw new TypeError(`Feature "${type}" is already registered`);
        }

        const handler = create(this.runtimeContext);

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
        try {
            Promise.resolve(handler(message)).catch((error) => {
                this.logger.log(`Feature "${message.type}" failed:`, error);
            });
        } catch (error) {
            this.logger.log(`Feature "${message.type}" failed:`, error);
        }
        return true;
    }
}
