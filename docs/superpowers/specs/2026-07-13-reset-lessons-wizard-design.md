# Reset Lessons Two-Step Wizard Design

## Goal

Change the existing reset-lessons modal so user selection and lesson selection appear as two separate wizard steps. Only one step's controls are visible at a time.

## User Experience

The modal keeps its existing title, close behavior, status region, confirmation, and reset progress display.

### Step 1: Select user

- Show the email search field and pupil list.
- Selecting one pupil highlights it and enables `Далее`.
- Do not load lessons until the user clicks `Далее`.
- Keep `Закрыть` available while the modal is not loading or running.

### Step 2: Select lessons

- Hide the search field and pupil list.
- Show the selected pupil, lesson checklist, and `Выбрать все уроки`.
- Show `Назад` and `Сбросить прогресс`.
- Keep the reset action disabled until at least one lesson is selected.
- `Назад` returns to step 1 without discarding lesson selections for the current pupil.
- If the user selects a different pupil and advances, clear the old lesson data and selections before loading that pupil's lessons.

## Modal State

`createResetModal` owns an explicit current step in addition to its existing pupil, lesson, loading, locked, and finished state.

The modal markup contains separate user-step and lesson-step containers. A single render/update function controls:

- which step container is visible;
- which footer buttons are visible;
- whether `Далее`, `Назад`, and `Сбросить прогресс` are enabled;
- control locking during loading and reset execution.

The modal exposes a callback for advancing with the selected pupil. The feature-level workflow uses that callback to request the pupil's lessons, then displays step 2 after a successful response. A failed request remains recoverable and keeps the user on step 1 with the error shown.

## Data Flow

1. Open the modal, load all marathon pupils, and display step 1.
2. Filter pupils locally as the user types.
3. Store the selected pupil without requesting lessons.
4. On `Далее`, load lessons with `GetMarathonLessonsForPupil`.
5. On success, store the lessons and display step 2.
6. On `Назад`, display step 1 while retaining the current pupil's loaded lessons and selections.
7. If a different pupil is selected, invalidate the retained lesson state.
8. Continue with the existing confirmation, discovery, reset, progress, completion, and error flows.

## Accessibility

- Identify the active step in visible text, such as `Шаг 1 из 2` and `Шаг 2 из 2`.
- Keep hidden step controls out of keyboard navigation by using the `hidden` attribute.
- Move focus to the email search when step 1 opens.
- Move focus to the lesson list or its first available control when step 2 opens.
- Preserve the existing dialog labels, live status region, progress semantics, Escape handling, and close lock during mutation.

## Validation

Focused tests should verify:

- the markup has separate user and lesson step containers;
- only the active step and its actions are shown;
- selecting a pupil enables `Далее` but does not immediately show lessons;
- advancing requests lessons and displays step 2 after success;
- `Назад` restores step 1;
- returning to step 2 for the same pupil preserves lesson selections;
- selecting another pupil clears stale lessons and selections;
- reset remains disabled until at least one lesson is selected;
- running-state progress remains visible while selection controls are hidden.

Manual validation should confirm keyboard focus, loading failures, backward navigation, and the existing reset workflow on an Edvibe marathon page.
