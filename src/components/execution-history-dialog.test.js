const test = require('node:test');
const assert = require('node:assert/strict');
const api = require('./execution-history-dialog.js');

test('formats stable status labels and generic record summaries', () => {
    assert.equal(api.formatExecutionStatus('completed_with_failures'), 'Completed with failures');
    assert.deepEqual(api.createSummary({
        operationType: 'batch-demo', pageContext: { marathonName: 'Course' }, counts: { successful: 2, failed: 1, skipped: 3 }
    }), { title: 'batch-demo', subtitle: 'Course', outcome: '2 successful · 1 failed · 3 skipped' });
});
