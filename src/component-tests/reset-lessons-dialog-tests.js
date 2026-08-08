import '../components/reset-lessons-dialog.js';
import {
    cleanup,
    click,
    elementUpdated,
    equal,
    fixture,
    shadowQuery
} from './component-test-harness.js';

export async function runResetLessonsDialogTests() {
    const lessons = [
        {MarathonLessonId: 101, Number: 0, Name: 'Lesson one', LastRequest: null},
        {MarathonLessonId: 102, Number: 1, Name: 'Lesson two', LastRequest: {Status: 2}}
    ];
    const dialog = await fixture('<edvibe-toolbox-reset-dialog></edvibe-toolbox-reset-dialog>');
    dialog.configure({
        stylesheetUrl: '/src/components/reset-lessons-dialog.css',
        searchDelay: 0,
        loadLessons: async () => lessons
    });
    dialog.showPupils({
        pupils: [
            {PupilId: 1, Name: 'Alice', Email: 'alice@example.com'},
            {PupilId: 2, Name: 'Bob', Email: 'bob@example.com'}
        ],
        total: 2
    });
    await elementUpdated(dialog);

    equal(dialog.id, 'edvibe-toolbox-reset-overlay');
    equal(shadowQuery(dialog, '.edvibe-reset-pupils').querySelectorAll('button').length, 2);
    equal(shadowQuery(dialog, '.edvibe-reset-status').textContent, 'Загружено пользователей: 2 из 2');
    equal(shadowQuery(dialog, '.edvibe-reset-next').disabled, true);

    click(shadowQuery(dialog, '.edvibe-reset-pupils button'));
    await elementUpdated(dialog);
    equal(dialog.selectedPupil.PupilId, 1);
    equal(shadowQuery(dialog, '.edvibe-reset-next').disabled, false);
    equal(shadowQuery(dialog, '.edvibe-reset-pupils button').getAttribute('aria-selected'), 'true');

    await dialog.handleNext();
    await elementUpdated(dialog);
    equal(dialog.currentStep, 'lessons');
    equal(shadowQuery(dialog, '.edvibe-reset-user-step').hidden, true);
    equal(shadowQuery(dialog, '.edvibe-reset-lesson-step').hidden, false);
    equal(shadowQuery(dialog, '.edvibe-reset-lessons').querySelectorAll('input').length, 2);
    equal(shadowQuery(dialog, '.edvibe-reset-selected-pupil').textContent.trim(), 'Alice — alice@example.com');

    dialog.toggleLesson(101, true);
    await elementUpdated(dialog);
    equal(shadowQuery(dialog, '.edvibe-reset-submit').disabled, false);

    let resetRequest = null;
    dialog.addEventListener('edvibe-reset-request', (event) => { resetRequest = event.detail; });
    dialog.handleSubmit();
    equal(resetRequest.pupil.PupilId, 1);
    equal(resetRequest.lessons.length, 1);
    equal(resetRequest.lessons[0].MarathonLessonId, 101);

    dialog.showDiscovery('Discovering work');
    await elementUpdated(dialog);
    equal(shadowQuery(dialog, '.edvibe-reset-progress').classList.contains('is-indeterminate'), true);
    equal(shadowQuery(dialog, '.edvibe-reset-progress').hasAttribute('value'), false);

    dialog.showProgress({completed: 1, total: 2, lesson: lessons[0], exerciseId: 77});
    await elementUpdated(dialog);
    equal(shadowQuery(dialog, '.edvibe-reset-progress').value, 50);
    equal(shadowQuery(dialog, '.edvibe-reset-status').textContent.includes('Упражнение 77'), true);

    dialog.showError('Reset failed');
    await elementUpdated(dialog);
    equal(shadowQuery(dialog, '.edvibe-reset-status').classList.contains('is-error'), true);
    equal(shadowQuery(dialog, '.edvibe-reset-status').textContent, 'Reset failed');

    dialog.showComplete('Reset complete');
    dialog.completeRun();
    await elementUpdated(dialog);
    equal(shadowQuery(dialog, '.edvibe-reset-progress').value, 100);
    equal(shadowQuery(dialog, '.edvibe-reset-status').classList.contains('is-success'), true);
    equal(shadowQuery(dialog, '.edvibe-reset-back').textContent.trim(), 'Сбросить для другого пользователя');

    dialog.handleBack();
    await elementUpdated(dialog);
    equal(dialog.currentStep, 'user');
    equal(dialog.selectedPupil, null);
    equal(shadowQuery(dialog, '.edvibe-reset-search').value, '');

    let closeEvents = 0;
    dialog.addEventListener('edvibe-dialog-close', () => { closeEvents += 1; });
    dialog.close();
    equal(closeEvents, 1);
    equal(dialog.isConnected, false);
    await cleanup();
}
