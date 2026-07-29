(function initializeBatchLessonAccess(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.EdVibeBatchLessonAccess = factory();
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createModule() {
    'use strict';

    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function parseMarathonId(url) {
        const match = String(url || '').match(/\/marathon\/(\d+)(?:\/|$)/);
        return match ? Number(match[1]) : null;
    }

    function parseEmailInput(value) {
        const entries = [];
        const malformed = [];
        const seen = new Set();
        for (const token of String(value || '').split(/[,;\r\n]+/)) {
            const input = token.trim();
            if (!input) {
                continue;
            }
            const normalized = input.toLowerCase();
            if (seen.has(normalized)) {
                continue;
            }
            seen.add(normalized);
            if (!EMAIL_PATTERN.test(input)) {
                malformed.push(input);
                continue;
            }
            entries.push({ input, normalized });
        }
        return { entries, malformed };
    }

    function appendPage(items, total, nextItems, nextTotal, label) {
        if (
            !Array.isArray(nextItems)
            || !Number.isInteger(nextTotal)
            || nextTotal < 0
            || (total !== null && nextTotal !== total)
            || (nextItems.length === 0 && items.length < nextTotal)
            || items.length + nextItems.length > nextTotal
        ) {
            const error = new Error(`${label} returned invalid pagination data.`);
            error.code = 'INVALID_RESPONSE';
            throw error;
        }
        return {
            items: items.concat(nextItems),
            total: nextTotal
        };
    }

    async function loadAllPupils({ sendRequest, marathonId, pageSize = 50 }) {
        let items = [];
        let total = null;

        while (total === null || items.length < total) {
            const response = await sendRequest(
                'MarathonPupilsWsController',
                'GetMarathonPupils',
                'Marathons',
                { MarathonId: marathonId, Skip: items.length, Take: pageSize }
            );
            const page = appendPage(
                items,
                total,
                response?.Value?.Items,
                response?.Value?.Page?.Count,
                'GetMarathonPupils'
            );
            items = page.items;
            total = page.total;
        }

        return items;
    }

    async function loadAllPupilLessons({ sendRequest, marathonId, pupilId, pageSize = 20 }) {
        let items = [];
        let total = null;

        while (total === null || items.length < total) {
            const response = await sendRequest(
                'MarathonLessonWsController',
                'GetMarathonLessonsForPupilPagination',
                'Marathons',
                {
                    PupilId: pupilId,
                    MarathonId: marathonId,
                    SearchTerm: '',
                    Page: { Skip: items.length, Take: pageSize }
                }
            );
            const page = appendPage(
                items,
                total,
                response?.Value?.Items,
                response?.Value?.Page?.Count,
                'GetMarathonLessonsForPupilPagination'
            );
            items = page.items;
            total = page.total;
        }

        return items;
    }

    function resolvePupilsByEmail(entries, pupils) {
        const pupilsByEmail = new Map();
        for (const pupil of pupils) {
            const email = String(pupil.Email || '').trim().toLowerCase();
            const candidates = pupilsByEmail.get(email) || [];
            candidates.push(pupil);
            pupilsByEmail.set(email, candidates);
        }

        const matches = [];
        const errors = [];
        for (const entry of entries) {
            const candidates = pupilsByEmail.get(entry.normalized) || [];
            if (candidates.length === 1) {
                matches.push(candidates[0]);
            } else if (candidates.length === 0) {
                errors.push({
                    type: 'missing',
                    input: entry.input,
                    message: `No marathon pupil found for ${entry.input}.`
                });
            } else {
                errors.push({
                    type: 'ambiguous',
                    input: entry.input,
                    count: candidates.length,
                    message: `Multiple marathon pupils found for ${entry.input}.`
                });
            }
        }
        return { matches, errors };
    }

    return {
        parseMarathonId,
        parseEmailInput,
        appendPage,
        loadAllPupils,
        loadAllPupilLessons,
        resolvePupilsByEmail
    };
});
