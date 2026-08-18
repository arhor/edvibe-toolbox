import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
    attachYoutubeVideo,
    buildVideoAttachmentRequest,
    executeVideoAttachmentBatch,
    extractLessonSections,
    getLessonSectionSelectionState,
    normalizeAttachmentTargets,
    normalizeYoutubeUrl,
    selectAllLessonSections
} from '#src/content/main/features/video-attachment/video-attachment.js';

describe('normalizeYoutubeUrl', () => {
    test('preserves direct YouTube URLs including short-link query parameters', () => {
        const shortUrl = 'https://youtu.be/WM331caeRW0?si=lmwM8k2q80NiaJ9A';
        const watchUrl = 'https://www.youtube.com/watch?v=WM331caeRW0&t=12';

        assert.equal(normalizeYoutubeUrl(shortUrl), shortUrl);
        assert.equal(normalizeYoutubeUrl(watchUrl), watchUrl);
    });

    test('rejects non-video and non-YouTube URLs', () => {
        assert.throws(() => normalizeYoutubeUrl('https://youtube.com/'), { code: 'INVALID_VIDEO_URL' });
        assert.throws(() => normalizeYoutubeUrl('https://example.com/watch?v=WM331caeRW0'), { code: 'INVALID_VIDEO_URL' });
    });
});

describe('extractLessonSections', () => {
    test('normalizes and sorts normal lesson sections', () => {
        const sections = extractLessonSections({
            Value: {
                Sections: [
                    { Id: 30, Name: 'Third', SortId: 3 },
                    { Id: 10, Name: 'First', SortId: 1 },
                    { Id: 20, Name: 'Second', SortId: 2 }
                ]
            }
        });

        assert.deepEqual(sections, [
            { sectionId: 10, name: 'First', sortId: 1 },
            { sectionId: 20, name: 'Second', sortId: 2 },
            { sectionId: 30, name: 'Third', sortId: 3 }
        ]);
    });

    test('rejects lesson responses without normal sections', () => {
        assert.throws(() => extractLessonSections({ Value: {} }), { code: 'INVALID_LESSON_RESPONSE' });
    });
});

describe('lesson section selection helpers', () => {
    const sections = [
        { sectionId: 10, name: 'A' },
        { sectionId: 20, name: 'B' }
    ];

    test('selecting a lesson selects all of its sections', () => {
        assert.deepEqual(selectAllLessonSections(sections), [10, 20]);
        assert.deepEqual(getLessonSectionSelectionState(sections, [10, 20]), {
            checked: true,
            indeterminate: false,
            selectedCount: 2,
            sectionCount: 2
        });
    });

    test('selecting only some child sections makes the lesson indeterminate', () => {
        assert.deepEqual(getLessonSectionSelectionState(sections, [20]), {
            checked: false,
            indeterminate: true,
            selectedCount: 1,
            sectionCount: 2
        });
    });
});

describe('buildVideoAttachmentRequest', () => {
    test('matches the recorded SaveExercise video contract', () => {
        const request = buildVideoAttachmentRequest({
            sectionId: 94447165,
            youtubeUrl: 'https://youtu.be/WM331caeRW0?si=lmwM8k2q80NiaJ9A',
            clientTime: '2026-08-17T16:11:49.968'
        });

        assert.equal(request.controller, 'SaveExerciseWsController');
        assert.equal(request.method, 'SaveExercise');
        assert.equal(request.projectName, 'Exercises');
        assert.deepEqual(request.value.ExerciseView, {
            Id: 0,
            Number: 0,
            Name: '',
            IsHidePupil: false,
            Type: 3,
            HomeworkLessonId: null,
            PersonalMaterialId: null,
            LessonSectionId: 94447165,
            Videos: [{ Link: 'https://youtu.be/WM331caeRW0?si=lmwM8k2q80NiaJ9A', Text: '' }]
        });
        assert.equal(request.value.AiUsed, false);
        assert.equal(request.value.UsedNewConstructor, true);
    });
});

describe('attachYoutubeVideo', () => {
    test('submits the request and returns the confirmed exercise identity', async () => {
        const calls = [];
        const result = await attachYoutubeVideo({
            sectionId: 94447165,
            youtubeUrl: 'https://youtu.be/WM331caeRW0',
            clientTime: '2026-08-17T16:11:49.968',
            async sendRequest(...args) {
                calls.push(args);
                return {
                    IsSuccess: true,
                    Value: {
                        Id: 1614598714,
                        Type: 3,
                        LessonSectionId: 94447165
                    }
                };
            }
        });

        assert.equal(calls.length, 1);
        assert.deepEqual(calls[0].slice(0, 3), ['SaveExerciseWsController', 'SaveExercise', 'Exercises']);
        assert.deepEqual(result, {
            exerciseId: 1614598714,
            sectionId: 94447165,
            youtubeUrl: 'https://youtu.be/WM331caeRW0'
        });
    });

    test('rejects responses that do not confirm a video exercise in the target section', async () => {
        await assert.rejects(() => attachYoutubeVideo({
            sectionId: 94447165,
            youtubeUrl: 'https://youtu.be/WM331caeRW0',
            async sendRequest() {
                return { IsSuccess: true, Value: { Id: 10, Type: 29, LessonSectionId: 94447165 } };
            }
        }), { code: 'INVALID_RESPONSE' });
    });
});

describe('normalizeAttachmentTargets', () => {
    test('deduplicates sections while retaining lesson context', () => {
        const targets = normalizeAttachmentTargets([
            { lessonId: 1, lessonNumber: 1, lessonName: 'One', sectionId: 10, sectionName: 'A' },
            { lessonId: 1, lessonNumber: 1, lessonName: 'One', sectionId: 10, sectionName: 'A' },
            { lessonId: 2, lessonNumber: 2, lessonName: 'Two', sectionId: 20, sectionName: 'B' }
        ]);

        assert.deepEqual(targets, [
            { lessonId: 1, lessonNumber: 1, lessonName: 'One', sectionId: 10, sectionName: 'A' },
            { lessonId: 2, lessonNumber: 2, lessonName: 'Two', sectionId: 20, sectionName: 'B' }
        ]);
    });
});

describe('executeVideoAttachmentBatch', () => {
    test('attaches the same original URL to every selected section sequentially', async () => {
        const requestValues = [];
        const waits = [];
        let exerciseId = 100;
        const result = await executeVideoAttachmentBatch({
            youtubeUrl: 'https://youtu.be/WM331caeRW0?si=batch',
            targets: [
                { lessonId: 1, lessonNumber: 1, lessonName: 'One', sectionId: 10, sectionName: 'A' },
                { lessonId: 2, lessonNumber: 2, lessonName: 'Two', sectionId: 20, sectionName: 'B' }
            ],
            async sendRequest(_controller, _method, _projectName, value) {
                requestValues.push(value);
                exerciseId += 1;
                return {
                    IsSuccess: true,
                    Value: {
                        Id: exerciseId,
                        Type: 3,
                        LessonSectionId: value.ExerciseView.LessonSectionId
                    }
                };
            },
            async wait(ms) {
                waits.push(ms);
            }
        });

        assert.deepEqual(
            requestValues.map((value) => ({
                sectionId: value.ExerciseView.LessonSectionId,
                url: value.ExerciseView.Videos[0].Link
            })),
            [
                { sectionId: 10, url: 'https://youtu.be/WM331caeRW0?si=batch' },
                { sectionId: 20, url: 'https://youtu.be/WM331caeRW0?si=batch' }
            ]
        );
        assert.deepEqual(waits, [250]);
        assert.deepEqual(result.summary, {
            requested: 2,
            successful: 2,
            failed: 0,
            notAttempted: 0
        });
    });

    test('stops after WebSocket loss and marks remaining targets as not attempted', async () => {
        let calls = 0;
        const result = await executeVideoAttachmentBatch({
            youtubeUrl: 'https://youtu.be/WM331caeRW0',
            targets: [
                { lessonId: 1, sectionId: 10 },
                { lessonId: 2, sectionId: 20 }
            ],
            async sendRequest() {
                calls += 1;
                const error = new Error('Socket gone');
                error.code = 'WS_UNAVAILABLE';
                throw error;
            }
        });

        assert.equal(calls, 1);
        assert.deepEqual(result.results.map(({ status }) => status), ['failed', 'not_attempted']);
        assert.deepEqual(result.summary, {
            requested: 2,
            successful: 0,
            failed: 1,
            notAttempted: 1
        });
    });
});
