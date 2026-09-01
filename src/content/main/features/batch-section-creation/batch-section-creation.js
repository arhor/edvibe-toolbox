import { createFeatureSession } from '#src/content/main/application/feature-session.js';
import { BATCH_SECTION_DIALOG_TAG } from '#src/content/main/features/batch-section-creation/batch-section-creation-dialog.js';
import { createRecordedExecution } from '#src/content/main/features/batch-section-creation/batch-section-creation-history.js';
import { createImageUploadCreationAdapter, dynamicImageRecipe } from '#src/content/main/features/batch-section-creation/batch-section-image-upload.js';
import { createFeatureError, parseMarathonId } from '#src/content/main/features/batch-workflow-primitives.js';
import { getLessonById, loadAllMarathonLessons } from '#src/content/main/infrastructure/edvibe-marathon-api.js';
import { WINDOW_MESSAGE_TYPES } from '#src/shared/messaging/index.js';
import { wait } from '#src/shared/utils.js';

const DIALOG_TAG = 'toolfox-batch-section-creation-dialog';
const OVERLAY_ID = 'toolfox-batch-section-creation-overlay';
const TRANSIENT_CODES = new Set(['WS_UNAVAILABLE', 'REQUEST_TIMEOUT', 'SEND_FAILED']);
const EXPECTED_WRITE_CODES = new Set([
    ...TRANSIENT_CODES,
    'SERVER_REJECTED',
    'INVALID_RESPONSE'
]);
const TOKEN_PATTERN = /\{\{\s*([^{}]+?)\s*\}\}/g;

function normalizeUrl(value) {
    const text = String(value || '').trim();
    if (!text) {
        return '';
    }
    try {
        const url = new URL(text);
        return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : '';
    } catch (_) {
        return '';
    }
}

function normalizeBlock(block, index) {
    const type = String(block?.type || '').trim();
    const id = String(block?.id || `block-${index + 1}`).trim();
    if (type === 'image') {
        return Object.freeze({
            id,
            type,
            url: String(block?.url || '').trim(),
            alt: String(block?.alt || '').trim()
        });
    }
    if (type === 'text') {
        return Object.freeze({ id, type, text: String(block?.text || '').trim() });
    }
    if (type === 'link') {
        return Object.freeze({
            id,
            type,
            label: String(block?.label || '').trim(),
            url: String(block?.url || '').trim()
        });
    }
    return Object.freeze({ id, type });
}

function validateSectionDefinition(input = {}) {
    const errors = [];
    const name = String(input?.name || '').trim();
    const blocks = Array.isArray(input?.blocks) ? input.blocks.map(normalizeBlock) : [];
    const seenIds = new Set();

    if (!name) {
        errors.push(createFeatureError('SECTION_NAME_REQUIRED', 'Section name is required.'));
    }
    if (blocks.length === 0) {
        errors.push(createFeatureError('SECTION_BLOCK_REQUIRED', 'Add at least one section block.'));
    }

    for (const [index, block] of blocks.entries()) {
        if (seenIds.has(block.id)) {
            errors.push(createFeatureError('DUPLICATE_BLOCK_ID', `Block ${index + 1} has a duplicate ID.`));
        }
        seenIds.add(block.id);
        if (block.type === 'image') {
            if (!normalizeUrl(block.url)) {
                errors.push(createFeatureError('IMAGE_URL_REQUIRED', `Image block ${index + 1} requires an HTTP(S) URL.`));
            }
        } else if (block.type === 'text') {
            if (!block.text) {
                errors.push(createFeatureError('TEXT_REQUIRED', `Text block ${index + 1} cannot be empty.`));
            }
        } else if (block.type === 'link') {
            if (!block.label) {
                errors.push(createFeatureError('LINK_LABEL_REQUIRED', `Link block ${index + 1} requires a label.`));
            }
            if (!normalizeUrl(block.url)) {
                errors.push(createFeatureError('LINK_URL_REQUIRED', `Link block ${index + 1} requires an HTTP(S) URL.`));
            }
        } else {
            errors.push(createFeatureError('UNSUPPORTED_BLOCK_TYPE', `Block ${index + 1} has unsupported type "${block.type || 'unknown'}".`));
        }
    }
    return { definition: Object.freeze({ name, blocks: Object.freeze(blocks) }), errors };
}

function reorderBlocks(blocks, fromIndex, toIndex) {
    const next = (Array.isArray(blocks) ? blocks : []).map((block) => ({ ...block }));
    if (
        !Number.isInteger(fromIndex)
        || !Number.isInteger(toIndex)
        || fromIndex < 0
        || toIndex < 0
        || fromIndex >= next.length
        || toIndex >= next.length
        || fromIndex === toIndex
    ) {
        return next;
    }
    const [block] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, block);
    return next;
}

function normalizeLesson(node, index = 0) {
    const lessonId = node?.LessonId ?? node?.lessonId ?? node?.Id;
    const marathonLessonId = node?.MarathonLessonId ?? node?.marathonLessonId ?? node?.Id;
    return Object.freeze({
        lessonId: Number(lessonId),
        marathonLessonId: Number(marathonLessonId),
        number: Number(node?.Number ?? node?.number ?? index) + (node?.Number !== undefined ? 1 : 0),
        name: String(node?.Name ?? node?.name ?? `Lesson ${index + 1}`)
    });
}

function extractNormalSections(structure) {
    const value = structure?.Value ?? structure;
    if (!value || !Array.isArray(value.Sections)) {
        throw createFeatureError('INVALID_LESSON_RESPONSE', 'The lesson response did not contain a normal sections array.');
    }
    return value.Sections;
}

function freezeEntries(entries) {
    return Object.freeze(entries.map((entry) => Object.freeze({ ...entry })));
}

function buildPreflightPlan({ lessons, selectedLessonIds, definition, inspectionsByLessonId }) {
    const validated = validateSectionDefinition(definition);
    if (validated.errors.length > 0) {
        throw createFeatureError('INVALID_SECTION_DEFINITION', 'The section definition is invalid.', {
            validationErrors: validated.errors
        });
    }
    const selected = new Set((selectedLessonIds || []).map(Number));
    const eligible = [];
    const rejected = [];

    for (const lesson of (lessons || []).filter((entry) => selected.has(Number(entry.lessonId)))) {
        const inspection = inspectionsByLessonId.get(Number(lesson.lessonId));
        if (!inspection || inspection.error) {
            const error = inspection?.error || createFeatureError('INVALID_LESSON_RESPONSE', 'The lesson was not inspected.');
            rejected.push({
                ...lesson,
                code: error.code || 'INVALID_LESSON_RESPONSE',
                message: error.message || 'The lesson could not be inspected.'
            });
            continue;
        }
        try {
            const sections = extractNormalSections(inspection.structure);
            const collision = sections.some((section) => String(section?.Name || '').trim() === validated.definition.name);
            if (collision) {
                rejected.push({ ...lesson, code: 'SECTION_NAME_COLLISION', message: `A section named "${validated.definition.name}" already exists.` });
            } else {
                eligible.push({ ...lesson });
            }
        } catch (error) {
            rejected.push({
                ...lesson,
                code: error.code || 'INVALID_LESSON_RESPONSE',
                message: error.message
            });
        }
    }

    const blockSummary = validated.definition.blocks.map((block, index) => Object.freeze({ index, type: block.type, id: block.id }));
    return Object.freeze({
        definition: validated.definition,
        selectedLessonIds: Object.freeze([...selected]),
        eligible: freezeEntries(eligible),
        rejected: freezeEntries(rejected),
        blockSummary: Object.freeze(blockSummary)
    });
}

function readPath(source, path) {
    return String(path || '').split('.').filter(Boolean).reduce(
        (value, key) => value == null ? undefined : value[key],
        source
    );
}

function resolveToken(path, context) {
    if (path.startsWith('generated.')) {
        const key = path.slice('generated.'.length);
        const store = context.block ? context.blockGenerated : context.generated;
        if (!(key in store)) {
            store[key] = context.createId();
        }
        return store[key];
    }
    return readPath(context, path);
}

function resolveTemplate(value, context) {
    if (Array.isArray(value)) {
        return value.map((entry) => resolveTemplate(entry, context));
    }
    if (value && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, resolveTemplate(entry, context)]));
    }
    if (typeof value !== 'string') {
        return value;
    }
    const exact = value.match(/^\{\{\s*([^{}]+?)\s*\}\}$/);
    if (exact) {
        return resolveToken(exact[1], context);
    }
    return value.replace(TOKEN_PATTERN, (_match, path) => {
        const resolved = resolveToken(path, context);
        return resolved == null ? '' : String(resolved);
    });
}

function validateRecipe(recipe) {
    const errors = [];
    if (!recipe || recipe.version !== 1) {
        errors.push(createFeatureError('RECIPE_MISSING', 'A version 1 recording recipe is required.'));
    }
    if (recipe && recipe.reviewedDynamicFields !== true) {
        errors.push(createFeatureError('RECIPE_NOT_REVIEWED', 'The recording recipe must explicitly confirm reviewed dynamic fields.'));
    }
    if (recipe && !Array.isArray(recipe.steps)) {
        errors.push(createFeatureError('RECIPE_STEPS_REQUIRED', 'The recording recipe requires steps.'));
    }
    for (const step of recipe?.steps || []) {
        if (!step.controller || !step.method || !step.projectName || !step.valueTemplate) {
            errors.push(createFeatureError('INVALID_RECIPE_STEP', `Recipe step "${step.id || step.method || 'unknown'}" is incomplete.`));
        }
    }
    return errors;
}

function createRecordedCreationAdapter({
    recipe = null,
    cryptoApi = globalThis.crypto,
    requestDelayMs = 300
} = {}) {
    const errors = validateRecipe(recipe);
    const createId = () => cryptoApi?.randomUUID?.()
        || `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    function expandSteps(steps, definition) {
        const expanded = [];
        for (let index = 0; index < steps.length;) {
            const step = steps[index];
            if (step.forEach !== 'blocks') {
                expanded.push({ step, block: null, blockIndex: null });
                index += 1;
                continue;
            }
            const group = [];
            while (index < steps.length && steps[index].forEach === 'blocks') {
                group.push(steps[index]);
                index += 1;
            }
            definition.blocks.forEach((block, blockIndex) => {
                const matching = group.find((candidate) =>
                    !Array.isArray(candidate.blockTypes) || candidate.blockTypes.includes(block.type)
                );
                if (matching) {
                    expanded.push({ step: matching, block, blockIndex });
                }
            });
        }
        return expanded;
    }

    async function executeSteps({
        steps,
        marathonId,
        lesson,
        definition,
        sendRequest,
        wait,
        captured = {},
        generated = {}
    }) {
        const blockGeneratedById = new Map();
        const expanded = expandSteps(steps, definition);
        let markedCreated = false;

        for (const [index, entry] of expanded.entries()) {
            const blockGenerated = entry.block
                ? blockGeneratedById.get(entry.block.id) || {}
                : generated;
            if (entry.block) {
                blockGeneratedById.set(entry.block.id, blockGenerated);
            }
            const context = {
                marathonId,
                lesson,
                section: definition,
                block: entry.block,
                blockIndex: entry.blockIndex,
                captured,
                generated,
                blockGenerated,
                createId
            };
            try {
                const response = await sendRequest(
                    entry.step.controller,
                    entry.step.method,
                    entry.step.projectName,
                    resolveTemplate(entry.step.valueTemplate, context)
                );
                for (const [name, path] of Object.entries(entry.step.capture || {})) {
                    const capturedValue = readPath(response, path);
                    if (capturedValue === undefined) {
                        throw createFeatureError('INVALID_RESPONSE', `Recipe capture "${name}" was missing after ${entry.step.id || entry.step.method}.`);
                    }
                    captured[name] = capturedValue;
                }
                if (entry.step.marksSectionCreated === true) {
                    markedCreated = true;
                }
                if (index < expanded.length - 1 && requestDelayMs > 0) {
                    await wait(requestDelayMs);
                }
            } catch (error) {
                error.partialCreated = markedCreated;
                error.captured = { ...captured };
                error.generated = { ...generated };
                throw error;
            }
        }
        return { captured: { ...captured }, generated: { ...generated } };
    }

    return Object.freeze({
        isReady: errors.length === 0,
        errors: Object.freeze(errors),
        async createSection(context) {
            if (errors.length > 0) {
                throw createFeatureError('RECIPE_UNAVAILABLE', errors[0].message);
            }
            return executeSteps({ ...context, steps: recipe.steps });
        },
        async cleanupSection(context) {
            if (!Array.isArray(recipe?.cleanupSteps) || recipe.cleanupSteps.length === 0) {
                return { attempted: false, status: 'unavailable' };
            }
            try {
                await executeSteps({ ...context, steps: recipe.cleanupSteps });
                return { attempted: true, status: 'success' };
            } catch (error) {
                return {
                    attempted: true,
                    status: 'failed',
                    code: error.code || 'CLEANUP_FAILED',
                    message: error.message
                };
            }
        }
    });
}

async function loadLessonCatalogue({ sendRequest, marathonId, pageSize = 100 }) {
    const items = await loadAllMarathonLessons({ sendRequest, marathonId, pageSize });
    return items.map(normalizeLesson);
}

async function inspectLessonsSequentially({
    lessons,
    selectedLessonIds,
    sendRequest,
    wait,
    delayMs = 300
}) {
    const selected = new Set((selectedLessonIds || []).map(Number));
    const targets = (lessons || []).filter((lesson) => selected.has(Number(lesson.lessonId)));
    const inspections = new Map();
    for (const [index, lesson] of targets.entries()) {
        try {
            const structure = await getLessonById({ sendRequest, lessonId: lesson.lessonId });
            inspections.set(Number(lesson.lessonId), { structure });
        } catch (error) {
            inspections.set(Number(lesson.lessonId), { error });
        }
        if (index < targets.length - 1 && delayMs > 0) {
            await wait(delayMs);
        }
    }
    return inspections;
}

function createResult(lesson, status, details = {}) {
    return {
        lessonId: lesson.lessonId,
        marathonLessonId: lesson.marathonLessonId,
        lessonNumber: lesson.number,
        lessonName: lesson.name,
        status,
        ...details
    };
}

function isFatalError(error, getConnectionState) {
    if (error?.code === 'WS_UNAVAILABLE') {
        return true;
    }
    if (error?.code === 'SEND_FAILED' && !getConnectionState().isOpen) {
        return true;
    }
    return !EXPECTED_WRITE_CODES.has(error?.code);
}

async function executeCreationPlan({
    marathonId,
    plan,
    adapter,
    sendRequest,
    wait,
    getConnectionState,
    lessonDelayMs = 300,
    onProgress = () => { }
}) {
    if (!adapter?.isReady) {
        throw createFeatureError('RECIPE_UNAVAILABLE', adapter?.errors?.[0]?.message || 'Recording recipe unavailable.');
    }
    const results = plan.rejected.map((lesson) => createResult(lesson, 'rejected', {
        code: lesson.code,
        message: lesson.message
    }));
    let attempts = 0;

    for (const [index, lesson] of plan.eligible.entries()) {
        onProgress({
            completed: index,
            total: plan.eligible.length,
            lesson,
            results: [...results]
        });
        try {
            attempts += 1;
            const created = await adapter.createSection({
                marathonId,
                lesson,
                definition: plan.definition,
                sendRequest,
                wait
            });
            results.push(createResult(lesson, 'created', {
                captured: created.captured,
                generated: created.generated,
                attempts: 1
            }));
        } catch (error) {
            const partial = Boolean(error.partialCreated);
            const fatal = isFatalError(error, getConnectionState);
            let cleanup = null;
            if (partial && !fatal) {
                cleanup = await adapter.cleanupSection({
                    marathonId,
                    lesson,
                    definition: plan.definition,
                    sendRequest,
                    wait,
                    captured: error.captured || {},
                    generated: error.generated || {}
                });
            }
            results.push(createResult(lesson, partial ? 'partially_created' : 'failed', {
                code: error.code || 'UNKNOWN_ERROR',
                message: error.message || 'Section creation failed.',
                captured: error.captured,
                generated: error.generated,
                cleanup,
                attempts: error.attempts || 1
            }));
            if (fatal) {
                for (const remaining of plan.eligible.slice(index + 1)) {
                    results.push(createResult(remaining, 'not_attempted', {
                        code: 'OPERATION_INTERRUPTED',
                        message: 'Not attempted because the batch operation stopped.'
                    }));
                }
                const partialResult = {
                    definition: plan.definition,
                    results,
                    attempts,
                    fatalError: error
                };
                error.partialResult = partialResult;
                throw error;
            }
        }
        onProgress({
            completed: index + 1,
            total: plan.eligible.length,
            lesson,
            results: [...results]
        });
        if (index < plan.eligible.length - 1 && lessonDelayMs > 0) {
            await wait(lessonDelayMs);
        }
    }
    return { definition: plan.definition, results, attempts };
}

function formatCreationReport(result) {
    const rows = Array.isArray(result?.results) ? result.results : [];
    const counts = (status) => rows.filter((entry) => entry.status === status).length;
    const lines = [
        `Section: ${result?.definition?.name || 'Unknown'}`,
        `Blocks: ${result?.definition?.blocks?.length || 0}`,
        `Created: ${counts('created')}`,
        `Rejected in preflight: ${counts('rejected')}`,
        `Failed: ${counts('failed')}`,
        `Partially created: ${counts('partially_created')}`,
        `Not attempted: ${counts('not_attempted')}`,
        ''
    ];
    for (const entry of rows) {
        lines.push(
            `${entry.lessonNumber || '?'}. ${entry.lessonName} — ${entry.status}`
            + (entry.code ? ` — ${entry.code}: ${entry.message || ''}` : '')
        );
        if (entry.captured?.sectionId !== undefined) {
            lines.push(`  Captured sectionId: ${entry.captured.sectionId}`);
        }
        if (entry.cleanup) {
            lines.push(`  Cleanup: ${entry.cleanup.status}`);
        }
    }
    return lines.join('\n').trim();
}

export function createBatchSectionCreationFeatureV2({
    transport,
    operationGuard,
    logger,
    executionHistoryService,
}) {
    const historyLogger = logger.createChildLogger('BatchSectionCreationHistory');
    const recordedExecution = createRecordedExecution({
        executePlan: executeCreationPlan,
        persistExecution: executionHistoryService.persistTerminal,
        getMarathonName: () => document.querySelector('h1')?.textContent?.trim()
            || document.title
            || null,
        now: () => new Date(),
        logger: historyLogger
    });

    const batchSectionCreationAdapter = createImageUploadCreationAdapter({
        recipe: dynamicImageRecipe,
        cryptoApi: window.crypto
    });

    return createBatchSectionCreationFeature({
        sendRequest: transport.sendRequest,
        getConnectionState: transport.getConnectionState,
        session: createFeatureSession({
            operationGuard,
            operationName: 'batch-section-creation'
        }),
        adapter: batchSectionCreationAdapter,
        executePlan: recordedExecution,
        createDialog: () => document.createElement(BATCH_SECTION_DIALOG_TAG),
        copyText: (text) => navigator.clipboard.writeText(text),
        logger: logger.createChildLogger('BatchSectionCreation')
    });
}

const batchSectionCreationFeatureDefinition = Object.freeze({
    type: WINDOW_MESSAGE_TYPES.OPEN_BATCH_SECTION_CREATION,
    create(context) {
        const feature = createBatchSectionCreationFeatureV2(context);
        return () => feature.open();
    }
});

function createBatchSectionCreationFeature({
    sendRequest,
    getConnectionState,
    session,
    adapter,
    executePlan = executeCreationPlan,
    createDialog = () => document.createElement(DIALOG_TAG),
    copyText = async () => { },
    logger = { log() {} }
}) {
    let running = false;
    let dialog = null;
    let marathonId = null;
    let lessons = [];
    let pendingPlan = null;
    let completedResult = null;

    function close() {
        running = false;
        dialog = null;
        lessons = [];
        pendingPlan = null;
        completedResult = null;
        session.close();
    }

    async function preflight(event) {
        if (running) {
            return;
        }
        running = true;
        try {
            const definition = event?.detail?.definition || {};
            const selectedLessonIds = event?.detail?.selectedLessonIds || [];
            const validation = validateSectionDefinition(definition);
            const errors = [...validation.errors];
            if (selectedLessonIds.length === 0) {
                errors.push(createFeatureError('LESSON_SELECTION_REQUIRED', 'Select at least one lesson.'));
            }
            if (errors.length > 0) {
                dialog.showValidationErrors(errors);
                return;
            }
            dialog.showLoading('Проверяем выбранные уроки…');
            const inspections = await inspectLessonsSequentially({
                lessons,
                selectedLessonIds,
                sendRequest,
                wait
            });
            pendingPlan = buildPreflightPlan({
                lessons,
                selectedLessonIds,
                definition: validation.definition,
                inspectionsByLessonId: inspections
            });
            dialog.showConfirmation(pendingPlan);
        } catch (error) {
            dialog.showValidationErrors([error]);
        } finally {
            running = false;
        }
    }

    async function confirm() {
        if (running || !pendingPlan?.eligible?.length) {
            return;
        }
        running = true;
        try {
            completedResult = await executePlan({
                marathonId,
                plan: pendingPlan,
                adapter,
                sendRequest,
                wait,
                getConnectionState,
                onProgress: (progress) => dialog.showExecution(progress)
            });
            dialog.showComplete(completedResult);
        } catch (error) {
            completedResult = error.partialResult || {
                definition: pendingPlan.definition,
                results: pendingPlan.rejected,
                fatalError: error
            };
            dialog.showComplete(completedResult, error);
        } finally {
            running = false;
        }
    }

    async function copyReport() {
        if (completedResult) {
            await copyText(formatCreationReport(completedResult));
        }
    }

    function restart() {
        pendingPlan = null;
        completedResult = null;
        dialog.showConfigure({
            lessons,
            recipeReady: adapter?.isReady,
            recipeErrors: adapter?.errors || []
        });
    }

    async function open() {
        if (session.isOpen() || document.getElementById(OVERLAY_ID)) {
            return;
        }
        if (!session.activate()) {
            window.alert('Another Toolfox operation is already running.');
            return;
        }
        marathonId = parseMarathonId(window.location.href);
        if (!marathonId) {
            session.release();
            window.alert('Open an Edvibe marathon page before creating sections.');
            return;
        }

        try {
            dialog = session.ownDialog(createDialog());
            dialog.addEventListener('edvibe-dialog-close', close);
            dialog.addEventListener('edvibe-batch-section-preflight', preflight);
            dialog.addEventListener('edvibe-batch-section-confirm', confirm);
            dialog.addEventListener('edvibe-batch-section-copy', copyReport);
            dialog.addEventListener('edvibe-batch-section-restart', restart);
            dialog.configure();
            (document.body || document.documentElement).appendChild(dialog);
            dialog.showLoading('Загружаем уроки марафона…');
            lessons = await loadLessonCatalogue({ sendRequest, marathonId });
            if (lessons.length === 0) {
                throw createFeatureError('EMPTY_LESSON_CATALOGUE', 'No lessons were found.');
            }
            dialog.showConfigure({
                lessons,
                recipeReady: adapter?.isReady,
                recipeErrors: adapter?.errors || []
            });
            logger.log(`Batch section creation ready for MarathonId ${marathonId}.`);
        } catch (error) {
            logger.log(`Batch section creation initialization failed (${error.code || 'UNKNOWN_ERROR'}).`);
            try {
                dialog?.showFatalError?.(error);
            } finally {
                session.release();
            }
        }
    }

    return { open, isRunning: () => running };
}

export {
    batchSectionCreationFeatureDefinition,
    parseMarathonId,
    validateSectionDefinition,
    reorderBlocks,
    normalizeLesson,
    buildPreflightPlan,
    createRecordedCreationAdapter,
    loadLessonCatalogue,
    inspectLessonsSequentially,
    executeCreationPlan,
    formatCreationReport,
    createBatchSectionCreationFeature,
    createFeatureError,
    DIALOG_TAG,
    OVERLAY_ID
};
