import '../components/batch-user-management-dialog.js';
import {cleanup, click, elementUpdated, equal, fixture, shadowQuery} from './component-test-harness.js';

function row(email, overrides = {}) {
    return {
        email,
        normalizedEmail: email.toLowerCase(),
        pupil: {MarathonPupilId: 22, Email: email, Name: 'User'},
        marathonPupilId: 22,
        hasCurator: true,
        actionable: true,
        status: 'matched',
        message: '',
        unassignSelected: false,
        deleteSelected: false,
        result: {status: 'pending', message: 'Not started'},
        ...overrides
    };
}

export async function runBatchUserManagementDialogTests() {
    const dialog = await fixture('<edvibe-toolbox-batch-user-management-dialog></edvibe-toolbox-batch-user-management-dialog>');
    dialog.configure();
    dialog.setEmailState({validCount: 2, malformedCount: 1});
    dialog.showReview({rows: [
        row('first@example.com'),
        row('second@example.com'),
        row('missing@example.com', {actionable: false, pupil: null, message: 'No marathon pupil found.'})
    ]});
    await elementUpdated(dialog);

    equal(dialog.id, 'edvibe-toolbox-batch-user-management-overlay');
    equal(shadowQuery(dialog, '.edvibe-batch-user-management-table-body').querySelectorAll('tr').length, 3);
    equal(shadowQuery(dialog, '.edvibe-batch-user-management-start').disabled, true);
    equal(shadowQuery(dialog, '.edvibe-batch-user-management-email-count').textContent, 'Уникальных email: 2');

    let selection = null;
    dialog.addEventListener('edvibe-batch-user-management-selection-change', (event) => { selection = event.detail; });
    click(shadowQuery(dialog, '.edvibe-batch-user-management-select-all-unassign'));
    await elementUpdated(dialog);
    equal(JSON.stringify(dialog.rows.map((item) => item.unassignSelected)), JSON.stringify([true, true, false]));
    equal(selection.rows.length, 3);
    equal(shadowQuery(dialog, '.edvibe-batch-user-management-start').disabled, false);

    let started = null;
    dialog.addEventListener('edvibe-batch-user-management-start', (event) => { started = event.detail; });
    click(shadowQuery(dialog, '.edvibe-batch-user-management-start'));
    equal(started.rows[0].unassignSelected, true);

    dialog.showExecution({completed: 1, total: 2, successes: 1, failures: 0, current: {email: 'second@example.com', operation: 'delete'}});
    await elementUpdated(dialog);
    equal(shadowQuery(dialog, '.edvibe-batch-user-management-progress').value, 1);
    equal(shadowQuery(dialog, '.edvibe-batch-user-management-progress').max, 2);
    equal(shadowQuery(dialog, '.edvibe-batch-user-management-status').textContent.includes('second@example.com'), true);
    equal(shadowQuery(dialog, '.edvibe-batch-user-management-close').disabled, true);

    dialog.showComplete({
        rows: [
            row('first@example.com', {unassignSelected: true, result: {status: 'success', message: 'Curator removed'}}),
            row('second@example.com', {deleteSelected: true, result: {status: 'failed', message: 'Delete failed'}})
        ],
        successes: 1,
        failures: 1
    });
    await elementUpdated(dialog);
    equal(dialog.mode, 'partial-complete');
    equal(shadowQuery(dialog, '.edvibe-batch-user-management-table-body').textContent.includes('Curator removed'), true);
    equal(shadowQuery(dialog, '.edvibe-batch-user-management-restart').disabled, false);
    equal([...shadowQuery(dialog, '.edvibe-batch-user-management-table-body').querySelectorAll('input')].every((input) => input.disabled), true);

    let restarted = 0;
    dialog.addEventListener('edvibe-batch-user-management-restart', () => { restarted += 1; });
    click(shadowQuery(dialog, '.edvibe-batch-user-management-restart'));
    await elementUpdated(dialog);
    equal(restarted, 1);
    equal(dialog.rows.length, 0);
    equal(dialog.emailInput, '');

    const emails = shadowQuery(dialog, '.edvibe-batch-user-management-emails');
    emails.value = 'first@example.com';
    emails.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
    await elementUpdated(dialog);
    let checked = null;
    dialog.addEventListener('edvibe-batch-user-management-check', (event) => { checked = event.detail; });
    click(shadowQuery(dialog, '.edvibe-batch-user-management-check'));
    equal(checked.emailInput, 'first@example.com');

    await cleanup();
}
