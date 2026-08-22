import * as recordApi from '#src/content/main/application/execution-history-record.js';

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

export {
    serializeExecutionRecord,
    serializeExecutionRecords,
    createExecutionFilename,
    createHistoryFilename
};
