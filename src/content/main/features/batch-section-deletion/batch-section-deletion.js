import { createFeatureError as featureError, parseMarathonId } from '#src/content/main/features/batch-workflow-primitives.js';
import { getLessonById, loadAllMarathonLessons } from '#src/content/main/infrastructure/edvibe-marathon-api.js';
import { wait } from '#src/shared/utils.js';

const DIALOG_TAG = 'edvibe-toolbox-batch-section-deletion-dialog';
const EXPECTED_WRITE_CODES = new Set(['SERVER_REJECTED', 'INVALID_RESPONSE', 'REQUEST_TIMEOUT', 'SEND_FAILED', 'WS_UNAVAILABLE']);

function normalizeSectionName(value) {
    const name = String(value || '').trim();
    if (!name) {
        throw featureError('SECTION_NAME_REQUIRED', 'Enter the exact section name.');
    }
    return name;
}

function normalizeLesson(node, index = 0) {
    const lessonId = Number(node?.LessonId ?? node?.lessonId ?? node?.Id);
    return Object.freeze({
        lessonId,
        marathonLessonId: Number(node?.MarathonLessonId ?? node?.marathonLessonId ?? node?.Id),
        number: Number(node?.Number ?? node?.number ?? index + 1),
        name: String(node?.Name ?? node?.name ?? `Lesson ${index + 1}`)
    });
}

function extractNormalSections(response) {
    const value = response?.Value ?? response?.value ?? response;
    if (!value || !Array.isArray(value.Sections)) {
        throw featureError('INVALID_LESSON_RESPONSE', 'The lesson response did not contain a normal Sections array.');
    }
    return value.Sections;
}

function findExactSectionMatches(sections, sectionName) {
    const name = normalizeSectionName(sectionName);
    if (!Array.isArray(sections)) {
        throw featureError('INVALID_LESSON_RESPONSE', 'Sections must be an array.');
    }
    return sections.filter((section) => String(section?.Name ?? '') === name);
}

function rejection(lesson, code, message) {
    return Object.freeze({ ...lesson, status: 'rejected', code, message });
}

function buildExecutionPlan({ lessons, selectedLessonIds, sectionName, inspectionsByLessonId }) {
    const name = normalizeSectionName(sectionName);
    const selected = new Set((selectedLessonIds || []).map(Number));
    const eligible = [];
    const rejected = [];
    for (const lesson of (lessons || []).filter((item) => selected.has(Number(item.lessonId)))) {
        const inspection = inspectionsByLessonId.get(Number(lesson.lessonId));
        if (!inspection || inspection.error) {
            const error = inspection?.error;
            rejected.push(rejection(lesson, error?.code || 'INVALID_LESSON_RESPONSE', error?.message || 'The lesson could not be inspected.'));
            continue;
        }
        try {
            const matches = findExactSectionMatches(extractNormalSections(inspection.response), name);
            if (matches.length === 0) {
                rejected.push(rejection(lesson, 'SECTION_NOT_FOUND', `Section "${name}" was not found.`));
            } else if (matches.length > 1) {
                rejected.push(rejection(lesson, 'SECTION_NAME_AMBIGUOUS', `Found ${matches.length} sections named "${name}".`));
            } else {
                const sectionId = Number(matches[0]?.Id);
                if (!Number.isSafeInteger(sectionId) || sectionId <= 0) {
                    rejected.push(rejection(lesson, 'UNSUPPORTED_SECTION_TYPE', 'The matching section has no safe normal-section ID.'));
                } else {
                    eligible.push(Object.freeze({ ...lesson, sectionName: name, sectionId }));
                }
            }
        } catch (error) {
            rejected.push(rejection(lesson, error.code || 'INVALID_LESSON_RESPONSE', error.message));
        }
    }
    return Object.freeze({
        sectionName: name,
        selectedCount: selected.size,
        eligible: Object.freeze(eligible),
        rejected: Object.freeze(rejected)
    });
}

function buildDeleteRequest(entry) {
    return Object.freeze({
        controller: 'LessonSectionWsController',
        method: 'DeleteStageSection',
        projectName: 'Books',
        value: Object.freeze({ StageSectionId: entry.sectionId })
    });
}

async function loadLessonCatalogue({ sendRequest, marathonId, pageSize = 100 }) {
    const items = await loadAllMarathonLessons({ sendRequest, marathonId, pageSize });
    return items.map(normalizeLesson);
}

async function inspectLessonsSequentially({ lessons, selectedLessonIds, sendRequest, wait, requestDelayMs = 250, onProgress }) {
    const selected = new Set((selectedLessonIds || []).map(Number));
    const targets = lessons.filter((lesson) => selected.has(Number(lesson.lessonId)));
    const inspections = new Map();
    for (const [index, lesson] of targets.entries()) {
        try {
            const response = await getLessonById({ sendRequest, lessonId: lesson.lessonId });
            extractNormalSections(response);
            inspections.set(lesson.lessonId, { response });
        } catch (error) {
            inspections.set(lesson.lessonId, { error: featureError(error.code || 'INVALID_LESSON_RESPONSE', error.message || 'Inspection failed.') });
        }
        onProgress?.({ current: index + 1, total: targets.length, lesson });
        if (index < targets.length - 1 && requestDelayMs > 0) {
            await wait(requestDelayMs);
        }
    }
    return inspections;
}

async function executePlan({ plan, sendRequest, wait, requestDelayMs = 300, onProgress }) {
    const results = plan.rejected.map((entry) => ({ ...entry }));
    let fatalError = null;
    for (const [index, entry] of plan.eligible.entries()) {
        if (fatalError) {
            results.push({ ...entry, status: 'not_attempted', code: 'OPERATION_INTERRUPTED', message: 'Not attempted because the operation stopped.' });
            continue;
        }
        try {
            const request = buildDeleteRequest(entry);
            const response = await sendRequest(request.controller, request.method, request.projectName, request.value);
            const value = response?.Value ?? response?.value;
            if (response?.IsSuccess === false || response?.isSuccess === false || value === false || value == null) {
                throw featureError('INVALID_RESPONSE', 'Deletion was not positively confirmed.');
            }
            results.push({ ...entry, status: 'deleted', code: 'DELETED', message: 'Section deleted.' });
        } catch (error) {
            const code = error.code || 'DELETE_FAILED';
            results.push({
                ...entry,
                status: 'failed',
                code,
                message: error.message || 'Deletion failed.',
                diagnosticObservations: [error]
            });
            if (!EXPECTED_WRITE_CODES.has(code)) {
                fatalError = error;
            }
        }
        onProgress?.({ current: index + 1, total: plan.eligible.length, entry, results: [...results] });
        if (index < plan.eligible.length - 1 && requestDelayMs > 0 && !fatalError) {
            await wait(requestDelayMs);
        }
    }
    return Object.freeze({ plan, results: Object.freeze(results.map(Object.freeze)), fatalError });
}

function formatReport(result) {
    const lines = [
        'Edvibe Toolbox: batch section deletion',
        `Section: ${result.plan.sectionName}`,
        `Selected: ${result.plan.selectedCount}`,
        `Eligible: ${result.plan.eligible.length}`,
        `Rejected: ${result.plan.rejected.length}`,
        ''
    ];
    for (const entry of result.results) {
        const label = `#${entry.number} ${entry.name} (lesson ${entry.lessonId})`;
        const section = entry.sectionId ? `, section ${entry.sectionId}` : '';
        lines.push(`[${entry.status}] ${label}${section}: ${entry.code} — ${entry.message}`);
    }
    return lines.join('\n');
}

function createBatchSectionDeletionFeature({
    sendRequest,
    getConnectionState,
    session,
    executeOperation = executePlan,
    createDialog,
    copyText,
    logger = { log() {} }
}) {
    async function open() {
        if (session.isOpen() || !session.activate()) {
            window.alert('Another Edvibe Toolbox operation is already running.');
            return;
        }
        const marathonId = parseMarathonId(window.location.href);
        if (!marathonId) {
            session.release();
            window.alert('Open an Edvibe marathon page first.');
            return;
        }
        if (getConnectionState?.()?.ready === false) {
            session.release();
            window.alert('Edvibe WebSocket connection is not ready.');
            return;
        }

        try {
            const dialog = session.ownDialog(createDialog());
            document.body.append(dialog);
            const lessons = await loadLessonCatalogue({ sendRequest, marathonId });
            dialog.configure({
                marathonId,
                lessons,
                async onInspect(input) {
                    const inspectionsByLessonId = await inspectLessonsSequentially({
                        lessons,
                        selectedLessonIds: input.selectedLessonIds,
                        sendRequest,
                        wait,
                        onProgress: input.onProgress
                    });
                    return buildExecutionPlan({ lessons, selectedLessonIds: input.selectedLessonIds, sectionName: input.sectionName, inspectionsByLessonId });
                },
                async onExecute(plan, onProgress) {
                    const result = await executeOperation({ plan, sendRequest, wait, onProgress });
                    return { ...result, report: formatReport(result) };
                },
                onCopy: copyText,
                onClose() {
                    session.close();
                }
            });
        } catch (error) {
            logger.log('Failed to open batch section deletion:', error);
            session.close();
            window.alert(error.message || 'Failed to load lessons.');
        }
    }
    return Object.freeze({ open });
}

export {
    DIALOG_TAG,
    parseMarathonId,
    normalizeSectionName,
    normalizeLesson,
    extractNormalSections,
    findExactSectionMatches,
    buildExecutionPlan,
    buildDeleteRequest,
    loadLessonCatalogue,
    inspectLessonsSequentially,
    executePlan,
    formatReport,
    createBatchSectionDeletionFeature
};
