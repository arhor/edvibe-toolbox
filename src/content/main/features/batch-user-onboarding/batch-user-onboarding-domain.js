import { createFeatureError } from '#src/content/main/features/batch-workflow-primitives.js';

function featureError(code, message, details = {}) {
    return createFeatureError(code, message, details);
}

function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.freeze(value);
    for (const nested of Object.values(value)) deepFreeze(nested);
    return value;
}

function normalizeModerator(item) {
    const id = Number(item?.Id);
    const teacherId = Number(item?.TeacherId);
    if (!Number.isSafeInteger(id) || id <= 0 || !Number.isSafeInteger(teacherId) || teacherId <= 0) {
        throw featureError('INVALID_MODERATOR_RESPONSE', 'The moderator catalogue contained an invalid identifier.');
    }
    return Object.freeze({
        id,
        teacherId,
        name: String(item?.Name || '').trim() || null,
        email: String(item?.Email || '').trim() || null
    });
}

function normalizeModeratorCatalogue(items) {
    if (!Array.isArray(items)) {
        throw featureError('INVALID_MODERATOR_RESPONSE', 'The moderator catalogue was not an array.');
    }
    const moderators = items.map(normalizeModerator);
    const ids = new Set();
    const teacherIds = new Set();
    for (const moderator of moderators) {
        if (ids.has(moderator.id) || teacherIds.has(moderator.teacherId)) {
            throw featureError('INVALID_MODERATOR_RESPONSE', 'The moderator catalogue contained ambiguous identifiers.');
        }
        ids.add(moderator.id);
        teacherIds.add(moderator.teacherId);
    }
    return Object.freeze(moderators);
}

async function loadModerators({ sendRequest, marathonId }) {
    const response = await sendRequest(
        'MarathonModeratorWsController',
        'GetMarathonModerators',
        'Marathons',
        { MarathonId: marathonId }
    );
    return normalizeModeratorCatalogue(response?.Value?.Items);
}

function buildModeratorIndex(moderators) {
    return new Map((moderators || []).map((moderator) => [moderator.teacherId, moderator]));
}

function resolvePupilModerators(pupilModerators, moderators) {
    if (!Array.isArray(pupilModerators)) {
        return Object.freeze({
            safe: false,
            moderators: Object.freeze([]),
            code: 'UNSAFE_MODERATOR_REPLACEMENT',
            message: 'Current curator assignments could not be interpreted safely.'
        });
    }
    const byTeacherId = buildModeratorIndex(moderators);
    const resolved = [];
    const seen = new Set();
    for (const current of pupilModerators) {
        const teacherId = Number(current?.TeacherId);
        const moderator = byTeacherId.get(teacherId);
        if (!Number.isSafeInteger(teacherId) || !moderator || seen.has(moderator.id)) {
            return Object.freeze({
                safe: false,
                moderators: Object.freeze([]),
                code: 'UNSAFE_MODERATOR_REPLACEMENT',
                message: 'Existing curator assignments cannot be preserved without guessing.'
            });
        }
        seen.add(moderator.id);
        resolved.push(moderator);
    }
    return Object.freeze({
        safe: true,
        moderators: Object.freeze(resolved),
        code: null,
        message: null
    });
}

function serializePupil(pupil) {
    if (!pupil) return null;
    return Object.freeze({
        email: String(pupil.Email || '').trim() || null,
        name: String(pupil.Name || pupil.DisplayName || pupil.FullName || '').trim() || null,
        pupilId: Number.isSafeInteger(Number(pupil.PupilId)) ? Number(pupil.PupilId) : null,
        marathonPupilId: Number.isSafeInteger(Number(pupil.MarathonPupilId))
            ? Number(pupil.MarathonPupilId)
            : null
    });
}

function buildPupilEmailIndex(pupils) {
    const index = new Map();
    for (const pupil of Array.isArray(pupils) ? pupils : []) {
        const email = String(pupil?.Email || '').trim().toLowerCase();
        if (!email) continue;
        const values = index.get(email) || [];
        values.push(pupil);
        index.set(email, values);
    }
    return index;
}

function findTargetModerator(moderators, targetModeratorId) {
    const targetId = Number(targetModeratorId);
    return (moderators || []).find((moderator) => moderator.id === targetId) || null;
}

export {
    buildPupilEmailIndex,
    deepFreeze,
    featureError,
    findTargetModerator,
    loadModerators,
    normalizeModeratorCatalogue,
    resolvePupilModerators,
    serializePupil
};
