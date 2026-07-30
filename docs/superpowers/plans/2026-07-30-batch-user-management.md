# Batch User Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a marathon-only batch workflow for reviewing emails, unassigning curators, deleting users, and displaying resilient per-row results.

**Architecture:** Add a dedicated UMD feature module for roster resolution, row planning, retries, and sequential execution, plus a shadow-root Web Component for the modal. Wire it through the existing popup/isolated/main bridge and operation guard, preserving the existing manifest dependency order.

**Tech Stack:** Manifest V3 Chrome extension, vanilla JavaScript, Web Components, intercepted WebSocket transport, Node.js built-in `node:test`.

## Global Constraints

- Resolve submitted emails against one complete cached marathon roster.
- Keep unmatched and ambiguous emails visible as non-actionable table rows.
- Keep all operation checkboxes unchecked by default.
- Treat an already-unassigned curator removal as a successful no-op with no mutation request.
- Execute curator removal before deletion; skip deletion when curator removal fails.
- Isolate row failures so one row never stops the remaining rows.
- Retry only `WS_UNAVAILABLE`, `REQUEST_TIMEOUT`, and eligible `SEND_FAILED` errors, with delays of exactly 1,000 ms and 3,000 ms and at most three total attempts.
- Keep all dynamic interface markup in a Web Component and all presentation rules in its dedicated CSS file.
- Do not add permissions, a build step, a background worker, or a framework.
- Do not edit vendored libraries or generated export files.
- Preserve `src/shared//logger.js` in the isolated script list and keep main-world libraries/logger/dependency order unchanged.

---

## File Structure

### New files

- `src/features/batch-user-management.js`: pure helpers, retrying operation execution, and feature orchestration.
- `src/components/batch-user-management-dialog.js`: modal Web Component, table interactions, states, and custom events.
- `src/components/batch-user-management-dialog.css`: modal and table presentation.
- `tests/batchUserManagement.test.js`: parser, roster resolution, planning, execution, retry, and row-isolation tests.
- `tests/batchUserManagementDialog.test.js`: Web Component rendering and interaction tests.

### Modified files

- `popup.js`: add the management tool definition.
- `src/isolated.js`: accept and relay the new popup command.
- `src/main.js`: load and construct the feature, then route its page-world event.
- `manifest.json`: add the CSS resource and ordered component/feature scripts.
- `tests/popupHandlers.test.js`: assert the new popup command, availability, bridge event, and stylesheet URL.
- `tests/moduleArchitecture.test.js`: assert manifest order and main-world composition.

---

### Task 1: Batch resolution and row planning

**Files:**
- Create: `tests/batchUserManagement.test.js`
- Create: `src/features/batch-user-management.js`

**Interfaces:**
- Produces `parseMarathonId(url) => number | null`.
- Produces `parseEmailInput(value) => { entries: Array<{ input, normalized }>, malformed: string[] }`.
- Produces `appendPage(items, total, nextItems, nextTotal, label) => { items, total }`.
- Produces `loadAllPupils({ sendRequest, marathonId, pageSize = 50 }) => Promise<Pupil[]>`.
- Produces `resolveUsersByEmail(entries, pupils) => { rows, errors }`.
- Produces `buildUserPlan({ rows }) => UserRow[]`, where each row has `email`, `normalizedEmail`, `pupil`, `marathonPupilId`, `hasCurator`, `unassignSelected: false`, `deleteSelected: false`, and `result: { status: 'pending', message: 'Not started' }`.

- [ ] **Step 1: Write failing tests for URL and email parsing**

Add tests with the existing `node:test` and `node:assert/strict` style:

```js
test('parseEmailInput preserves first spelling and removes case-insensitive duplicates', () => {
    assert.deepEqual(
        parseEmailInput(' First@Example.com, second@example.com\nfirst@example.com ; bad '),
        {
            entries: [
                { input: 'First@Example.com', normalized: 'first@example.com' },
                { input: 'second@example.com', normalized: 'second@example.com' }
            ],
            malformed: ['bad']
        }
    );
});

test('parseMarathonId accepts only marathon path IDs', () => {
    assert.equal(parseMarathonId('https://edvibe.com/cabinet/marathon/18508/students'), 18508);
    assert.equal(parseMarathonId('https://edvibe.com/cabinet/marathons'), null);
});
```

- [ ] **Step 2: Run the parser tests and verify the expected missing-export failure**

Run:

```bash
node --test tests/batchUserManagement.test.js
```

Expected: FAIL because `src/features/batch-user-management.js` and its exported helpers do not exist.

- [ ] **Step 3: Implement the minimal UMD module and parser**

Create the module using the repository pattern:

```js
(function initializeBatchUserManagement(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.EdVibeBatchUserManagement = factory();
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createModule() {
    'use strict';

    // Keep pure helpers here; orchestration is added in later tasks.
});
```

Implement the exact parser separators `[,;\r\n]+`, the existing email pattern `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, stable case-insensitive deduplication, and `parseMarathonId` matching `/\/marathon\/(\d+)(?:\/|$)/`.

- [ ] **Step 4: Write failing tests for complete roster pagination**

Assert exact request values and accumulation until `Page.Count` is reached:

```js
test('loadAllPupils requests every roster page', async () => {
    const calls = [];
    const pupils = await loadAllPupils({
        marathonId: 18508,
        pageSize: 2,
        sendRequest: async (controller, method, project, value) => {
            calls.push({ controller, method, project, value });
            return value.Skip === 0
                ? { Value: { Items: [{ MarathonPupilId: 1 }, { MarathonPupilId: 2 }], Page: { Count: 3 } } }
                : { Value: { Items: [{ MarathonPupilId: 3 }], Page: { Count: 3 } } };
        }
    });

    assert.deepEqual(pupils.map((pupil) => pupil.MarathonPupilId), [1, 2, 3]);
    assert.deepEqual(calls.map((call) => call.value), [
        { MarathonId: 18508, Skip: 0, Take: 2 },
        { MarathonId: 18508, Skip: 2, Take: 2 }
    ]);
});
```

Also test that inconsistent counts, non-arrays, and an empty page before the expected total throw `INVALID_RESPONSE`.

- [ ] **Step 5: Run the pagination tests to verify failure**

Run:

```bash
node --test tests/batchUserManagement.test.js
```

Expected: FAIL because `loadAllPupils` is not implemented.

- [ ] **Step 6: Implement pagination and exact email resolution**

Use `GetMarathonPupils` with `{ MarathonId, Skip, Take }`, and validate each page before appending. Build a case-insensitive map from `pupil.Email`. For each input entry, emit one row:

```js
{
    email: entry.input,
    normalizedEmail: entry.normalized,
    pupil: candidates.length === 1 ? candidates[0] : null,
    status: candidates.length === 1 ? 'matched' : candidates.length === 0 ? 'missing' : 'ambiguous',
    message: candidates.length === 1 ? '' : candidates.length === 0
        ? `No marathon pupil found for ${entry.input}.`
        : `Multiple marathon pupils found for ${entry.input}.`
}
```

Keep the row order equal to the submitted deduplicated email order and do not expose full pupil objects in errors.

- [ ] **Step 7: Write and run planning tests, then implement `buildUserPlan`**

Test that matched rows copy `MarathonPupilId`, detect `hasCurator` only from an array-valued `Moderators` with length greater than zero, and initialize both selection flags to `false`. Test that missing and ambiguous rows have no ID and are not actionable. Run the focused file and require PASS before continuing.

Export all helpers added in this task and keep the module loadable in Node without browser globals.

---

### Task 2: Retrying mutations and resilient row execution

**Files:**
- Modify: `tests/batchUserManagement.test.js`
- Modify: `src/features/batch-user-management.js`

**Interfaces:**
- Produces `runWithRetry(operation, { wait, getConnectionState, retryDelays = [1000, 3000] }) => Promise<{ value, attempts }>`.
- Produces `executeUserPlan({ marathonId, rows, sendRequest, wait, getConnectionState, onProgress }) => Promise<{ rows, completed, total, successes, failures, attempts }>`.
- Each progress snapshot is `{ completed, total, successes, failures, current: { email, operation } }`.
- Each output row contains per-operation statuses and a structured `result: { status, message }` suitable for concise table rendering.

- [ ] **Step 1: Write failing tests for retry behavior**

Use typed errors with `code` and a live `getConnectionState` callback:

```js
test('runWithRetry retries transient failures twice and returns total attempts', async () => {
    let attempts = 0;
    const waits = [];
    const result = await runWithRetry(async () => {
        attempts += 1;
        if (attempts < 3) {
            const error = new Error('temporary');
            error.code = 'REQUEST_TIMEOUT';
            throw error;
        }
        return 'ok';
    }, {
        wait: async (delay) => waits.push(delay),
        getConnectionState: () => ({ isOpen: true })
    });

    assert.deepEqual(result, { value: 'ok', attempts: 3 });
    assert.deepEqual(waits, [1000, 3000]);
});
```

Add a non-transient rejection test that asserts one attempt and a transient exhaustion test that asserts three attempts and the final error’s `attempts` property.

- [ ] **Step 2: Run retry tests and verify failure**

Run:

```bash
node --test tests/batchUserManagement.test.js
```

Expected: FAIL because `runWithRetry` is not implemented.

- [ ] **Step 3: Implement minimal retry logic**

Use the batch lesson access policy exactly: retry only `WS_UNAVAILABLE`, `REQUEST_TIMEOUT`, and `SEND_FAILED` when its cause indicates a closed connection; before retry attempts after the first, require `getConnectionState().isOpen`. Attach `attempts` to terminal errors.

- [ ] **Step 4: Write failing tests for exact mutation payloads and response validation**

Add one matched row with both operations selected and a curator. Assert calls are exactly:

```js
[
    {
        controller: 'MarathonPupilsWsController',
        method: 'AddModeratorsToPupil',
        project: 'Marathons',
        value: {
            MarathonId: 18508,
            MarathonPupilId: 22,
            SelectedModeratorsIds: []
        }
    },
    {
        controller: 'MarathonPupilsWsController',
        method: 'DeleteMarathonPupil',
        project: 'Marathons',
        value: { MarathonPupilId: 22 }
    }
]
```

Return `{ Value: { IsSuccess: true, Status: 0 } }` for the first operation and `{ Value: 22 }` for the second. Add tests that `{ Value: { IsSuccess: false } }` and `{ Value: 21 }` become `INVALID_RESPONSE` operation failures.

- [ ] **Step 5: Run mutation tests and verify failure**

Run the focused test file and confirm it fails because `executeUserPlan` is not implemented.

- [ ] **Step 6: Implement operation helpers and sequential row execution**

Implement separate internal functions for curator removal and deletion. The row loop must:

```js
if (row.unassignSelected) {
    if (row.hasCurator) {
        await removeCuratorWithRetry(row);
    } else {
        row.unassign = { status: 'noop', attempts: 0 };
    }
}
if (row.deleteSelected) {
    await deleteUserWithRetry(row);
}
```

Wrap each row in a catch that records a row-level failure and continues. If unassignment fails, set deletion to `skipped` with a reason and do not call the delete method. Count every request attempt, including retries; count a no-op row as completed but with zero attempts. Invoke `onProgress` before and after each actionable row using the immutable snapshot shape. Do not let an `onProgress` exception replace a mutation result; catch rendering errors around the callback.

- [ ] **Step 7: Write failing tests for no-op, dependency, isolation, and progress**

Add this row fixture and cover all behaviors with independent tests:

```js
function createRow(overrides = {}) {
    return {
        email: 'user@example.com',
        normalizedEmail: 'user@example.com',
        pupil: { MarathonPupilId: 22, Email: 'user@example.com', Name: 'User' },
        marathonPupilId: 22,
        hasCurator: true,
        unassignSelected: false,
        deleteSelected: false,
        result: { status: 'pending', message: 'Not started' },
        ...overrides
    };
}
```

Implement the tests concretely as follows:

```js
test('unassign without a curator is a successful no-op and still permits deletion', async () => {
    const calls = [];
    const result = await executeUserPlan({
        marathonId: 18508,
        rows: [createRow({ hasCurator: false, unassignSelected: true, deleteSelected: true })],
        sendRequest: async (controller, method, project, value) => {
            calls.push({ controller, method, project, value });
            return { Value: 22 };
        },
        wait: async () => {},
        getConnectionState: () => ({ isOpen: true })
    });

    assert.deepEqual(calls.map((call) => call.method), ['DeleteMarathonPupil']);
    assert.equal(result.rows[0].unassign.status, 'noop');
    assert.equal(result.rows[0].delete.status, 'success');
});

test('failed curator removal skips deletion for that row', async () => {
    const methods = [];
    const result = await executeUserPlan({
        marathonId: 18508,
        rows: [createRow({ unassignSelected: true, deleteSelected: true })],
        sendRequest: async (_controller, method) => {
            methods.push(method);
            const error = new Error('permission denied');
            error.code = 'SERVER_REJECTED';
            throw error;
        },
        wait: async () => {},
        getConnectionState: () => ({ isOpen: true })
    });

    assert.deepEqual(methods, ['AddModeratorsToPupil']);
    assert.equal(result.rows[0].unassign.status, 'failed');
    assert.equal(result.rows[0].delete.status, 'skipped');
    assert.equal(result.failures, 1);
});

test('a failed row does not stop a later row', async () => {
    const result = await executeUserPlan({
        marathonId: 18508,
        rows: [
            createRow({ email: 'failed@example.com', unassignSelected: true }),
            createRow({
                email: 'deleted@example.com',
                normalizedEmail: 'deleted@example.com',
                pupil: { MarathonPupilId: 23, Email: 'deleted@example.com', Name: 'Deleted' },
                marathonPupilId: 23,
                hasCurator: false,
                deleteSelected: true
            })
        ],
        sendRequest: async (_controller, method, _project, value) => {
            if (method === 'AddModeratorsToPupil') {
                const error = new Error('write failed');
                error.code = 'SERVER_REJECTED';
                throw error;
            }
            return { Value: value.MarathonPupilId };
        },
        wait: async () => {},
        getConnectionState: () => ({ isOpen: true })
    });

    assert.equal(result.rows[0].result.status, 'failed');
    assert.equal(result.rows[1].delete.status, 'success');
    assert.equal(result.successes, 1);
    assert.equal(result.failures, 1);
});

test('progress reports current operation and completed row counts', async () => {
    const progress = [];
    await executeUserPlan({
        marathonId: 18508,
        rows: [createRow({ email: 'delete@example.com', hasCurator: false, deleteSelected: true })],
        sendRequest: async () => ({ Value: 22 }),
        wait: async () => {},
        getConnectionState: () => ({ isOpen: true }),
        onProgress: (snapshot) => progress.push(snapshot)
    });

    assert.deepEqual(progress.map((snapshot) => snapshot.completed), [0, 1]);
    assert.deepEqual(progress.map((snapshot) => snapshot.current), [
        { email: 'delete@example.com', operation: 'delete' },
        { email: 'delete@example.com', operation: 'delete' }
    ]);
});
```

Use no network or browser mocks; inject `sendRequest`, `wait`, and `getConnectionState` as the production boundary.

- [ ] **Step 8: Run all feature tests and refactor only after green**

Run:

```bash
node --test tests/batchUserManagement.test.js
```

Expected: all parser, pagination, planning, retry, payload, ordering, isolation, and progress tests pass. Only after green, extract duplication in result formatting while preserving the tested interfaces.

---

### Task 3: Batch user management feature orchestration

**Files:**
- Modify: `tests/batchUserManagement.test.js`
- Modify: `src/features/batch-user-management.js`

**Interfaces:**
- Produces `createBatchUserManagementFeature({ sendRequest, getConnectionState, wait, canStart, onActiveChange, createDialog, log }) => { open, isRunning }`.
- Dialog events consumed: `edvibe-dialog-close`, `edvibe-batch-user-management-input-change`, `edvibe-batch-user-management-check`, `edvibe-batch-user-management-selection-change`, `edvibe-batch-user-management-start`, and `edvibe-batch-user-management-restart`.
- Dialog methods consumed: `configure`, `showChecking`, `showReview`, `showValidationErrors`, `showExecution`, `showComplete`, `showFatalError`.

- [ ] **Step 1: Write failing orchestration tests**

Test that `open`:

- refuses to run while `canStart()` is false;
- parses the marathon ID from the current URL;
- activates the operation guard with `batch-user-management`;
- loads the roster once and calls `dialog.showReview` with one row per submitted email;
- releases the guard on close and on initialization failure.

Test that the check action blocks malformed/empty input without mutation, and that the start action passes only selected actionable rows to `executeUserPlan`.

- [ ] **Step 2: Run orchestration tests and verify failure**

Run:

```bash
node --test tests/batchUserManagement.test.js
```

Expected: FAIL because `createBatchUserManagementFeature` and the orchestration states are not implemented.

- [ ] **Step 3: Implement orchestration and operation guard integration**

Follow the existing batch lesson access lifecycle. Refuse duplicate dialogs using the active overlay ID, validate the marathon URL, create/append the dialog, load the roster, and surface fatal errors without enabling mutations. During `open`, register listeners before appending the dialog. On start, lock the dialog, execute the selected rows, pass progress snapshots through to `dialog.showExecution`, then render the returned row results. Keep the cached roster for `restart` and release the guard only when the dialog closes.

- [ ] **Step 4: Run focused feature tests**

Run:

```bash
node --test tests/batchUserManagement.test.js
```

Expected: PASS with zero failures.

---

### Task 4: User-management modal Web Component

**Files:**
- Create: `tests/batchUserManagementDialog.test.js`
- Create: `src/components/batch-user-management-dialog.js`
- Create: `src/components/batch-user-management-dialog.css`

**Interfaces:**
- Produces custom element `edvibe-toolbox-batch-user-management-dialog`.
- Produces overlay ID `edvibe-toolbox-batch-user-management-overlay`.
- Emits `edvibe-batch-user-management-input-change` with `{ emailInput }`.
- Emits `edvibe-batch-user-management-check` with `{ emailInput }`.
- Emits `edvibe-batch-user-management-selection-change` with `{ rows }` whenever a checkbox changes or a select-all link is used.
- Emits `edvibe-batch-user-management-start` with `{ rows }`.
- Emits `edvibe-batch-user-management-restart` and `edvibe-dialog-close`.

- [ ] **Step 1: Write failing template and initial-state tests**

Use the existing `batchLessonAccessDialog.test.js` fake DOM harness pattern. Assert registration, template controls, four table headings, two select-all links, progress bar, status, check button, start button, restart button, and close button. Assert all row operation checkboxes are initially unchecked and the start button is disabled.

- [ ] **Step 2: Run dialog tests and verify failure**

Run:

```bash
node --test tests/batchUserManagementDialog.test.js
```

Expected: FAIL because the component files and registration do not exist.

- [ ] **Step 3: Implement the shadow-root template and state model**

Create a template with a linked stylesheet, email textarea, live counts, configure/check controls, review table container, live status, progress element, validation/results region, start/restart/close buttons. Keep all dynamic row and table markup generated with `document.createElement`; do not assign inline styles or create inline `<style>` tags.

Implement modes `configure`, `checking`, `review`, `executing`, `complete`, `partial-complete`, and `fatal-error`. Keep rows as copied data objects in the component; selection changes update only `unassignSelected` and `deleteSelected` for actionable rows.

- [ ] **Step 4: Write failing selection and locking tests**

Assert that:

- each column’s select-all link selects only actionable rows in that column;
- repeating the link clears that column when all actionable rows are already selected;
- missing/ambiguous rows cannot be selected;
- the start button enables after one selection and emits the complete selected row data;
- checking and execution lock inputs and checkboxes;
- restart clears input, selections, results, and progress but allows a new check.

- [ ] **Step 5: Run selection tests and verify failure**

Run the focused dialog file and confirm the expected failures identify missing selection/rendering behavior.

- [ ] **Step 6: Implement rendering, selection, progress, and result states**

Render each row with safe `textContent`, not interpolated HTML. Render a matched user’s name and email, a problem row’s submitted email and message, disabled checkboxes where appropriate, and the current/final result text. `showExecution` must update `progress.max`, `progress.value`, current message, and the table’s row result. `showComplete` must preserve the table and render all final statuses. The close control must be disabled in `checking` and `executing`.

- [ ] **Step 7: Run focused dialog tests**

Run:

```bash
node --test tests/batchUserManagementDialog.test.js
```

Expected: PASS with zero failures.

---

### Task 5: Popup, bridge, main-world, and manifest wiring

**Files:**
- Modify: `popup.js`
- Modify: `src/isolated.js`
- Modify: `src/main.js`
- Modify: `manifest.json`
- Modify: `tests/popupHandlers.test.js`
- Modify: `tests/moduleArchitecture.test.js`

**Interfaces:**
- Popup command: `OPEN_BATCH_USER_MANAGEMENT`.
- Isolated event: `EDVIBE_TOOLBOX_OPEN_BATCH_USER_MANAGEMENT`.
- Main feature global: `EdVibeBatchUserManagement`.
- Main dialog global: `EdVibeBatchUserManagementDialog`.
- Operation guard name: `batch-user-management`.

- [ ] **Step 1: Write failing wiring tests**

Add assertions that:

```js
assert.match(popupScript, /id: 'batch-user-management'/);
assert.match(popupScript, /command: 'OPEN_BATCH_USER_MANAGEMENT'/);
assert.match(isolatedScript, /OPEN_BATCH_USER_MANAGEMENT/);
assert.match(isolatedScript, /EDVIBE_TOOLBOX_OPEN_BATCH_USER_MANAGEMENT/);
```

Extend manifest tests to require:

- `src/components/batch-user-management-dialog.css` in `web_accessible_resources`;
- `src/components/batch-user-management-dialog.js` before `src/features/batch-user-management.js`;
- the feature before `src/main.js`;
- `src/shared//logger.js` unchanged in the isolated list;
- all `lib/*.js` before the main logger and all project modules after it.

- [ ] **Step 2: Run wiring tests and verify failure**

Run:

```bash
node --test tests/popupHandlers.test.js tests/moduleArchitecture.test.js
```

Expected: FAIL because the command, bridge, manifest entries, and main-world module loading do not yet exist.

- [ ] **Step 3: Add the popup card definition**

Add a management-group definition in `TOOL_DEFINITIONS`:

```js
{
    id: 'batch-user-management',
    group: 'management',
    title: 'Управление пользователями',
    description: 'Снять кураторов и удалить пользователей по списку email.',
    command: 'OPEN_BATCH_USER_MANAGEMENT',
    requirement: 'marathon',
    busyLabel: 'Открывается…',
    appearance: 'danger',
    closeOnSuccess: true
}
```

- [ ] **Step 4: Add the isolated bridge case**

Add a switch case that posts only the command and stylesheet URL:

```js
case 'OPEN_BATCH_USER_MANAGEMENT':
    window.postMessage({
        type: 'EDVIBE_TOOLBOX_OPEN_BATCH_USER_MANAGEMENT',
        stylesheetUrl: chrome.runtime.getURL(
            'src/components/batch-user-management-dialog.css'
        )
    }, '*');
    sendResponse({ status: 'success', info: 'Batch user management opened.' });
    break;
```

- [ ] **Step 5: Add ordered manifest entries and main-world construction**

In `manifest.json`, add the stylesheet resource. In the `MAIN` scripts array, place the new component after existing component dependencies and before the new feature, then place the feature immediately before `src/main.js`; leave the libraries, logger, and isolated double-slash logger unchanged.

In `src/main.js`, require both new globals, create a dedicated `batchUserManagementLog`, construct the feature with the existing transport and `operationGuard`, and route `EDVIBE_TOOLBOX_OPEN_BATCH_USER_MANAGEMENT` to `batchUserManagementFeature.open({ stylesheetUrl })`.

- [ ] **Step 6: Run wiring tests and inspect the final manifest diff**

Run:

```bash
node --test tests/popupHandlers.test.js tests/moduleArchitecture.test.js
git diff -- manifest.json src/isolated.js src/main.js popup.js
```

Expected: focused tests PASS. Reject any diff that normalizes `src/shared//logger.js`, moves a library after the main logger, or places a project module before the main logger.

---

### Task 6: Full verification and manual handoff

**Files:**
- Verify: all modified JavaScript, CSS, manifest, and test files.

- [ ] **Step 1: Run every automated test**

Run:

```bash
node --test tests/*.test.js
```

Expected: all tests pass with zero failures.

- [ ] **Step 2: Run JavaScript syntax checks**

Run:

```bash
for file in popup.js src/isolated.js src/main.js src/features/batch-user-management.js src/components/batch-user-management-dialog.js; do node --check "$file"; done
```

Expected: every command exits zero with no syntax errors.

- [ ] **Step 3: Run repository diff checks**

Run:

```bash
git diff --check
git status --short
```

Confirm the recording JSON remains unmodified/uncommitted and no vendored or generated export file is included.

- [ ] **Step 4: Manually validate the extension**

Load the repository unpacked in Chrome, reload the extension, open a marathon students page, and verify:

1. the new management card is available only on a marathon page;
2. pasted emails are counted and checked against the complete roster;
3. missing and ambiguous emails remain visible and non-actionable;
4. both select-all links affect only their own column;
5. all checkboxes start unchecked;
6. a no-curator row performs no unassign request;
7. curator removal precedes deletion;
8. failed curator removal suppresses deletion only for that row;
9. another row continues and receives its own result;
10. progress and current-operation text update during execution;
11. completed rows retain final result text in the table.

- [ ] **Step 5: Report verified results**

Report the exact automated test command and result, syntax-check result, manifest invariants, and any manual checks that could not be completed without an authenticated Edvibe page.
