const test = require('node:test');
const assert = require('node:assert/strict');

const {
    IndexedDbError,
    createIndexedDb,
    requestToPromise
} = require('../src/shared/indexeddb.js');

class FakeRequest {
    succeed(result) {
        this.result = result;
        queueMicrotask(() => this.onsuccess?.({ target: this }));
        return this;
    }

    fail(error) {
        this.error = error;
        queueMicrotask(() => this.onerror?.({ target: this }));
        return this;
    }
}

class FakeCursorSource {
    constructor(values) {
        this.values = values;
    }

    openCursor(_range, direction) {
        const request = new FakeRequest();
        const values = direction === 'prev' ? [...this.values].reverse() : [...this.values];
        let index = 0;
        const makeCursor = () => ({
            value: values[index],
            primaryKey: values[index].id,
            continue() {
                index += 1;
                request.result = index < values.length ? makeCursor() : null;
                queueMicrotask(() => request.onsuccess?.({ target: request }));
            }
        });
        request.result = values.length ? makeCursor() : null;
        queueMicrotask(() => request.onsuccess?.({ target: request }));
        return request;
    }

    openKeyCursor(range, direction) { return this.openCursor(range, direction); }
    get(key) { return new FakeRequest().succeed(this.values.find((value) => value.id === key)); }
    getKey() { return new FakeRequest().succeed(this.values[0]?.id); }
    getAll() { return new FakeRequest().succeed([...this.values]); }
    getAllKeys() { return new FakeRequest().succeed(this.values.map((value) => value.id)); }
    count() { return new FakeRequest().succeed(this.values.length); }
}

class FakeStore extends FakeCursorSource {
    put(value) {
        const index = this.values.findIndex((item) => item.id === value.id);
        if (index >= 0) this.values[index] = value;
        else this.values.push(value);
        return new FakeRequest().succeed(value.id);
    }

    add(value) {
        if (this.values.some((item) => item.id === value.id)) {
            return new FakeRequest().fail(new Error('ConstraintError'));
        }
        this.values.push(value);
        return new FakeRequest().succeed(value.id);
    }

    delete(key) {
        const index = this.values.findIndex((item) => item.id === key);
        if (index >= 0) this.values.splice(index, 1);
        return new FakeRequest().succeed(undefined);
    }

    clear() {
        this.values.splice(0);
        return new FakeRequest().succeed(undefined);
    }

    index() { return this; }
}

class FakeTransaction {
    constructor(stores, commitDelay = 0) {
        this.stores = stores;
        this.error = null;
        setTimeout(() => {
            if (!this.aborted) this.oncomplete?.();
        }, commitDelay);
    }

    objectStore(name) { return this.stores[name]; }

    abort() {
        this.aborted = true;
        queueMicrotask(() => this.onabort?.());
    }
}

class FakeDatabase {
    constructor(stores = {}) {
        this.stores = stores;
        this.version = 1;
        this.closeCount = 0;
        this.transactions = [];
        this.objectStoreNames = { contains: (name) => Object.hasOwn(this.stores, name) };
    }

    createObjectStore(name) {
        const store = new FakeStore([]);
        this.stores[name] = store;
        return store;
    }

    transaction(names) {
        const selected = Object.fromEntries(Array.from(names).map((name) => [name, this.stores[name]]));
        const transaction = new FakeTransaction(selected, 15);
        this.transactions.push(transaction);
        return transaction;
    }

    close() { this.closeCount += 1; }
}

class FakeFactory {
    constructor(database) {
        this.database = database;
        this.openCount = 0;
        this.oldVersion = 0;
    }

    open(_name, version) {
        this.openCount += 1;
        const request = new FakeRequest();
        request.result = this.database;
        request.transaction = new FakeTransaction(this.database.stores);
        queueMicrotask(() => {
            request.onupgradeneeded?.({ oldVersion: this.oldVersion, newVersion: version });
            queueMicrotask(() => request.onsuccess?.({ target: request }));
        });
        return request;
    }
}

test('request adapter preserves the native error as cause', async () => {
    const nativeError = new Error('boom');
    const request = new FakeRequest().fail(nativeError);

    await assert.rejects(requestToPromise(request, { operation: 'demo' }), (error) => {
        assert.ok(error instanceof IndexedDbError);
        assert.equal(error.cause, nativeError);
        assert.equal(error.context.operation, 'demo');
        return true;
    });
});

test('open runs ordered migrations once and reuses the connection', async () => {
    const database = new FakeDatabase();
    const factory = new FakeFactory(database);
    const applied = [];
    const db = createIndexedDb({
        name: 'test',
        version: 3,
        migrations: [
            { version: 3, migrate: () => applied.push(3) },
            { version: 1, migrate: ({ db: opened }) => { opened.createObjectStore('items'); applied.push(1); } },
            { version: 2, migrate: () => applied.push(2) }
        ]
    }, { indexedDB: factory });

    const first = await db.open();
    const second = await db.open();

    assert.equal(first, second);
    assert.deepEqual(applied, [1, 2, 3]);
    assert.equal(factory.openCount, 1);
});

test('versionchange closes and invalidates the cached connection', async () => {
    const database = new FakeDatabase({ items: new FakeStore([]) });
    const factory = new FakeFactory(database);
    const db = createIndexedDb({ name: 'test', version: 1 }, { indexedDB: factory });

    await db.open();
    database.onversionchange();
    await db.open();

    assert.equal(database.closeCount, 1);
    assert.equal(factory.openCount, 2);
});

test('readwrite resolves only after the transaction commits', async () => {
    const database = new FakeDatabase({ items: new FakeStore([]) });
    const db = createIndexedDb({ name: 'test', version: 1 }, { indexedDB: new FakeFactory(database) });
    const events = [];

    const result = await db.readwrite('items', ({ store }) => {
        events.push('callback');
        return store('items').put({ id: 1 }).then(() => {
            events.push('request');
            return 'saved';
        });
    }, 'save-item').then((value) => {
        events.push('resolved');
        return value;
    });

    assert.equal(result, 'saved');
    assert.deepEqual(events, ['callback', 'request', 'resolved']);
});

test('repository supports CRUD and newest-first limited index queries', async () => {
    const store = new FakeStore([{ id: 1 }, { id: 2 }, { id: 3 }]);
    const database = new FakeDatabase({ items: store });
    const db = createIndexedDb({ name: 'test', version: 1 }, { indexedDB: new FakeFactory(database) });
    const repository = db.repository('items');

    assert.equal((await repository.get(2)).id, 2);
    await repository.put({ id: 4 });
    assert.equal(await repository.count(), 4);
    assert.deepEqual((await repository.newest('createdAt', { limit: 2 })).map((item) => item.id), [4, 3]);
    await repository.delete(1);
    assert.equal(await repository.count(), 3);
    await repository.clear();
    assert.equal(await repository.count(), 0);
});

test('callback failures abort and produce contextual errors', async () => {
    const database = new FakeDatabase({ items: new FakeStore([]) });
    const db = createIndexedDb({ name: 'test', version: 1 }, { indexedDB: new FakeFactory(database) });

    await assert.rejects(db.readwrite('items', () => {
        throw new Error('invalid state');
    }, 'validate'), (error) => {
        assert.ok(error instanceof IndexedDbError);
        assert.match(error.message, /operation=validate/);
        assert.equal(error.cause.message, 'invalid state');
        return true;
    });
});
