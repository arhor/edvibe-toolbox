class IndexedDbError extends Error {
    constructor(message, context = {}, cause) {
        super(message, cause === undefined ? undefined : { cause });
        this.name = 'IndexedDbError';
        this.context = Object.freeze({ ...context });
        if (cause !== undefined && this.cause === undefined) {
            this.cause = cause;
        }
    }
}

function errorMessage(action, context) {
    const details = [
        context.database && `database=${context.database}`,
        context.stores && `stores=${context.stores.join(',')}`,
        context.store && `store=${context.store}`,
        context.index && `index=${context.index}`,
        context.mode && `mode=${context.mode}`,
        context.operation && `operation=${context.operation}`,
        context.version && `version=${context.version}`
    ].filter(Boolean).join(' ');
    return details ? `${action} (${details})` : action;
}

function wrapError(action, context, cause) {
    if (cause instanceof IndexedDbError) {
        return cause;
    }
    return new IndexedDbError(errorMessage(action, context), context, cause);
}

function requestToPromise(request, context = {}) {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(wrapError('IndexedDB request failed', context, request.error));
    });
}

function transactionToPromise(transaction, context = {}) {
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(wrapError('IndexedDB transaction failed', context, transaction.error));
        transaction.onabort = () => reject(wrapError('IndexedDB transaction aborted', context, transaction.error));
    });
}

function normalizeStores(storeNames) {
    const stores = typeof storeNames === 'string' ? [storeNames] : Array.from(storeNames || []);
    if (stores.length === 0) {
        throw new TypeError('At least one object store is required');
    }
    return stores;
}

function normalizeMigrations(definition) {
    const migrations = Array.from(definition.migrations || []).sort((left, right) => left.version - right.version);
    const seen = new Set();
    for (const migration of migrations) {
        if (!Number.isInteger(migration.version) || migration.version < 1 || migration.version > definition.version) {
            throw new TypeError(`Invalid migration version: ${migration.version}`);
        }
        if (seen.has(migration.version)) {
            throw new TypeError(`Duplicate migration version: ${migration.version}`);
        }
        if (typeof migration.migrate !== 'function') {
            throw new TypeError(`Migration ${migration.version} must define migrate()`);
        }
        seen.add(migration.version);
    }
    return migrations;
}

function cursorToPromise(source, options, context) {
    const {
        range = null,
        direction = 'next',
        limit = Infinity,
        keysOnly = false,
        map = null
    } = options || {};

    if (!Number.isFinite(limit) && limit !== Infinity) {
        throw new TypeError('Cursor limit must be a finite number or Infinity');
    }
    if (limit < 0) {
        throw new RangeError('Cursor limit cannot be negative');
    }
    if (limit === 0) {
        return Promise.resolve([]);
    }

    return new Promise((resolve, reject) => {
        const results = [];
        let request;
        try {
            request = keysOnly
                ? source.openKeyCursor(range, direction)
                : source.openCursor(range, direction);
        } catch (error) {
            reject(wrapError('Failed to open IndexedDB cursor', context, error));
            return;
        }

        request.onerror = () => reject(wrapError('IndexedDB cursor failed', context, request.error));
        request.onsuccess = () => {
            const cursor = request.result;
            if (!cursor || results.length >= limit) {
                resolve(results);
                return;
            }

            const raw = keysOnly ? cursor.primaryKey : cursor.value;
            results.push(typeof map === 'function' ? map(raw, cursor) : raw);
            cursor.continue();
        };
    });
}

function createSourceHelpers(source, context) {
    return {
        raw: source,
        get(key) {
            return requestToPromise(source.get(key), { ...context, operation: 'get' });
        },
        getKey(query) {
            return requestToPromise(source.getKey(query), { ...context, operation: 'getKey' });
        },
        getAll(query = null, count) {
            return requestToPromise(source.getAll(query, count), { ...context, operation: 'getAll' });
        },
        getAllKeys(query = null, count) {
            return requestToPromise(source.getAllKeys(query, count), { ...context, operation: 'getAllKeys' });
        },
        count(query = null) {
            return requestToPromise(source.count(query), { ...context, operation: 'count' });
        },
        iterate(options = {}) {
            return cursorToPromise(source, options, { ...context, operation: 'iterate' });
        }
    };
}

function createStoreHelpers(store, context) {
    return {
        ...createSourceHelpers(store, context),
        put(value, key) {
            return requestToPromise(store.put(value, key), { ...context, operation: 'put' });
        },
        add(value, key) {
            return requestToPromise(store.add(value, key), { ...context, operation: 'add' });
        },
        delete(key) {
            return requestToPromise(store.delete(key), { ...context, operation: 'delete' });
        },
        clear() {
            return requestToPromise(store.clear(), { ...context, operation: 'clear' });
        },
        index(indexName) {
            const index = store.index(indexName);
            return createSourceHelpers(index, { ...context, index: indexName });
        }
    };
}

function createIndexedDb(definition, options = {}) {
    if (!definition || typeof definition.name !== 'string' || definition.name.length === 0) {
        throw new TypeError('Database definition requires a non-empty name');
    }
    if (!Number.isInteger(definition.version) || definition.version < 1) {
        throw new TypeError('Database definition requires a positive integer version');
    }

    const indexedDbFactory = options.indexedDB || globalThis.indexedDB;
    if (!indexedDbFactory || typeof indexedDbFactory.open !== 'function') {
        throw new TypeError('An IndexedDB factory is required');
    }

    const migrations = normalizeMigrations(definition);
    let connection = null;
    let opening = null;

    function invalidate(db) {
        if (connection === db) {
            connection = null;
        }
        opening = null;
    }

    function open() {
        if (connection) {
            return Promise.resolve(connection);
        }
        if (opening) {
            return opening;
        }

        opening = new Promise((resolve, reject) => {
            let request;
            let settled = false;
            let blockedTimer = null;
            try {
                request = indexedDbFactory.open(definition.name, definition.version);
            } catch (error) {
                reject(wrapError('Failed to open IndexedDB database', {
                    database: definition.name,
                    version: definition.version
                }, error));
                return;
            }

            const fail = (error) => {
                if (settled) {
                    return;
                }
                settled = true;
                if (blockedTimer !== null) {
                    clearTimeout(blockedTimer);
                }
                opening = null;
                reject(error);
            };

            request.onblocked = () => {
                const context = {
                    database: definition.name,
                    version: definition.version,
                    operation: 'open'
                };
                const error = wrapError('IndexedDB upgrade is blocked by another open connection', context, request.error);
                if (typeof options.onBlocked === 'function') {
                    options.onBlocked(error, context);
                }
                if (options.blockedTimeoutMs > 0 && blockedTimer === null) {
                    blockedTimer = setTimeout(() => fail(error), options.blockedTimeoutMs);
                }
            };

            request.onupgradeneeded = (event) => {
                const db = request.result;
                const transaction = request.transaction;
                try {
                    for (const migration of migrations) {
                        if (migration.version > event.oldVersion && migration.version <= event.newVersion) {
                            migration.migrate({
                                db,
                                transaction,
                                oldVersion: event.oldVersion,
                                newVersion: event.newVersion,
                                version: migration.version
                            });
                        }
                    }
                } catch (error) {
                    try {
                        transaction.abort();
                    } catch (_) {
                        // The browser may already have aborted the upgrade transaction.
                    }
                    fail(wrapError('IndexedDB migration failed', {
                        database: definition.name,
                        version: event.newVersion,
                        operation: 'migrate'
                    }, error));
                }
            };

            request.onerror = () => fail(wrapError('Failed to open IndexedDB database', {
                database: definition.name,
                version: definition.version,
                operation: 'open'
            }, request.error));

            request.onsuccess = () => {
                const db = request.result;
                if (settled) {
                    db.close();
                    return;
                }
                settled = true;
                if (blockedTimer !== null) {
                    clearTimeout(blockedTimer);
                }
                connection = db;
                opening = null;
                db.onversionchange = () => {
                    db.close();
                    invalidate(db);
                    if (typeof options.onVersionChange === 'function') {
                        options.onVersionChange({ database: definition.name, version: db.version });
                    }
                };
                resolve(db);
            };
        });

        return opening;
    }

    async function runTransaction(storeNames, mode, callback, operation = 'transaction') {
        const stores = normalizeStores(storeNames);
        if (mode !== 'readonly' && mode !== 'readwrite') {
            throw new TypeError(`Unsupported transaction mode: ${mode}`);
        }
        if (typeof callback !== 'function') {
            throw new TypeError('Transaction callback must be a function');
        }

        const db = await open();
        const context = { database: definition.name, stores, mode, operation };
        let transaction;
        try {
            transaction = db.transaction(stores, mode);
        } catch (error) {
            throw wrapError('Failed to create IndexedDB transaction', context, error);
        }

        const completion = transactionToPromise(transaction, context);
        const helpers = Object.create(null);
        for (const storeName of stores) {
            helpers[storeName] = createStoreHelpers(transaction.objectStore(storeName), {
                ...context,
                store: storeName
            });
        }

        let result;
        try {
            result = callback({
                transaction,
                stores: helpers,
                store(name) {
                    if (!helpers[name]) {
                        throw new IndexedDbError(errorMessage('Store is not part of this transaction', {
                            ...context,
                            store: name
                        }), { ...context, store: name });
                    }
                    return helpers[name];
                },
                abort(reason) {
                    if (reason !== undefined && transaction.error === null) {
                        try {
                            Object.defineProperty(transaction, '__edvibeAbortReason', { value: reason });
                        } catch (_) {
                            // Native transactions may be non-extensible.
                        }
                    }
                    transaction.abort();
                }
            });
        } catch (error) {
            try {
                transaction.abort();
            } catch (_) {
                // Ignore secondary abort failures.
            }
            try {
                await completion;
            } catch (_) {
                // The callback error is the actionable cause.
            }
            throw wrapError('IndexedDB transaction callback failed', context, error);
        }

        try {
            const [value] = await Promise.all([Promise.resolve(result), completion]);
            return value;
        } catch (error) {
            const cause = transaction.__edvibeAbortReason || error;
            throw wrapError('IndexedDB transaction did not commit', context, cause);
        }
    }

    function repository(storeName) {
        return {
            get(key) {
                return runTransaction(storeName, 'readonly', ({ store }) => store(storeName).get(key), `get:${storeName}`);
            },
            put(value, key) {
                return runTransaction(storeName, 'readwrite', ({ store }) => store(storeName).put(value, key), `put:${storeName}`);
            },
            add(value, key) {
                return runTransaction(storeName, 'readwrite', ({ store }) => store(storeName).add(value, key), `add:${storeName}`);
            },
            delete(key) {
                return runTransaction(storeName, 'readwrite', ({ store }) => store(storeName).delete(key), `delete:${storeName}`);
            },
            clear() {
                return runTransaction(storeName, 'readwrite', ({ store }) => store(storeName).clear(), `clear:${storeName}`);
            },
            count(query = null) {
                return runTransaction(storeName, 'readonly', ({ store }) => store(storeName).count(query), `count:${storeName}`);
            },
            iterate(options = {}) {
                return runTransaction(storeName, 'readonly', ({ store }) => store(storeName).iterate(options), `iterate:${storeName}`);
            },
            queryIndex(indexName, options = {}) {
                return runTransaction(storeName, 'readonly', ({ store }) => {
                    return store(storeName).index(indexName).iterate(options);
                }, `query-index:${storeName}.${indexName}`);
            },
            newest(indexName, options = {}) {
                return this.queryIndex(indexName, { ...options, direction: 'prev' });
            }
        };
    }

    function close() {
        if (connection) {
            const db = connection;
            connection = null;
            db.close();
        }
        opening = null;
    }

    return Object.freeze({
        name: definition.name,
        version: definition.version,
        open,
        close,
        reset: close,
        transaction: runTransaction,
        readonly(storeNames, callback, operation) {
            return runTransaction(storeNames, 'readonly', callback, operation);
        },
        readwrite(storeNames, callback, operation) {
            return runTransaction(storeNames, 'readwrite', callback, operation);
        },
        repository
    });
}

export {
    IndexedDbError,
    createIndexedDb,
    requestToPromise,
    transactionToPromise
};
