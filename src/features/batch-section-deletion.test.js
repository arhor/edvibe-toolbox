import test from 'node:test';
import assert from 'node:assert/strict';
import * as api from './batch-section-deletion.js';

const lesson = (lessonId, name = `Lesson ${lessonId}`) => ({ lessonId, marathonLessonId: lessonId + 100, number: lessonId, name });
const response = (sections) => ({ Value: { Sections: sections } });

test('parses marathon id and rejects unrelated pages', () => {
    assert.equal(api.parseMarathonId('https://edvibe.com/cabinet/school/marathons/marathon/18508/lessons'), 18508);
    assert.equal(api.parseMarathonId('https://edvibe.com/cabinet'), null);
});

test('requires a non-empty trimmed section name', () => {
    assert.equal(api.normalizeSectionName('  Ogłoszenie  '), 'Ogłoszenie');
    assert.throws(() => api.normalizeSectionName('   '), { code: 'SECTION_NAME_REQUIRED' });
});

test('matching is exact and case-sensitive', () => {
    const sections = [{ Id: 1, Name: 'News' }, { Id: 2, Name: 'news' }, { Id: 3, Name: 'News ' }];
    assert.deepEqual(api.findExactSectionMatches(sections, ' News '), [{ Id: 1, Name: 'News' }]);
});

test('plan distinguishes zero, one, and multiple matches and preserves per-lesson ids', () => {
    const lessons = [lesson(1), lesson(2), lesson(3), lesson(4)];
    const inspectionsByLessonId = new Map([
        [1, { response: response([]) }],
        [2, { response: response([{ Id: 201, Name: 'Promo' }]) }],
        [3, { response: response([{ Id: 301, Name: 'Promo' }, { Id: 302, Name: 'Promo' }]) }],
        [4, { response: response([{ Id: 401, Name: 'Promo' }]) }]
    ]);
    const plan = api.buildExecutionPlan({ lessons, selectedLessonIds: [1, 2, 3, 4], sectionName: 'Promo', inspectionsByLessonId });
    assert.deepEqual(plan.eligible.map((item) => item.sectionId), [201, 401]);
    assert.deepEqual(plan.rejected.map((item) => item.code), ['SECTION_NOT_FOUND', 'SECTION_NAME_AMBIGUOUS']);
    assert.ok(Object.isFrozen(plan));
    assert.ok(Object.isFrozen(plan.eligible));
});

test('invalid normal section id is rejected as unsupported', () => {
    const plan = api.buildExecutionPlan({
        lessons: [lesson(1)], selectedLessonIds: [1], sectionName: 'Promo',
        inspectionsByLessonId: new Map([[1, { response: response([{ Id: null, Name: 'Promo' }]) }]])
    });
    assert.equal(plan.rejected[0].code, 'UNSUPPORTED_SECTION_TYPE');
});

test('delete request uses recording-derived endpoint and dynamic section id', () => {
    assert.deepEqual(api.buildDeleteRequest({ sectionId: 93608416 }), {
        controller: 'LessonSectionWsController', method: 'DeleteStageSection', projectName: 'Books', value: { StageSectionId: 93608416 }
    });
});

test('execution is sequential, throttled, and continues after expected per-lesson failure', async () => {
    const calls = [];
    const waits = [];
    const plan = { sectionName: 'Promo', selectedCount: 3, rejected: [], eligible: [
        { ...lesson(1), sectionName: 'Promo', sectionId: 11 },
        { ...lesson(2), sectionName: 'Promo', sectionId: 22 },
        { ...lesson(3), sectionName: 'Promo', sectionId: 33 }
    ] };
    const result = await api.executePlan({
        plan,
        sendRequest: async (_c, _m, _p, value) => {
            calls.push(value.StageSectionId);
            if (value.StageSectionId === 22) { const error = new Error('rejected'); error.code = 'SERVER_REJECTED'; throw error; }
            return { IsSuccess: true, Value: { StageSectionId: value.StageSectionId } };
        },
        wait: async (ms) => waits.push(ms),
        requestDelayMs: 7
    });
    assert.deepEqual(calls, [11, 22, 33]);
    assert.deepEqual(waits, [7, 7]);
    assert.deepEqual(result.results.map((item) => item.status), ['deleted', 'failed', 'deleted']);
});

test('fatal interruption retains partial result and marks remaining lessons not attempted', async () => {
    const plan = { sectionName: 'Promo', selectedCount: 2, rejected: [], eligible: [
        { ...lesson(1), sectionName: 'Promo', sectionId: 11 },
        { ...lesson(2), sectionName: 'Promo', sectionId: 22 }
    ] };
    const result = await api.executePlan({
        plan,
        sendRequest: async () => { const error = new Error('connection died'); error.code = 'INTERNAL_CONNECTION_ERROR'; throw error; },
        wait: async () => {}
    });
    assert.equal(result.results[0].status, 'failed');
    assert.equal(result.results[1].status, 'not_attempted');
    assert.equal(result.fatalError.code, 'INTERNAL_CONNECTION_ERROR');
});

test('report includes all outcomes and diagnostics', () => {
    const report = api.formatReport({
        plan: { sectionName: 'Promo', selectedCount: 2, eligible: [{}], rejected: [{}] },
        results: [
            { ...lesson(1), sectionId: 11, status: 'deleted', code: 'DELETED', message: 'Section deleted.' },
            { ...lesson(2), status: 'rejected', code: 'SECTION_NOT_FOUND', message: 'Not found.' }
        ]
    });
    assert.match(report, /Section: Promo/);
    assert.match(report, /section 11/);
    assert.match(report, /SECTION_NOT_FOUND/);
});
