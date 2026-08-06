(function initializeBatchSectionImageUploadComponent(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], () => factory(root));
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(null);
    } else {
        root.EdVibeBatchSectionImageUploadComponent = factory(root);
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createModule(root) {
    'use strict';

    const IMAGE_PLACEHOLDER_PREFIX = 'https://media-files-y.edvibe.com/local-upload/';
    const ENHANCED_MARKER = Symbol('edvibeBatchSectionImageUploadEnhanced');

    function createClientId(cryptoApi = globalThis.crypto) {
        return cryptoApi?.randomUUID?.()
            || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    function createPlaceholderUrl(clientId) {
        return `${IMAGE_PLACEHOLDER_PREFIX}${encodeURIComponent(String(clientId || ''))}`;
    }

    function parseClientId(value) {
        const text = String(value || '');
        if (!text.startsWith(IMAGE_PLACEHOLDER_PREFIX)) {
            return '';
        }
        try {
            return decodeURIComponent(text.slice(IMAGE_PLACEHOLDER_PREFIX.length));
        } catch (_) {
            return '';
        }
    }

    function formatFileSize(value) {
        const bytes = Math.max(0, Number(value) || 0);
        if (bytes < 1024) {
            return `${bytes} Б`;
        }
        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} КБ`;
        }
        return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
    }

    function createRegistry() {
        const files = new Map();
        return Object.freeze({
            register(clientId, file) {
                if (clientId && file) {
                    files.set(String(clientId), file);
                }
            },
            get(clientId) {
                return files.get(String(clientId || '')) || null;
            },
            remove(clientId) {
                files.delete(String(clientId || ''));
            },
            clear() {
                files.clear();
            },
            size() {
                return files.size;
            }
        });
    }

    function enhanceImageBlock(block, cryptoApi = globalThis.crypto) {
        const clientId = createClientId(cryptoApi);
        return {
            ...block,
            clientId,
            url: createPlaceholderUrl(clientId),
            alt: String(block?.alt || ''),
            fileName: '',
            fileSize: 0,
            fileType: '',
            previewUrl: '',
            fileError: ''
        };
    }

    function resolveEnhancementStylesheet(stylesheetUrl) {
        try {
            return new URL('./batch-section-image-upload.css', stylesheetUrl).href;
        } catch (_) {
            return '';
        }
    }

    function enhanceDialog({ rootObject, dialogApi, registry }) {
        const Dialog = dialogApi?.BatchSectionCreationDialog;
        if (!Dialog?.prototype || Dialog.prototype[ENHANCED_MARKER]) {
            return false;
        }

        const prototype = Dialog.prototype;
        Object.defineProperty(prototype, ENHANCED_MARKER, { value: true });

        const originalConfigure = prototype.configure;
        const originalCreateBlock = prototype.createBlock;
        const originalRenderBlocks = prototype.renderBlocks;
        const originalRenderPreview = prototype.renderPreview;
        const originalOnInput = prototype.onInput;
        const originalOnBlockClick = prototype.onBlockClick;
        const originalOnRestart = prototype.onRestart;
        const originalClose = prototype.close;
        const originalRenderState = prototype.renderState;

        function releaseBlock(block) {
            if (!block || block.type !== 'image') {
                return;
            }
            registry.remove(block.clientId || parseClientId(block.url));
            if (block.previewUrl) {
                rootObject.URL?.revokeObjectURL?.(block.previewUrl);
            }
            block.fileName = '';
            block.fileSize = 0;
            block.fileType = '';
            block.previewUrl = '';
            block.fileError = '';
        }

        function releaseAll(dialog) {
            for (const block of dialog.blocks || []) {
                releaseBlock(block);
            }
        }

        prototype.configure = function configure(options = {}) {
            const result = originalConfigure.call(this, options);
            const href = resolveEnhancementStylesheet(options.stylesheetUrl || this.stylesheetUrl);
            if (href && this.shadowRoot && !this.shadowRoot.querySelector('.edvibe-batch-section-image-upload-stylesheet')) {
                const link = (this.ownerDocument || rootObject.document).createElement('link');
                link.className = 'edvibe-batch-section-image-upload-stylesheet';
                link.rel = 'stylesheet';
                link.href = href;
                this.shadowRoot.prepend(link);
            }
            return result;
        };

        prototype.createBlock = function createBlock(type) {
            const block = originalCreateBlock.call(this, type);
            return type === 'image'
                ? enhanceImageBlock(block, rootObject.crypto)
                : block;
        };

        prototype.renderBlocks = function renderBlocks() {
            originalRenderBlocks.call(this);
            const document = this.ownerDocument || rootObject.document;

            for (const block of this.blocks || []) {
                if (block.type !== 'image') {
                    continue;
                }
                const article = this.elements.blocks.querySelector(`[data-block-id="${block.id}"]`);
                const urlInput = article?.querySelector('[data-block-field="url"]');
                const field = urlInput?.closest?.('label');
                if (!article || !field) {
                    continue;
                }

                const title = document.createElement('span');
                title.textContent = 'Файл изображения';
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.dataset.blockField = 'file';
                input.className = 'edvibe-batch-section-file-input';
                field.replaceChildren(title, input);

                const details = document.createElement('div');
                details.className = 'edvibe-batch-section-file-details';
                const text = document.createElement('span');
                text.textContent = block.fileName
                    ? `${block.fileName} · ${formatFileSize(block.fileSize)}`
                    : 'Файл ещё не выбран';
                details.appendChild(text);

                if (block.fileName) {
                    const clear = document.createElement('button');
                    clear.type = 'button';
                    clear.dataset.blockAction = 'clear-file';
                    clear.textContent = 'Убрать файл';
                    details.appendChild(clear);
                }
                field.after(details);

                if (block.fileError) {
                    const error = document.createElement('p');
                    error.className = 'edvibe-batch-section-file-error';
                    error.textContent = block.fileError;
                    details.after(error);
                }

                if (block.previewUrl) {
                    const preview = document.createElement('img');
                    preview.className = 'edvibe-batch-section-image-preview';
                    preview.src = block.previewUrl;
                    preview.alt = block.alt || block.fileName || 'Предпросмотр баннера';
                    (article.querySelector('.edvibe-batch-section-file-error') || details).after(preview);
                }
            }
        };

        prototype.renderPreview = function renderPreview() {
            originalRenderPreview.call(this);
            const items = this.elements.previewBlocks.querySelectorAll('li');
            (this.blocks || []).forEach((block, index) => {
                if (block.type === 'image' && items[index]) {
                    items[index].textContent = `${index + 1}. Баннер: ${block.fileName || 'файл не выбран'}`;
                }
            });
        };

        prototype.onInput = function onInput(event) {
            const field = event.target?.dataset?.blockField;
            if (field !== 'file') {
                originalOnInput.call(this, event);
                if (field === 'alt') {
                    const article = event.target.closest?.('[data-block-id]');
                    const preview = article?.querySelector?.('.edvibe-batch-section-image-preview');
                    if (preview) {
                        preview.alt = event.target.value || 'Предпросмотр баннера';
                    }
                }
                return;
            }

            const article = event.target.closest?.('[data-block-id]');
            const block = this.blocks.find((entry) => entry.id === article?.dataset?.blockId);
            if (!block) {
                return;
            }

            releaseBlock(block);
            const file = event.target.files?.[0] || null;
            if (file && !String(file.type || '').startsWith('image/')) {
                block.fileError = 'Выберите файл изображения.';
                event.target.value = '';
            } else if (file) {
                block.fileName = file.name;
                block.fileSize = file.size;
                block.fileType = file.type;
                block.previewUrl = rootObject.URL?.createObjectURL?.(file) || '';
                registry.register(block.clientId, file);
            }

            this.renderBlocks();
            this.renderPreview();
            this.renderState();
        };

        prototype.onBlockClick = function onBlockClick(event) {
            const action = event.target?.dataset?.blockAction;
            const article = event.target?.closest?.('[data-block-id]');
            const block = this.blocks.find((entry) => entry.id === article?.dataset?.blockId);

            if (action === 'clear-file' && block?.type === 'image') {
                releaseBlock(block);
                this.renderBlocks();
                this.renderPreview();
                this.renderState();
                return;
            }
            if (action === 'remove' && block?.type === 'image') {
                releaseBlock(block);
            }
            originalOnBlockClick.call(this, event);
        };

        prototype.onRestart = function onRestart() {
            releaseAll(this);
            originalOnRestart.call(this);
        };

        prototype.close = function close() {
            releaseAll(this);
            originalClose.call(this);
        };

        prototype.renderState = function renderState() {
            originalRenderState.call(this);
            const configurable = ['configure', 'validation-error'].includes(this.mode);
            const missingImage = (this.blocks || []).some((block) =>
                block.type === 'image' && !registry.get(block.clientId || parseClientId(block.url))
            );
            if (configurable && missingImage) {
                this.elements.preflight.disabled = true;
            }
        };

        return true;
    }

    let registry = null;
    if (root?.document && root.EdVibeBatchSectionCreationDialog) {
        registry = createRegistry();
        root.EdVibeBatchSectionImageRegistry = registry;
        enhanceDialog({
            rootObject: root,
            dialogApi: root.EdVibeBatchSectionCreationDialog,
            registry
        });
    }

    return {
        IMAGE_PLACEHOLDER_PREFIX,
        createClientId,
        createPlaceholderUrl,
        parseClientId,
        formatFileSize,
        createRegistry,
        enhanceImageBlock,
        resolveEnhancementStylesheet,
        enhanceDialog,
        registry
    };
});
