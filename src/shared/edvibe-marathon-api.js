// @ts-check

import { appendPage, createFeatureError } from './batch-workflow-primitives.js';

/** @typedef {import('./edvibe-marathon-api.types.js').EdvibeSendRequest} EdvibeSendRequest */
/** @typedef {import('./edvibe-marathon-api.types.js').EdvibeMarathonApi} EdvibeMarathonApi */
/** @typedef {import('./edvibe-marathon-api.types.js').MarathonLesson} MarathonLesson */
/** @typedef {import('./edvibe-marathon-api.types.js').MarathonPupil} MarathonPupil */

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isRecord(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * @param {unknown} sendRequest
 * @returns {EdvibeSendRequest}
 */
function requireRequest(sendRequest) {
    if (typeof sendRequest !== 'function') throw new TypeError('sendRequest is required');
    return /** @type {EdvibeSendRequest} */ (sendRequest);
}

/**
 * Decode the transport envelope without changing pagination failure semantics.
 * The shared appendPage validator remains authoritative for Items and Count.
 * @param {unknown} response
 * @returns {{ items: unknown, total: unknown }}
 */
function readPage(response) {
    if (!isRecord(response)) return { items: undefined, total: undefined };
    const value = isRecord(response.Value)
        ? response.Value
        : isRecord(response.value)
            ? response.value
            : null;
    if (!value) return { items: undefined, total: undefined };
    const page = isRecord(value.Page) ? value.Page : null;
    return {
        items: value.Items,
        total: page?.Count
    };
}

/**
 * @param {{ sendRequest: EdvibeSendRequest, marathonId: number, pageSize?: number }} options
 * @returns {Promise<MarathonPupil[]>}
 */
async function loadAllPupils({ sendRequest, marathonId, pageSize = 50 }) {
    const request = requireRequest(sendRequest);
    /** @type {Record<string, unknown>[]} */
    let items = [];
    /** @type {number | null} */
    let total = null;

    while (total === null || items.length < total) {
        const response = await request(
            'MarathonPupilsWsController',
            'GetMarathonPupils',
            'Marathons',
            { MarathonId: marathonId, Skip: items.length, Take: pageSize }
        );
        const pageData = readPage(response);
        const page = appendPage(items, total, pageData.items, pageData.total, 'GetMarathonPupils');
        items = page.items;
        total = page.total;
    }

    return /** @type {MarathonPupil[]} */ (items);
}

/**
 * @param {{ sendRequest: EdvibeSendRequest, marathonId: number, pupilId: number, pageSize?: number }} options
 * @returns {Promise<MarathonLesson[]>}
 */
async function loadAllPupilLessons({ sendRequest, marathonId, pupilId, pageSize = 20 }) {
    const request = requireRequest(sendRequest);
    /** @type {Record<string, unknown>[]} */
    let items = [];
    /** @type {number | null} */
    let total = null;

    while (total === null || items.length < total) {
        const response = await request(
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
        const pageData = readPage(response);
        const page = appendPage(
            items,
            total,
            pageData.items,
            pageData.total,
            'GetMarathonLessonsForPupilPagination'
        );
        items = page.items;
        total = page.total;
    }

    return /** @type {MarathonLesson[]} */ (items);
}

/**
 * @param {{ sendRequest: EdvibeSendRequest, marathonId: number, pageSize?: number }} options
 * @returns {Promise<MarathonLesson[]>}
 */
async function loadAllMarathonLessons({ sendRequest, marathonId, pageSize = 100 }) {
    const request = requireRequest(sendRequest);
    /** @type {Record<string, unknown>[]} */
    let items = [];
    /** @type {number | null} */
    let total = null;

    while (total === null || items.length < total) {
        const response = await request(
            'MarathonLessonWsController',
            'GetMarathonLessonsPagination',
            'Marathons',
            {
                MarathonId: marathonId,
                SearchTerm: '',
                Page: { Skip: items.length, Take: pageSize }
            }
        );
        const pageData = readPage(response);
        const page = appendPage(
            items,
            total,
            pageData.items,
            pageData.total,
            'GetMarathonLessonsPagination'
        );
        items = page.items;
        total = page.total;
    }

    return /** @type {MarathonLesson[]} */ (items);
}

/**
 * @param {{ sendRequest: EdvibeSendRequest, lessonId: number }} options
 * @returns {Promise<Record<string, unknown>>}
 */
async function getLessonById({ sendRequest, lessonId }) {
    const request = requireRequest(sendRequest);
    const response = await request(
        'LessonWsController',
        'GetLessonWithId',
        'Books',
        { LessonId: lessonId }
    );
    if (!isRecord(response)) {
        throw createFeatureError('INVALID_RESPONSE', 'GetLessonWithId returned an invalid response.');
    }
    return response;
}

/**
 * @param {{ sendRequest: EdvibeSendRequest }} options
 * @returns {EdvibeMarathonApi}
 */
function createEdvibeMarathonApi({ sendRequest }) {
    const request = requireRequest(sendRequest);
    return Object.freeze({
        /** @param {{ marathonId: number, pageSize?: number }} options */
        loadAllPupils(options) {
            return loadAllPupils({ ...options, sendRequest: request });
        },
        /** @param {{ marathonId: number, pupilId: number, pageSize?: number }} options */
        loadAllPupilLessons(options) {
            return loadAllPupilLessons({ ...options, sendRequest: request });
        },
        /** @param {{ marathonId: number, pageSize?: number }} options */
        loadAllMarathonLessons(options) {
            return loadAllMarathonLessons({ ...options, sendRequest: request });
        },
        /** @param {{ lessonId: number }} options */
        getLessonById(options) {
            return getLessonById({ ...options, sendRequest: request });
        }
    });
}

export {
    createEdvibeMarathonApi,
    getLessonById,
    loadAllMarathonLessons,
    loadAllPupilLessons,
    loadAllPupils
};