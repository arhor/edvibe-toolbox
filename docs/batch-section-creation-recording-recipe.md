# Batch section creation recording recipe

The batch section-creation feature deliberately contains no guessed Edvibe mutation endpoints. Its read-side discovery uses established repository APIs, while writes are enabled only when a reviewed recipe derived from an Action Recorder export is assigned to `window.EdVibeBatchSectionCreationRecipe` before `src/main.js` runs.

## Required top-level fields

```js
window.EdVibeBatchSectionCreationRecipe = {
    version: 1,
    reviewedDynamicFields: true,
    steps: [/* recorded creation requests */],
    cleanupSteps: [/* optional recorded safe deletion requests */]
};
```

`reviewedDynamicFields` must be set only after every captured identifier has been classified as fixed, generated, captured from a prior response, or supplied by the current marathon, lesson, section, or block.

## Request step

```js
{
    id: 'descriptive-step-name',
    controller: 'ControllerFromRecording',
    method: 'MethodFromRecording',
    projectName: 'ProjectFromRecording',
    valueTemplate: {
        LessonId: '{{lesson.lessonId}}',
        MarathonId: '{{marathonId}}',
        SectionName: '{{section.name}}',
        ClientId: '{{generated.sectionClientId}}'
    },
    capture: {
        sectionId: 'Value.SectionId'
    },
    marksSectionCreated: true
}
```

A step may use `forEach: 'blocks'`. Consecutive block steps are expanded in the user's configured block order. `blockTypes` can restrict a step to `image`, `text`, or `link` blocks.

## Supported template tokens

- `{{marathonId}}`
- `{{lesson.lessonId}}`, `{{lesson.marathonLessonId}}`, `{{lesson.number}}`, `{{lesson.name}}`
- `{{section.name}}`
- `{{block.id}}`, `{{block.type}}`, and the fields belonging to that block type
- `{{blockIndex}}`
- `{{captured.<name>}}` for values captured from earlier responses
- `{{generated.<name>}}` for UUIDs generated at execution time; block-scoped tokens are unique per block

A string containing only a token preserves the resolved value's original type. Other strings are treated as literals.

## Captures and partial creation

`capture` maps a stable recipe name to a dot-separated response path. Set `marksSectionCreated: true` on the first request whose confirmed success means a section now exists and later failure must be reported as `partially_created`.

Optional `cleanupSteps` use the same template rules. They are attempted only after a partial creation and only when the reviewed recording proves deletion is safe. Without cleanup steps, partial results remain visible for manual review.

## Review checklist

1. Record one representative manual creation containing every supported block type.
2. Remove or redact session data and credentials.
3. Identify every marathon-, lesson-, section-, block-, request-, and session-specific value.
4. Replace dynamic values with tokens and retain only truly stable literals.
5. Verify response capture paths against the recording.
6. Confirm block request order and any required delays.
7. Add cleanup steps only when the recorded API safely deletes the newly created section.
8. Run the automated tests with the reviewed recipe fixture, then manually verify on a disposable lesson.
