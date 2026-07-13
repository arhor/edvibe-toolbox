# Reset User Lessons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a safe page-overlay workflow for selecting one marathon pupil and resetting progress for selected lessons.

**Architecture:** Keep WebSocket ownership and operation locking in `main.js`. Add a focused UMD-style `resetLessons.js` module containing testable data/orchestration helpers and the page modal. Route the new popup command through the existing isolated-world bridge.

**Tech Stack:** Manifest V3, vanilla JavaScript, HTML/CSS, Chrome extension messaging, intercepted WebSocket transport, Node.js built-in test runner.

**Reset protocol correction:** A complete exercise reset requires an awaited
`ExerciseAnswerSaveVersion1WsController.SaveAnswer` call with `IsReset: true`,
followed by the awaited `MarathonStatisticService.DropMarathonExerciseStatistic`
call. The first clears the persisted answer; the second clears marathon statistics.

---

## File Map

- Create `resetLessons.js`: reset API helpers, orchestration, modal rendering, and progress UI.
- Create `tests/resetLessons.test.js`: unit tests for pagination, filtering, payloads, request deletion rules, and immediate failure.
- Modify `main.js`: request timeout/validation support, fire-and-forget transport, operation lock, and reset startup.
- Modify `isolated.js`: allow and forward the reset command.
- Modify `popup.html`: add the destructive reset button.
- Modify `popup.js`: validate context and send the reset command.
- Modify `manifest.json`: load `resetLessons.js` in MAIN world before `main.js`.

No dependency or build-system changes are required.

### Task 1: Build the testable reset data helpers

**Files:**
- Create: `resetLessons.js`
- Create: `tests/resetLessons.test.js`

- [ ] **Step 1: Add failing tests for URL parsing, email filtering, section normalization, and deletion rules**

Create `tests/resetLessons.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const {
    parseMarathonId,
    filterPupilsByEmail,
    collectLessonSections,
    shouldDeleteLastRequest,
    buildLoadExercisesPayload
} = require('../resetLessons.js');

test('parseMarathonId reads a numeric marathon id', () => {
    assert.equal(parseMarathonId('https://app.edvibe.com/marathon/18508'), 18508);
    assert.equal(parseMarathonId('https://app.edvibe.com/dashboard'), null);
});

test('filterPupilsByEmail uses case-insensitive includes logic', () => {
    const pupils = [
        { PupilId: 1, Email: 'first@example.com' },
        { PupilId: 2, Email: 'OTHER@EXAMPLE.COM' },
        { PupilId: 3, Email: null }
    ];

    assert.deepEqual(
        filterPupilsByEmail(pupils, 'other@'),
        [pupils[1]]
    );
    assert.deepEqual(filterPupilsByEmail(pupils, ''), pupils);
});

test('collectLessonSections appends homework and removes missing sections', () => {
    const regular = [{ Id: 10 }, null, { Id: 11 }];
    assert.deepEqual(
        collectLessonSections({ Sections: regular, HomeworkSection: { Id: 12 } }),
        [{ Id: 10 }, { Id: 11 }, { Id: 12 }]
    );
});

test('shouldDeleteLastRequest requires a non-zero latest status', () => {
    assert.equal(shouldDeleteLastRequest({}), false);
    assert.equal(shouldDeleteLastRequest({ LastRequest: { Id: 1, Status: 0 } }), false);
    assert.equal(shouldDeleteLastRequest({ LastRequest: { Id: 2, Status: 2 } }), true);
});

test('buildLoadExercisesPayload uses MarathonLessonId as LessonId', () => {
    assert.deepEqual(
        buildLoadExercisesPayload({
            marathonId: 18508,
            pupilId: 1397893,
            marathonLessonId: 230807,
            sectionId: 6975727
        }),
        {
            MarathonId: 18508,
            LessonId: 230807,
            SectionId: 6975727,
            PupilId: 1397893,
            IsTeacher: true,
            LessonSection: 0,
            Domain: 'edvibe.com'
        }
    );
});
```

- [ ] **Step 2: Run the tests and verify the module is missing**

Run:

```bash
node --test tests/resetLessons.test.js
```

Expected: FAIL because `resetLessons.js` does not exist.

- [ ] **Step 3: Add the minimal UMD module and pure helpers**

Create `resetLessons.js`:

```js
(function initializeResetLessons(root, factory) {
    const api = factory();
    root.EdVibeLessonReset = api;

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createResetLessonsModule() {
    'use strict';

    function parseMarathonId(url) {
        const match = String(url || '').match(/marathon\/(\d+)/);
        return match ? Number(match[1]) : null;
    }

    function filterPupilsByEmail(pupils, query) {
        const normalizedQuery = String(query || '').trim().toLowerCase();
        if (!normalizedQuery) return pupils;

        return pupils.filter((pupil) =>
            String(pupil.Email || '').toLowerCase().includes(normalizedQuery)
        );
    }

    function collectLessonSections(lessonValue) {
        const sections = Array.isArray(lessonValue?.Sections)
            ? lessonValue.Sections.filter(Boolean)
            : [];

        if (lessonValue?.HomeworkSection) {
            sections.push(lessonValue.HomeworkSection);
        }

        return sections;
    }

    function shouldDeleteLastRequest(lesson) {
        return Boolean(lesson?.LastRequest?.Id && lesson.LastRequest.Status !== 0);
    }

    function buildLoadExercisesPayload({
        marathonId,
        pupilId,
        marathonLessonId,
        sectionId
    }) {
        return {
            MarathonId: marathonId,
            LessonId: marathonLessonId,
            SectionId: sectionId,
            PupilId: pupilId,
            IsTeacher: true,
            LessonSection: 0,
            Domain: 'edvibe.com'
        };
    }

    function buildResetAnswerPayload({ marathonId, pupilId, lessonId, exercise }) {
        return {
            SelfSync: false,
            IsReset: true,
            ExerciseId: exercise.id,
            ExerciseType: exercise.type,
            SectionId: exercise.sectionId,
            PupilId: pupilId,
            MarathonId: marathonId,
            SingleAnswer: {},
            ManyAnswers: [],
            RepeatingManyAnswers: [],
            AnswerErrorsCount: [[]],
            StatisticsInfo: {
                CountAnswersTrue: 0,
                CountAnswersFalse: 0,
                CountAnswersPending: 0
            },
            LessonId: lessonId
        };
    }

    return {
        parseMarathonId,
        filterPupilsByEmail,
        collectLessonSections,
        shouldDeleteLastRequest,
        buildLoadExercisesPayload,
        buildResetAnswerPayload
    };
});
```

- [ ] **Step 4: Run the helper tests**

Run:

```bash
node --test tests/resetLessons.test.js
```

Expected: 6 tests pass.

### Task 2: Add pupil pagination and reset orchestration

**Files:**
- Modify: `resetLessons.js`
- Modify: `tests/resetLessons.test.js`

- [ ] **Step 1: Add failing tests for pagination and immediate abort**

Append imports for `loadAllPupils`, `discoverResetWork`, and `executeResetWork`, then add:

```js
test('loadAllPupils follows Page.Count until every pupil is loaded', async () => {
    const calls = [];
    const pages = [
        { Value: { Items: [{ PupilId: 1 }, { PupilId: 2 }], Page: { Count: 3 } } },
        { Value: { Items: [{ PupilId: 3 }], Page: { Count: 3 } } }
    ];

    const pupils = await loadAllPupils(async (...args) => {
        calls.push(args);
        return pages[calls.length - 1];
    }, 18508, 2);

    assert.deepEqual(pupils.map((pupil) => pupil.PupilId), [1, 2, 3]);
    assert.deepEqual(calls.map((call) => call[3].Skip), [0, 2]);
});

test('discoverResetWork loads sections and user exercises', async () => {
    const lesson = {
        LessonId: 1468983,
        MarathonLessonId: 230807,
        Name: 'Lesson 2',
        LastRequest: { Id: 3690753, Status: 2 }
    };

    const calls = [];
    const sendRequest = async (controller, method, project, value) => {
        calls.push({ controller, method, project, value });

        if (method === 'GetLessonWithId') {
            return { Value: { Sections: [{ Id: 10 }], HomeworkSection: { Id: 11 } } };
        }

        return {
            Value: {
                Items: value.SectionId === 10
                    ? [{ Id: 100, Type: 6 }, { Id: 101, Type: 10 }]
                    : [{ Id: 102, Type: 18 }]
            }
        };
    };

    const work = await discoverResetWork({
        sendRequest,
        wait: async () => {},
        marathonId: 18508,
        pupilId: 1397893,
        lessons: [lesson]
    });

    assert.deepEqual(work[0].exercises, [
        { id: 100, type: 6, sectionId: 10 },
        { id: 101, type: 10, sectionId: 10 },
        { id: 102, type: 18, sectionId: 11 }
    ]);
    assert.equal(work[0].deleteRequestId, 3690753);
    assert.equal(calls.filter((call) => call.method === 'LoadExercises').length, 2);
});

test('executeResetWork stops on the first failed reset', async () => {
    const calls = [];
    const deletedIds = [];
    const sendRequest = async (_controller, method, _project, value) => {
        calls.push({ method, exerciseId: value.ExerciseId });
        if (method === 'DropMarathonExerciseStatistic' && value.ExerciseId === 101) {
            throw new Error('reset rejected');
        }
        return method === 'SaveAnswer' ? { Value: {} } : { Value: true };
    };

    await assert.rejects(
        executeResetWork({
            sendRequest,
            sendWithoutResponse: (...args) => deletedIds.push(args[3].RequestId),
            wait: async () => {},
            marathonId: 18508,
            pupilId: 1397893,
            work: [{
                lesson: { LessonId: 1468989, Name: 'Lesson 2' },
                exercises: [
                    { id: 100, type: 6, sectionId: 10 },
                    { id: 101, type: 10, sectionId: 10 },
                    { id: 102, type: 18, sectionId: 11 }
                ],
                deleteRequestId: 3690753
            }],
            onProgress: () => {}
        }),
        /Lesson 2.*101.*reset rejected/
    );

    assert.deepEqual(calls.map((call) => call.method), [
        'SaveAnswer',
        'DropMarathonExerciseStatistic',
        'SaveAnswer',
        'DropMarathonExerciseStatistic'
    ]);
    assert.deepEqual(deletedIds, []);
});
```

- [ ] **Step 2: Run tests and verify the new exports are missing**

Run `node --test tests/resetLessons.test.js`.

Expected: FAIL because the three orchestration functions are undefined.

- [ ] **Step 3: Implement pagination and work discovery**

Add inside the module:

```js
async function loadAllPupils(sendRequest, marathonId, pageSize = 100) {
    const pupils = [];
    let total = Infinity;

    while (pupils.length < total) {
        const response = await sendRequest(
            'MarathonPupilsWsController',
            'GetMarathonPupils',
            'Marathons',
            { MarathonId: marathonId, Skip: pupils.length, Take: pageSize }
        );
        const items = response.Value?.Items;
        total = Number(response.Value?.Page?.Count);

        if (!Array.isArray(items) || !Number.isFinite(total)) {
            throw new Error('GetMarathonPupils returned an invalid response.');
        }

        pupils.push(...items);
        if (items.length === 0 && pupils.length < total) {
            throw new Error('GetMarathonPupils pagination stopped before all pupils were loaded.');
        }
    }

    return pupils;
}

async function discoverResetWork({
    sendRequest,
    wait,
    marathonId,
    pupilId,
    lessons,
    onDiscovery = () => {}
}) {
    const work = [];

    for (const lesson of lessons) {
        onDiscovery(`Loading sections for "${lesson.Name}"...`);
        const lessonResponse = await sendRequest(
            'LessonWsController',
            'GetLessonWithId',
            'Books',
            { LessonId: lesson.LessonId }
        );
        const sections = collectLessonSections(lessonResponse.Value);
        const exercises = [];

        for (const section of sections) {
            await wait(300);
            const exercisesResponse = await sendRequest(
                'GetExerciseWsController',
                'LoadExercises',
                'Exercises',
                buildLoadExercisesPayload({
                    marathonId,
                    pupilId,
                    marathonLessonId: lesson.MarathonLessonId,
                    sectionId: section.Id
                })
            );
            const items = exercisesResponse.Value?.Items;
            if (!Array.isArray(items)) {
                throw new Error(`LoadExercises returned invalid data for "${lesson.Name}".`);
            }
            exercises.push(...items
                .filter((item) => Number.isFinite(item.Id))
                .map((item) => ({
                    id: item.Id,
                    type: item.Type,
                    sectionId: section.Id
                })));
        }

        work.push({
            lesson,
            exercises,
            deleteRequestId: shouldDeleteLastRequest(lesson)
                ? lesson.LastRequest.Id
                : null
        });
    }

    return work;
}
```

- [ ] **Step 4: Implement sequential reset execution**

Add:

```js
async function executeResetWork({
    sendRequest,
    sendWithoutResponse,
    wait,
    marathonId,
    pupilId,
    work,
    onProgress
}) {
    const total = work.reduce(
        (sum, item) => sum + item.exercises.length + (item.deleteRequestId ? 1 : 0),
        0
    );
    let completed = 0;

    for (const item of work) {
        for (const exercise of item.exercises) {
            try {
                await wait(300);
                await sendRequest(
                    'ExerciseAnswerSaveVersion1WsController',
                    'SaveAnswer',
                    'ExerciseAnswer',
                    buildResetAnswerPayload({
                        marathonId,
                        pupilId,
                        lessonId: item.lesson.LessonId,
                        exercise
                    })
                );
                const response = await sendRequest(
                    'MarathonStatisticService',
                    'DropMarathonExerciseStatistic',
                    'Statistic',
                    {
                        MarathondId: marathonId,
                        PupilId: pupilId,
                        ExerciseId: exercise.id
                    }
                );
                if (response.Value !== true) {
                    throw new Error('server did not confirm the reset');
                }
            } catch (error) {
                throw new Error(
                    `Failed in "${item.lesson.Name}", exercise ${exercise.id}: ${error.message}`
                );
            }

            completed += 1;
            onProgress({ completed, total, lesson: item.lesson, exerciseId: exercise.id });
        }

        if (item.deleteRequestId) {
            sendWithoutResponse(
                'MarathonLessonWsController',
                'DeleteMarathonLessonRequestPupil',
                'Marathons',
                { RequestId: item.deleteRequestId }
            );
            completed += 1;
            onProgress({ completed, total, lesson: item.lesson, exerciseId: null });
        }
    }
}
```

Export all three functions from the returned API.

- [ ] **Step 5: Run orchestration tests**

Run `node --test tests/resetLessons.test.js`.

Expected: 8 tests pass and the abort test confirms exercise `102` and request deletion are not attempted.

### Task 3: Add the page overlay and modal state

**Files:**
- Modify: `resetLessons.js`

- [ ] **Step 1: Add a factory with explicit dependencies**

Add `createResetLessonsFeature` to the module:

```js
function createResetLessonsFeature({
    sendRequest,
    sendWithoutResponse,
    wait,
    canStart,
    onActiveChange
}) {
    let running = false;
    let active = false;

    function releaseOperation() {
        if (!active) return;
        active = false;
        onActiveChange(false);
    }

    async function open() {
        if (document.getElementById('edvibe-toolbox-reset-overlay')) return;
        if (!canStart()) {
            window.alert('Another Edvibe Toolbox operation is already running.');
            return;
        }

        const marathonId = parseMarathonId(window.location.href);
        if (!marathonId) {
            window.alert('Open an Edvibe marathon page before resetting lessons.');
            return;
        }

        active = true;
        onActiveChange(true);

        const modal = createResetModal({ onClose: releaseOperation });
        document.body.appendChild(modal.overlay);

        try {
            modal.setLoading('Loading marathon pupils...');
            const pupils = await loadAllPupils(sendRequest, marathonId);
            modal.showPupils(pupils, async (pupil) => {
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
                modal.showLessons(pupil, response.Value);
            });
        } catch (error) {
            modal.showError(error.message);
        }

        modal.onReset(async ({ pupil, lessons }) => {
            const confirmed = window.confirm(
                `Reset ${lessons.length} lesson(s) for ${pupil.Email}?`
            );
            if (!confirmed) return;

            running = true;
            modal.lock();

            try {
                modal.showDiscovery('Discovering exercises...');
                const work = await discoverResetWork({
                    sendRequest,
                    wait,
                    marathonId,
                    pupilId: pupil.PupilId,
                    lessons,
                    onDiscovery: modal.showDiscovery
                });
                await executeResetWork({
                    sendRequest,
                    sendWithoutResponse,
                    wait,
                    marathonId,
                    pupilId: pupil.PupilId,
                    work,
                    onProgress: modal.showProgress
                });
                modal.showComplete('Selected lesson progress was reset successfully.');
            } catch (error) {
                modal.showError(error.message);
            } finally {
                running = false;
                releaseOperation();
                modal.unlockAfterRun();
            }
        });
    }

    return { open, isRunning: () => running };
}
```

- [ ] **Step 2: Implement `createResetModal` with local state**

`createResetModal({ onClose })` must call `onClose` exactly once when an unlocked modal is removed. It returns this interface:

```js
{
    overlay,
    setLoading(message),
    showPupils(pupils, onSelectPupil),
    showLessons(pupil, lessons),
    onReset(handler),
    lock(),
    unlockAfterRun(),
    showDiscovery(message),
    showProgress({ completed, total, lesson, exerciseId }),
    showComplete(message),
    showError(message)
}
```

Use DOM APIs and `textContent` for pupil/lesson data. Do not interpolate emails or lesson names into `innerHTML`. Keep selected pupil and selected lesson IDs in closure state. Email filtering must call `filterPupilsByEmail`; lesson checkboxes must use `MarathonLessonId` as stable values.

- [ ] **Step 3: Add scoped styles and accessibility**

Create one style element with ID `edvibe-toolbox-reset-styles`. Scope every selector under `#edvibe-toolbox-reset-overlay`. Include:

- fixed full-screen backdrop at `z-index: 2147483647`;
- responsive card width `min(760px, calc(100vw - 32px))`;
- scrollable pupil and lesson lists;
- visible selected pupil row;
- danger-colored reset button;
- determinate progress bar and indeterminate animation;
- error and success status colors.

Set `role="dialog"`, `aria-modal="true"`, a labelled heading, progressbar ARIA values, and labels for search and checklist controls. Escape closes only while not running. Backdrop click closes only while not running.

- [ ] **Step 4: Export and syntax-check the completed module**

Export `createResetLessonsFeature`, then run:

```bash
node --check resetLessons.js
node --test tests/resetLessons.test.js
```

Expected: syntax check succeeds and all 8 tests pass.

### Task 4: Extend WebSocket transport and operation locking

**Files:**
- Modify: `main.js:5-58`
- Modify: `main.js:239-253`
- Modify: `main.js:425-431`

- [ ] **Step 1: Add timeout cleanup to awaited requests**

Store pending entries as `{ resolve, reject, timeoutId }`. On response, clear the timeout, remove the entry, reject unsuccessful responses, and resolve successful responses:

```js
const REQUEST_TIMEOUT_MS = 15000;

// In the message handler:
const pending = pendingRequests.get(data.RequestId);
pendingRequests.delete(data.RequestId);
clearTimeout(pending.timeoutId);

if (data.IsSuccess !== true) {
    pending.reject(new Error(
        `${data.Class || 'Edvibe'}:${data.Method || 'request'} failed with ErrorCode ${data.ErrorCode}`
    ));
} else {
    pending.resolve(data);
}
```

In `sendSocketMessage`, create a timeout that deletes the request ID and rejects with the controller/method context.

- [ ] **Step 2: Add fire-and-forget packet sending**

Factor packet construction into `createSocketPacket`, then add:

```js
function sendSocketMessageWithoutResponse(controller, method, projectName, valueObject) {
    if (!activeEdvibeSocket || activeEdvibeSocket.readyState !== OriginalWebSocket.OPEN) {
        throw new Error('Active WebSocket connection is missing. Reload the Edvibe tab.');
    }

    activeEdvibeSocket.send(JSON.stringify(
        createSocketPacket(controller, method, projectName, valueObject)
    ));
}
```

Do not add this request to `pendingRequests`.

- [ ] **Step 3: Add a shared operation lock**

Replace independent start checks with:

```js
let activeToolboxOperation = null;

function canStartToolboxOperation() {
    return activeToolboxOperation === null;
}

function setToolboxOperation(operation) {
    activeToolboxOperation = operation;
}
```

The export sets `export` before starting and clears it in `finally`. Its duplicate warning covers any active toolbox operation.

- [ ] **Step 4: Instantiate and route the reset feature**

After transport helpers are defined:

```js
const lessonResetFeature = window.EdVibeLessonReset.createResetLessonsFeature({
    sendRequest: sendSocketMessage,
    sendWithoutResponse: sendSocketMessageWithoutResponse,
    wait: delay,
    canStart: canStartToolboxOperation,
    onActiveChange(isActive) {
        setToolboxOperation(isActive ? 'reset' : null);
    }
});
```

Extend the page message listener:

```js
if (event.source !== window) return;

if (event.data?.type === 'EDVIBE_TOOLBOX_START_ALL') {
    startAutomatedMarathonBackup();
}

if (event.data?.type === 'EDVIBE_TOOLBOX_OPEN_RESET') {
    lessonResetFeature.open();
}
```

- [ ] **Step 5: Check syntax**

Run:

```bash
node --check main.js
node --check resetLessons.js
```

Expected: both commands exit successfully.

### Task 5: Wire the popup and isolated-world command

**Files:**
- Modify: `popup.html:55-79,86-89`
- Modify: `popup.js:5-80`
- Modify: `isolated.js:26-38`
- Modify: `manifest.json:27-32`

- [ ] **Step 1: Add the popup reset button**

In the existing section, add:

```html
<button id="resetLessonsBtn" class="btn btn-danger">Сброс уроков</button>
```

Keep the existing `.btn-danger` styles and add a disabled hover rule matching `.btn-backup`.

- [ ] **Step 2: Add a shared active marathon-tab helper**

In `popup.js`, add:

```js
async function getActiveMarathonTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !tab.url) {
        throw new Error('Active browser tab could not be determined.');
    }
    if (!tab.url.includes('edvibe.com') || !/marathon\/\d+/.test(tab.url)) {
        throw new Error('Open an Edvibe marathon page first.');
    }
    return tab;
}

function sendTabCommand(tabId, action) {
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, { action }, (response) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
            }
            resolve(response);
        });
    });
}
```

Use these helpers for the existing export handler and the new reset handler.

- [ ] **Step 3: Route the reset action through `isolated.js`**

Add a dedicated branch:

```js
if (message?.action === 'OPEN_LESSON_RESET') {
    window.postMessage({ type: 'EDVIBE_TOOLBOX_OPEN_RESET' }, '*');
    sendResponse({ status: 'success' });
    return true;
}
```

Keep unknown commands ignored. Do not relay pupil or lesson data through `window.postMessage`.

- [ ] **Step 4: Load the reset module before `main.js`**

Update the MAIN-world scripts:

```json
"js": [
    "lib/jszip.min.js",
    "lib/turndown.min.js",
    "compileMarathonToZip.js",
    "resetLessons.js",
    "main.js"
]
```

- [ ] **Step 5: Run static validation**

Run:

```bash
node --check popup.js
node --check isolated.js
node --check main.js
node --check resetLessons.js
node -e "JSON.parse(require('fs').readFileSync('manifest.json', 'utf8')); console.log('manifest ok')"
node --test tests/resetLessons.test.js
```

Expected: all syntax checks succeed, `manifest ok` prints, and all tests pass.

### Task 6: Manual end-to-end verification

**Files:**
- Verify only; no planned edits.

- [ ] **Step 1: Reload the unpacked extension**

Open `chrome://extensions`, reload Edvibe Toolbox, and confirm Chrome reports no manifest or content-script errors.

- [ ] **Step 2: Verify popup routing**

On a non-marathon page, click `Сброс уроков` and confirm the extension reports that a marathon page is required. On `edvibe.com/.../marathon/<id>`, click it and confirm the page overlay opens.

- [ ] **Step 3: Verify pupil pagination and filtering**

Confirm the modal eventually shows the full course pupil count from `Page.Count`. Search with mixed-case email fragments and confirm only case-insensitive substring matches remain.

- [ ] **Step 4: Verify selection behavior**

Select one pupil and confirm lessons load. Verify only one pupil remains selected, `Select all` updates every lesson checkbox, and `Сбросить прогресс` is enabled only with at least one checked lesson.

- [ ] **Step 5: Verify a controlled reset**

Use a test pupil and one known completed lesson. Confirm the dialog identifies the pupil and count. Verify discovery progress becomes determinate, exercise resets occur sequentially, and applicable non-zero `LastRequest` IDs produce `DeleteMarathonLessonRequestPupil` packets without waiting.

- [ ] **Step 6: Verify the resulting Edvibe state**

Reload the pupil's lesson and confirm selected exercise progress is cleared. Confirm lessons with `LastRequest.Status === 0` did not send deletion requests.

- [ ] **Step 7: Verify failure and mutual exclusion**

During reset, confirm the modal cannot close and export cannot start. Simulate or observe one failed awaited request and confirm no later exercise or lesson request is sent and the modal identifies the failure context.

## Completion Criteria

- `node --test tests/resetLessons.test.js` passes.
- All modified JavaScript files pass `node --check`.
- `manifest.json` parses and Chrome reloads it without errors.
- The modal loads every pupil, filters by email, selects one pupil, and selects lessons.
- Each exercise sends the captured answer-reset payload before the statistic-drop payload.
- The first awaited failure aborts all remaining work.
- `DeleteMarathonLessonRequestPupil` is sent only for a non-zero `LastRequest.Status` and is never awaited.
- A real test pupil's selected lesson progress is cleared.

Do not create commits unless the user explicitly asks for them.
