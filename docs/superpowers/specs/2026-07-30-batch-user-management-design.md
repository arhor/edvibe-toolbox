# Batch User Management Design

## Goal

Add an Edvibe Toolbox workflow that lets an operator paste multiple user
emails, review the resolved marathon users, optionally remove their curators,
optionally delete them, and see an independent result for every row.

## Scope

The first version operates on the marathon in the active Edvibe tab. It accepts
email addresses, resolves them against one cached full-marathon roster, and
performs only the operations explicitly selected for each matched user.

The feature does not:

- assign a new curator;
- delete users outside the active marathon;
- delete a user when selected curator removal fails for that same row;
- run from a non-marathon page;
- create a separate authenticated WebSocket connection;
- add Chrome permissions, a background worker, a framework, or a build step.

## Recorded Edvibe Operations

The supplied recording contains exploratory moderator lookups for several
different users, followed by the mutation sequence for one user. It establishes
these operations:

Load the marathon roster once and resolve the submitted emails locally:

```js
sendRequest(
    'MarathonPupilsWsController',
    'GetMarathonPupils',
    'Marathons',
    {
        MarathonId: marathonId,
        Skip: offset,
        Take: pageSize
    }
);
```

Remove all curators from one marathon user:

```js
sendRequest(
    'MarathonPupilsWsController',
    'AddModeratorsToPupil',
    'Marathons',
    {
        MarathonId: marathonId,
        MarathonPupilId: marathonPupilId,
        SelectedModeratorsIds: []
    }
);
```

The mutation is successful only when the returned `Value.IsSuccess` is
`true`. The roster's `Moderators` array is used to determine whether removal
is needed. When it is empty, curator removal is an immediate successful no-op
and no mutation is sent.

Delete one marathon user:

```js
sendRequest(
    'MarathonPupilsWsController',
    'DeleteMarathonPupil',
    'Marathons',
    { MarathonPupilId: marathonPupilId }
);
```

The deletion is successful only when the response has a successful transport
status and `Value === marathonPupilId`.

## User Experience

Add a `Управление пользователями` tool to the popup management group. It is
available only on an Edvibe marathon page. Activating it opens an in-page modal
and closes the popup.

### Configure and check

The initial modal contains:

- a multiline email input;
- a live count of unique valid and malformed email entries;
- a primary `Проверить пользователей` action.

Emails may be separated by commas, semicolons, or line breaks. Parsing trims
whitespace, compares case-insensitively, removes duplicates, and preserves the
first occurrence's spelling and order. The same conservative syntax pattern as
batch lesson access is used:

```js
/^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

Checking loads the complete roster before building the table. An empty roster
is a fatal initialization error. Malformed, missing, and ambiguous entries are
retained as visible rows rather than discarded.

### Review table

After checking, the modal shows a scrollable four-column table:

1. `Пользователь` — name and email for a match, or the submitted email and
   resolution problem for a non-actionable row;
2. `Снять куратора` — an unchecked checkbox and a small `Выбрать все` link in
   the header;
3. `Удалить пользователя` — an unchecked checkbox and its own `Выбрать все`
   link in the header;
4. `Результат` — current state before execution and the final row result.

All operation checkboxes are unchecked by default. Missing and ambiguous rows
remain visible but have disabled operation checkboxes. The dedicated
`Начать обработку` button is disabled until at least one actionable operation
is selected. A matched user with no current curator has an enabled unassign
checkbox, but selecting it will record an immediate no-op success.

### Execution and completion

During execution, inputs, row checkboxes, selection links, close, and restart
controls are locked. A progress bar shows completed actionable rows out of the
total and a short current message containing the email and operation.

When execution ends, the same table remains visible and each row displays its
result. The modal also offers `Запустить другую группу`, which clears the
email input, selections, progress, and results while keeping the loaded roster
available for a new check. Close becomes available after checking errors or
completion, but not during execution.

## Row Execution Semantics

Rows are processed sequentially. A row with no selected operation is not part
of the execution total. A row with selected operations follows this exact
order:

1. If curator removal is selected and the roster reports at least one
   moderator, call `AddModeratorsToPupil` with an empty ID list.
2. If curator removal is selected and no moderator is present, record a
   successful no-op without a request.
3. If curator removal fails after retry exhaustion, mark the row failed and do
   not call `DeleteMarathonPupil`.
4. If deletion is selected and curator removal succeeded or was a no-op, call
   `DeleteMarathonPupil`.
5. Store the row's operation statuses and continue with the next row.

One row failure never stops another row. Unexpected errors are converted into a
concise row-level failure so the batch remains resilient. Progress callbacks
are isolated from mutation bookkeeping so a rendering error cannot report a
successful write as unfinished.

## Retry and Error Handling

The feature uses the batch lesson access retry policy: at most three total
attempts, with waits of 1,000 ms and 3,000 ms between attempts, and retries
only for typed transient connection failures (`WS_UNAVAILABLE`,
`REQUEST_TIMEOUT`, and eligible `SEND_FAILED`). Server rejection,
`INVALID_RESPONSE`, authorization, permission, validation, and other ordinary
errors are not retried.

Each operation result records its status, attempt count, error code, and concise
message. The row result distinguishes curator-removal failure, delete failure,
successful no-op removal, successful removal, and successful deletion. No
full user objects, curator lists, or request payloads are logged or displayed.

## Architecture

The feature follows the existing world separation:

```text
popup.js
  OPEN_BATCH_USER_MANAGEMENT
        |
        v
src/isolated.js
  EDVIBE_TOOLBOX_OPEN_BATCH_USER_MANAGEMENT
        |
        v
src/main.js
  batchUserManagementFeature.open()
        |
        +--> WebSocket transport
        +--> operation guard
        +--> batch-user-management-dialog
```

### `src/features/batch-user-management.js`

Add a UMD-style module that owns:

- marathon ID parsing;
- email parsing and case-insensitive deduplication;
- complete roster pagination;
- exact email resolution with missing and ambiguous outcomes;
- row-plan construction;
- typed retry behavior;
- curator no-op detection;
- sequential unassign/delete execution;
- progress snapshots, row results, and report-safe summaries;
- orchestration of dialog states.

The module exposes pure helpers where practical so request payloads, response
validation, ordering, retry behavior, and row isolation can be tested without
a browser. Its factory shape is:

```js
createBatchUserManagementFeature({
    sendRequest,
    getConnectionState,
    wait,
    canStart,
    onActiveChange,
    createDialog,
    log
}) // => { open, isRunning }
```

The feature registers with the operation guard under `batch-user-management`
and cannot run concurrently with another guarded operation.

### `src/components/batch-user-management-dialog.js`

Add a shadow-root Web Component. It owns markup, table rendering, selection
interaction, disabled/locked states, progress display, and semantic custom
events. It does not parse emails, call the transport, retry requests, or
construct operation results.

The component exposes explicit states:

- `configure`;
- `checking`;
- `review`;
- `executing`;
- `complete`;
- `partial-complete`;
- `fatal-error`.

All CSS lives in `src/components/batch-user-management-dialog.css` and the
stylesheet is loaded through the component's shadow-root link.

## Files

Create:

- `src/features/batch-user-management.js`;
- `src/components/batch-user-management-dialog.js`;
- `src/components/batch-user-management-dialog.css`;
- focused feature and dialog tests.

Modify:

- `popup.js` for the tool definition;
- `src/isolated.js` for the popup command bridge;
- `src/main.js` for feature construction and routing;
- `manifest.json` for the ordered component/feature scripts and web-accessible
  stylesheet;
- architecture, popup, and bridge tests for the new command and manifest
  invariants.

Do not modify vendored libraries or generated export artifacts.

## Verification

The implementation is complete only after:

- focused feature tests pass;
- focused dialog and bridge tests pass;
- the full `node --test tests/*.test.js` suite passes;
- JavaScript files parse successfully with Node syntax checks;
- the final manifest preserves the isolated logger double slash and main-world
  dependency order;
- manual validation confirms the popup card, email checking, select-all links,
  no-op curator removal, unassign-before-delete suppression, independent row
  failures, progress updates, and final table results on an Edvibe marathon.
