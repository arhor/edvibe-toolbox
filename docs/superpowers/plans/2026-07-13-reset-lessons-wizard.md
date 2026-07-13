# Reset Lessons Two-Step Wizard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the reset-lessons modal into explicit user-selection and lesson-selection steps, with forward and backward navigation.

**Architecture:** Keep the existing modal and reset orchestration in `resetLessons.js`. Add a small pure view-state helper so button visibility and disabled state are testable without a browser DOM, then make `createResetModal` render one of two step containers while preserving loaded lessons for the current pupil.

**Tech Stack:** Vanilla JavaScript, DOM APIs, Manifest V3, Node.js built-in test runner.

---

## File Map

- Modify `resetLessons.js`: add wizard view-state logic, two-step markup, navigation, focus management, and deferred lesson loading.
- Modify `tests/resetLessons.test.js`: test wizard state and markup while retaining existing reset protocol coverage.
- Verify `main.js`: no functional change expected; syntax-check because it consumes the reset module.

No new dependencies or files are required. Commit steps are intentionally omitted because this repository requires explicit user authorization before creating commits.

### Task 1: Add testable wizard view state

**Files:**
- Modify: `tests/resetLessons.test.js:4-18`
- Modify: `tests/resetLessons.test.js:297-335`
- Modify: `resetLessons.js:275-290`
- Modify: `resetLessons.js:1007-1021`

- [ ] **Step 1: Write failing tests for step visibility and actions**

Add `getResetWizardViewState` to the destructured imports:

```js
const {
    parseMarathonId,
    filterPupilsByEmail,
    collectLessonSections,
    shouldDeleteLastRequest,
    buildLoadExercisesPayload,
    buildResetAnswerPayload,
    loadAllPupils,
    discoverResetWork,
    executeResetWork,
    createResetLessonsFeature,
    getResetModalMarkup,
    getResetRunningStyles,
    getResetWizardViewState,
    setResetRunningState,
    getErrorType
} = require('../resetLessons.js');
```

Append these tests before the running-state tests:

```js
test('wizard user step shows Next and requires a selected pupil', () => {
    assert.deepEqual(
        getResetWizardViewState({
            step: 'user',
            hasSelectedPupil: false,
            selectedLessonCount: 0,
            loading: false,
            locked: false,
            finished: false
        }),
        {
            userStepHidden: false,
            lessonStepHidden: true,
            nextHidden: false,
            nextDisabled: true,
            backHidden: true,
            backDisabled: false,
            submitHidden: true,
            submitDisabled: true,
            closeDisabled: false
        }
    );

    assert.equal(
        getResetWizardViewState({
            step: 'user',
            hasSelectedPupil: true,
            selectedLessonCount: 0,
            loading: false,
            locked: false,
            finished: false
        }).nextDisabled,
        false
    );
});

test('wizard lesson step shows Back and requires a selected lesson', () => {
    const empty = getResetWizardViewState({
        step: 'lessons',
        hasSelectedPupil: true,
        selectedLessonCount: 0,
        loading: false,
        locked: false,
        finished: false
    });
    const selected = getResetWizardViewState({
        step: 'lessons',
        hasSelectedPupil: true,
        selectedLessonCount: 2,
        loading: false,
        locked: false,
        finished: false
    });

    assert.equal(empty.userStepHidden, true);
    assert.equal(empty.lessonStepHidden, false);
    assert.equal(empty.nextHidden, true);
    assert.equal(empty.backHidden, false);
    assert.equal(empty.submitHidden, false);
    assert.equal(empty.submitDisabled, true);
    assert.equal(selected.submitDisabled, false);
});

test('wizard loading and running states block navigation', () => {
    const loading = getResetWizardViewState({
        step: 'user',
        hasSelectedPupil: true,
        selectedLessonCount: 0,
        loading: true,
        locked: false,
        finished: false
    });
    const running = getResetWizardViewState({
        step: 'lessons',
        hasSelectedPupil: true,
        selectedLessonCount: 1,
        loading: false,
        locked: true,
        finished: false
    });

    assert.equal(loading.nextDisabled, true);
    assert.equal(loading.closeDisabled, true);
    assert.equal(running.backDisabled, true);
    assert.equal(running.submitDisabled, true);
    assert.equal(running.closeDisabled, true);
});
```

- [ ] **Step 2: Run the tests and verify the helper is missing**

Run:

```bash
node --test tests/resetLessons.test.js
```

Expected: FAIL because `getResetWizardViewState` is not exported.

- [ ] **Step 3: Implement the pure view-state helper**

Add before `ensureResetStyles`:

```js
function getResetWizardViewState({
    step,
    hasSelectedPupil,
    selectedLessonCount,
    loading,
    locked,
    finished
}) {
    const blocked = loading || locked || finished;
    const showingUsers = step === 'user';

    return {
        userStepHidden: !showingUsers,
        lessonStepHidden: showingUsers,
        nextHidden: !showingUsers,
        nextDisabled: blocked || !hasSelectedPupil,
        backHidden: showingUsers,
        backDisabled: blocked,
        submitHidden: showingUsers,
        submitDisabled: blocked || !hasSelectedPupil || selectedLessonCount === 0,
        closeDisabled: loading || locked
    };
}
```

Export it alongside the existing UI helpers:

```js
return {
    parseMarathonId,
    filterPupilsByEmail,
    collectLessonSections,
    shouldDeleteLastRequest,
    buildLoadExercisesPayload,
    buildResetAnswerPayload,
    loadAllPupils,
    discoverResetWork,
    executeResetWork,
    createResetLessonsFeature,
    getResetModalMarkup,
    getResetRunningStyles,
    getResetWizardViewState,
    setResetRunningState,
    getErrorType
};
```

- [ ] **Step 4: Run the tests**

Run:

```bash
node --test tests/resetLessons.test.js
```

Expected: all tests pass.

### Task 2: Split the modal markup into two steps

**Files:**
- Modify: `tests/resetLessons.test.js`
- Modify: `resetLessons.js:339-390`
- Modify: `resetLessons.js:518-600`

- [ ] **Step 1: Write failing markup tests**

Append:

```js
test('reset modal markup separates user and lesson wizard steps', () => {
    const markup = getResetModalMarkup();

    assert.match(markup, /class="edvibe-reset-step-indicator"[^>]*>Шаг 1 из 2</);
    assert.match(markup, /class="edvibe-reset-user-step"/);
    assert.match(markup, /class="edvibe-reset-lesson-step" hidden/);
    assert.match(markup, /class="edvibe-reset-button edvibe-reset-next"/);
    assert.match(markup, /class="edvibe-reset-button edvibe-reset-back"[^>]*hidden/);
    assert.match(markup, /class="edvibe-reset-button edvibe-reset-submit"[^>]*hidden/);
});

test('reset modal user step closes before the lesson step begins', () => {
    const markup = getResetModalMarkup();
    const userStepEnd = markup.indexOf('</section>');
    const lessonStepStart = markup.indexOf('class="edvibe-reset-lesson-step"');

    assert.ok(userStepEnd > 0);
    assert.ok(lessonStepStart > userStepEnd);
});
```

- [ ] **Step 2: Run the tests and verify the current combined markup fails**

Run:

```bash
node --test tests/resetLessons.test.js
```

Expected: FAIL because the step containers and navigation buttons are absent.

- [ ] **Step 3: Replace `getResetModalMarkup` with two step containers**

Use this markup:

```js
function getResetModalMarkup() {
    return `
        <div class="edvibe-reset-card">
            <div class="edvibe-reset-header">
                <div>
                    <h2 id="edvibe-reset-title" class="edvibe-reset-title">Сброс уроков</h2>
                    <p class="edvibe-reset-subtitle">
                        <span class="edvibe-reset-step-indicator">Шаг 1 из 2</span>
                        <span class="edvibe-reset-step-description">Выберите пользователя.</span>
                    </p>
                </div>
                <button class="edvibe-reset-close" type="button" aria-label="Закрыть">&times;</button>
            </div>
            <div class="edvibe-reset-body">
                <section class="edvibe-reset-user-step" aria-label="Выбор пользователя">
                    <label class="edvibe-reset-label" for="edvibe-reset-search">Поиск по email</label>
                    <input id="edvibe-reset-search" class="edvibe-reset-search" type="search"
                        placeholder="user@example.com" autocomplete="off">
                    <div class="edvibe-reset-list edvibe-reset-pupils" role="listbox"
                        aria-label="Пользователи марафона"></div>
                </section>
                <section class="edvibe-reset-lesson-step" aria-label="Выбор уроков" hidden>
                    <div class="edvibe-reset-label edvibe-reset-selected-pupil"></div>
                    <label class="edvibe-reset-select-all">
                        <input class="edvibe-reset-select-all-input" type="checkbox">
                        Выбрать все уроки
                    </label>
                    <div class="edvibe-reset-list edvibe-reset-lessons"
                        aria-label="Уроки пользователя" tabindex="-1"></div>
                </section>
            </div>
            <div class="edvibe-reset-live-region">
                <p class="edvibe-reset-status" aria-live="polite"></p>
                <div class="edvibe-reset-progress" role="progressbar"
                    aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                    <div class="edvibe-reset-progress-bar"></div>
                </div>
            </div>
            <div class="edvibe-reset-footer">
                <button class="edvibe-reset-button edvibe-reset-cancel" type="button">Закрыть</button>
                <button class="edvibe-reset-button edvibe-reset-back" type="button" hidden>
                    Назад
                </button>
                <button class="edvibe-reset-button edvibe-reset-next" type="button" disabled>
                    Далее
                </button>
                <button class="edvibe-reset-button edvibe-reset-submit" type="button" disabled hidden>
                    Сбросить прогресс
                </button>
            </div>
        </div>
    `;
}
```

- [ ] **Step 4: Add scoped wizard styles**

Add inside the existing scoped style template:

```css
#${RESET_OVERLAY_ID} [hidden] {
    display: none !important;
}

#${RESET_OVERLAY_ID} .edvibe-reset-step-indicator {
    margin-right: 8px;
    color: #2563eb;
    font-weight: 700;
}

#${RESET_OVERLAY_ID} .edvibe-reset-back {
    background: #64748b;
}

#${RESET_OVERLAY_ID} .edvibe-reset-next {
    background: #2563eb;
}
```

Keep `.edvibe-reset-submit` danger-colored and `.edvibe-reset-cancel` neutral as they are now.

- [ ] **Step 5: Run the tests**

Run:

```bash
node --test tests/resetLessons.test.js
```

Expected: all tests pass, including the existing assertion that the live progress region remains outside the scrollable body.

### Task 3: Implement wizard navigation and deferred lesson loading

**Files:**
- Modify: `resetLessons.js:603-884`
- Verify: `resetLessons.js:887-1005`

- [ ] **Step 1: Query the new elements and initialize wizard state**

At the start of `createResetModal`, replace the old lessons-section query and add the wizard controls:

```js
const search = overlay.querySelector('.edvibe-reset-search');
const userStep = overlay.querySelector('.edvibe-reset-user-step');
const lessonStep = overlay.querySelector('.edvibe-reset-lesson-step');
const stepIndicator = overlay.querySelector('.edvibe-reset-step-indicator');
const stepDescription = overlay.querySelector('.edvibe-reset-step-description');
const pupilsList = overlay.querySelector('.edvibe-reset-pupils');
const lessonsList = overlay.querySelector('.edvibe-reset-lessons');
const selectedPupilLabel = overlay.querySelector('.edvibe-reset-selected-pupil');
const selectAll = overlay.querySelector('.edvibe-reset-select-all-input');
const status = overlay.querySelector('.edvibe-reset-status');
const progress = overlay.querySelector('.edvibe-reset-progress');
const progressBar = overlay.querySelector('.edvibe-reset-progress-bar');
const closeButtons = [
    overlay.querySelector('.edvibe-reset-close'),
    overlay.querySelector('.edvibe-reset-cancel')
];
const back = overlay.querySelector('.edvibe-reset-back');
const next = overlay.querySelector('.edvibe-reset-next');
const submit = overlay.querySelector('.edvibe-reset-submit');

let currentStep = 'user';
let allPupils = [];
let selectedPupil = null;
let loadedPupilId = null;
let lessons = [];
let selectedLessonIds = new Set();
let selectPupilHandler = null;
let resetHandler = null;
let locked = false;
let loading = false;
let finished = false;
let closed = false;
```

- [ ] **Step 2: Replace submit-only state updates with one wizard renderer**

Replace `updateSubmitState` and `updateInteractiveState` with:

```js
function updateInteractiveState() {
    const view = getResetWizardViewState({
        step: currentStep,
        hasSelectedPupil: Boolean(selectedPupil),
        selectedLessonCount: selectedLessonIds.size,
        loading,
        locked,
        finished
    });
    const inputsBlocked = locked || loading || finished;

    userStep.hidden = view.userStepHidden;
    lessonStep.hidden = view.lessonStepHidden;
    next.hidden = view.nextHidden;
    next.disabled = view.nextDisabled;
    back.hidden = view.backHidden;
    back.disabled = view.backDisabled;
    submit.hidden = view.submitHidden;
    submit.disabled = view.submitDisabled;
    closeButtons.forEach((button) => {
        button.disabled = view.closeDisabled;
    });
    search.disabled = inputsBlocked;
    pupilsList.querySelectorAll('button').forEach((button) => {
        button.disabled = inputsBlocked;
    });
    lessonsList.querySelectorAll('input').forEach((input) => {
        input.disabled = inputsBlocked;
    });
    selectAll.disabled = inputsBlocked || lessons.length === 0;

    const showingUsers = currentStep === 'user';
    stepIndicator.textContent = showingUsers ? 'Шаг 1 из 2' : 'Шаг 2 из 2';
    stepDescription.textContent = showingUsers
        ? 'Выберите пользователя.'
        : 'Выберите уроки для сброса прогресса.';
}
```

Replace every call to `updateSubmitState()` in pupil and lesson rendering with `updateInteractiveState()`.

- [ ] **Step 3: Make pupil selection local and invalidate only stale lesson data**

Replace the pupil row click listener with:

```js
row.addEventListener('click', () => {
    if (locked || loading || finished || pupil.PupilId === selectedPupil?.PupilId) return;

    selectedPupil = pupil;
    if (pupil.PupilId !== loadedPupilId) {
        loadedPupilId = null;
        lessons = [];
        selectedLessonIds = new Set();
        renderLessons();
    }
    setStatus(`Выбран пользователь: ${pupil.Email || 'email отсутствует'}`);
    renderPupils();
    updateInteractiveState();
});
```

This removes the network request from pupil-row selection.

- [ ] **Step 4: Add forward and backward navigation**

Add these event listeners before the submit listener:

```js
next.addEventListener('click', async () => {
    if (next.disabled || !selectPupilHandler || !selectedPupil) return;

    if (selectedPupil.PupilId === loadedPupilId) {
        currentStep = 'lessons';
        updateInteractiveState();
        lessonsList.focus();
        return;
    }

    try {
        await selectPupilHandler(selectedPupil);
    } catch (error) {
        loading = false;
        currentStep = 'user';
        updateInteractiveState();
        console.error(
            `[Edvibe Toolbox][Reset] Failed to load lessons for PupilId `
            + `${selectedPupil.PupilId} (${getErrorType(error)}).`
        );
        setStatus(error.message, 'error');
    }
});

back.addEventListener('click', () => {
    if (back.disabled) return;
    currentStep = 'user';
    setStatus(`Выбран пользователь: ${selectedPupil?.Email || 'email отсутствует'}`);
    updateInteractiveState();
    search.focus();
});
```

Keep the existing submit listener unchanged apart from relying on the new wizard state.

- [ ] **Step 5: Update public modal methods for step transitions**

Use these implementations:

```js
showPupils(pupils, onSelectPupil) {
    allPupils = pupils;
    selectPupilHandler = onSelectPupil;
    currentStep = 'user';
    loading = false;
    setStatus(`Загружено пользователей: ${pupils.length}`);
    renderPupils();
    updateInteractiveState();
    search.focus();
},
showLessons(pupil, loadedLessons) {
    const pupilChanged = loadedPupilId !== pupil.PupilId;
    selectedPupil = pupil;
    loadedPupilId = pupil.PupilId;
    lessons = loadedLessons;
    if (pupilChanged) {
        selectedLessonIds = new Set();
    }
    loading = false;
    currentStep = 'lessons';
    selectedPupilLabel.textContent = `${pupil.Name || 'Без имени'} — ${pupil.Email || ''}`;
    setStatus(`Загружено уроков: ${lessons.length}`);
    renderLessons();
    updateInteractiveState();
    lessonsList.focus();
},
```

Remove `lessonsSection.hidden = false`; the renderer now owns visibility.

- [ ] **Step 6: Confirm feature-level loading remains attached to Next**

Keep the existing callback passed to `modal.showPupils`:

```js
modal.showPupils(pupils, async (pupil) => {
    console.log(
        `[Edvibe Toolbox][Reset] Loading lessons for PupilId ${pupil.PupilId}.`
    );
    modal.setLoading(`Loading lessons for ${pupil.Email}...`);
    const response = await sendRequest(
        'MarathonLessonWsController',
        'GetMarathonLessonsForPupil',
        'Marathons',
        {
            PupilId: pupil.PupilId,
            MarathonId: marathonId,
            SearchTerm: '',
            Domain: 'edvibe.com'
        }
    );
    if (!Array.isArray(response.Value)) {
        throw new Error('GetMarathonLessonsForPupil returned invalid data.');
    }
    console.log(
        `[Edvibe Toolbox][Reset] Loaded ${response.Value.length} lesson(s) `
        + `for PupilId ${pupil.PupilId}.`
    );
    modal.showLessons(pupil, response.Value);
});
```

Because row clicks no longer invoke this callback, the request starts only when `Далее` is clicked.

- [ ] **Step 7: Run focused tests and syntax checks**

Run:

```bash
node --test tests/resetLessons.test.js
node --check resetLessons.js
node --check main.js
```

Expected: all tests pass and both syntax checks exit successfully.

### Task 4: Manual wizard and reset verification

**Files:**
- Verify only.

- [ ] **Step 1: Reload the unpacked extension**

Open `chrome://extensions`, reload Edvibe Toolbox, and verify Chrome reports no content-script errors.

- [ ] **Step 2: Verify step 1**

Open reset lessons on an Edvibe marathon. Confirm only search and pupils are visible, `Далее` is disabled initially, selecting a pupil enables it, and selecting a pupil does not yet send `GetMarathonLessonsForPupil`.

- [ ] **Step 3: Verify step 2 and backward navigation**

Click `Далее`. Confirm one lesson request is sent, only lesson controls are visible after it succeeds, the active indicator reads `Шаг 2 из 2`, and `Сбросить прогресс` stays disabled until a lesson is checked. Select lessons, click `Назад`, then click `Далее` without changing the pupil; confirm selections remain and no duplicate lesson request is sent.

- [ ] **Step 4: Verify pupil changes invalidate stale lessons**

Go back, choose another pupil, and click `Далее`. Confirm a new lesson request is sent and the previous pupil's lessons and checkbox selections do not appear.

- [ ] **Step 5: Verify failures and reset progress**

Confirm a failed lesson request leaves the modal on step 1 with an error and enabled retry. Complete a controlled reset and confirm confirmation, running-state selection hiding, visible progress, close locking, completion, and error handling still behave as before.

## Completion Criteria

- The modal displays only one selection step at a time.
- Step 1 requires a selected pupil before advancing.
- Lessons load only when `Далее` is clicked.
- Step 2 supports `Назад`, lesson selection, select-all, and reset.
- Same-pupil backward navigation preserves lessons and selections without another request.
- Choosing another pupil clears stale lesson state.
- Existing reset protocol, progress, locking, and error tests continue to pass.
- `node --test tests/resetLessons.test.js`, `node --check resetLessons.js`, and `node --check main.js` succeed.
