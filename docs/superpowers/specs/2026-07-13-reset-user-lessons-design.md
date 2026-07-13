# Reset User Lessons Design

## Goal

Add a destructive administration workflow that lets a teacher select one marathon pupil, select one or more lessons, and reset that pupil's exercise progress for those lessons.

## User Experience

The extension popup gains a red `Сброс уроков` button. Clicking it closes the popup naturally and opens a large modal overlay in the active Edvibe marathon page.

The modal has two selection steps:

1. A case-insensitive email search and a single-select pupil list showing pupil name and email.
2. A lesson checklist for the selected pupil, including lesson number, name, and latest request status. The checklist includes a `Select all` control.

`Сбросить прогресс` is disabled until a pupil and at least one lesson are selected. Before starting, the user must confirm the selected pupil and lesson count.

While work is running, the modal cannot be closed and all selection controls are disabled. It first shows indeterminate discovery progress, then a determinate progress bar for reset operations. Completion enables closing. A failure stops processing immediately and identifies the affected lesson and exercise where available.

## Components

### Popup and isolated bridge

`popup.html` adds the reset button. `popup.js` validates that the active tab is an Edvibe marathon page and sends a dedicated reset command. `isolated.js` accepts only that known command and forwards a minimal page message to the MAIN world.

### WebSocket transport

`main.js` remains the owner of the intercepted Edvibe WebSocket and correlated request/response handling. It provides:

- the existing awaited request helper for calls that return responses;
- a fire-and-forget sender for `DeleteMarathonLessonRequestPupil`;
- reset-running state so reset and export workflows cannot overlap;
- the MAIN-world command handler that starts the reset modal.

Awaited responses are accepted only when `IsSuccess === true` and their expected values are present. Any failure aborts the reset workflow.

### Reset module

A new `resetLessons.js` owns modal rendering, local state, pupil pagination and filtering, lesson selection, exercise discovery, reset orchestration, and progress presentation. It receives transport functions from `main.js`; it does not intercept or access WebSockets directly.

## Data Flow

1. Parse `MarathonId` from the current `marathon/<id>` URL.
2. Load all pupils using `MarathonPupilsWsController.GetMarathonPupils`, advancing `Skip` until the response's `Page.Count` is reached.
3. Filter the in-memory pupil list with `pupil.Email.toLowerCase().includes(query.toLowerCase())`.
4. After selecting a pupil, call `MarathonLessonWsController.GetMarathonLessonsForPupil` with:
   - `PupilId`
   - `MarathonId`
   - empty `SearchTerm`
   - `Domain: "edvibe.com"`
5. After lesson selection and confirmation, discover reset work for each selected lesson:
   - call `LessonWsController.GetLessonWithId` using the lesson's `LessonId`;
   - combine regular `Sections` and `HomeworkSection`;
   - call `GetExerciseWsController.LoadExercises` for each section using the marathon ID, selected pupil ID, section ID, and the lesson's `MarathonLessonId`;
   - retain each exercise ID and type together with its section ID.
6. Reset exercises sequentially, preserving a 300 ms delay between section/exercise requests. Each exercise reset is an ordered pair:
   - call `ExerciseAnswerSaveVersion1WsController.SaveAnswer` with `IsReset: true`, empty answer collections, zero answer statistics, and the exercise, section, pupil, marathon, and lesson identifiers;
   - after that succeeds, call `MarathonStatisticService.DropMarathonExerciseStatistic`.
7. After all exercises for a lesson succeed, if `LastRequest` exists and `LastRequest.Status !== 0`, send `MarathonLessonWsController.DeleteMarathonLessonRequestPupil` with `LastRequest.Id`. This request is fire-and-forget because the server sends no response.
8. Continue to the next selected lesson. Stop immediately on the first failed awaited request.

## Progress

Exercise discovery is indeterminate because the total exercise count is initially unknown. Once discovery completes, total work is:

- one unit per exercise reset;
- one unit per applicable lesson-request deletion.

The modal updates after every unit and displays current lesson/exercise context. Fire-and-forget deletion counts as complete once its packet is sent.

## Safety and Error Handling

- Require an explicit confirmation immediately before mutation.
- Allow exactly one selected pupil.
- Require at least one selected lesson.
- Prevent duplicate reset starts.
- Prevent export and reset from running concurrently.
- Do not close the modal during mutation.
- Abort on the first failed awaited request.
- Do not attempt request deletion when `LastRequest` is absent or its status is `0`.
- Log only pupil IDs, lesson IDs, exercise IDs, and counts; do not log full pupil records or exercise payloads.
- Remove pending request correlations when an awaited request times out, preventing leaks and permanently hung UI.

## Validation

Static and focused manual validation will cover:

- manifest script ordering and Chrome extension reload without errors;
- popup domain/marathon URL validation and bridge command routing;
- complete pupil pagination and case-insensitive email filtering;
- single pupil selection and lesson checklist state;
- disabled/enabled destructive action states and confirmation;
- request payloads for all seven Edvibe methods, including both calls in each exercise reset;
- section and homework-section discovery;
- sequential throttled exercise resets with answer reset before statistic deletion;
- conditional fire-and-forget request deletion;
- immediate abort and useful failure context;
- indeterminate and determinate progress behavior;
- mutual exclusion with marathon export.

The final end-to-end check must use a test pupil on a real Edvibe marathon and verify the selected lessons reopen with cleared exercise progress.
