/* eslint-disable better-mutation/no-mutation */
export class Logger {
    constructor({ namespace, namespaces = null }) {
        this.namespaces = namespaces ?? [validateNamespace(namespace)];

        this.log = this.log.bind(this);
        this.createChildLogger = this.createChildLogger.bind(this);
    }

    log(...args) {
        console.log(
            this.namespaces.map(namespace => `[${namespace}]`).join(''),
            ...args,
        );
    }

    createChildLogger(namespace) {
        return new Logger({
            namespaces: [
                ...this.namespaces,
                validateNamespace(namespace),
            ],
        });
    }
}

function validateNamespace(namespace) {
    if (typeof namespace !== 'string' || !namespace.trim()) {
        throw new Error('Namespace must be a non-empty string.');
    }

    return namespace;
}
