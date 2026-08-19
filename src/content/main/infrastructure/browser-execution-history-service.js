import * as historyExportApi from '#src/content/main/infrastructure/execution-history-export.js';
import * as historyRepositoryApi from '#src/content/main/infrastructure/execution-history-repository.js';
import * as historyRetentionApi from '#src/content/main/infrastructure/execution-history-retention.js';
import * as historyServiceApi from '#src/content/main/infrastructure/execution-history-service.js';
import * as indexedDbApi from '#src/content/main/infrastructure/indexeddb.js';

function createBrowserExecutionHistoryService() {
    return historyServiceApi.createExecutionHistoryService({
        repository: historyRepositoryApi.createExecutionHistoryRepository({
            indexedDbApi,
            indexedDB: window.indexedDB
        }),
        preferenceStore: historyRetentionApi.createRetentionPreferenceStore(),
        downloader: historyExportApi.createJsonDownloader({
            document,
            URL: window.URL,
            Blob: window.Blob
        }),
        cryptoApi: window.crypto
    });
}

export { createBrowserExecutionHistoryService };
