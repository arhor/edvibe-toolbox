# IndexedDB persistence

`src/shared/indexeddb.js` provides the extension-owned IndexedDB boundary. It keeps database lifecycle, migrations, transaction completion, request errors, and common store operations out of feature modules without hiding native IndexedDB concepts.

## Define a database

```js
const historyDb = EdVibeIndexedDb.createIndexedDb({
    name: 'edvibe-toolbox',
    version: 2,
    migrations: [
        {
            version: 1,
            migrate({ db }) {
                if (!db.objectStoreNames.contains('history')) {
                    const store = db.createObjectStore('history', { keyPath: 'id' });
                    store.createIndex('createdAt', 'createdAt');
                }
            }
        },
        {
            version: 2,
            migrate({ transaction }) {
                const store = transaction.objectStore('history');
                if (!store.indexNames.contains('feature')) {
                    store.createIndex('feature', 'feature');
                }
            }
        }
    ]
});
```

Migration versions are explicit integers. Add one migration for each schema version, keep it synchronous, and guard store/index creation with `contains()` where practical. Schema changes run only in the upgrade transaction. Throwing aborts the upgrade and rejects `open()` with an `IndexedDbError` whose `cause` is the original failure.

## Transactions

```js
await historyDb.readwrite(['history', 'metadata'], ({ store, abort }) => {
    const write = store('history').put(entry);
    const metadata = store('metadata').put({ key: 'lastWrite', value: entry.createdAt });

    if (!entry.id) abort(new Error('History entries require an id'));
    return Promise.all([write, metadata]);
}, 'save-history-entry');
```

The callback runs immediately so all IndexedDB work is queued while the transaction is active. Do not await network calls, timers, or unrelated asynchronous work inside it. The returned promise resolves only after both the callback result and the native transaction complete.

## Repository helpers

```js
const history = historyDb.repository('history');

await history.put(entry);
const item = await history.get(entry.id);
const latest = await history.newest('createdAt', {
    range: IDBKeyRange.bound(from, to),
    limit: 50
});
```

Repositories expose `get`, `put`, `add`, `delete`, `clear`, `count`, cursor iteration, indexed queries, and newest-first indexed retrieval. Advanced consumers can use `raw` on a store or index helper and the native transaction passed to the callback.

Call `close()` (or its alias `reset()`) for tests and extension lifecycle cleanup. Open connections close automatically on `versionchange`. Use `onBlocked` to log or surface an upgrade blocked by another extension context.
