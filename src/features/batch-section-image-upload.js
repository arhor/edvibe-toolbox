import { registry as defaultRegistry } from '../components/batch-section-image-upload.js';
import { createRecordedCreationAdapter } from './batch-section-creation.js';
import { batchSectionCreationRecipe } from './batch-section-creation-recipe.js';

const UPLOAD_ENDPOINT = 'https://media-files-y.edvibe.com/api/MediaFile/create-multiple';
const IMAGE_PLACEHOLDER_PREFIX = 'https://media-files-y.edvibe.com/local-upload/';

function createUploadError(code, message, details = {}) {
    const error = new Error(message);
    error.code = code;
    Object.assign(error, details);
    return error;
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

function normalizeRequestUrl(input, baseUrl) {
    const candidate = typeof input === 'string' || input instanceof URL
        ? String(input)
        : String(input?.url || '');
    try {
        return new URL(candidate, baseUrl || 'https://edvibe.com/');
    } catch (_) {
        return null;
    }
}

function isTrustedEdvibeUrl(input, baseUrl) {
    const url = normalizeRequestUrl(input, baseUrl);
    return Boolean(url)
        && url.protocol === 'https:'
        && (url.hostname === 'edvibe.com' || url.hostname.endsWith('.edvibe.com'));
}

function readHeader(headers, name, HeadersCtor = globalThis.Headers) {
    if (!headers) return '';
    try {
        if (HeadersCtor) return new HeadersCtor(headers).get(name) || '';
    } catch (_) {
        // Fall through to plain-object and tuple handling.
    }
    const target = String(name).toLowerCase();
    if (Array.isArray(headers)) {
        const entry = headers.find(([key]) => String(key).toLowerCase() === target);
        return entry ? String(entry[1] || '') : '';
    }
    for (const [key, value] of Object.entries(headers)) {
        if (String(key).toLowerCase() === target) return String(value || '');
    }
    return '';
}

function createAuthorizationCapture(rootObject) {
    let authorization = '';
    const baseUrl = rootObject.location?.href || 'https://edvibe.com/';
    const originalFetch = rootObject.fetch;
    const HeadersCtor = rootObject.Headers;

    function capture(input, headers) {
        if (!isTrustedEdvibeUrl(input, baseUrl)) return;
        const value = readHeader(headers, 'authorization', HeadersCtor);
        if (value) authorization = value;
    }

    if (typeof originalFetch === 'function') {
        rootObject.fetch = function edvibeToolboxFetch(input, init) {
            capture(input, init?.headers || input?.headers);
            return originalFetch.apply(this, arguments);
        };
    }

    const xhrPrototype = rootObject.XMLHttpRequest?.prototype;
    if (xhrPrototype?.open && xhrPrototype?.setRequestHeader) {
        const originalOpen = xhrPrototype.open;
        const originalSetRequestHeader = xhrPrototype.setRequestHeader;
        const urls = new WeakMap();
        xhrPrototype.open = function open(method, url) {
            urls.set(this, url);
            return originalOpen.apply(this, arguments);
        };
        xhrPrototype.setRequestHeader = function setRequestHeader(name, value) {
            if (
                String(name).toLowerCase() === 'authorization'
                && isTrustedEdvibeUrl(urls.get(this), baseUrl)
                && value
            ) {
                authorization = String(value);
            }
            return originalSetRequestHeader.apply(this, arguments);
        };
    }

    return Object.freeze({ getAuthorization: () => authorization, capture });
}

function createDynamicImageRecipe(recipe) {
    if (!recipe || !Array.isArray(recipe.steps)) return recipe;
    const steps = recipe.steps.map((step) => {
        if (step.id !== 'save-image') return step;
        const exerciseView = step.valueTemplate?.ExerciseView || {};
        return Object.freeze({
            ...step,
            valueTemplate: Object.freeze({
                ...step.valueTemplate,
                ExerciseView: Object.freeze({
                    ...exerciseView,
                    ChangeExerciseImages: Object.freeze([
                        Object.freeze({
                            ImageId: '{{block.asset.imageId}}',
                            FullImageId: '{{block.asset.fullImageId}}',
                            ImageUrl: '{{block.asset.imageUrl}}',
                            FullImageUrl: '{{block.asset.fullImageUrl}}',
                            cropped: false
                        })
                    ])
                })
            })
        });
    });
    return Object.freeze({ ...recipe, steps: Object.freeze(steps) });
}

async function uploadImageAssets({
    definition,
    registry,
    authorization,
    fetchFn,
    FormDataCtor
}) {
    const imageBlocks = (definition?.blocks || []).filter((block) => block.type === 'image');
    if (imageBlocks.length === 0) return definition;
    if (!authorization) {
        throw createUploadError(
            'AUTH_CONTEXT_UNAVAILABLE',
            'Edvibe authorization context is unavailable. Reload the page and try again.'
        );
    }

    const formData = new FormDataCtor();
    formData.append('Type', '8');
    formData.append('SaveOriginal', 'true');
    formData.append('IsOriginalSizeOutputImage', 'true');
    const clientIds = [];
    imageBlocks.forEach((block, index) => {
        const clientId = parseClientId(block.url);
        const file = registry?.get?.(clientId);
        if (!clientId || !file) {
            throw createUploadError('IMAGE_FILE_REQUIRED', `Image block ${index + 1} requires a selected file.`);
        }
        clientIds.push(clientId);
        formData.append(`Files[${index}]`, file, file.name);
        formData.append(`Selections[${index}].X`, '0');
        formData.append(`Selections[${index}].Y`, '0');
        formData.append(`Selections[${index}].Width`, '0');
        formData.append(`Selections[${index}].Height`, '0');
        formData.append(`Ids[${index}]`, clientId);
    });

    let response;
    try {
        response = await fetchFn(UPLOAD_ENDPOINT, {
            method: 'POST',
            headers: { accept: '*/*', authorization },
            body: formData,
            mode: 'cors',
            credentials: 'include'
        });
    } catch (error) {
        throw createUploadError('MEDIA_UPLOAD_FAILED', 'Could not upload the selected image.', { cause: error });
    }
    if (!response?.ok) {
        throw createUploadError('MEDIA_UPLOAD_FAILED', `Edvibe image upload failed with HTTP ${response?.status || 'unknown'}.`);
    }

    let payload;
    try {
        payload = await response.json();
    } catch (error) {
        throw createUploadError('INVALID_MEDIA_RESPONSE', 'Edvibe returned an invalid image response.', { cause: error });
    }
    if (!payload?.IsSuccess) {
        throw createUploadError('MEDIA_UPLOAD_REJECTED', payload?.ErrorMessage || 'Edvibe rejected the selected image.');
    }
    if ((payload?.Data?.ErrorItems || []).length > 0) {
        throw createUploadError('MEDIA_UPLOAD_PARTIAL', 'Edvibe failed to upload one or more selected images.', {
            errorItems: payload.Data.ErrorItems
        });
    }

    const assetsByClientId = new Map((payload?.Data?.Items || []).map((item) => [
        String(item.OldId || ''),
        Object.freeze({
            imageId: item.Id,
            fullImageId: item.IdFull,
            imageUrl: item.Url,
            fullImageUrl: item.UrlFull
        })
    ]));
    for (const clientId of clientIds) {
        if (!assetsByClientId.has(clientId)) {
            throw createUploadError('INVALID_MEDIA_RESPONSE', 'Edvibe did not return an asset for every selected image.');
        }
    }
    const blocks = definition.blocks.map((block) => {
        if (block.type !== 'image') return block;
        const clientId = parseClientId(block.url);
        return Object.freeze({ ...block, asset: assetsByClientId.get(clientId) });
    });
    return Object.freeze({ ...definition, blocks: Object.freeze(blocks) });
}

function createEnhancedAdapterFactory({
    originalFactory,
    registry,
    authorizationCapture,
    fetchFn,
    FormDataCtor
}) {
    if (typeof originalFactory !== 'function') return null;
    return function createEnhancedAdapter(options) {
        const adapter = originalFactory(options);
        const uploadsByDefinition = new WeakMap();
        async function enrich(definition) {
            if (!definition || typeof definition !== 'object') return definition;
            let upload = uploadsByDefinition.get(definition);
            if (!upload) {
                upload = uploadImageAssets({
                    definition,
                    registry,
                    authorization: authorizationCapture.getAuthorization(),
                    fetchFn,
                    FormDataCtor
                });
                uploadsByDefinition.set(definition, upload);
            }
            return upload;
        }
        return Object.freeze({
            ...adapter,
            async createSection(context) {
                const definition = await enrich(context.definition);
                return adapter.createSection({ ...context, definition });
            },
            async cleanupSection(context) {
                const definition = await enrich(context.definition);
                return adapter.cleanupSection({ ...context, definition });
            }
        });
    };
}

function enhanceAdapterFactory({
    featureApi,
    registry,
    authorizationCapture,
    fetchFn,
    FormDataCtor
}) {
    const originalFactory = featureApi?.createRecordedCreationAdapter;
    if (typeof originalFactory !== 'function' || originalFactory.__imageUploadEnhanced) return false;
    const enhanced = createEnhancedAdapterFactory({
        originalFactory,
        registry,
        authorizationCapture,
        fetchFn,
        FormDataCtor
    });
    enhanced.__imageUploadEnhanced = true;
    featureApi.createRecordedCreationAdapter = enhanced;
    return true;
}

const authorizationCapture = globalThis.document
    ? createAuthorizationCapture(globalThis)
    : null;
const dynamicImageRecipe = createDynamicImageRecipe(batchSectionCreationRecipe);
const createImageUploadCreationAdapter = authorizationCapture
    ? createEnhancedAdapterFactory({
        originalFactory: createRecordedCreationAdapter,
        registry: defaultRegistry,
        authorizationCapture,
        fetchFn: globalThis.fetch.bind(globalThis),
        FormDataCtor: globalThis.FormData
    })
    : createRecordedCreationAdapter;

export {
    UPLOAD_ENDPOINT,
    IMAGE_PLACEHOLDER_PREFIX,
    createUploadError,
    parseClientId,
    normalizeRequestUrl,
    isTrustedEdvibeUrl,
    readHeader,
    createAuthorizationCapture,
    createDynamicImageRecipe,
    uploadImageAssets,
    createEnhancedAdapterFactory,
    enhanceAdapterFactory,
    authorizationCapture,
    dynamicImageRecipe,
    createImageUploadCreationAdapter
};
