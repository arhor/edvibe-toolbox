import '../components/batch-section-creation-dialog.js';
import {registry as imageRegistry} from '../components/batch-section-image-upload.js';
import {
    cleanup,
    click,
    elementUpdated,
    equal,
    fixture,
    shadowQuery
} from './component-test-harness.js';

export async function runBatchSectionCreationDialogTests() {
    imageRegistry.clear();
    const lessons = [
        {lessonId: 10, number: 1, name: 'Welcome'},
        {lessonId: 11, number: 2, name: 'Practice'}
    ];
    const dialog = await fixture('<edvibe-toolbox-batch-section-creation-dialog></edvibe-toolbox-batch-section-creation-dialog>');
    dialog.configure({stylesheetUrl: '/src/components/batch-section-creation-dialog.css'});
    dialog.showConfigure({lessons, recipeReady: true});
    await elementUpdated(dialog);

    equal(dialog.id, 'edvibe-toolbox-batch-section-creation-overlay');
    equal(shadowQuery(dialog, '.edvibe-batch-section-lessons').querySelectorAll('input').length, 2);
    equal(shadowQuery(dialog, '.edvibe-batch-section-preflight').disabled, true);

    const name = shadowQuery(dialog, '.edvibe-batch-section-name');
    name.value = 'Summer section';
    name.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
    click(shadowQuery(dialog, '[data-add-block="image"]'));
    click(shadowQuery(dialog, '[data-add-block="text"]'));
    await elementUpdated(dialog);

    equal(dialog.blocks.length, 2);
    const imageBlock = dialog.blocks[0];
    equal(imageBlock.type, 'image');
    equal(dialog.canPreflight(), false, 'Image blocks require a selected file.');
    equal(shadowQuery(dialog, '.edvibe-batch-section-image-preview') === null, true);

    const imageInput = shadowQuery(dialog, '.edvibe-batch-section-file-input');
    const file = new File(['image-data'], 'banner.png', {type: 'image/png'});
    Object.defineProperty(imageInput, 'files', {configurable: true, value: [file]});
    imageInput.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
    await elementUpdated(dialog);

    const selectedImage = dialog.blocks.find((block) => block.type === 'image');
    equal(selectedImage.fileName, 'banner.png');
    equal(selectedImage.url.includes('/local-upload/'), true);
    equal(imageRegistry.get(selectedImage.clientId), file);
    equal(shadowQuery(dialog, '.edvibe-batch-section-file-details').textContent.includes('banner.png'), true);
    equal(shadowQuery(dialog, '.edvibe-batch-section-image-preview').src.startsWith('blob:'), true);

    const altInput = shadowQuery(dialog, '[data-block-field="alt"]');
    altInput.value = 'Campaign banner';
    altInput.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
    const blockText = shadowQuery(dialog, '[data-block-field="text"]');
    blockText.value = 'Hello';
    blockText.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
    click(shadowQuery(dialog, '.edvibe-batch-section-select-all'));
    await elementUpdated(dialog);

    equal(dialog.sectionName, 'Summer section');
    equal(dialog.blocks.find((block) => block.type === 'image').alt, 'Campaign banner');
    equal(dialog.blocks.find((block) => block.type === 'text').text, 'Hello');
    equal(dialog.selectedLessonIds.size, 2);
    equal(shadowQuery(dialog, '.edvibe-batch-section-preview-name').textContent, 'Summer section');
    equal(shadowQuery(dialog, '.edvibe-batch-section-preview-blocks').textContent.includes('Баннер: banner.png'), true);
    equal(shadowQuery(dialog, '.edvibe-batch-section-preflight').disabled, false);

    const imageArticle = [...dialog.shadowRoot.querySelectorAll('.edvibe-batch-section-block')]
        .find((element) => element.dataset.blockId === selectedImage.id);
    click(imageArticle.querySelector('[data-block-action="down"]'));
    await elementUpdated(dialog);
    equal(dialog.blocks[1].type, 'image', 'Image block should reorder through the normal Lit block model.');

    let preflight = null;
    dialog.addEventListener('edvibe-batch-section-preflight', (event) => { preflight = event.detail; });
    click(shadowQuery(dialog, '.edvibe-batch-section-preflight'));
    equal(preflight.definition.name, 'Summer section');
    equal(preflight.definition.blocks.length, 2);
    equal(preflight.definition.blocks.find((block) => block.type === 'image').fileName, 'banner.png');
    equal(JSON.stringify(preflight.selectedLessonIds), JSON.stringify([10, 11]));

    dialog.showValidationErrors([{code: 'SECTION_NAME_COLLISION', message: 'Already exists'}]);
    await elementUpdated(dialog);
    equal(shadowQuery(dialog, '.edvibe-batch-section-errors').textContent.includes('SECTION_NAME_COLLISION: Already exists'), true);

    const plan = {
        selectedLessonIds: [10, 11],
        eligible: [{number: 1, name: 'Welcome'}],
        rejected: [{number: 2, name: 'Practice', code: 'SECTION_NAME_COLLISION', message: 'Already exists'}],
        definition: {name: 'Summer section', blocks: preflight.definition.blocks}
    };
    dialog.showConfirmation(plan);
    await elementUpdated(dialog);
    equal(shadowQuery(dialog, '.edvibe-batch-section-summary').textContent.includes('Отклонено проверкой: 1'), true);
    equal(shadowQuery(dialog, '.edvibe-batch-section-confirm').disabled, false);

    let confirmed = 0;
    dialog.addEventListener('edvibe-batch-section-confirm', () => { confirmed += 1; });
    click(shadowQuery(dialog, '.edvibe-batch-section-confirm'));
    equal(confirmed, 1);

    dialog.showExecution({completed: 1, total: 2, lesson: {number: 1, name: 'Welcome'}});
    await elementUpdated(dialog);
    equal(shadowQuery(dialog, '.edvibe-batch-section-progress').value, 1);
    equal(shadowQuery(dialog, '.edvibe-batch-section-status').textContent.includes('Выполнено 1 из 2'), true);
    equal(shadowQuery(dialog, '.edvibe-batch-section-close').disabled, true);

    dialog.showComplete({
        results: [
            {status: 'created', lessonNumber: 1, lessonName: 'Welcome', message: 'Done'},
            {status: 'partially_created', lessonNumber: 2, lessonName: 'Practice', code: 'CLEANUP_FAILED', message: 'Review', cleanup: {status: 'failed'}}
        ]
    });
    await elementUpdated(dialog);
    equal(shadowQuery(dialog, '.edvibe-batch-section-results').textContent.includes('Нужна ручная проверка'), true);
    equal(shadowQuery(dialog, '.edvibe-batch-section-copy').hidden, false);
    equal(shadowQuery(dialog, '.edvibe-batch-section-restart').hidden, false);

    let copied = 0;
    let restarted = 0;
    dialog.addEventListener('edvibe-batch-section-copy', () => { copied += 1; });
    dialog.addEventListener('edvibe-batch-section-restart', () => { restarted += 1; });
    click(shadowQuery(dialog, '.edvibe-batch-section-copy'));
    click(shadowQuery(dialog, '.edvibe-batch-section-restart'));
    await elementUpdated(dialog);
    equal(copied, 1);
    equal(restarted, 1);
    equal(dialog.sectionName, '');
    equal(dialog.blocks.length, 0);
    equal(dialog.selectedLessonIds.size, 0);
    equal(imageRegistry.size(), 0, 'Restart should release selected image files.');

    dialog.showConfigure({lessons, recipeReady: true});
    click(shadowQuery(dialog, '[data-add-block="image"]'));
    await elementUpdated(dialog);
    const secondInput = shadowQuery(dialog, '.edvibe-batch-section-file-input');
    const secondFile = new File(['second'], 'second.png', {type: 'image/png'});
    Object.defineProperty(secondInput, 'files', {configurable: true, value: [secondFile]});
    secondInput.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
    await elementUpdated(dialog);
    equal(imageRegistry.size(), 1);

    let closed = 0;
    dialog.addEventListener('edvibe-dialog-close', () => { closed += 1; });
    dialog.close();
    equal(closed, 1);
    equal(dialog.isConnected, false);
    equal(imageRegistry.size(), 0, 'Closing should release selected image files.');
    await cleanup();
}
