(function initializeBatchSectionDeletion(root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.EdVibeBatchSectionDeletion = factory();
})(typeof globalThis !== 'undefined' ? globalThis : window, function createModule() {
    'use strict';

    const DIALOG_TAG = 'edvibe-toolbox-batch-section-deletion-dialog';
    const EXPECTED_WRITE_CODES = new Set(['SERVER_REJECTED', 'INVALID_RESPONSE', 'REQUEST_TIMEOUT', 'SEND_FAILED', 'WS_UNAVAILABLE']);

    function featureError(code, message, details = {}) {
        const error = new Error(message);
        error.code = code;
        Object.assign(error, details);
        return error;
    }

    function parseMarathonId(url) {
        const match = String(url || '').match(/\/marathon\/(\d+)(?:\/|$)/);
        return match ? Number(match[1]) : null;
    }

    function normalizeSectionName(value) {
        const name = String(value || '').trim();
        if (!name) throw featureError('SECTION_NAME_REQUIRED', 'Enter the exact section name.');
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
        if (!Array.isArray(sections)) throw featureError('INVALID_LESSON_RESPONSE', 'Sections must be an array.');
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
        const items = [];
        let count = null;
        while (count === null || items.length < count) {
            const response = await sendRequest('MarathonLessonWsController', 'GetMarathonLessonsPagination', 'Marathons', {
                MarathonId: marathonId,
                SearchTerm: '',
                Page: { Skip: items.length, Take: pageSize }
            });
            const value = response?.Value ?? response?.value;
            const next = value?.Items;
            count = value?.Page?.Count;
            if (!Array.isArray(next) || !Number.isInteger(count) || (next.length === 0 && items.length < count)) {
                throw featureError('INVALID_RESPONSE', 'Lesson catalogue pagination was invalid.');
            }
            items.push(...next);
        }
        return items.map(normalizeLesson);
    }

    async function inspectLessonsSequentially({ lessons, selectedLessonIds, sendRequest, wait, requestDelayMs = 250, onProgress }) {
        const selected = new Set((selectedLessonIds || []).map(Number));
        const targets = lessons.filter((lesson) => selected.has(Number(lesson.lessonId)));
        const inspections = new Map();
        for (const [index, lesson] of targets.entries()) {
            try {
                const response = await sendRequest('LessonWsController', 'GetLessonWithId', 'Books', { LessonId: lesson.lessonId });
                extractNormalSections(response);
                inspections.set(lesson.lessonId, { response });
            } catch (error) {
                inspections.set(lesson.lessonId, { error: featureError(error.code || 'INVALID_LESSON_RESPONSE', error.message || 'Inspection failed.') });
            }
            onProgress?.({ current: index + 1, total: targets.length, lesson });
            if (index < targets.length - 1 && requestDelayMs > 0) await wait(requestDelayMs);
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
                results.push({ ...entry, status: 'failed', code, message: error.message || 'Deletion failed.' });
                if (!EXPECTED_WRITE_CODES.has(code)) fatalError = error;
            }
            onProgress?.({ current: index + 1, total: plan.eligible.length, entry, results: [...results] });
            if (index < plan.eligible.length - 1 && requestDelayMs > 0 && !fatalError) await wait(requestDelayMs);
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

    function buildExecutionHistoryInput({ marathonId, startedAt, completedAt, result }) {
        const deleted = result.results.filter((entry) => entry.status === 'deleted').length;
        const failed = result.results.filter((entry) => entry.status === 'failed').length;
        const rejected = result.results.filter((entry) => entry.status === 'rejected').length;
        const notAttempted = result.results.filter((entry) => entry.status === 'not_attempted').length;
        const status = result.fatalError
            ? 'interrupted'
            : failed > 0 || rejected > 0
                ? 'completed_with_failures'
                : 'completed';
        return Object.freeze({
            operationType: 'batch-section-deletion',
            startedAt,
            completedAt,
            status,
            pageContext: Object.freeze({ marathonId }),
            counts: Object.freeze({
                requested: result.plan.selectedCount,
                eligible: result.plan.eligible.length,
                attempted: deleted + failed,
                successful: deleted,
                noOp: 0,
                skipped: rejected,
                failed,
                notAttempted
            }),
            results: Object.freeze(result.results.map((entry) => Object.freeze({
                itemId: `lesson-${entry.lessonId}`,
                label: `#${entry.number} ${entry.name}`,
                status: entry.status,
                code: entry.code,
                message: entry.message,
                attempts: entry.status === 'not_attempted' || entry.status === 'rejected' ? 0 : 1,
                data: Object.freeze({
                    lessonId: entry.lessonId,
                    marathonLessonId: entry.marathonLessonId,
                    sectionId: entry.sectionId || null,
                    sectionName: result.plan.sectionName
                })
            })))
        });
    }

    function createBatchSectionDeletionFeature({
        sendRequest,
        getConnectionState,
        wait,
        canStart,
        onActiveChange,
        createDialog,
        copyText,
        persistExecution = async () => Object.freeze({ stored: false }),
        openHistory = () => {},
        log = () => {}
    }) {
        let active = false;
        async function open({ stylesheetUrl } = {}) {
            if (active || !canStart()) {
                window.alert('Another Edvibe Toolbox operation is already running.');
                return;
            }
            const marathonId = parseMarathonId(window.location.href);
            if (!marathonId) {
                window.alert('Open an Edvibe marathon page first.');
                return;
            }
            if (getConnectionState?.()?.ready === false) {
                window.alert('Edvibe WebSocket connection is not ready.');
                return;
            }
            active = true;
            onActiveChange(true);
            const dialog = createDialog();
            document.body.append(dialog);
            try {
                const lessons = await loadLessonCatalogue({ sendRequest, marathonId });
                dialog.configure({
                    stylesheetUrl,
                    marathonId,
                    lessons,
                    async onInspect(input) {
                        const inspectionsByLessonId = await inspectLessonsSequentially({ lessons, selectedLessonIds: input.selectedLessonIds, sendRequest, wait, onProgress: input.onProgress });
                        return buildExecutionPlan({ lessons, selectedLessonIds: input.selectedLessonIds, sectionName: input.sectionName, inspectionsByLessonId });
                    },
                    async onExecute(plan, onProgress) {
                        const startedAt = new Date().toISOString();
                        const result = await executePlan({ plan, sendRequest, wait, onProgress });
                        const completedAt = new Date().toISOString();
                        let history;
                        try {
                            history = await persistExecution(buildExecutionHistoryInput({ marathonId, startedAt, completedAt, result }));
                        } catch (persistenceError) {
                            history = Object.freeze({ stored: false, persistenceError });
                            log('Batch section deletion history persistence failed:', persistenceError);
                        }
                        return { ...result, report: formatReport(result), history };
                    },
                    onCopy: copyText,
                    onOpenHistory(executionId) {
                        dialog.remove();
                        active = false;
                        onActiveChange(false);
                        openHistory(executionId, stylesheetUrl);
                    },
                    onClose() {
                        dialog.remove();
                        active = false;
                        onActiveChange(false);
                    }
                });
            } catch (error) {
                log('Failed to open batch section deletion:', error);
                dialog.remove();
                active = false;
                onActiveChange(false);
                window.alert(error.message || 'Failed to load lessons.');
            }
        }
        return Object.freeze({ open });
    }

    return Object.freeze({
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
        buildExecutionHistoryInput,
        createBatchSectionDeletionFeature
    });
});
