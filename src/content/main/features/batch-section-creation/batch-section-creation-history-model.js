const OPERATION_TYPE = 'batch_section_creation';
const TERMINAL_STATUSES = Object.freeze([
    'completed',
    'completed_with_failures',
    'cancelled',
    'interrupted'
]);
const ATTEMPTED_STATUSES = Object.freeze(['created', 'failed', 'partially_created']);
const FAILURE_STATUSES = Object.freeze(['failed', 'partially_created']);

function parseMarathonId(url) {
    const match = String(url || '').match(/\/marathon\/(\d+)(?:\/|$)/);
    return match ? String(match[1]) : null;
}

function text(value, fallback = '') {
    const normalized = String(value ?? '').trim();
    if (!normalized) return fallback;
    return normalized;
}

function safeUrl(value) {
    const normalized = text(value);
    if (!normalized) return null;
    try {
        const url = new URL(normalized);
        return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
    } catch (_) {
        return null;
    }
}

function safeBlockText(value) {
    return text(value);
}

function freezeArray(entries) {
    return Object.freeze(entries.map((entry) => Object.freeze(entry)));
}

function summarizeBlock(block, index) {
    const type = text(block?.type, 'unknown', 80);
    const summary = {
        order: index,
        blockId: text(block?.id, `block-${index + 1}`, 160),
        type
    };
    const clientId = text(block?.clientId, '', 500);
    if (clientId) summary.clientId = clientId;
    if (type === 'image') {
        summary.url = safeUrl(block?.url);
        summary.alt = safeBlockText(block?.alt, 1000) || null;
    } else if (type === 'text') {
        summary.content = safeBlockText(block?.text, 10000) || null;
    } else if (type === 'link') {
        summary.label = safeBlockText(block?.label, 1000) || null;
        summary.url = safeUrl(block?.url);
    }
    return summary;
}

function serializeSectionDefinition(definition = {}) {
    const blocks = Array.isArray(definition?.blocks)
        ? definition.blocks.map(summarizeBlock)
        : [];
    return Object.freeze({
        name: text(definition?.name, 'Unnamed section', 500),
        blocks: freezeArray(blocks)
    });
}

function words(value) {
    return String(value || '')
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(Boolean);
}

function isIdentifierPath(path) {
    const leaf = words(path.at(-1));
    return leaf.includes('id');
}

function collectIdentifiers(source, sourceName, output, path = [], seen = new WeakSet()) {
    if (source === null || source === undefined) return;
    if (typeof source !== 'object') {
        if (!isIdentifierPath(path)) return;
        const value = typeof source === 'number' || typeof source === 'boolean'
            ? source
            : text(source, '', 500);
        if (value === '') return;
        output.push({ source: sourceName, name: path.join('.'), value });
        return;
    }
    if (seen.has(source)) return;
    seen.add(source);
    try {
        if (Array.isArray(source)) {
            source.forEach((entry, index) => collectIdentifiers(
                entry,
                sourceName,
                output,
                [...path, String(index)],
                seen
            ));
            return;
        }
        for (const [key, value] of Object.entries(source)) {
            collectIdentifiers(value, sourceName, output, [...path, key], seen);
        }
    } finally {
        seen.delete(source);
    }
}

function serializeIdentifiers(result = {}) {
    const entries = [];
    collectIdentifiers(result?.captured, 'captured', entries);
    collectIdentifiers(result?.generated, 'generated', entries);
    collectIdentifiers(result?.blockGenerated, 'block_generated', entries);
    const deduplicated = [];
    const seen = new Set();
    for (const entry of entries) {
        const key = `${entry.source}\u0000${entry.name}\u0000${String(entry.value)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        deduplicated.push(entry);
    }
    return freezeArray(deduplicated);
}

function normalizeLesson(value = {}, fallbackId = null) {
    const lessonId = value.lessonId ?? value.LessonId ?? fallbackId;
    const marathonLessonId = value.marathonLessonId ?? value.MarathonLessonId ?? null;
    const number = value.lessonNumber ?? value.number ?? value.Number ?? null;
    const name = value.lessonName ?? value.name ?? value.Name ?? null;
    return Object.freeze({
        lessonId: lessonId === undefined || lessonId === null ? null : lessonId,
        marathonLessonId: marathonLessonId === undefined ? null : marathonLessonId,
        number: number === undefined ? null : number,
        name: text(name, 'Unnamed lesson', 500)
    });
}

function lessonKey(value) {
    const lessonId = value?.lessonId ?? value?.LessonId;
    return lessonId === undefined || lessonId === null ? null : String(lessonId);
}

function asExecutionResult(value, fallbackStatus, terminalStatus) {
    return {
        lessonId: value?.lessonId ?? value?.LessonId ?? null,
        marathonLessonId: value?.marathonLessonId ?? value?.MarathonLessonId ?? null,
        lessonNumber: value?.lessonNumber ?? value?.number ?? value?.Number ?? null,
        lessonName: value?.lessonName ?? value?.name ?? value?.Name ?? null,
        status: value?.status || fallbackStatus,
        code: value?.code,
        message: value?.message,
        attempts: value?.attempts,
        captured: value?.captured,
        generated: value?.generated,
        blockGenerated: value?.blockGenerated,
        cleanup: value?.cleanup,
        terminalStatus
    };
}

function materializeResults(plan = {}, executionResult = {}, terminalStatus = null) {
    const rejectedByLesson = new Map();
    for (const entry of plan?.rejected || []) {
        const key = lessonKey(entry);
        if (key !== null) rejectedByLesson.set(key, asExecutionResult(entry, 'rejected', terminalStatus));
    }
    const finalByLesson = new Map();
    for (const entry of executionResult?.results || []) {
        const key = lessonKey(entry);
        if (key === null) continue;
        const fallbackStatus = entry?.status || (rejectedByLesson.has(key) ? 'rejected' : null);
        finalByLesson.set(key, asExecutionResult(entry, fallbackStatus, terminalStatus));
    }
    const eligibleByLesson = new Map();
    for (const entry of plan?.eligible || []) {
        const key = lessonKey(entry);
        if (key !== null) eligibleByLesson.set(key, entry);
    }
    const selectedIds = Array.isArray(plan?.selectedLessonIds)
        ? plan.selectedLessonIds.map(String)
        : [];
    const ordered = [];
    const included = new Set();

    for (const id of selectedIds) {
        let entry = finalByLesson.get(id) || rejectedByLesson.get(id);
        if (!entry && eligibleByLesson.has(id)) {
            entry = asExecutionResult(eligibleByLesson.get(id), 'not_attempted', terminalStatus);
        }
        if (!entry) {
            entry = asExecutionResult({ lessonId: id, lessonName: `Lesson ${id}` }, 'not_attempted', terminalStatus);
        }
        ordered.push(entry);
        included.add(id);
    }

    for (const entry of [...rejectedByLesson.values(), ...finalByLesson.values()]) {
        const key = lessonKey(entry);
        if (key !== null && included.has(key)) continue;
        ordered.push(entry);
        if (key !== null) included.add(key);
    }
    for (const [key, entry] of eligibleByLesson.entries()) {
        if (included.has(key)) continue;
        ordered.push(asExecutionResult(entry, 'not_attempted', terminalStatus));
        included.add(key);
    }
    return ordered;
}

function isAttemptedStatus(status) {
    return ATTEMPTED_STATUSES.includes(status);
}

function isFailureStatus(status) {
    return FAILURE_STATUSES.includes(status);
}

function buildCounts(results, plan = {}) {
    const attempted = results.filter((result) => isAttemptedStatus(result.status)).length;
    const notAttempted = results.filter((result) => result.status === 'not_attempted').length;
    const inferredEligible = attempted + notAttempted;
    const plannedEligible = Array.isArray(plan?.eligible) ? plan.eligible.length : 0;
    return Object.freeze({
        requested: results.length,
        eligible: Math.max(plannedEligible, inferredEligible),
        attempted,
        successful: results.filter((result) => result.status === 'created').length,
        noOp: 0,
        skipped: results.filter((result) => result.status === 'rejected').length,
        failed: results.filter((result) => isFailureStatus(result.status)).length,
        notAttempted
    });
}

export {
    OPERATION_TYPE,
    TERMINAL_STATUSES,
    parseMarathonId,
    text,
    serializeSectionDefinition,
    serializeIdentifiers,
    normalizeLesson,
    asExecutionResult,
    materializeResults,
    isAttemptedStatus,
    isFailureStatus,
    buildCounts
};
