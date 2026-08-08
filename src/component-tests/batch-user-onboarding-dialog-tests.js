import '../components/batch-user-onboarding-dialog.js';
import {cleanup, click, elementUpdated, equal, fixture, shadowQuery} from './component-test-harness.js';

function discoveredRow(email, overrides = {}) {
    return {
        email,
        normalizedEmail: email.toLowerCase(),
        user: {name: 'User'},
        resolution: 'in_marathon',
        membership: 'in_marathon',
        actionable: true,
        moderatorStateSafe: true,
        currentModerators: [],
        message: '',
        ...overrides
    };
}

export async function runBatchUserOnboardingDialogTests() {
    const calls = {preflight: null, executed: null, copied: '', history: null, closed: 0};
    const dialog = await fixture('<edvibe-toolbox-batch-user-onboarding-dialog></edvibe-toolbox-batch-user-onboarding-dialog>');
    dialog.configure({
        stylesheetUrl: '/src/components/batch-user-onboarding-dialog.css',
        moderators: [{id: 7, name: 'Curator', email: 'curator@example.com'}],
        parseEmailInput: (value) => ({
            entries: value.trim() ? value.split(/\s+/).filter((entry) => entry.includes('@')) : [],
            malformed: value.includes('bad') ? ['bad'] : []
        }),
        onDiscover: async () => [
            discoveredRow('existing@example.com'),
            discoveredRow('new@example.com', {
                user: null,
                resolution: 'resolvable_not_in_marathon',
                membership: 'not_in_marathon'
            })
        ],
        onPreflight: async (request) => {
            calls.preflight = request;
            return {
                counts: {requested: 2, additions: 1, assignments: 1, noOps: 0, rejectedOperations: 0},
                rows: [
                    {
                        email: 'existing@example.com',
                        resolution: 'in_marathon',
                        selectedOperations: [],
                        message: 'No changes'
                    },
                    {
                        email: 'new@example.com',
                        resolution: 'resolvable_not_in_marathon',
                        selectedOperations: ['add', 'assign'],
                        add: {status: 'planned', code: 'ADD'},
                        assign: {status: 'planned', code: 'ASSIGN'}
                    }
                ]
            };
        },
        onExecute: async (plan, onProgress) => {
            calls.executed = plan;
            onProgress({completed: 1, total: 2, successes: 1, failures: 0, current: {email: 'new@example.com', operation: 'add'}});
            onProgress({completed: 2, total: 2, successes: 2, failures: 0, current: {email: 'new@example.com', operation: 'assign'}});
            return {
                report: 'onboarding report',
                history: {stored: true, record: {id: 'onboarding-history-1'}}
            };
        },
        onCopy: (report) => { calls.copied = report; },
        onOpenHistory: (id) => { calls.history = id; },
        onClose: () => { calls.closed += 1; }
    });
    dialog.showConfigure();
    await elementUpdated(dialog);

    const emails = shadowQuery(dialog, '.emails');
    emails.value = 'existing@example.com new@example.com bad';
    emails.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
    await elementUpdated(dialog);
    equal(shadowQuery(dialog, '.valid-count').textContent, 'Уникальных email: 2');
    equal(shadowQuery(dialog, '.invalid-count').textContent, 'Некорректных: 1');

    await dialog.discover();
    await elementUpdated(dialog);
    equal(dialog.mode, 'review');
    equal(shadowQuery(dialog, '.rows').querySelectorAll('tr').length, 2);
    equal([...shadowQuery(dialog, '.rows').querySelectorAll('input')].every((input) => input.checked === false), true);

    const newRow = [...shadowQuery(dialog, '.rows').querySelectorAll('tr')]
        .find((row) => row.dataset.email === 'new@example.com');
    let add = newRow.querySelector('.add-selected');
    let assign = newRow.querySelector('.assign-selected');
    equal(assign.disabled, true, 'Assignment is unavailable until a new user is selected for addition.');

    add.checked = true;
    add.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
    await elementUpdated(dialog);
    assign = [...shadowQuery(dialog, '.rows').querySelectorAll('tr')]
        .find((row) => row.dataset.email === 'new@example.com')
        .querySelector('.assign-selected');
    equal(assign.disabled, false);
    assign.checked = true;
    assign.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
    await elementUpdated(dialog);
    equal(dialog.rows.find((row) => row.normalizedEmail === 'new@example.com').assignSelected, true);

    add = [...shadowQuery(dialog, '.rows').querySelectorAll('tr')]
        .find((row) => row.dataset.email === 'new@example.com')
        .querySelector('.add-selected');
    add.checked = false;
    add.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
    await elementUpdated(dialog);
    const resetRow = dialog.rows.find((row) => row.normalizedEmail === 'new@example.com');
    equal(resetRow.addSelected, false);
    equal(resetRow.assignSelected, false, 'Removing add must also remove the dependent assignment.');

    dialog.setRowSelection('new@example.com', 'addSelected', true);
    dialog.setRowSelection('new@example.com', 'assignSelected', true);
    dialog.targetModeratorId = '7';
    await dialog.preparePlan();
    await elementUpdated(dialog);
    equal(dialog.mode, 'preflight');
    equal(calls.preflight.targetModeratorId, '7');
    equal(calls.preflight.rows.find((row) => row.normalizedEmail === 'new@example.com').assignSelected, true);
    equal(shadowQuery(dialog, '.preflight').textContent.includes('Неизменяемый план'), true);
    equal(shadowQuery(dialog, '.preflight').textContent.includes('Назначений: 1'), true);

    dialog.returnToReview();
    equal(dialog.mode, 'review');
    await dialog.preparePlan();
    await dialog.execute();
    await elementUpdated(dialog);
    equal(dialog.mode, 'complete');
    equal(calls.executed, dialog.plan);
    equal(shadowQuery(dialog, '.report').value, 'onboarding report');
    equal(shadowQuery(dialog, '.history').hidden, false);
    equal(shadowQuery(dialog, '.status').textContent.includes('Результат сохранён в истории'), true);

    click(shadowQuery(dialog, '.copy'));
    click(shadowQuery(dialog, '.history'));
    equal(calls.copied, 'onboarding report');
    equal(calls.history, 'onboarding-history-1');

    click(shadowQuery(dialog, '.restart'));
    await elementUpdated(dialog);
    equal(dialog.mode, 'configure');
    equal(dialog.emailInput, '');
    equal(dialog.targetModeratorId, '');
    equal(dialog.rows.length, 0);

    dialog.close();
    equal(calls.closed, 1);
    await cleanup();
}
