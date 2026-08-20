import { createFeatureError, parseMarathonId } from '#src/content/main/features/batch-workflow-primitives.js';
import { VIDEO_ATTACHMENT_DIALOG_TAG } from '#src/content/main/features/video-attachment/video-attachment-dialog.js';
import { getLessonById, loadAllMarathonLessons } from '#src/content/main/infrastructure/edvibe-marathon-api.js';
import { WINDOW_MESSAGE_TYPES } from '#src/shared/messaging/index.js';
import { wait } from '#src/shared/utils.js';

const RECOVERABLE_WRITE_CODES = new Set([
    'SERVER_REJECTED',
    'INVALID_RESPONSE',
    'REQUEST_TIMEOUT',
    'SEND_FAILED'
]);

function toPositiveSafeInteger(value) {
    const number = Number(value);
    return Number.isSafeInteger(number) && number > 0 ? number : null;
}

function normalizeLesson(node, index = 0) {
    const lessonId = toPositiveSafeInteger(node?.LessonId ?? node?.lessonId ?? node?.Id);
    if (!lessonId) {
        throw createFeatureError('INVALID_LESSON', 'Edvibe returned a lesson without a valid ID.');
    }

    return Object.freeze({
        lessonId,
        marathonLessonId: toPositiveSafeInteger(node?.MarathonLessonId ?? node?.marathonLessonId ?? node?.Id),
        number: Number(node?.Number ?? node?.number ?? index + 1),
        name: String(node?.Name ?? node?.name ?? `Lesson ${index + 1}`)
    });
}

function extractLessonSections(response) {
    const value = response?.Value ?? response?.value ?? response;
    if (!value || !Array.isArray(value.Sections)) {
        throw createFeatureError('INVALID_LESSON_RESPONSE', 'The lesson response did not contain a normal Sections array.');
    }

    return Object.freeze(value.Sections
        .map((section, index) => {
            const sectionId = toPositiveSafeInteger(section?.Id ?? section?.id);
            if (!sectionId) {
                return null;
            }
            const rawSortId = Number(section?.SortId ?? section?.sortId ?? index);
            return Object.freeze({
                sectionId,
                name: String(section?.Name ?? section?.name ?? `Section ${index + 1}`),
                sortId: Number.isFinite(rawSortId) ? rawSortId : index
            });
        })
        .filter(Boolean)
        .sort((left, right) => left.sortId - right.sortId || left.sectionId - right.sectionId));
}

async function loadLessonCatalogue({ sendRequest, marathonId, pageSize = 100 }) {
    const items = await loadAllMarathonLessons({ sendRequest, marathonId, pageSize });
    return Object.freeze(items.map(normalizeLesson));
}

async function loadLessonSections({ sendRequest, lessonId }) {
    const response = await getLessonById({ sendRequest, lessonId });
    return extractLessonSections(response);
}

function getLessonSectionSelectionState(sections = [], selectedSectionIds = []) {
    const sectionIds = new Set((sections || []).map(({ sectionId }) => Number(sectionId)));
    const selectedCount = (selectedSectionIds || []).filter((sectionId) => sectionIds.has(Number(sectionId))).length;
    const sectionCount = sectionIds.size;
    return Object.freeze({
        checked: sectionCount > 0 && selectedCount === sectionCount,
        indeterminate: selectedCount > 0 && selectedCount < sectionCount,
        selectedCount,
        sectionCount
    });
}

function selectAllLessonSections(sections = []) {
    return Object.freeze((sections || []).map(({ sectionId }) => Number(sectionId)));
}

function normalizeYoutubeUrl(value) {
    const input = String(value || '').trim();
    if (!input) {
        throw createFeatureError('VIDEO_URL_REQUIRED', 'Enter a YouTube video URL.');
    }

    let url;
    try {
        url = new URL(input);
    } catch (_) {
        throw createFeatureError('INVALID_VIDEO_URL', 'Enter a valid YouTube video URL.');
    }

    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
        throw createFeatureError('INVALID_VIDEO_URL', 'YouTube video URL must use HTTP or HTTPS.');
    }

    const hostname = url.hostname.toLowerCase();
    const isShortLink = hostname === 'youtu.be' || hostname === 'www.youtu.be';
    const isYoutubeHost = hostname === 'youtube.com' || hostname.endsWith('.youtube.com');
    const segments = url.pathname.split('/').filter(Boolean);
    const hasVideoTarget = isShortLink
        ? Boolean(segments[0])
        : isYoutubeHost && (
            (url.pathname === '/watch' && Boolean(url.searchParams.get('v')))
            || (['embed', 'live', 'shorts'].includes(segments[0]) && Boolean(segments[1]))
        );

    if (!hasVideoTarget) {
        throw createFeatureError('INVALID_VIDEO_URL', 'Enter a direct YouTube video link.');
    }

    return input;
}

function buildVideoAttachmentRequest({ sectionId, youtubeUrl, clientTime = new Date().toISOString() }) {
    const normalizedSectionId = toPositiveSafeInteger(sectionId);
    if (!normalizedSectionId) {
        throw createFeatureError('INVALID_SECTION_ID', 'The target lesson section ID is invalid.');
    }

    const link = normalizeYoutubeUrl(youtubeUrl);
    return Object.freeze({
        controller: 'SaveExerciseWsController',
        method: 'SaveExercise',
        projectName: 'Exercises',
        value: Object.freeze({
            ClassId: null,
            Domain: 'edvibe.com',
            ExerciseView: Object.freeze({
                Id: 0,
                Number: 0,
                Name: '',
                IsHidePupil: false,
                Type: 3,
                HomeworkLessonId: null,
                PersonalMaterialId: null,
                LessonSectionId: normalizedSectionId,
                Videos: Object.freeze([
                    Object.freeze({
                        Link: link,
                        Text: ''
                    })
                ])
            }),
            AiUsed: false,
            UsedNewConstructor: true,
            ClientTime: String(clientTime),
            DeviceType: 'desktop'
        })
    });
}

async function attachYoutubeVideo({ sendRequest, sectionId, youtubeUrl, clientTime }) {
    if (typeof sendRequest !== 'function') {
        throw new TypeError('sendRequest is required.');
    }

    const request = buildVideoAttachmentRequest({ sectionId, youtubeUrl, clientTime });
    const response = await sendRequest(
        request.controller,
        request.method,
        request.projectName,
        request.value
    );
    const value = response?.Value ?? response?.value;
    const exerciseId = toPositiveSafeInteger(value?.Id ?? value?.id);
    const responseSectionId = toPositiveSafeInteger(value?.LessonSectionId ?? value?.lessonSectionId);

    if (
        !value
        || Number(value?.Type ?? value?.type) !== 3
        || !exerciseId
        || responseSectionId !== request.value.ExerciseView.LessonSectionId
    ) {
        throw createFeatureError('INVALID_RESPONSE', 'Edvibe did not confirm the created video exercise.');
    }

    return Object.freeze({
        exerciseId,
        sectionId: responseSectionId,
        youtubeUrl: request.value.ExerciseView.Videos[0].Link
    });
}

function normalizeAttachmentTargets(targets) {
    const normalized = [];
    const seenSections = new Set();

    for (const target of targets || []) {
        const lessonId = toPositiveSafeInteger(target?.lessonId);
        const sectionId = toPositiveSafeInteger(target?.sectionId);
        if (!lessonId || !sectionId) {
            throw createFeatureError('INVALID_TARGET', 'Every selected target must contain valid lesson and section IDs.');
        }
        if (seenSections.has(sectionId)) {
            continue;
        }
        seenSections.add(sectionId);
        normalized.push(Object.freeze({
            lessonId,
            lessonNumber: Number(target?.lessonNumber ?? 0),
            lessonName: String(target?.lessonName ?? `Lesson ${lessonId}`),
            sectionId,
            sectionName: String(target?.sectionName ?? `Section ${sectionId}`)
        }));
    }

    if (normalized.length === 0) {
        throw createFeatureError('TARGET_REQUIRED', 'Select at least one lesson section.');
    }

    return Object.freeze(normalized);
}

function isFatalBatchError(error, getConnectionState) {
    if (error?.code === 'WS_UNAVAILABLE') {
        return true;
    }
    if (error?.code === 'SEND_FAILED' && (!getConnectionState || !getConnectionState().isOpen)) {
        return true;
    }
    return !RECOVERABLE_WRITE_CODES.has(error?.code);
}

async function executeVideoAttachmentBatch({
    targets,
    youtubeUrl,
    sendRequest,
    wait = async () => { },
    getConnectionState,
    requestDelayMs = 250,
    onProgress = () => { }
}) {
    const link = normalizeYoutubeUrl(youtubeUrl);
    const normalizedTargets = normalizeAttachmentTargets(targets);
    const results = [];
    let fatalError = null;

    for (const [index, target] of normalizedTargets.entries()) {
        if (fatalError) {
            results.push(Object.freeze({
                ...target,
                status: 'not_attempted',
                code: 'OPERATION_INTERRUPTED',
                message: 'Not attempted because the batch operation stopped.'
            }));
            continue;
        }

        try {
            const attached = await attachYoutubeVideo({
                sendRequest,
                sectionId: target.sectionId,
                youtubeUrl: link
            });
            results.push(Object.freeze({
                ...target,
                ...attached,
                status: 'attached',
                code: 'ATTACHED',
                message: 'Video attached.'
            }));
        } catch (error) {
            results.push(Object.freeze({
                ...target,
                status: 'failed',
                code: error.code || 'ATTACH_FAILED',
                message: error.message || 'Failed to attach the video.'
            }));
            if (isFatalBatchError(error, getConnectionState)) {
                fatalError = error;
            }
        }

        onProgress({
            current: index + 1,
            total: normalizedTargets.length,
            target,
            results: [...results]
        });
        if (index < normalizedTargets.length - 1 && requestDelayMs > 0 && !fatalError) {
            await wait(requestDelayMs);
        }
    }

    const successful = results.filter((entry) => entry.status === 'attached').length;
    const failed = results.filter((entry) => entry.status === 'failed').length;
    const notAttempted = results.filter((entry) => entry.status === 'not_attempted').length;
    return Object.freeze({
        youtubeUrl: link,
        targets: normalizedTargets,
        results: Object.freeze(results),
        fatalError,
        summary: Object.freeze({
            requested: normalizedTargets.length,
            successful,
            failed,
            notAttempted
        })
    });
}

export function createVideoAttachmentFeatureV2({
    transport,
    operationGuard,
    logger,
}) {
    return createVideoAttachmentFeature({
        sendRequest: transport.sendRequest,
        getConnectionState: transport.getConnectionState,
        canStart: operationGuard.canStart,
        onActiveChange: operationGuard.guardedActiveChange('video-attachment'),

        createDialog: () => document.createElement(VIDEO_ATTACHMENT_DIALOG_TAG),
        getLocationHref: () => window.location.href,
        appendDialog: (dialog) => document.body.append(dialog),
        alertUser: (message) => window.alert(message),
        logger: logger.createChildLogger('VideoAttachment'),
    });
}

const videoAttachmentFeatureDefinition = Object.freeze({
    type: WINDOW_MESSAGE_TYPES.OPEN_VIDEO_ATTACHMENT,
    create(context) {
        const feature = createVideoAttachmentFeatureV2(context);
        return () => feature.open();
    }
});

function createVideoAttachmentFeature({
    sendRequest,
    getConnectionState,
    canStart = () => true,
    onActiveChange = () => { },
    createDialog,
    getLocationHref = () => globalThis.location?.href || '',
    appendDialog = (dialog) => globalThis.document?.body?.append(dialog),
    alertUser = (message) => globalThis.alert?.(message),
    logger = { log() {} }
}) {
    let active = false;

    function release(dialog) {
        dialog?.remove?.();
        if (!active) {
            return;
        }
        active = false;
        onActiveChange(false);
    }

    function open() {
        if (active || !canStart()) {
            alertUser('Another Edvibe Toolbox operation is already running.');
            return;
        }

        const marathonId = parseMarathonId(getLocationHref());
        if (!marathonId) {
            alertUser('Open an Edvibe marathon page first.');
            return;
        }

        active = true;
        onActiveChange(true);
        let dialog;
        try {
            dialog = createDialog();
            dialog.configure({
                marathonId,
                lessons: [],
                loadingLessons: true,
                async onLoadSections(lessonId) {
                    return loadLessonSections({ sendRequest, lessonId });
                },
                async onAttach({ youtubeUrl, targets, onProgress }) {
                    const result = await executeVideoAttachmentBatch({
                        targets,
                        youtubeUrl,
                        sendRequest,
                        getConnectionState,
                        wait,
                        onProgress
                    });
                    logger.log(`Attached YouTube video to ${result.summary.successful}/${result.summary.requested} selected sections.`);
                    return result;
                },
                onClose() {
                    release(dialog);
                }
            });
            appendDialog(dialog);

            void loadLessonCatalogue({ sendRequest, marathonId })
                .then((lessons) => {
                    if (active) {
                        dialog.setLessons(lessons);
                    }
                })
                .catch((error) => {
                    if (active) {
                        dialog.setLoadError(error);
                    }
                });
        } catch (error) {
            release(dialog);
            throw error;
        }
    }

    return Object.freeze({ open });
}

export {
    videoAttachmentFeatureDefinition,
    attachYoutubeVideo,
    buildVideoAttachmentRequest,
    createVideoAttachmentFeature,
    executeVideoAttachmentBatch,
    getLessonSectionSelectionState,
    extractLessonSections,
    loadLessonCatalogue,
    loadLessonSections,
    normalizeAttachmentTargets,
    normalizeYoutubeUrl,
    selectAllLessonSections
};
