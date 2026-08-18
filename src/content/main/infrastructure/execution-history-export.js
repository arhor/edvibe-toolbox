import * as recordApi from '#src/content/main/infrastructure/execution-history-record.js';

function serializeExecutionRecord(record) {
    return `${JSON.stringify(recordApi.cloneExecutionRecord(record), null, 2)}\n`;
}

function serializeExecutionRecords(records) {
    if (!Array.isArray(records)) {
        throw new TypeError('Records must be an array');
    }
    const normalizedRecords = records.map(recordApi.cloneExecutionRecord);
    return `${JSON.stringify(normalizedRecords, null, 2)}\n`;
}

function slug(value) {
    return String(value || 'operation').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'operation';
}

function compactTimestamp(value) {
    return new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function createExecutionFilename(record) {
    recordApi.validateExecutionRecord(record);
    return `edvibe-${slug(record.operationType)}-${compactTimestamp(record.completedAt)}-${slug(record.id).slice(-36)}.json`;
}

function createHistoryFilename(now = new Date()) {
    return `edvibe-execution-history-${compactTimestamp(now)}.json`;
}

function createJsonDownloader(options = {}) {
    const documentApi = options.document || globalThis.document;
    const URLApi = options.URL || globalThis.URL;
    const BlobClass = options.Blob || globalThis.Blob;
    if (!documentApi?.createElement || !URLApi?.createObjectURL || !BlobClass) {
        return Object.freeze({
            download() {
                throw new Error('Browser download APIs are unavailable');
            }
        });
    }
    return Object.freeze({
        download({ filename, json }) {
            const blob = new BlobClass([json], { type: 'application/json;charset=utf-8' });
            const url = URLApi.createObjectURL(blob);
            const anchor = documentApi.createElement('a');
            anchor.href = url;
            anchor.download = filename;
            anchor.hidden = true;
            (documentApi.body || documentApi.documentElement).append(anchor);
            try {
                anchor.click(); 
            } finally {
                anchor.remove();
                URLApi.revokeObjectURL(url);
            }
        }
    });
}

export {
    serializeExecutionRecord,
    serializeExecutionRecords,
    createExecutionFilename,
    createHistoryFilename,
    createJsonDownloader
};
