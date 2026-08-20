import { isMainCommandMessage } from '#src/shared/messaging/protocol.js';

export class FeatureDispatcher {
    constructor({ context, features = [] } = {}) {
        if (!context || typeof context !== 'object') {
            throw new TypeError('context is required');
        }
        if (typeof context.logger?.createChildLogger !== 'function') {
            throw new TypeError('context must provide a logger');
        }
        if (typeof context.registerDispatch !== 'function') {
            throw new TypeError('context must provide dispatch registration');
        }
        if (!Array.isArray(features)) {
            throw new TypeError('features must be an array');
        }

        this.features = new Map();
        this.context = context;
        this.logger = context.logger.createChildLogger('FeatureDispatcher');

        this.register = this.register.bind(this);
        this.dispatch = this.dispatch.bind(this);

        context.registerDispatch(this.dispatch);
        features.forEach(this.register);
    }

    register({ type, create }) {
        if (typeof type !== 'string' || typeof create !== 'function') {
            throw new TypeError('Feature definition must provide a type and create function');
        }
        if (this.features.has(type)) {
            throw new TypeError(`Feature "${type}" is already registered`);
        }

        const handler = create(this.context);

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
