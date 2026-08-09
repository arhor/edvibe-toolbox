import '../components/export-progress-dialog.js';
import {
    cleanup,
    click,
    elementUpdated,
    equal,
    fixture,
    shadowQuery
} from './component-test-harness.js';

export async function runExportProgressDialogTests() {
    const dialog = await fixture('<edvibe-toolbox-export-progress></edvibe-toolbox-export-progress>');
    await elementUpdated(dialog);

    equal(shadowQuery(dialog, '.status').textContent, 'Preparing export...');
    equal(shadowQuery(dialog, '.count').textContent, 'Discovering sections...');
    equal(shadowQuery(dialog, '.percent').textContent, '0%');
    equal(shadowQuery(dialog, '.progress').hasAttribute('value'), false);
    equal(dialog.shadowRoot.querySelector('link'), null);
    equal(getComputedStyle(dialog).position, 'fixed');
    equal(getComputedStyle(shadowQuery(dialog, '.overlay')).display, 'flex');

    equal(dialog.setProgress({
        statusText: 'Loading sections',
        loadedSections: 2,
        totalSections: 4
    }), dialog);
    await elementUpdated(dialog);
    equal(shadowQuery(dialog, '.status').textContent, 'Loading sections');
    equal(shadowQuery(dialog, '.count').textContent, '2 / 4 sections loaded');
    equal(shadowQuery(dialog, '.percent').textContent, '50%');
    equal(shadowQuery(dialog, '.progress').value, 50);
    equal(dialog.hasAttribute('indeterminate'), false);

    dialog.setProgress({statusText: 'Discovering'});
    await elementUpdated(dialog);
    equal(dialog.hasAttribute('indeterminate'), true);
    equal(shadowQuery(dialog, '.progress').hasAttribute('value'), false);

    dialog.error('Export failed');
    await elementUpdated(dialog);
    equal(dialog.hasAttribute('error'), true);
    equal(dialog.hasAttribute('complete'), false);
    equal(shadowQuery(dialog, '.status').textContent, 'Export failed');

    dialog.complete('Export complete', 4);
    await elementUpdated(dialog);
    equal(dialog.hasAttribute('complete'), true);
    equal(dialog.hasAttribute('error'), false);
    equal(shadowQuery(dialog, '.percent').textContent, '100%');
    equal(shadowQuery(dialog, '.progress').value, 100);

    click(shadowQuery(dialog, '.close'));
    equal(dialog.isConnected, false);
    await cleanup();

    const dismissible = await fixture('<edvibe-toolbox-export-progress></edvibe-toolbox-export-progress>');
    dismissible.dismissAfter(0);
    await new Promise((resolve) => setTimeout(resolve, 0));
    equal(dismissible.isConnected, false);
    await cleanup();
}