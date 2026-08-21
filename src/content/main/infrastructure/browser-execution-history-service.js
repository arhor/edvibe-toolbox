import { createExecutionHistoryService } from '#src/content/main/application/execution-history-service.js';
import { createBrowserJsonDownloader } from '#src/content/main/infrastructure/browser-json-downloader.js';
import { createStorageBridge } from '#src/content/main/infrastructure/chrome-storage-bridge.js';
import { createExecutionHistoryPreferenceStore } from '#src/content/main/infrastructure/execution-history-preference-store.js';
import * as historyRepositoryApi from '#src/content/main/infrastructure/execution-history-repository.js';
import * as indexedDbApi from '#src/content/main/infrastructure/indexeddb.js';

function createBrowserExecutionHistoryService() {
    return createExecutionHistoryService({
        repository: historyRepositoryApi.createExecutionHistoryRepository({
            indexedDbApi,
            indexedDB: window.indexedDB
        }),
        preferenceStore: createExecutionHistoryPreferenceStore({
            storage: createStorageBridge({ window, cryptoApi: window.crypto })
        }),
        downloader: createBrowserJsonDownloader({
            document,
            URL: window.URL,
            Blob: window.Blob
        }),
        cryptoApi: window.crypto
    });
}

export { createBrowserExecutionHistoryService };
