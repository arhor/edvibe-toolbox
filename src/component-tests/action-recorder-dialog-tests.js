import '../components/action-recorder-dialog.js';
import {
    cleanup,
    click,
    elementUpdated,
    equal,
    fixture,
    shadowQuery
} from './component-test-harness.js';

export async function runActionRecorderDialogTests() {
    const calls = {start: 0, stop: 0, clear: 0, export: 0, copyRecipe: 0, close: 0, requests: []};
    const dialog = await fixture('<edvibe-toolbox-action-recorder></edvibe-toolbox-action-recorder>');
    dialog.configure({
        stylesheetUrl: '/src/components/action-recorder-dialog.css',
        onStart: () => { calls.start += 1; },
        onStop: () => { calls.stop += 1; },
        onClear: () => { calls.clear += 1; },
        onExport: () => { calls.export += 1; },
        onCopyRecipe: () => { calls.copyRecipe += 1; },
        onCopyRequest: (sequence) => calls.requests.push(sequence),
        onClose: () => { calls.close += 1; }
    });
    dialog.confirm = () => true;

    const session = {
        startedAt: '2026-08-01T10:00:00.000Z',
        stoppedAt: '2026-08-01T10:00:05.000Z',
        frameCount: 4,
        storedBytes: 2048,
        operations: [
            {
                sequence: 1,
                controller: 'PageController',
                method: 'Run',
                projectName: 'Page',
                requestId: 'r1',
                origin: 'page',
                durationMs: 25,
                requestValue: {id: 1},
                response: {isSuccess: true}
            },
            {
                sequence: 2,
                controller: 'ToolboxController',
                method: 'Inspect',
                projectName: 'Toolbox',
                requestId: 'r2',
                origin: 'toolbox',
                durationMs: null,
                requestValue: {id: 2},
                response: null
            }
        ],
        otherFrames: [{kind: 'ping'}]
    };

    dialog.setState({status: 'recording', session: {...session, stoppedAt: null}, notice: 'Recording'});
    await elementUpdated(dialog);
    equal(dialog.id, 'edvibe-toolbox-action-recorder');
    equal(shadowQuery(dialog, '.state-label').textContent, 'Идёт запись');
    equal(shadowQuery(dialog, '.operation-count').textContent, '1');
    equal(shadowQuery(dialog, '.recorder-stop').hidden, false);
    equal(shadowQuery(dialog, '.recorder-start').hidden, true);
    equal(shadowQuery(dialog, '.recorder-notice').textContent, 'Recording');

    click(shadowQuery(dialog, '.copy-request'));
    equal(calls.requests[0], 1);

    dialog.showToolbox = true;
    await elementUpdated(dialog);
    equal(shadowQuery(dialog, '.operation-count').textContent, '2');
    equal(shadowQuery(dialog, '.operation-list').querySelectorAll('.operation').length, 2);

    click(shadowQuery(dialog, '.recorder-minimize'));
    await elementUpdated(dialog);
    equal(shadowQuery(dialog, '.recorder-overlay').hidden, true);
    equal(shadowQuery(dialog, '.recorder-indicator').hidden, false);
    equal(shadowQuery(dialog, '.recorder-indicator').classList.contains('is-recording'), true);

    dialog.handleClose();
    await elementUpdated(dialog);
    equal(calls.close, 0);
    equal(dialog.minimized, true);
    dialog.restore();
    await elementUpdated(dialog);
    equal(dialog.minimized, false);

    click(shadowQuery(dialog, '.recorder-stop'));
    click(shadowQuery(dialog, '.recorder-copy'));
    click(shadowQuery(dialog, '.recorder-export'));
    equal(calls.stop, 1);
    equal(calls.copyRecipe, 1);
    equal(calls.export, 1);

    dialog.setState({status: 'stopped', session, copyFallback: 'manual recipe'});
    await elementUpdated(dialog);
    equal(shadowQuery(dialog, '.state-label').textContent, 'Запись остановлена');
    equal(shadowQuery(dialog, '.elapsed').textContent, '0:05');
    equal(shadowQuery(dialog, '.byte-count').textContent, '2.0 КиБ');
    equal(shadowQuery(dialog, '.other-count').textContent, '1');
    equal(shadowQuery(dialog, '.copy-fallback').hidden, false);
    equal(shadowQuery(dialog, '.copy-fallback textarea').value, 'manual recipe');

    click(shadowQuery(dialog, '.recorder-clear'));
    equal(calls.clear, 1);
    dialog.handleClose();
    equal(calls.close, 1);

    await cleanup();
}
