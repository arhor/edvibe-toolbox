'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const history = require('./batch-section-deletion-history.js');
const lessons = () => [
{ lessonId: 101, marathonLessonId: 1001, number: 1, name: 'Welcome' },
{ lessonId: 102, marathonLessonId: 1002, number: 2, name: 'Practice' },
{ lessonId: 103, marathonLessonId: 1003, number: 3, name: 'Review' }
];
function plan(overrides = {}) {
const selected = lessons();
return {
sectionName: 'Summer promotion',
selectedLessonIds: selected.map((entry) => entry.lessonId),
selectedCount: selected.length,
eligible: selected.map((entry) => ({
...entry,
sectionName: 'Summer promotion',
sectionId: entry.lessonId + 500,
sectionType: 'normal',
discoveryOutcome: 'matched',
matchCount: 1
})),
rejected: [],
...overrides
};
}
function build(overrides = {}) {
return history.buildExecutionHistoryInput({
plan: plan(),
result: {},
startedAt: '2026-08-06T10:00:00.000Z',
completedAt: '2026-08-06T10:01:00.000Z',
marathonId: '77',
marathonName: 'Autumn course',
...overrides
});
}
test('preserves explicit discovery outcomes for zero, one, multiple, unsupported, and invalid cases', () => {
const selected = lessons();
const rejected = [
{
...selected[0], sectionName: 'Summer promotion', discoveryOutcome: 'not_found',
status: 'rejected', code: 'SECTION_NOT_FOUND', message: 'Not found.', attempts: 0, matchCount: 0
},
{
...selected[1], sectionName: 'Summer promotion', discoveryOutcome: 'ambiguous',
status: 'rejected', code: 'SECTION_NAME_AMBIGUOUS', message: 'Two matches.', attempts: 0, matchCount: 2
},
{
...selected[2], sectionName: 'Summer promotion', discoveryOutcome: 'unsupported_section_type',
status: 'rejected', code: 'UNSUPPORTED_SECTION_TYPE', message: 'Unsupported.', attempts: 0, matchCount: 1
},
{
lessonId: 104, marathonLessonId: 1004, number: 4, name: 'Broken',
sectionName: 'Summer promotion', discoveryOutcome: 'invalid_lesson_response',
status: 'rejected', code: 'INVALID_LESSON_RESPONSE', message: 'Invalid lesson.', attempts: 0
}
];
const eligible = [{
lessonId: 105, marathonLessonId: 1005, number: 5, name: 'Matched',
sectionName: 'Summer promotion', sectionId: 605, sectionType: 'normal',
discoveryOutcome: 'matched', matchCount: 1
}];
const input = build({
plan: plan({
selectedLessonIds: [101, 102, 103, 104, 105],
selectedCount: 5,
eligible,
rejected
}),
result: { results: [...rejected, { ...eligible[0], status: 'deleted', attempts: 1 }] }
});
assert.deepEqual(input.results.map((entry) => entry.data.discovery.outcome), [
'not_found', 'ambiguous', 'unsupported_section_type', 'invalid_lesson_response', 'matched'
]);
assert.equal(input.results[4].data.section.matchedId, 605);
assert.equal(input.results[4].data.section.supportedType, 'normal');
assert.equal(input.results[4].data.finalOutcome, 'deleted');
});
test('distinguishes validated deletion failure and preserves retries', () => {
const target = plan().eligible[0];
const input = build({
plan: plan({ selectedLessonIds: [101], selectedCount: 1, eligible: [target] }),
result: {
results: [{
...target,
status: 'failed',
code: 'REQUEST_TIMEOUT',
message: 'Deletion timed out.',
attempts: 3
}]
}
});
assert.equal(input.status, 'completed_with_failures');
assert.equal(input.results[0].status, 'failed');
assert.equal(input.results[0].attempts, 3);
assert.deepEqual(input.results[0].data.deletionFailure, {
code: 'REQUEST_TIMEOUT',
message: 'Deletion timed out.',
attemptCount: 3
});
assert.equal(input.results[0].data.discovery.outcome, 'matched');
});
test('retains completed work and materializes the remaining plan after interruption', () => {
const targetPlan = plan();
const input = build({
plan: targetPlan,
result: {
results: [
{ ...targetPlan.eligible[0], status: 'deleted', attempts: 1 },
{
...targetPlan.eligible[1], status: 'failed', code: 'WS_UNAVAILABLE',
message: 'Connection disappeared.', attempts: 2
}
],
fatalError: Object.assign(new Error('Connection disappeared.'), { code: 'WS_UNAVAILABLE' })
}
});
assert.equal(input.status, 'interrupted');
assert.deepEqual(input.results.map((entry) => entry.status), ['deleted', 'failed', 'not_attempted']);
assert.equal(input.results[2].code, 'OPERATION_INTERRUPTED');
assert.equal(input.results[2].attempts, 0);
assert.equal(input.counts.notAttempted, 1);
});
test('cancellation preserves rejections and marks every remaining eligible lesson not attempted', () => {
const selected = lessons();
const rejected = {
...selected[1],
sectionName: 'Summer promotion',
discoveryOutcome: 'not_found',
status: 'rejected',
code: 'SECTION_NOT_FOUND',
message: 'Not found.',
attempts: 0
};
const eligible = [selected[0], selected[2]].map((entry) => ({
...entry,
sectionName: 'Summer promotion',
sectionId: entry.lessonId + 500,
sectionType: 'normal',
discoveryOutcome: 'matched'
}));
const input = build({
plan: plan({ eligible, rejected: [rejected] }),
terminalStatus: 'cancelled'
});
assert.equal(input.status, 'cancelled');
assert.deepEqual(input.results.map((entry) => entry.status), [
'not_attempted', 'rejected', 'not_attempted'
]);
assert.equal(input.results[0].code, 'OPERATION_CANCELLED');
assert.equal(input.counts.skipped, 1);
assert.equal(input.counts.notAttempted, 2);
});
test('history input whitelists audit fields and excludes raw or session-shaped payloads', () => {
const target = plan().eligible[0];
const input = build({
plan: plan({ selectedLessonIds: [101], selectedCount: 1, eligible: [target] }),
result: {
results: [{
...target,
status: 'deleted',
attempts: 1,
rawLesson: { Sections: [{ Id: 1 }] },
transportResponse: { Value: true },
recording: [{ frame: 'secret' }],
sessionToken: 'secret'
}]
}
});
const json = JSON.stringify(input);
assert.doesNotMatch(json, /rawLesson|transportResponse|recording|sessionToken|secret/);
assert.match(json, /Summer promotion/);
assert.match(json, /batch-section-deletion/);
});
