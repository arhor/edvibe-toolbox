# Batch Lesson Access Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an in-page Edvibe Toolbox workflow that validates multiple marathon pupils by email and safely opens selected lessons in batch.

**Architecture:** Add a dedicated UMD feature module for parsing, pagination, preflight, retries, execution, and reporting, plus a shadow-root Web Component for the workflow UI. Reuse the intercepted page WebSocket, typed transport errors, operation guard, popup-to-isolated-to-main command bridge, and existing content-script dependency model.

**Tech Stack:** Manifest V3 Chrome extension, vanilla JavaScript, HTML templates in Web Components, dedicated CSS, Node.js built-in `node:test`, Edvibe WebSocket request/response API.

## Global Constraints

- Keep the project framework-free with no package manager, build step, background worker, or new Chrome permission.
- Run only from an active Edvibe marathon page and preserve the isolated-world/main-world responsibility split.
- Validate every submitted email and every selected pupil/lesson state before the first mutation.
- All lesson checkboxes are unchecked by default; require at least one unique email and one selected lesson.
- Skip `IsOpen === true` pairs without sending `ChangeIsOpenLessonForPupil`.
- Retry only typed transient transport failures, with at most three total attempts and delays of exactly 1,000 ms and 3,000 ms.
- Never retry `SERVER_REJECTED`, `INVALID_RESPONSE`, validation, authorization, permission, or ordinary server-declared errors.
- Continue after an individual mutation failure and report every result at the end.
- Execute writes sequentially with a 300 ms throttle before each mutation attempt group.
- Treat emails and lesson data as sensitive; do not log complete payloads or email lists.
- Implement dynamic UI as a Web Component and keep all presentation CSS in a dedicated `.css` file.
- Do not edit `lib/jszip.min.js`, `lib/turndown.min.js`, or generated `export-*.json` files.
- Preserve `"src/shared//logger.js"` byte-for-byte in the isolated content-script list.
- Preserve `MAIN` content-script order: vendored libraries, `src/shared/logger.js`, remaining shared modules, components, features, then `src/main.js`.

---

## File Structure

### New files

- `src/features/batch-lesson-access.js`: pure batch helpers and feature orchestration.
- `src/components/batch-lesson-access-dialog.js`: shadow-root dialog rendering and semantic UI events.
- `src/components/batch-lesson-access-dialog.css`: all batch-dialog presentation.
- `tests/batchLessonAccess.test.js`: parsing, pagination, preflight, retry, execution, reporting, and orchestration tests.
- `tests/batchLessonAccessDialog.test.js`: custom-element state and interaction tests.

### Modified files

- `src/shared/websocket-transport.js`: typed errors and read-only connection state.
- `tests/websocketTransport.test.js`: typed transport behavior.
- `popup.js`: management tool definition.
- `src/isolated.js`: trusted popup command bridge.
- `src/main.js`: feature construction and event routing.
- `manifest.json`: stylesheet resource and ordered component/feature scripts.
- `tests/moduleArchitecture.test.js`: exact manifest and composition assertions.
- `tests/popupHandlers.test.js`: popup tool command and marathon availability.

---

### Task 1: Typed WebSocket Transport Failures

**Files:**
- Modify: `src/shared/websocket-transport.js:12-284`
- Test: `tests/websocketTransport.test.js`

**Interfaces:**
- Consumes: existing `createWebSocketTransport(options)`.
- Produces: `createTransportError(code, message, details)`, transport errors with `code`, `controller`, `method`, `requestId`, `serverErrorCode`, and `cause`; `transport.getConnectionState() => { isOpen: boolean }`.

- [ ] **Step 1: Write failing tests for connection state and unavailable errors**

Append tests which assert the initial state is closed, an intercepted open socket
changes it to open, and a request without a socket rejects with structured
metadata:

```js
test('transport exposes connection state and typed unavailable errors', async () => {
    const root = { WebSocket: FakeWebSocket };
    const transport = createWebSocketTransport({
        WebSocketClass: FakeWebSocket,
        cryptoApi: { randomUUID: () => 'request-state' },
        log() {}
    });

    assert.deepEqual(transport.getConnectionState(), { isOpen: false });
    await assert.rejects(
        transport.sendRequest('Controller', 'Method', 'Project', {}),
        (error) => error.code === 'WS_UNAVAILABLE'
            && error.controller === 'Controller'
            && error.method === 'Method'
    );

    transport.install(root);
    new root.WebSocket('wss://example.test');
    assert.deepEqual(transport.getConnectionState(), { isOpen: true });
});
```

- [ ] **Step 2: Write failing tests for timeout, server rejection, and send failure metadata**

Use injected timeout functions for `REQUEST_TIMEOUT`, an `IsSuccess: false`
response for `SERVER_REJECTED`, and a socket whose `send` throws for
`SEND_FAILED`. Assert request ID, server error code, and original cause:

```js
assert.equal(error.code, 'SERVER_REJECTED');
assert.equal(error.serverErrorCode, 403);
assert.equal(error.requestId, 'request-rejected');
```

- [ ] **Step 3: Run the transport tests to verify failure**

Run:

```bash
node --test tests/websocketTransport.test.js
```

Expected: FAIL because `getConnectionState` and typed `code` metadata do not
exist.

- [ ] **Step 4: Implement the transport error helper**

Add a helper near `REQUEST_TIMEOUT_MS`:

```js
function createTransportError(code, message, details = {}) {
    const error = new Error(message);
    error.code = code;
    for (const key of [
        'controller',
        'method',
        'requestId',
        'serverErrorCode',
        'cause'
    ]) {
        if (details[key] !== undefined) {
            error[key] = details[key];
        }
    }
    return error;
}
```

Use it in `requireOpenSocket`, the timeout callback, the server-rejection path,
and the `socket.send` catch. Pass controller and method into
`requireOpenSocket(controller, method)`. Preserve all existing message text so
current regex assertions remain valid.

- [ ] **Step 5: Add read-only connection state**

Add:

```js
function getConnectionState() {
    return {
        isOpen: Boolean(
            activeSocket && activeSocket.readyState === WebSocketClass.OPEN
        )
    };
}
```

Return it with the existing transport methods:

```js
return {
    install,
    sendRequest,
    sendWithoutResponse,
    subscribeFrames,
    getConnectionState
};
```

- [ ] **Step 6: Run focused and full tests**

Run:

```bash
node --test tests/websocketTransport.test.js
node --test tests/*.test.js
```

Expected: all tests pass with zero failures.

- [ ] **Step 7: Commit**

```bash
git add src/shared/websocket-transport.js tests/websocketTransport.test.js
git commit -m "feat: expose typed websocket transport errors"
```

---

### Task 2: Batch Input, Pagination, and Pupil Resolution

**Files:**
- Create: `src/features/batch-lesson-access.js`
- Create: `tests/batchLessonAccess.test.js`

**Interfaces:**
- Consumes: `sendRequest(controller, method, projectName, value)`.
- Produces:
  - `parseMarathonId(url) => number | null`
  - `parseEmailInput(value) => { entries, malformed }`
  - `loadAllPupils({ sendRequest, marathonId, pageSize }) => Promise<Pupil[]>`
  - `loadAllPupilLessons({ sendRequest, marathonId, pupilId, pageSize }) => Promise<Lesson[]>`
  - `resolvePupilsByEmail(entries, pupils) => { matches, errors }`

- [ ] **Step 1: Write failing parser and resolution tests**

Cover comma, semicolon, CRLF/LF separation, trimming, case-insensitive stable
deduplication, malformed email collection, exact matching, missing matches, and
ambiguous duplicate roster rows:

```js
test('email input normalizes and deduplicates in first-seen order', () => {
    assert.deepEqual(
        parseEmailInput(' First@Example.com,second@example.com\nfirst@example.com '),
        {
            entries: [
                { input: 'First@Example.com', normalized: 'first@example.com' },
                { input: 'second@example.com', normalized: 'second@example.com' }
            ],
            malformed: []
        }
    );
});
```

Use a deliberately conservative syntax rule that requires one `@`, a non-empty
local part, and a dotted domain with no whitespace:

```js
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

- [ ] **Step 2: Write failing pagination tests**

Assert exact request shapes and complete accumulation:

```js
assert.deepEqual(calls[0].value, {
    MarathonId: 18508,
    Skip: 0,
    Take: 50
});
assert.deepEqual(calls[1].value, {
    PupilId: 1397893,
    MarathonId: 18508,
    SearchTerm: '',
    Page: { Skip: 20, Take: 20 }
});
```

Add rejection cases for non-array `Items`, non-integer/negative `Page.Count`,
an empty page before the total, a shrinking total, and accumulated items
exceeding the reported total.

- [ ] **Step 3: Run the new test file to verify failure**

Run:

```bash
node --test tests/batchLessonAccess.test.js
```

Expected: FAIL because `src/features/batch-lesson-access.js` does not exist.

- [ ] **Step 4: Create the UMD module and parsing helpers**

Use the repository's module shape:

```js
(function initializeBatchLessonAccess(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.EdVibeBatchLessonAccess = factory();
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createModule() {
    'use strict';

    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function parseMarathonId(url) {
        const match = String(url || '').match(/\/marathon\/(\d+)(?:\/|$)/);
        return match ? Number(match[1]) : null;
    }

    function parseEmailInput(value) {
        const entries = [];
        const malformed = [];
        const seen = new Set();
        for (const token of String(value || '').split(/[,;\r\n]+/)) {
            const input = token.trim();
            if (!input) {
                continue;
            }
            const normalized = input.toLowerCase();
            if (seen.has(normalized)) {
                continue;
            }
            seen.add(normalized);
            if (!EMAIL_PATTERN.test(input)) {
                malformed.push(input);
                continue;
            }
            entries.push({ input, normalized });
        }
        return { entries, malformed };
    }
```

Export every tested helper at the module return statement.

- [ ] **Step 5: Implement a shared strict page accumulator**

Keep the request functions separate, but centralize response validation:

```js
function appendPage(items, total, nextItems, nextTotal, label) {
    if (
        !Array.isArray(nextItems)
        || !Number.isInteger(nextTotal)
        || nextTotal < 0
        || (total !== null && nextTotal !== total)
        || (nextItems.length === 0 && items.length < nextTotal)
        || items.length + nextItems.length > nextTotal
    ) {
        const error = new Error(`${label} returned invalid pagination data.`);
        error.code = 'INVALID_RESPONSE';
        throw error;
    }
    return {
        items: items.concat(nextItems),
        total: nextTotal
    };
}
```

Implement both endpoint loops with default sizes of 50 pupils and 20 lessons.

- [ ] **Step 6: Implement exact email resolution**

Index pupils by `String(pupil.Email || '').trim().toLowerCase()`. For each parsed
entry, return one match only when the index has exactly one row. Return all
missing and ambiguous errors without short-circuiting:

```js
{
    type: 'missing',
    input: entry.input,
    message: `No marathon pupil found for ${entry.input}.`
}
```

and:

```js
{
    type: 'ambiguous',
    input: entry.input,
    count: candidates.length,
    message: `Multiple marathon pupils found for ${entry.input}.`
}
```

- [ ] **Step 7: Run focused tests**

Run:

```bash
node --test tests/batchLessonAccess.test.js
```

Expected: all parser, resolution, and pagination tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/features/batch-lesson-access.js tests/batchLessonAccess.test.js
git commit -m "feat: add batch access preflight primitives"
```

---

### Task 3: Preflight Planning, Retry, Execution, and Reports

**Files:**
- Modify: `src/features/batch-lesson-access.js`
- Modify: `tests/batchLessonAccess.test.js`

**Interfaces:**
- Consumes: Task 1 transport error codes and Task 2 pupil/lesson helpers.
- Produces:
  - `createFeatureError(code, message, details) => Error`
  - `runWithRetry(operation, options) => Promise<{ value, attempts }>`
  - `buildAccessPlan({ pupils, selectedLessonIds, lessonsByPupilId })`
  - `executeAccessPlan(options) => Promise<BatchResult>`
  - `formatBatchReport(result) => string`

- [ ] **Step 1: Write failing preflight-plan tests**

Use two pupils and two selected lessons. Assert `IsOpen === true` becomes a
skip, `false` becomes a write, and missing, duplicated, or non-boolean selected
lesson states produce aggregated preflight errors:

```js
assert.deepEqual(plan.alreadyOpen.map((item) => item.marathonLessonId), [10]);
assert.deepEqual(plan.needsOpening.map((item) => item.marathonLessonId), [11]);
```

Each plan item must contain:

```js
{
    email,
    pupilId,
    marathonPupilId,
    marathonLessonId,
    lessonName
}
```

- [ ] **Step 2: Write failing retry-policy tests**

Inject `wait` and `getConnectionState` spies. Cover:

- timeout twice, then success: three attempts and waits `[1000, 3000]`;
- `SERVER_REJECTED`: one attempt and no waits;
- `INVALID_RESPONSE`: one attempt and no waits;
- unavailable connection before a retry: the retry attempt records
  `WS_UNAVAILABLE` without calling the operation;
- third transient failure: reject with `attempts === 3`.

Use:

```js
const TRANSIENT_CODES = new Set([
    'WS_UNAVAILABLE',
    'REQUEST_TIMEOUT',
    'SEND_FAILED'
]);
```

Treat `SEND_FAILED` as transient only when its `cause` is present and the
connection state is not open.

- [ ] **Step 3: Write failing execution and report tests**

Assert writes are sequential, wait 300 ms before each plan item, send the exact
recorded payload, require `response.Value === true`, continue after a permanent
failure, and aggregate successes, failures, attempts, and preflight skips:

```js
assert.deepEqual(calls[0], {
    controller: 'MarathonLessonWsController',
    method: 'ChangeIsOpenLessonForPupil',
    project: 'Marathons',
    value: {
        IsOpen: true,
        MarathonLessonId: 2034971,
        MarathonPupilId: 228019,
        MarathonId: 18508
    }
});
```

Assert `formatBatchReport` includes actionable emails and failed lesson names
but excludes `PupilId`, `MarathonPupilId`, and serialized response payloads.

- [ ] **Step 4: Run focused tests to verify failure**

Run:

```bash
node --test tests/batchLessonAccess.test.js
```

Expected: FAIL because planning, retry, execution, and report exports do not
exist.

- [ ] **Step 5: Implement typed feature errors and retry**

Create `INVALID_RESPONSE` errors for malformed successful responses. Implement
three total attempts with `[1000, 3000]` delays and attach the final attempt
count:

```js
async function runWithRetry(operation, {
    wait,
    getConnectionState,
    retryDelays = [1000, 3000]
}) {
    let attempts = 0;
    while (attempts <= retryDelays.length) {
        attempts += 1;
        try {
            if (attempts > 1 && !getConnectionState().isOpen) {
                throw createFeatureError(
                    'WS_UNAVAILABLE',
                    'The Edvibe connection is unavailable.'
                );
            }
            return { value: await operation(), attempts };
        } catch (error) {
            if (!isTransientError(error) || attempts > retryDelays.length) {
                error.attempts = attempts;
                throw error;
            }
            await wait(retryDelays[attempts - 1]);
        }
    }
}
```

Ensure the last transient error exits after attempt three; do not add a fourth
operation call.

- [ ] **Step 6: Implement access-plan construction**

For each matched pupil, build a `Map` by `MarathonLessonId`, reject duplicate
IDs, require every selected ID, and require a boolean `IsOpen`. Return:

```js
{
    alreadyOpen,
    needsOpening,
    errors
}
```

Do not throw on the first pupil inconsistency; collect all errors so the dialog
can show the complete preflight failure.

- [ ] **Step 7: Implement sequential execution**

For each `needsOpening` item:

1. call `wait(300)`;
2. call `runWithRetry` around the mutation request;
3. require `Value === true`;
4. append success or failure;
5. invoke `onProgress` with immutable count snapshots;
6. continue to the next item after failure.

Return:

```js
{
    requestedEmails,
    matchedUsers,
    selectedLessons,
    opened,
    alreadyOpen,
    failures,
    attempts
}
```

- [ ] **Step 8: Implement plain-text report formatting**

Format stable summary lines followed by failure lines shaped as:

```text
FAILED user@example.com — 5. Lesson name — 3 attempts — REQUEST_TIMEOUT: message
```

Do not include unrelated pupil fields or raw payloads.

- [ ] **Step 9: Run focused and full tests**

Run:

```bash
node --test tests/batchLessonAccess.test.js
node --test tests/*.test.js
```

Expected: all tests pass.

- [ ] **Step 10: Commit**

```bash
git add src/features/batch-lesson-access.js tests/batchLessonAccess.test.js
git commit -m "feat: execute resilient batch lesson access"
```

---

### Task 4: Batch Access Web Component

**Files:**
- Create: `src/components/batch-lesson-access-dialog.js`
- Create: `src/components/batch-lesson-access-dialog.css`
- Create: `tests/batchLessonAccessDialog.test.js`

**Interfaces:**
- Consumes: plain pupils, lessons, plans, progress snapshots, validation errors,
  and batch summaries supplied by the feature.
- Produces:
  - `BATCH_ACCESS_DIALOG_TAG = 'edvibe-toolbox-batch-access-dialog'`
  - `BATCH_ACCESS_OVERLAY_ID = 'edvibe-toolbox-batch-access-overlay'`
  - custom events `edvibe-batch-access-input-change`,
    `edvibe-batch-access-submit`,
    `edvibe-batch-access-confirm`, `edvibe-batch-access-copy-report`,
    `edvibe-batch-access-restart`, and `edvibe-dialog-close`
  - methods `configure`, `setEmailState`, `showConfigure`, `showValidation`,
    `showValidationErrors`, `showConfirmation`, `showExecution`,
    `showComplete`, and `showFatalError`.

- [ ] **Step 1: Create a fake DOM harness and failing structure tests**

Follow `tests/resetLessonsDialog.test.js`: provide fake `HTMLElement`,
`document.createElement`, `attachShadow`, event dispatch, `classList`, and
selector lookup. Assert:

- the module registers the exact custom-element tag;
- the template contains a stylesheet link, textarea, lesson list, select-all,
  clear-all, primary action, status region, progress element, summary region,
  copy, restart, confirm, and close controls;
- all lesson selections start unchecked;
- the primary action is disabled without parsed emails or selected lessons.

- [ ] **Step 2: Write failing interaction/state tests**

Cover:

- configure renders numbered lessons and unique-email count supplied by the
  feature;
- textarea input emits the complete raw value and `setEmailState` updates the
  valid/malformed counts without parsing inside the component;
- select-all selects every lesson and clear-all removes every selection;
- submit emits raw email text plus selected lesson IDs;
- validation and execution lock textarea, checkboxes, and close controls;
- confirmation renders pending and already-open counts;
- execution renders progress and running counts;
- validation errors unlock editing and render every message;
- completion enables copy, restart, and close;
- restart clears input and selections but retains the provided lesson catalogue.

- [ ] **Step 3: Run dialog tests to verify failure**

Run:

```bash
node --test tests/batchLessonAccessDialog.test.js
```

Expected: FAIL because the component module does not exist.

- [ ] **Step 4: Create the UMD Web Component**

Use the existing component pattern:

```js
(function initializeBatchAccessDialog(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], () => factory(root));
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(root);
    } else {
        root.EdVibeBatchAccessDialogComponent = factory(root);
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createComponent(root) {
    'use strict';

    const BATCH_ACCESS_DIALOG_TAG = 'edvibe-toolbox-batch-access-dialog';
    const BATCH_ACCESS_OVERLAY_ID = 'edvibe-toolbox-batch-access-overlay';
```

Build all markup once in a `<template>`, attach a shadow root, cache selectors,
and render through explicit state methods. Use `textContent` and DOM creation
for user/server data; never interpolate it into `innerHTML`.

- [ ] **Step 5: Implement semantic events**

Submit detail:

```js
{
    emailInput: this.elements.emails.value,
    selectedLessonIds: [...this.selectedLessonIds]
}
```

The input-change event detail is `{ emailInput: this.elements.emails.value }`.
Confirmation, copy, restart, and close events need no sensitive detail.
Backdrop and Escape close only in editable or completed states.

- [ ] **Step 6: Create dedicated responsive CSS**

Adapt spacing, typography, rows, status colors, focus rings, and progress layout
from `reset-lessons-dialog.css`, using only `.edvibe-batch-access-*` selectors.
Support a bounded viewport with scrollable email/lesson/error regions. Include:

```css
:host {
    all: initial;
}

.edvibe-batch-access-overlay {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
}
```

Do not assign `.style`, `style.cssText`, or inline `style` attributes from
JavaScript.

- [ ] **Step 7: Run dialog and architecture tests**

Run:

```bash
node --test tests/batchLessonAccessDialog.test.js
node --test tests/moduleArchitecture.test.js
```

Expected: dialog tests pass; architecture tests remain green because the new
files are not wired yet.

- [ ] **Step 8: Commit**

```bash
git add src/components/batch-lesson-access-dialog.js \
    src/components/batch-lesson-access-dialog.css \
    tests/batchLessonAccessDialog.test.js
git commit -m "feat: add batch lesson access dialog"
```

---

### Task 5: Feature Orchestration and All-Read-Before-Write Boundary

**Files:**
- Modify: `src/features/batch-lesson-access.js`
- Modify: `tests/batchLessonAccess.test.js`

**Interfaces:**
- Consumes: Task 2/3 helpers, Task 4 dialog methods/events, transport
  `sendRequest` and `getConnectionState`, operation guard callbacks.
- Produces:

```js
createBatchLessonAccessFeature({
    sendRequest,
    getConnectionState,
    wait,
    canStart,
    onActiveChange,
    createDialog,
    copyText,
    log
}) // => { open, isRunning }
```

- [ ] **Step 1: Write failing initialization tests**

Stub the dialog and request sequence. Assert `open`:

- rejects concurrent operation through `canStart`;
- parses the marathon ID from `window.location.href`;
- activates the operation guard once;
- loads every pupil page;
- uses the first pupil to load the complete lesson catalogue;
- configures and appends one dialog;
- releases the guard on initialization failure or dialog close;
- shows a fatal error for an empty roster without enabling submission.

- [ ] **Step 2: Write failing validation/preflight orchestration tests**

Dispatch `edvibe-batch-access-submit` and assert:

- malformed, missing, and ambiguous emails are aggregated before lesson-state
  requests;
- failed email resolution issues zero pupil lesson-state reads and zero writes;
- valid emails load all lesson pages for every matched pupil;
- a failed access-state read uses the retry policy;
- any final read or plan inconsistency issues zero writes;
- successful preflight calls `showConfirmation` with exact pending and skipped
  counts;
- an all-already-open plan calls `showComplete` without confirmation or writes.

- [ ] **Step 3: Write failing confirmation, reporting, and restart tests**

Assert confirmation executes the frozen plan once, duplicate confirm events are
ignored while running, progress is forwarded, copied reports use the completed
result, restart clears run-specific state without refetching roster/catalogue,
and close releases the operation guard.

- [ ] **Step 4: Run focused tests to verify failure**

Run:

```bash
node --test tests/batchLessonAccess.test.js
```

Expected: FAIL because `createBatchLessonAccessFeature` is not exported.

- [ ] **Step 5: Implement the factory and lifecycle**

Maintain explicit state:

```js
let active = false;
let running = false;
let pupils = [];
let lessonCatalogue = [];
let pendingPlan = null;
let completedResult = null;
```

`open` must refuse duplicate overlays by ID, activate the guard before network
work, configure the dialog, append it, and release the guard only on close or
fatal initialization failure.

- [ ] **Step 6: Implement submit preflight**

On `edvibe-batch-access-input-change`, call `parseEmailInput` and pass
`{ validCount: entries.length, malformedCount: malformed.length }` to
`dialog.setEmailState`. On submit:

1. freeze the submitted email text and lesson ID array;
2. parse all emails;
3. aggregate syntax and resolution errors;
4. return to editable state if any exist;
5. for each matched pupil, load all lesson pages through `runWithRetry`;
6. collect all read failures instead of writing;
7. build the plan and aggregate consistency errors;
8. return to editable state if any preflight error exists;
9. store an immutable plan snapshot and show confirmation;
10. finish immediately when `needsOpening.length === 0`.

- [ ] **Step 7: Implement confirmation and completion**

Guard confirmation with `running`. Execute only the stored plan, forward
progress, show a full or partial completion summary, retain the result for
copying, and never recompute selection from mutable dialog fields.

Use injected `copyText(formatBatchReport(completedResult))` for explicit report
copy. Routine logs include marathon ID, pupil ID, marathon lesson ID, counts,
and error codes, but not email lists or response payloads.

- [ ] **Step 8: Run focused and full tests**

Run:

```bash
node --test tests/batchLessonAccess.test.js
node --test tests/*.test.js
```

Expected: all tests pass.

- [ ] **Step 9: Commit**

```bash
git add src/features/batch-lesson-access.js tests/batchLessonAccess.test.js
git commit -m "feat: orchestrate batch lesson access workflow"
```

---

### Task 6: Popup, World Bridge, Composition, and Manifest Wiring

**Files:**
- Modify: `popup.js:10-45`
- Modify: `src/isolated.js:21-56`
- Modify: `src/main.js:15-115`
- Modify: `manifest.json:17-61`
- Modify: `tests/moduleArchitecture.test.js`
- Modify: `tests/popupHandlers.test.js`

**Interfaces:**
- Consumes: `EdVibeBatchLessonAccess`,
  `EdVibeBatchAccessDialogComponent`, `transport.getConnectionState`, and
  `createBatchLessonAccessFeature`.
- Produces command path:

```text
OPEN_BATCH_LESSON_ACCESS
  -> EDVIBE_TOOLBOX_OPEN_BATCH_LESSON_ACCESS
  -> batchLessonAccessFeature.open()
```

- [ ] **Step 1: Write failing popup and routing tests**

Assert the popup definition has:

```js
{
    id: 'batch-lesson-access',
    group: 'management',
    command: 'OPEN_BATCH_LESSON_ACCESS',
    requirement: 'marathon',
    closeOnSuccess: true
}
```

Assert isolated routing posts only the event type plus
`src/components/batch-lesson-access-dialog.css`. Assert main requires both new
modules, constructs the feature with `transport.getConnectionState`, and routes
the event to `batchLessonAccessFeature.open`.

- [ ] **Step 2: Update exact manifest expectations before the manifest**

In `tests/moduleArchitecture.test.js`, require:

```js
[
    'lib/jszip.min.js',
    'lib/turndown.min.js',
    'src/shared/logger.js',
    'src/shared/websocket-transport.js',
    'src/shared/operation-guard.js',
    'src/components/reset-lessons-dialog.js',
    'src/components/action-recorder-dialog.js',
    'src/components/export-progress-dialog.js',
    'src/components/batch-lesson-access-dialog.js',
    'src/features/reset-lessons.js',
    'src/features/marathon-export.js',
    'src/features/action-recorder.js',
    'src/features/batch-lesson-access.js',
    'src/main.js'
]
```

Require the new CSS resource while retaining all three existing resources.
Retain the isolated assertion exactly as:

```js
[
    'src/shared//logger.js',
    'src/isolated.js'
]
```

Add `src/features/batch-lesson-access.js` to the coordinator-files presentation
guard.

- [ ] **Step 3: Run wiring tests to verify failure**

Run:

```bash
node --test tests/popupHandlers.test.js tests/moduleArchitecture.test.js
```

Expected: FAIL because the new popup command, bridge, composition, and manifest
entries are absent.

- [ ] **Step 4: Add popup and isolated routing**

Add a Russian-localized management card consistent with existing popup copy:

```js
Object.freeze({
    id: 'batch-lesson-access',
    group: 'management',
    title: 'Открыть доступ к урокам',
    description: 'Открыть выбранные уроки для списка учеников.',
    command: 'OPEN_BATCH_LESSON_ACCESS',
    requirement: 'marathon',
    actionLabel: 'Открыть мастер',
    busyLabel: 'Открывается…',
    closeOnSuccess: true
})
```

Add one isolated switch case which posts:

```js
{
    type: 'EDVIBE_TOOLBOX_OPEN_BATCH_LESSON_ACCESS',
    stylesheetUrl: chrome.runtime.getURL(
        'src/components/batch-lesson-access-dialog.css'
    )
}
```

- [ ] **Step 5: Compose the feature in main**

Require both globals, create `const batchAccessLog =
createMainLog('BatchAccess')`, and construct:

```js
const batchLessonAccessFeature = batchAccessApi.createBatchLessonAccessFeature({
    sendRequest: transport.sendRequest,
    getConnectionState: transport.getConnectionState,
    wait,
    canStart: operationGuard.canStart,
    onActiveChange(isActive) {
        if (isActive) {
            operationGuard.activate('batch-access');
        }
        else {
            operationGuard.release('batch-access');
        }
    },
    createDialog() {
        return document.createElement(batchAccessDialogApi.BATCH_ACCESS_DIALOG_TAG);
    },
    copyText: (text) => navigator.clipboard.writeText(text),
    log: batchAccessLog
});
```

Route only the exact main-world event to `open`.

- [ ] **Step 6: Edit the manifest while preserving script invariants**

Add the CSS resource after existing component styles. Add the component after
existing components and the feature after existing features. Do not sort the
list. Do not change either logger string. Inspect the manifest diff immediately:

```bash
git diff -- manifest.json
```

Reject the change if the isolated path is not exactly
`"src/shared//logger.js"` or if either vendored library moved behind
`"src/shared/logger.js"`.

- [ ] **Step 7: Run wiring and full tests**

Run:

```bash
node --test tests/popupHandlers.test.js tests/moduleArchitecture.test.js
node --test tests/*.test.js
```

Expected: all tests pass.

- [ ] **Step 8: Inspect the final manifest and source diff**

Run:

```bash
git diff --check
git diff -- manifest.json popup.js src/isolated.js src/main.js
```

Expected: no whitespace errors; only the new resource, ordered scripts, popup
card, command bridge, and composition changes appear.

- [ ] **Step 9: Commit**

```bash
git add manifest.json popup.js src/isolated.js src/main.js \
    tests/moduleArchitecture.test.js tests/popupHandlers.test.js
git commit -m "feat: wire batch lesson access tool"
```

---

### Task 7: End-to-End Verification and Manual Handoff

**Files:**
- Modify only if verification exposes a defect in files already listed above.

**Interfaces:**
- Consumes: the complete batch lesson access workflow.
- Produces: fresh automated-test evidence and a precise manual-validation
  checklist for the operator.

- [ ] **Step 1: Run the complete automated suite**

Run:

```bash
node --test tests/*.test.js
```

Expected: zero failed, cancelled, or skipped tests.

- [ ] **Step 2: Run syntax checks on every changed JavaScript file**

Run:

```bash
node --check src/shared/websocket-transport.js
node --check src/features/batch-lesson-access.js
node --check src/components/batch-lesson-access-dialog.js
node --check src/isolated.js
node --check src/main.js
node --check popup.js
```

Expected: each command exits with status 0 and emits no syntax error.

- [ ] **Step 3: Verify manifest invariants mechanically**

Run:

```bash
node -e "const m=require('./manifest.json'); const i=m.content_scripts.find(x=>x.world==='ISOLATED').js; const a=m.content_scripts.find(x=>x.world==='MAIN').js; if(i[0]!=='src/shared//logger.js'||i[1]!=='src/isolated.js'||a[0]!=='lib/jszip.min.js'||a[1]!=='lib/turndown.min.js'||a[2]!=='src/shared/logger.js'||a.at(-1)!=='src/main.js') process.exit(1)"
```

Expected: exit status 0.

- [ ] **Step 4: Inspect repository scope**

Run:

```bash
git status --short
git log --oneline -7
git diff --check HEAD~6..HEAD
```

Expected: no generated export or vendor files changed; commits are limited to
transport, feature, component, wiring, and their tests.

- [ ] **Step 5: Perform the unpacked-extension checks**

In Chrome:

1. open `chrome://extensions/`;
2. reload Edvibe Toolbox and confirm no manifest/runtime load errors;
3. open an Edvibe marathon page;
4. launch `Открыть доступ к урокам`;
5. verify every lesson starts unchecked and select/clear-all works;
6. submit malformed, duplicate, unknown, and valid emails together and confirm
   all input problems appear before any writes;
7. run a small valid batch containing an already-open pair;
8. verify confirmation counts, sequential progress, skip behavior, and Edvibe
   access state;
9. copy the report and compare it with the displayed summary;
10. rerun the same batch and confirm prior successes are skipped.

- [ ] **Step 6: Record any environment-only limitation in the handoff**

If authenticated Edvibe access or a safe test pupil is unavailable, report
exactly which manual steps were not run. Do not claim the live workflow passed
without observing it.
