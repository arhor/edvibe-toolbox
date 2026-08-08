const clientTime = new Date().toISOString();

// Derived from the WebSocket recording captured on 2026-08-05.
// V1 intentionally reuses the single recorded Edvibe image asset.
const batchSectionCreationRecipe = Object.freeze({
    version: 1,
    reviewedDynamicFields: true,
    steps: Object.freeze([
        Object.freeze({
            id: 'create-section',
            controller: 'LessonSectionWsController',
            method: 'AddStageSection',
            projectName: 'Books',
            valueTemplate: Object.freeze({
                LessonId: '{{lesson.lessonId}}',
                StageSectionName: '{{section.name}}',
                SortId: 4
            }),
            capture: Object.freeze({ sectionId: 'Value.StageSectionId' }),
            marksSectionCreated: true
        }),
        Object.freeze({
            id: 'confirm-section-name',
            controller: 'LessonSectionWsController',
            method: 'EditStageSection',
            projectName: 'Books',
            valueTemplate: Object.freeze({
                LessonId: '{{lesson.lessonId}}',
                StageSectionId: '{{captured.sectionId}}',
                StageSectionName: '{{section.name}}',
                SortId: 4
            })
        }),
        Object.freeze({
            id: 'save-image',
            controller: 'SaveExerciseWsController',
            method: 'SaveExercise',
            projectName: 'Exercises',
            forEach: 'blocks',
            blockTypes: Object.freeze(['image']),
            valueTemplate: Object.freeze({
                ClassId: null,
                Domain: 'edvibe.com',
                ExerciseView: Object.freeze({
                    Id: 0,
                    Number: '{{blockIndex}}',
                    Name: '',
                    IsHidePupil: false,
                    Type: 27,
                    HomeworkLessonId: null,
                    PersonalMaterialId: null,
                    LessonSectionId: '{{captured.sectionId}}',
                    Descriptions: Object.freeze(['']),
                    ChangeExerciseImages: Object.freeze([
                        Object.freeze({
                            ImageId: 687640222,
                            FullImageId: 687640223,
                            ImageUrl: 'https://media-y.edvibe.com/files/LessonExerciseImages/b455a98f-ef63-49b5-a6f4-2111c7edebc6.png',
                            FullImageUrl: 'https://media-y.edvibe.com/files/LessonExerciseImages/035f9f67-1474-4eb3-8359-5eb93ea68a2e.png',
                            cropped: false
                        })
                    ])
                }),
                AiUsed: false,
                UsedNewConstructor: true,
                ClientTime: clientTime,
                DeviceType: 'desktop'
            })
        }),
        Object.freeze({
            id: 'save-cta',
            controller: 'SaveExerciseWsController',
            method: 'SaveExercise',
            projectName: 'Exercises',
            forEach: 'blocks',
            blockTypes: Object.freeze(['link']),
            valueTemplate: Object.freeze({
                ClassId: null,
                Domain: 'edvibe.com',
                ExerciseView: Object.freeze({
                    Id: 0,
                    Number: '{{blockIndex}}',
                    Name: '',
                    IsHidePupil: false,
                    Type: 29,
                    HomeworkLessonId: null,
                    PersonalMaterialId: null,
                    LessonSectionId: '{{captured.sectionId}}',
                    Button: Object.freeze({
                        Link: '{{block.url}}',
                        Text: '{{block.label}}'
                    })
                }),
                AiUsed: false,
                UsedNewConstructor: true,
                ClientTime: clientTime,
                DeviceType: 'desktop'
            })
        })
    ])
});

export { batchSectionCreationRecipe };
