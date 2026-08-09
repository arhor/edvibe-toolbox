import { appendPage, createFeatureError } from './batch-workflow-primitives.js';

function requireRequest(sendRequest) {
    if (typeof sendRequest !== 'function') throw new TypeError('sendRequest is required');
    return sendRequest;
}

function readPage(response, label) {
    const value = response?.Value ?? response?.value;
    if (!value) throw createFeatureError('INVALID_RESPONSE', `${label} returned no value.`);
    return { items: value.Items, total: value.Page?.Count };
}

async function loadAllPupils({ sendRequest, marathonId, pageSize = 50 }) {
    const request = requireRequest(sendRequest);
    let items = [];
    let total = null;

    while (total === null || items.length < total) {
        const response = await request(
            'MarathonPupilsWsController',
            'GetMarathonPupils',
            'Marathons',
            { MarathonId: marathonId, Skip: items.length, Take: pageSize }
        );
        const pageData = readPage(response, 'GetMarathonPupils');
        const page = appendPage(items, total, pageData.items, pageData.total, 'GetMarathonPupils');
        items = page.items;
        total = page.total;
    }

    return items;
}

async function loadAllPupilLessons({ sendRequest, marathonId, pupilId, pageSize = 20 }) {
    const request = requireRequest(sendRequest);
    let items = [];
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
        const pageData = readPage(response, 'GetMarathonLessonsForPupilPagination');
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

    return items;
}

async function loadAllMarathonLessons({ sendRequest, marathonId, pageSize = 100 }) {
    const request = requireRequest(sendRequest);
    let items = [];
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
        const pageData = readPage(response, 'GetMarathonLessonsPagination');
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

    return items;
}

async function getLessonById({ sendRequest, lessonId }) {
    const request = requireRequest(sendRequest);
    const response = await request(
        'LessonWsController',
        'GetLessonWithId',
        'Books',
        { LessonId: lessonId }
    );
    if (response == null || typeof response !== 'object') {
        throw createFeatureError('INVALID_RESPONSE', 'GetLessonWithId returned an invalid response.');
    }
    return response;
}

function createEdvibeMarathonApi({ sendRequest }) {
    const request = requireRequest(sendRequest);
    return Object.freeze({
        loadAllPupils(options) {
            return loadAllPupils({ ...options, sendRequest: request });
        },
        loadAllPupilLessons(options) {
            return loadAllPupilLessons({ ...options, sendRequest: request });
        },
        loadAllMarathonLessons(options) {
            return loadAllMarathonLessons({ ...options, sendRequest: request });
        },
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