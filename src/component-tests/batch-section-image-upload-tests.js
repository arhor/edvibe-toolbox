import {
    BatchSectionImageUploadController,
    createPlaceholderUrl,
    createRegistry,
    formatFileSize,
    parseClientId
} from '../components/batch-section-image-upload.js';
import {equal} from './component-test-harness.js';

export async function runBatchSectionImageUploadTests() {
    const revoked = [];
    let previewIndex = 0;
    const registry = createRegistry();
    const controller = new BatchSectionImageUploadController({
        registry,
        cryptoApi: {randomUUID: () => 'client-1'},
        urlApi: {
            createObjectURL: () => `blob:preview-${++previewIndex}`,
            revokeObjectURL: (url) => revoked.push(url)
        }
    });

    const imageBlock = controller.createBlock({id: 'image-1', type: 'image', alt: ''});
    equal(imageBlock.clientId, 'client-1');
    equal(imageBlock.url, createPlaceholderUrl('client-1'));
    equal(parseClientId(imageBlock.url), 'client-1');
    equal(formatFileSize(2048), '2.0 КБ');
    equal(controller.canSubmit([imageBlock]), false);

    const firstFile = new File(['first'], 'first.png', {type: 'image/png'});
    const selected = controller.selectFile(imageBlock, firstFile);
    equal(selected.fileName, 'first.png');
    equal(selected.fileType, 'image/png');
    equal(selected.previewUrl, 'blob:preview-1');
    equal(registry.get('client-1'), firstFile);
    equal(registry.size(), 1);
    equal(controller.canSubmit([selected]), true);

    const secondFile = new File(['second'], 'second.jpg', {type: 'image/jpeg'});
    const replaced = controller.selectFile(selected, secondFile);
    equal(replaced.fileName, 'second.jpg');
    equal(replaced.previewUrl, 'blob:preview-2');
    equal(registry.get('client-1'), secondFile);
    equal(JSON.stringify(revoked), JSON.stringify(['blob:preview-1']));

    const cleared = controller.clearFile(replaced);
    equal(cleared.fileName, '');
    equal(cleared.previewUrl, '');
    equal(cleared.url, createPlaceholderUrl('client-1'));
    equal(registry.size(), 0);
    equal(JSON.stringify(revoked), JSON.stringify(['blob:preview-1', 'blob:preview-2']));

    const invalid = controller.selectFile(cleared, new File(['text'], 'notes.txt', {type: 'text/plain'}));
    equal(invalid.fileError, 'Выберите файл изображения.');
    equal(registry.size(), 0);
    equal(controller.canSubmit([invalid]), false);

    const first = controller.selectFile(controller.createBlock({id: 'first', type: 'image'}), firstFile);
    const second = controller.selectFile(controller.createBlock({id: 'second', type: 'image'}), secondFile);
    const released = controller.releaseAll([first, {id: 'text', type: 'text', text: 'Hello'}, second]);
    equal(registry.size(), 0);
    equal(released[0].previewUrl, '');
    equal(released[1].text, 'Hello');
    equal(released[2].previewUrl, '');
    equal(revoked.includes(first.previewUrl), true);
    equal(revoked.includes(second.previewUrl), true);
}
