const IMAGE_PLACEHOLDER_PREFIX = 'https://media-files-y.edvibe.com/local-upload/';

function createClientId(cryptoApi = globalThis.crypto) {
    return cryptoApi?.randomUUID?.()
        || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createPlaceholderUrl(clientId) {
    return `${IMAGE_PLACEHOLDER_PREFIX}${encodeURIComponent(String(clientId || ''))}`;
}

function parseClientId(value) {
    const text = String(value || '');
    if (!text.startsWith(IMAGE_PLACEHOLDER_PREFIX)) return '';
    try {
        return decodeURIComponent(text.slice(IMAGE_PLACEHOLDER_PREFIX.length));
    } catch (_) {
        return '';
    }
}

function formatFileSize(value) {
    const bytes = Math.max(0, Number(value) || 0);
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

function createRegistry() {
    const files = new Map();
    return Object.freeze({
        register(clientId, file) {
            if (clientId && file) files.set(String(clientId), file);
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
    const clientId = block?.clientId || parseClientId(block?.url) || createClientId(cryptoApi);
    return {
        ...block,
        clientId,
        url: createPlaceholderUrl(clientId),
        alt: String(block?.alt || ''),
        fileName: String(block?.fileName || ''),
        fileSize: Math.max(0, Number(block?.fileSize) || 0),
        fileType: String(block?.fileType || ''),
        previewUrl: String(block?.previewUrl || ''),
        fileError: String(block?.fileError || '')
    };
}

function resolveEnhancementStylesheet(stylesheetUrl) {
    try {
        return new URL('./batch-section-image-upload.css', stylesheetUrl).href;
    } catch (_) {
        return '';
    }
}

class BatchSectionImageUploadController {
    constructor({
        registry = createRegistry(),
        urlApi = globalThis.URL,
        cryptoApi = globalThis.crypto
    } = {}) {
        this.registry = registry;
        this.urlApi = urlApi;
        this.cryptoApi = cryptoApi;
    }

    createBlock(block = {}) {
        return enhanceImageBlock(block, this.cryptoApi);
    }

    hasSelectedFile(block) {
        if (!block || block.type !== 'image') return true;
        return Boolean(this.registry.get(block.clientId || parseClientId(block.url)));
    }

    canSubmit(blocks = []) {
        return !blocks.some((block) => block.type === 'image' && !this.hasSelectedFile(block));
    }

    selectFile(block, file) {
        const released = this.releaseBlock(block);
        if (!file) return released;
        if (!String(file.type || '').startsWith('image/')) {
            return {...released, fileError: 'Выберите файл изображения.'};
        }

        const clientId = released.clientId || createClientId(this.cryptoApi);
        const previewUrl = this.urlApi?.createObjectURL?.(file) || '';
        this.registry.register(clientId, file);
        return {
            ...released,
            clientId,
            url: createPlaceholderUrl(clientId),
            fileName: String(file.name || ''),
            fileSize: Math.max(0, Number(file.size) || 0),
            fileType: String(file.type || ''),
            previewUrl,
            fileError: ''
        };
    }

    clearFile(block) {
        return this.releaseBlock(block);
    }

    releaseBlock(block) {
        if (!block || block.type !== 'image') return block;
        const clientId = block.clientId || parseClientId(block.url);
        if (clientId) this.registry.remove(clientId);
        if (block.previewUrl) this.urlApi?.revokeObjectURL?.(block.previewUrl);
        const next = enhanceImageBlock({...block, clientId}, this.cryptoApi);
        return {
            ...next,
            fileName: '',
            fileSize: 0,
            fileType: '',
            previewUrl: '',
            fileError: ''
        };
    }

    releaseAll(blocks = []) {
        return blocks.map((block) => this.releaseBlock(block));
    }
}

const registry = createRegistry();
const controller = new BatchSectionImageUploadController({registry});
const batchSectionImageUploadComponentApi = Object.freeze({
    IMAGE_PLACEHOLDER_PREFIX,
    createClientId,
    createPlaceholderUrl,
    parseClientId,
    formatFileSize,
    createRegistry,
    enhanceImageBlock,
    resolveEnhancementStylesheet,
    BatchSectionImageUploadController,
    createController: (options = {}) => new BatchSectionImageUploadController(options),
    registry,
    controller
});

globalThis.EdVibeBatchSectionImageRegistry = registry;
globalThis.EdVibeBatchSectionImageUploadComponent = batchSectionImageUploadComponentApi;

export {
    IMAGE_PLACEHOLDER_PREFIX,
    createClientId,
    createPlaceholderUrl,
    parseClientId,
    formatFileSize,
    createRegistry,
    enhanceImageBlock,
    resolveEnhancementStylesheet,
    BatchSectionImageUploadController,
    registry,
    controller
};
