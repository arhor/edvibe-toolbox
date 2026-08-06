(function initializeExecutionHistoryService(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory(
            require('./execution-history-record.js'),
            require('./execution-history-retention.js'),
            require('./execution-history-export.js')
        );
    } else {
        root.EdVibeExecutionHistoryService = factory(
            root.EdVibeExecutionHistoryRecord,
            root.EdVibeExecutionHistoryRetention,
            root.EdVibeExecutionHistoryExport
        );
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createModule(recordApi, retentionApi, exportApi) {
    'use strict';

    function createExecutionHistoryService(options) {
        const { repository, preferenceStore, downloader } = options || {};
        if (!repository || !preferenceStore || !downloader) throw new TypeError('Repository, preference store, and downloader are required');
        const cryptoApi = options.cryptoApi;
        const now = typeof options.now === 'function' ? options.now : () => new Date();

        async function persistTerminal(input) {
            const record = recordApi.buildExecutionRecord(input, { cryptoApi, now: now() });
            try {
                await repository.persist(record);
            } catch (persistenceError) {
                return Object.freeze({ stored: false, record, persistenceError, retentionError: null, exportError: null });
            }

            let preferences;
            let retentionError = null;
            let exportError = null;
            try {
                preferences = await preferenceStore.get();
                await retentionApi.applyRetention({
                    repository,
                    preferences,
                    now: now(),
                    protectedExecutionId: record.id
                });
            } catch (error) {
                retentionError = error;
                preferences = preferences || retentionApi.DEFAULT_RETENTION_PREFERENCES;
            }
            if (preferences.autoExport) {
                try { downloadRecord(record); }
                catch (error) { exportError = error; }
            }
            return Object.freeze({ stored: true, record, persistenceError: null, retentionError, exportError });
        }

        function downloadRecord(record) {
            downloader.download({
                filename: exportApi.createExecutionFilename(record),
                json: exportApi.serializeExecutionRecord(record)
            });
        }

        return Object.freeze({
            persistTerminal,
            get: (executionId) => repository.get(executionId),
            list: (filters) => repository.list(filters),
            delete: (executionId) => repository.delete(executionId),
            clear: () => repository.clear(),
            getPreferences: () => preferenceStore.get(),
            setPreferences: (preferences) => preferenceStore.set(preferences),
            exportRecord: async (executionId) => {
                const record = await repository.get(executionId);
                if (!record) throw new Error('Execution record was not found');
                downloadRecord(record);
                return record;
            },
            exportFiltered: async (filters = {}) => {
                const records = await repository.list(filters);
                downloader.download({
                    filename: exportApi.createHistoryFilename(now()),
                    json: exportApi.serializeExecutionRecords(records)
                });
                return records;
            }
        });
    }

    return Object.freeze({ createExecutionHistoryService });
});
