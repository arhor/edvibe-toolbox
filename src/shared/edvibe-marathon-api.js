import { appendPage } from './batch-workflow-primitives.js';

function requireRequest(sendRequest) {
    if (typeof sendRequest !== 'function') throw new TypeError('sendRequest is required');
    return sendRequest;
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

function createEdvibeMarathonApi({ sendRequest }) {
    const request = requireRequest(sendRequest);
    return Object.freeze({
        loadAllPupils(options) {
            return loadAllPupils({ ...options, sendRequest: request });
        },
        loadAllPupilLessons(options) {
            return loadAllPupilLessons({ ...options, sendRequest: request });
        }
    });
}

export {
    createEdvibeMarathonApi,
    loadAllPupilLessons,
    loadAllPupils
};