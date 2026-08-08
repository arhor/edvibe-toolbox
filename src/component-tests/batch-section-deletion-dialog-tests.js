import '../components/batch-section-deletion-dialog.js';
import {
    cleanup,
    click,
    elementUpdated,
    equal,
    fixture,
    shadowQuery
} from './component-test-harness.js';

export async function runBatchSectionDeletionDialogTests() {
    const calls = {inspect: 0, execute: 0, copied: '', history: null, closed: 0};
    const plan = {
        selectedCount: 2,
        eligible: [{lessonId: 10, number: 1, name: 'Welcome', sectionId: 100}],
        rejected: [{lessonId: 11, number: 2, name: 'Practice <safe>', code: 'NOT_FOUND', message: 'Missing <safe>'}]
    };
    const dialog = await fixture('<edvibe-toolbox-batch-section-deletion-dialog></edvibe-toolbox-batch-section-deletion-dialog>');
    dialog.configure({
        stylesheetUrl: '/src/components/batch-section-deletion-dialog.css',
        lessons: [
            {lessonId: 10, number: 1, name: 'Welcome'},
            {lessonId: 11, number: 2, name: 'Practice <safe>'}
        ],
        onInspect: async ({sectionName, selectedLessonIds, onProgress}) => {
            calls.inspect += 1;
            equal(sectionName, 'Announcement');
            equal(JSON.stringify(selectedLessonIds), JSON.stringify([10, 11]));
            onProgress({current: 1, total: 2});
            return plan;
        },
        onExecute: async (receivedPlan, onProgress) => {
            calls.execute += 1;
            equal(receivedPlan, plan);
            onProgress({current: 1, total: 1});
            return {
                report: 'deletion report',
                history: {stored: true, record: {id: 'history-1'}}
            };
        },
        onCopy: (report) => { calls.copied = report; },
        onOpenHistory: (id) => { calls.history = id; },
        onClose: () => { calls.closed += 1; }
    });
    await elementUpdated(dialog);

    equal(shadowQuery(dialog, '.lessons').querySelectorAll('input').length, 2);
    click(shadowQuery(dialog, '.select-all'));
    await elementUpdated(dialog);
    equal(shadowQuery(dialog, '.selection').textContent, '2 selected');

    const name = shadowQuery(dialog, '.section-name');
    name.value = 'Announcement';
    name.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
    await dialog.inspect();
    await elementUpdated(dialog);
    equal(calls.inspect, 1);
    equal(shadowQuery(dialog, '.preflight').textContent.includes('Eligible'), true);
    equal(shadowQuery(dialog, '.preflight').textContent.includes('Practice <safe>'), true);
    equal(shadowQuery(dialog, '.execute').hidden, false);
    equal(shadowQuery(dialog, '.inspect').textContent, 'Run preflight again');

    await dialog.execute();
    await elementUpdated(dialog);
    equal(calls.execute, 1);
    equal(shadowQuery(dialog, '.result').hidden, false);
    equal(shadowQuery(dialog, '.result textarea').value, 'deletion report');
    equal(shadowQuery(dialog, '.history').hidden, false);
    equal(shadowQuery(dialog, '.status').textContent.includes('Saved to execution history'), true);

    click(shadowQuery(dialog, '.copy'));
    click(shadowQuery(dialog, '.history'));
    equal(calls.copied, 'deletion report');
    equal(calls.history, 'history-1');

    click(shadowQuery(dialog, 'button.close'));
    equal(calls.closed, 1);
    await cleanup();
}
