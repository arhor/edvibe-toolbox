import { batchSectionCreationRecipe } from '#src/content/main/features/batch-section-creation/batch-section-creation-recipe.js';
import { createRecordedCreationAdapter } from '#src/content/main/features/batch-section-creation/batch-section-creation.js';
import { registry as defaultRegistry } from '#src/content/main/features/batch-section-creation/image-upload/batch-section-image-upload.js';

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

function readStorageKeys(storage) {
    if (!storage) return null;
    try {
        return Array.from({ length: storage.length }, (_, index) => storage.key(index))
            .filter(Boolean)
            .map(String)
            .sort();
    } catch (_) {
        return null;
    }
}

function readCookieNames(documentObject) {
    if (!documentObject) return null;
    try {
        const cookie = String(documentObject.cookie || '');
        if (!cookie) return [];
        return cookie
            .split(';')
            .map((entry) => entry.split('=', 1)[0].trim())
            .filter(Boolean)
            .sort();
    } catch (_) {
        return null;
    }
}

function createAuthorizationCapture(rootObject) {
    let authorization = '';
    let authorizationCaptureCount = 0;
    let fetchTrustedRequestCount = 0;
    let manualTrustedRequestCount = 0;
    let trustedRequestCount = 0;
    let xhrTrustedRequestCount = 0;
    let lastAuthorizationCapture = null;
    let lastTrustedRequest = null;
    const baseUrl = rootObject.location?.href || 'https://edvibe.com/';
    const originalFetch = rootObject.fetch;
    const HeadersCtor = rootObject.Headers;
    const xhrPrototype = rootObject.XMLHttpRequest?.prototype;
    const fetchHookInstalled = typeof originalFetch === 'function';
    const xhrHookInstalled = Boolean(xhrPrototype?.open && xhrPrototype?.setRequestHeader);
    const installedAt = new Date().toISOString();

    function summarizeRequestUrl(input) {
        const url = normalizeRequestUrl(input, baseUrl);
        return url ? `${url.origin}${url.pathname}` : null;
    }

    function recordTrustedRequest(input, source = 'manual', method = 'GET') {
        if (!isTrustedEdvibeUrl(input, baseUrl)) return false;
        trustedRequestCount += 1;
        if (source === 'fetch') fetchTrustedRequestCount += 1;
        else if (source === 'xhr') xhrTrustedRequestCount += 1;
        else manualTrustedRequestCount += 1;
        lastTrustedRequest = Object.freeze({
            source,
            method: String(method || 'GET').toUpperCase(),
            url: summarizeRequestUrl(input),
            observedAt: new Date().toISOString()
        });
        return true;
    }

    function capture(input, headers, {
        source = 'manual',
        method = 'GET',
        observeRequest = true
    } = {}) {
        if (observeRequest) {
            if (!recordTrustedRequest(input, source, method)) return;
        } else if (!isTrustedEdvibeUrl(input, baseUrl)) {
            return;
        }
        const value = readHeader(headers, 'authorization', HeadersCtor);
        if (!value) return;
        authorization = value;
        authorizationCaptureCount += 1;
        lastAuthorizationCapture = Object.freeze({
            source,
            method: String(method || 'GET').toUpperCase(),
            url: summarizeRequestUrl(input),
            observedAt: new Date().toISOString()
        });
    }

    if (fetchHookInstalled) {
        rootObject.fetch = function edvibeToolboxFetch(input, init) {
            capture(input, init?.headers || input?.headers, {
                source: 'fetch',
                method: init?.method || input?.method || 'GET'
            });
            return originalFetch.apply(this, arguments);
        };
    }

    if (xhrHookInstalled) {
        const originalOpen = xhrPrototype.open;
        const originalSetRequestHeader = xhrPrototype.setRequestHeader;
        const requests = new WeakMap();
        xhrPrototype.open = function open(method, url) {
            requests.set(this, { method, url });
            recordTrustedRequest(url, 'xhr', method);
            return originalOpen.apply(this, arguments);
        };
        xhrPrototype.setRequestHeader = function setRequestHeader(name, value) {
            if (String(name).toLowerCase() === 'authorization' && value) {
                const request = requests.get(this) || {};
                capture(request.url, { authorization: value }, {
                    source: 'xhr',
                    method: request.method,
                    observeRequest: false
                });
            }
            return originalSetRequestHeader.apply(this, arguments);
        };
    }

    function getDiagnostics() {
        return Object.freeze({
            installedAt,
            hasAuthorization: Boolean(authorization),
            hooks: Object.freeze({
                fetch: fetchHookInstalled,
                xhr: xhrHookInstalled
            }),
            trustedRequests: Object.freeze({
                total: trustedRequestCount,
                fetch: fetchTrustedRequestCount,
                xhr: xhrTrustedRequestCount,
                manual: manualTrustedRequestCount
            }),
            authorizationCaptureCount,
            lastTrustedRequest,
            lastAuthorizationCapture,
            storage: Object.freeze({
                localStorageKeys: readStorageKeys(rootObject.localStorage),
                sessionStorageKeys: readStorageKeys(rootObject.sessionStorage),
                cookieNames: readCookieNames(rootObject.document)
            })
        });
    }

    return Object.freeze({
        getAuthorization: () => authorization,
        getDiagnostics,
        capture
    });
}

function createAuthorizationFailureDiagnostics(captureDiagnostics, imageBlockCount) {
    const completedAt = new Date().toISOString();
    const startedAt = captureDiagnostics?.installedAt || completedAt;
    const startedAtMs = Date.parse(startedAt);
    const completedAtMs = Date.parse(completedAt);
    const durationMs = Number.isFinite(startedAtMs) && Number.isFinite(completedAtMs)
        ? Math.max(0, completedAtMs - startedAtMs)
        : null;
    return Object.freeze({
        requestAttempts: Object.freeze([
            Object.freeze({
                correlationId: 'media-upload-auth-context',
                operationName: 'resolve-image-upload-authorization',
                controller: null,
                method: 'captureAuthorizationHeader',
                projectName: 'MediaFile',
                requestId: null,
                attemptNumber: 1,
                startedAt,
                completedAt,
                durationMs,
                outcome: 'failure',
                transportCode: 'AUTH_CONTEXT_UNAVAILABLE',
                serverErrorCode: null,
                serverErrorMessage: null,
                requestSummary: Object.freeze({
                    endpoint: UPLOAD_ENDPOINT,
                    imageBlockCount,
                    authorizationCapture: captureDiagnostics || null
                }),
                responseSummary: null
            })
        ])
    });
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
    authorizationContext = null,
    fetchFn,
    FormDataCtor
}) {
    const imageBlocks = (definition?.blocks || []).filter((block) => block.type === 'image');
    if (imageBlocks.length === 0) return definition;
    if (!authorization) {
        throw createUploadError(
            'AUTH_CONTEXT_UNAVAILABLE',
            'Edvibe authorization context is unavailable. Reload the page and try again.',
            {
                diagnostics: createAuthorizationFailureDiagnostics(
                    authorizationContext,
                    imageBlocks.length
                )
            }
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
                    authorizationContext: authorizationCapture.getDiagnostics?.() || null,
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
    readStorageKeys,
    readCookieNames,
    createAuthorizationCapture,
    createAuthorizationFailureDiagnostics,
    createDynamicImageRecipe,
    uploadImageAssets,
    createEnhancedAdapterFactory,
    enhanceAdapterFactory,
    authorizationCapture,
    dynamicImageRecipe,
    createImageUploadCreationAdapter
};
