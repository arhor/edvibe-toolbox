import {
    createSummary,
    formatExecutionStatus
} from '../components/execution-history-dialog.js';
import {
    cleanup,
    elementUpdated,
    equal,
    fixture,
    shadowQuery
} from './component-test-harness.js';

function createRecord(id, operationType, status = 'completed') {
    return {
        id,
        operationType,
        status,
        pageContext: {marathonId: 42, marathonName: 'Course'},
        startedAt: '2026-08-01T10:00:00.000Z',
        completedAt: '2026-08-01T10:01:00.000Z',
        counts: {successful: 2, failed: 1, skipped: 0},
        results: [{
            status: 'failed',
            label: 'User one',
            message: 'Rejected',
            code: 'bad-input',
            attempts: 1,
            data: {email: 'user@example.com'}
        }]
    };
}

export async function runExecutionHistoryDialogTests() {
    equal(formatExecutionStatus('completed_with_failures'), 'Completed with failures');
    const summary = createSummary(createRecord('summary', 'batch-demo'));
    equal(summary.title, 'batch-demo');
    equal(summary.subtitle, 'Course');
    equal(summary.outcome, '2 successful · 1 failed · 0 skipped');

    let records = [
        createRecord('one', 'batch-demo'),
        createRecord('two', 'batch-other', 'cancelled')
    ];
    const calls = {filters: [], exported: [], deleted: [], cleared: 0, preferences: []};
    const service = {
        async list(filters) {
            calls.filters.push({...filters});
            return [...records];
        },
        async get(id) {
            return records.find((record) => record.id === id) || null;
        },
        async getPreferences() {
            return {mode: 'limits', maxCount: 25, maxAgeDays: 30, autoExport: false};
        },
        async setPreferences(preferences) {
            calls.preferences.push(preferences);
        },
        async exportFiltered(filters) {
            calls.exported.push({type: 'filtered', filters: {...filters}});
        },
        async exportRecord(id) {
            calls.exported.push({type: 'record', id});
        },
        async delete(id) {
            calls.deleted.push(id);
            records = records.filter((record) => record.id !== id);
        },
        async clear() {
            calls.cleared += 1;
            records = [];
        }
    };

    let closeCalls = 0;
    const dialog = await fixture('<edvibe-toolbox-execution-history-dialog></edvibe-toolbox-execution-history-dialog>');
    dialog.configure({
        stylesheetUrl: '/src/components/execution-history-dialog.css',
        service,
        onClose: () => { closeCalls += 1; }
    });
    dialog.confirm = () => true;
    await dialog.initialize();
    await elementUpdated(dialog);

    equal(shadowQuery(dialog, '[data-role="record-count"]').textContent, '2 executions');
    equal(shadowQuery(dialog, '[data-role="record-list"]').querySelectorAll('.record-card').length, 2);
    equal(shadowQuery(dialog, '[name="maxCount"]').value, '25');
    equal(shadowQuery(dialog, '[name="maxAgeDays"]').value, '30');

    await dialog.openRecord('one');
    await elementUpdated(dialog);
    equal(shadowQuery(dialog, '[data-role="detail"] h3').textContent, 'batch-demo');
    equal(shadowQuery(dialog, '[data-role="detail"]').textContent.includes('User one'), true);

    dialog.setFilter('status', 'completed');
    await dialog.loadRecords();
    equal(calls.filters.at(-1).status, 'completed');

    await dialog.handleAction('export-filtered');
    equal(calls.exported.at(-1).type, 'filtered');
    equal(calls.exported.at(-1).filters.status, 'completed');

    await dialog.openRecord('one');
    await dialog.handleAction('download-one');
    equal(calls.exported.at(-1).id, 'one');

    dialog.updatePreference('mode', 'indefinite');
    dialog.updatePreference('autoExport', true);
    await dialog.handleAction('save-preferences');
    equal(calls.preferences.at(-1).mode, 'indefinite');
    equal(calls.preferences.at(-1).autoExport, true);

    await dialog.openRecord('one');
    await dialog.handleAction('delete-one');
    await elementUpdated(dialog);
    equal(calls.deleted[0], 'one');
    equal(shadowQuery(dialog, '[data-role="record-count"]').textContent, '1 execution');

    await dialog.handleAction('clear-all');
    await elementUpdated(dialog);
    equal(calls.cleared, 1);
    equal(shadowQuery(dialog, '[data-role="state"]').textContent, 'No executions match these filters.');

    await dialog.handleAction('close');
    equal(closeCalls, 1);
    await cleanup();
}
