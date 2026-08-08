import '../components/batch-lesson-access-dialog.js';
import {
    cleanup,
    click,
    elementUpdated,
    equal,
    fixture,
    shadowQuery
} from './component-test-harness.js';

export async function runBatchLessonAccessDialogTests() {
    const lessons = [
        {MarathonLessonId: 10, Number: 0, Name: 'Welcome'},
        {MarathonLessonId: 11, Number: 1, Name: 'Practice'}
    ];
    const dialog = await fixture('<edvibe-toolbox-batch-access-dialog></edvibe-toolbox-batch-access-dialog>');
    dialog.configure({stylesheetUrl: '/src/components/batch-lesson-access-dialog.css'});

    dialog.showLoading();
    dialog.emailInput = 'first@example.com';
    dialog.setEmailState({validCount: 1, malformedCount: 0});
    await elementUpdated(dialog);
    equal(shadowQuery(dialog, '.edvibe-batch-access-progress').hidden, false);
    equal(shadowQuery(dialog, '.edvibe-batch-access-progress').hasAttribute('value'), false);
    equal(shadowQuery(dialog, '.edvibe-batch-access-emails').disabled, false);

    dialog.showConfigure({lessons});
    await elementUpdated(dialog);
    equal(shadowQuery(dialog, '.edvibe-batch-access-emails').value, 'first@example.com');
    equal(shadowQuery(dialog, '.edvibe-batch-access-lessons').querySelectorAll('input').length, 2);
    equal(shadowQuery(dialog, '.edvibe-batch-access-email-count').textContent.trim(), 'Уникальных email: 1');

    let inputEvent = null;
    let submitEvent = null;
    dialog.addEventListener('edvibe-batch-access-input-change', (event) => { inputEvent = event.detail; });
    dialog.addEventListener('edvibe-batch-access-submit', (event) => { submitEvent = event.detail; });
    const emails = shadowQuery(dialog, '.edvibe-batch-access-emails');
    emails.value = 'First@Example.com';
    emails.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
    equal(inputEvent.emailInput, 'First@Example.com');

    const selectAll = shadowQuery(dialog, '.edvibe-batch-access-select-all');
    selectAll.checked = true;
    selectAll.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
    await elementUpdated(dialog);
    equal(dialog.selectedLessonIds.size, 2);
    equal(shadowQuery(dialog, '.edvibe-batch-access-submit').disabled, false);
    click(shadowQuery(dialog, '.edvibe-batch-access-submit'));
    equal(submitEvent.emailInput, 'First@Example.com');
    equal(JSON.stringify(submitEvent.selectedLessonIds), JSON.stringify([10, 11]));

    dialog.showValidation();
    await elementUpdated(dialog);
    equal(shadowQuery(dialog, '.edvibe-batch-access-emails').disabled, true);
    equal(shadowQuery(dialog, '.edvibe-batch-access-close').disabled, true);

    dialog.showValidationErrors(['Некорректный email', 'Урок недоступен']);
    await elementUpdated(dialog);
    equal(shadowQuery(dialog, '.edvibe-batch-access-errors').querySelectorAll('p').length, 2);
    equal(shadowQuery(dialog, '.edvibe-batch-access-close').disabled, false);

    dialog.showConfirmation({
        matchedUsers: 12,
        selectedLessons: [10, 11],
        needsOpening: [{}, {}, {}],
        alreadyOpen: [{}]
    });
    await elementUpdated(dialog);
    equal(shadowQuery(dialog, '.edvibe-batch-access-summary').textContent.includes('3 доступов нужно открыть'), true);
    let confirmed = 0;
    dialog.addEventListener('edvibe-batch-access-confirm', () => { confirmed += 1; });
    click(shadowQuery(dialog, '.edvibe-batch-access-confirm'));
    equal(confirmed, 1);

    dialog.showExecution({completed: 2, total: 4, opened: 1, failures: 1, alreadyOpen: 3});
    await elementUpdated(dialog);
    equal(shadowQuery(dialog, '.edvibe-batch-access-progress').value, 2);
    equal(shadowQuery(dialog, '.edvibe-batch-access-progress').max, 4);
    equal(shadowQuery(dialog, '.edvibe-batch-access-status').textContent.includes('Выполнено: 2 из 4'), true);

    dialog.showComplete({
        requestedEmails: 1,
        matchedUsers: 1,
        selectedLessons: [10],
        opened: [],
        alreadyOpen: [],
        failures: [{
            email: 'first@example.com', lessonNumber: 5, lessonName: 'Practice <unsafe>',
            attempts: 3, code: 'REQUEST_TIMEOUT', message: 'Timed out <unsafe>'
        }],
        attempts: 3
    });
    await elementUpdated(dialog);
    equal(dialog.mode, 'partial-complete');
    equal(shadowQuery(dialog, '.edvibe-batch-access-failure').textContent.includes('Practice <unsafe>'), true);
    equal(shadowQuery(dialog, '.edvibe-batch-access-copy').disabled, false);

    let copied = 0;
    let restarted = 0;
    dialog.addEventListener('edvibe-batch-access-copy-report', () => { copied += 1; });
    dialog.addEventListener('edvibe-batch-access-restart', () => { restarted += 1; });
    click(shadowQuery(dialog, '.edvibe-batch-access-copy'));
    click(shadowQuery(dialog, '.edvibe-batch-access-restart'));
    await elementUpdated(dialog);
    equal(copied, 1);
    equal(restarted, 1);
    equal(dialog.emailInput, '');
    equal(dialog.selectedLessonIds.size, 0);
    equal(dialog.lessons.length, 2);

    let closed = 0;
    dialog.addEventListener('edvibe-dialog-close', () => { closed += 1; });
    dialog.close();
    equal(closed, 1);
    equal(dialog.isConnected, false);
    await cleanup();
}
