(function initializeBatchLessonAccessHistoryModel(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./batch-lesson-access.js'));
    } else {
        root.EdVibeBatchLessonAccessHistoryModel = factory(root.EdVibeBatchLessonAccess);
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createModule(batchAccessApi) {
    'use strict';

    const OPERATION_TYPE = 'batch_lesson_access';

    function freezeObject(value) {
        return Object.freeze({ ...value });
    }

    function freezeItems(items) {
        return Object.freeze(items.map((item) => freezeObject(item)));
    }

    function normalizeEmail(value) {
        return String(value || '').trim().toLowerCase();
    }

    function getPupilId(pupil) {
        return pupil?.PupilId ?? pupil?.Id ?? null;
    }

    function getMarathonPupilId(pupil) {
        return pupil?.MarathonPupilId ?? pupil?.Id ?? null;
    }

    function sanitizePupil(pupil) {
        return freezeObject({
            email: String(pupil?.Email || '').trim() || null,
            pupilId: getPupilId(pupil),
            marathonPupilId: getMarathonPupilId(pupil)
        });
    }

    function sanitizeLesson(lesson) {
        const number = Number(lesson?.Number);
        return freezeObject({
            marathonLessonId: lesson?.MarathonLessonId ?? null,
            lessonNumber: Number.isFinite(number) ? number + 1 : null,
            lessonName: String(lesson?.Name || '').trim() || null,
            isOpen: typeof lesson?.IsOpen === 'boolean' ? lesson.IsOpen : null
        });
    }

    function splitSubmittedInputs(value) {
        const entries = [];
        const seen = new Set();
        for (const token of String(value || '').split(/[,;\r\n]+/)) {
            const submittedInput = token.trim();
            if (!submittedInput) continue;
            const normalizedEmail = normalizeEmail(submittedInput);
            if (seen.has(normalizedEmail)) continue;
            seen.add(normalizedEmail);
            entries.push(freezeObject({ submittedInput, normalizedEmail }));
        }
        return Object.freeze(entries);
    }

    function lessonKey(email, marathonLessonId) {
        return `${normalizeEmail(email)}:${String(marathonLessonId)}`;
    }

    function attemptKey(marathonPupilId, marathonLessonId) {
        return `${String(marathonPupilId)}:${String(marathonLessonId)}`;
    }

    function serializeError(error, fallbackCode, fallbackMessage) {
        return freezeObject({
            code: typeof error?.code === 'string' ? error.code : fallbackCode,
            message: String(error?.message || fallbackMessage),
            email: String(error?.email || '').trim() || null,
            pupilId: error?.pupilId ?? null,
            marathonLessonId: error?.marathonLessonId ?? null,
            attempts: Number.isInteger(error?.attempts) ? error.attempts : 0,
            type: typeof error?.type === 'string' ? error.type : null,
            count: Number.isInteger(error?.count) ? error.count : null
        });
    }

    function createCapture() {
        return {
            pupils: [],
            lessonsByPupilId: new Map(),
            lessonCatalogue: [],
            writeAttempts: new Map(),
            stylesheetUrl: '',
            attempt: null,
            sequence: 0
        };
    }

    function replacePage(target, offset, values) {
        if (offset === 0) target.length = 0;
        for (let index = 0; index < values.length; index += 1) {
            target[offset + index] = values[index];
        }
        while (target.length > 0 && target[target.length - 1] === undefined) target.pop();
    }

    function observeRequest(capture, method, value, result) {
        if (method === 'GetMarathonPupils') {
            const items = Array.isArray(result?.Value?.Items) ? result.Value.Items.map(sanitizePupil) : [];
            replacePage(capture.pupils, Number(value?.Skip) || 0, items);
            return;
        }
        if (method === 'GetMarathonLessonsForPupilPagination') {
            const pupilId = value?.PupilId ?? null;
            const lessons = capture.lessonsByPupilId.get(pupilId) || [];
            const items = Array.isArray(result?.Value?.Items) ? result.Value.Items.map(sanitizeLesson) : [];
            replacePage(lessons, Number(value?.Page?.Skip) || 0, items);
            capture.lessonsByPupilId.set(pupilId, lessons);
        }
    }

    function recordWriteAttempt(capture, method, value) {
        if (method !== 'ChangeIsOpenLessonForPupil') return;
        const key = attemptKey(value?.MarathonPupilId, value?.MarathonLessonId);
        capture.writeAttempts.set(key, (capture.writeAttempts.get(key) || 0) + 1);
    }

    function buildIdentityResolution({ submittedEmailInput, pupils }) {
        const submitted = splitSubmittedInputs(submittedEmailInput);
        const valid = batchAccessApi.parseEmailInput(submittedEmailInput);
        const malformed = new Set(valid.malformed.map(normalizeEmail));
        const pupilsByEmail = new Map();
        for (const pupil of pupils) {
            const key = normalizeEmail(pupil.email);
            const candidates = pupilsByEmail.get(key) || [];
            candidates.push(pupil);
            pupilsByEmail.set(key, candidates);
        }

        return submitted.map((entry) => {
            if (malformed.has(entry.normalizedEmail)) {
                return freezeObject({
                    ...entry,
                    resolution: 'malformed',
                    resolvedEmail: null,
                    pupilId: null,
                    marathonPupilId: null,
                    code: 'USER_INPUT_MALFORMED',
                    message: `Invalid email address: ${entry.submittedInput}.`
                });
            }
            const candidates = pupilsByEmail.get(entry.normalizedEmail) || [];
            if (candidates.length === 0) {
                return freezeObject({
                    ...entry,
                    resolution: 'missing',
                    resolvedEmail: null,
                    pupilId: null,
                    marathonPupilId: null,
                    code: 'USER_NOT_FOUND',
                    message: `No marathon pupil found for ${entry.submittedInput}.`
                });
            }
            if (candidates.length > 1) {
                return freezeObject({
                    ...entry,
                    resolution: 'ambiguous',
                    resolvedEmail: null,
                    pupilId: null,
                    marathonPupilId: null,
                    code: 'USER_AMBIGUOUS',
                    message: `Multiple marathon pupils found for ${entry.submittedInput}.`
                });
            }
            const pupil = candidates[0];
            return freezeObject({
                ...entry,
                resolution: 'matched',
                resolvedEmail: pupil.email,
                pupilId: pupil.pupilId,
                marathonPupilId: pupil.marathonPupilId,
                code: null,
                message: null
            });
        });
    }

    function selectedLessonMetadata(selectedLessonIds, lessonCatalogue) {
        const byId = new Map(lessonCatalogue.map((lesson) => [lesson.marathonLessonId, lesson]));
        return freezeItems(selectedLessonIds.map((marathonLessonId) => {
            const lesson = byId.get(marathonLessonId);
            return {
                marathonLessonId,
                lessonNumber: lesson?.lessonNumber ?? null,
                lessonName: lesson?.lessonName || `Lesson ${marathonLessonId}`
            };
        }));
    }

    function findDiscoveryError(errors, identity) {
        return errors.find((error) => (
            identity.pupilId !== null && error.pupilId === identity.pupilId
        ) || (
            identity.resolvedEmail && normalizeEmail(error.email) === normalizeEmail(identity.resolvedEmail)
        ));
    }

    function buildObservedPlan({
        submittedEmailInput,
        selectedLessonIds,
        pupils,
        lessonsByPupilId,
        lessonCatalogue,
        errors = []
    }) {
        const identities = buildIdentityResolution({ submittedEmailInput, pupils });
        const selectedLessons = selectedLessonMetadata(selectedLessonIds, lessonCatalogue);
        const serializedErrors = freezeItems(errors.map((error) => serializeError(
            error,
            'LESSON_ACCESS_PREFLIGHT_FAILED',
            'The lesson-access preflight failed.'
        )));
        const matrix = [];
        const discoveryFailures = [];
        const representedErrorCodes = new Set([
            'INVALID_EMAIL',
            'USER_INPUT_MALFORMED',
            'USER_NOT_FOUND',
            'USER_AMBIGUOUS'
        ]);
        const operationFailures = serializedErrors
            .filter((error) => !error.email
                && error.pupilId === null
                && error.marathonLessonId === null
                && !error.type
                && !representedErrorCodes.has(error.code))
            .map((error) => freezeObject({
                code: error.code,
                message: error.message,
                attempts: error.attempts,
                kind: ['EMAILS_REQUIRED', 'LESSONS_REQUIRED'].includes(error.code) ? 'input' : 'preflight'
            }));

        for (const identity of identities) {
            if (identity.resolution !== 'matched') continue;
            const lessons = lessonsByPupilId.get(identity.pupilId);
            if (!Array.isArray(lessons)) {
                const source = findDiscoveryError(serializedErrors, identity);
                if (source) {
                    discoveryFailures.push(freezeObject({
                        submittedEmail: identity.submittedInput,
                        resolvedEmail: identity.resolvedEmail,
                        pupilId: identity.pupilId,
                        marathonPupilId: identity.marathonPupilId,
                        code: source.code || 'LESSON_STATE_DISCOVERY_FAILED',
                        message: source.message || `Could not load lesson access for ${identity.resolvedEmail}.`,
                        attempts: source.attempts || 0
                    }));
                }
                for (const selected of selectedLessons) {
                    matrix.push(freezeObject({
                        ...identity,
                        ...selected,
                        preflightAccessState: 'unknown',
                        plannedOutcome: 'not_attempted',
                        code: source ? 'LESSON_STATE_UNAVAILABLE' : 'PREFLIGHT_BLOCKED',
                        message: source
                            ? 'The lesson state could not be loaded, so this combination was not attempted.'
                            : 'Validation stopped before this confirmed user and lesson combination could be prepared.'
                    }));
                }
                continue;
            }

            const matchingByLessonId = new Map();
            for (const lesson of lessons) {
                const values = matchingByLessonId.get(lesson.marathonLessonId) || [];
                values.push(lesson);
                matchingByLessonId.set(lesson.marathonLessonId, values);
            }

            for (const selected of selectedLessons) {
                const states = matchingByLessonId.get(selected.marathonLessonId) || [];
                if (states.length === 0) {
                    matrix.push(freezeObject({
                        ...identity,
                        ...selected,
                        preflightAccessState: 'unknown',
                        plannedOutcome: 'rejected',
                        code: 'LESSON_NOT_RETURNED',
                        message: `Lesson ${selected.marathonLessonId} was not returned for ${identity.resolvedEmail}.`
                    }));
                    continue;
                }
                if (states.length > 1) {
                    matrix.push(freezeObject({
                        ...identity,
                        ...selected,
                        preflightAccessState: 'unknown',
                        plannedOutcome: 'rejected',
                        code: 'LESSON_STATE_AMBIGUOUS',
                        message: `Multiple lesson states were returned for lesson ${selected.marathonLessonId}.`
                    }));
                    continue;
                }
                const state = states[0];
                if (typeof state.isOpen !== 'boolean') {
                    matrix.push(freezeObject({
                        ...identity,
                        ...selected,
                        lessonNumber: state.lessonNumber ?? selected.lessonNumber,
                        lessonName: state.lessonName || selected.lessonName,
                        preflightAccessState: 'unknown',
                        plannedOutcome: 'rejected',
                        code: 'INVALID_ACCESS_STATE',
                        message: `Lesson ${selected.marathonLessonId} returned an invalid access state.`
                    }));
                    continue;
                }
                matrix.push(freezeObject({
                    ...identity,
                    ...selected,
                    lessonNumber: state.lessonNumber ?? selected.lessonNumber,
                    lessonName: state.lessonName || selected.lessonName,
                    preflightAccessState: state.isOpen ? 'open' : 'closed',
                    plannedOutcome: state.isOpen ? 'already_open' : 'pending',
                    code: null,
                    message: null
                }));
            }
        }

        return Object.freeze({
            identities: freezeItems(identities),
            selectedLessons,
            matrix: freezeItems(matrix),
            discoveryFailures: freezeItems(discoveryFailures),
            operationFailures: freezeItems(operationFailures),
            errors: serializedErrors
        });
    }

    return Object.freeze({
        OPERATION_TYPE,
        freezeObject,
        normalizeEmail,
        sanitizePupil,
        sanitizeLesson,
        splitSubmittedInputs,
        lessonKey,
        attemptKey,
        createCapture,
        observeRequest,
        recordWriteAttempt,
        buildObservedPlan
    });
});
