# Batch Lesson Access Design

## Goal

Add an Edvibe Toolbox workflow that opens selected marathon lessons for multiple
pupils identified by email. The workflow must validate the complete batch before
making changes, skip lessons that are already open, retry only transient
connection failures, continue after individual write failures, and provide an
aggregate report.

## Scope

The first version operates on the marathon in the active Edvibe tab. It accepts
email addresses, resolves them only against that marathon's pupils, and opens
access only to lessons selected by the operator.

The feature does not:

- add pupils to a marathon;
- close lesson access;
- change lesson content or pupil progress;
- create an independent authenticated WebSocket connection;
- run from a non-marathon page;
- add Chrome permissions, a background worker, framework, or build step.

## Recorded Edvibe Operations

The supplied WebSocket recording establishes the required API operations.

Load marathon pupils:

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

Load a pupil's paginated lesson-access state:

```js
sendRequest(
    'MarathonLessonWsController',
    'GetMarathonLessonsForPupilPagination',
    'Marathons',
    {
        PupilId: pupilId,
        MarathonId: marathonId,
        SearchTerm: '',
        Page: {
            Skip: offset,
            Take: pageSize
        }
    }
);
```

Open one lesson for one marathon pupil:

```js
sendRequest(
    'MarathonLessonWsController',
    'ChangeIsOpenLessonForPupil',
    'Marathons',
    {
        IsOpen: true,
        MarathonLessonId: marathonLessonId,
        MarathonPupilId: marathonPupilId,
        MarathonId: marathonId
    }
);
```

A successful mutation must have `IsSuccess: true` at the transport level and a
`Value` of `true`. Any other response is a failure.

## User Experience

Add an `Open lesson access in batch` tool to the popup's management group. It is
available only on an Edvibe marathon page. Activating it opens an in-page dialog
and closes the popup.

The dialog follows the existing reset-lessons visual conventions but is a
separate Web Component with purpose-specific state.

### Configure

The initial dialog contains:

- a multiline email input;
- a live count of parsed unique emails;
- a scrollable lesson checklist showing lesson number and name;
- `Select all` and `Clear all` controls;
- a primary `Validate and open access` action.

Emails may be separated by commas, semicolons, or line breaks. The parser trims
surrounding whitespace, compares emails case-insensitively, removes repeated
entries, and preserves the first occurrence's order and spelling for display.
Email syntax is validated before roster matching.

All lesson checkboxes are unchecked by default. The primary action is disabled
until at least one syntactically valid email and one lesson are present.

When the dialog opens, the feature loads the complete marathon roster and uses
the first available pupil to load the complete marathon lesson catalogue from
`GetMarathonLessonsForPupilPagination`. Lesson identity is the
`MarathonLessonId`. If the marathon has no pupils or the catalogue cannot be
loaded, the dialog displays an initialization error and makes no mutation
available.

### Validate and Prepare

Starting the workflow locks the inputs so the eventual execution plan matches
the displayed selection. No mutation occurs in this phase.

The feature:

1. parses, normalizes, and deduplicates the submitted emails;
2. validates every email's syntax;
3. waits for and uses the complete cached roster loaded during initialization,
   without stopping early after a match;
4. builds a case-insensitive exact-email index;
5. requires exactly one marathon pupil for every submitted email;
6. reports every malformed, missing, and ambiguous email together;
7. loads every lesson-access page for every resolved pupil;
8. verifies that every selected `MarathonLessonId` exists for every pupil;
9. classifies each pupil/lesson pair as `alreadyOpen` or `needsOpening`.

Malformed, missing, or ambiguous emails block access-state preflight. A
preflight request failure or inconsistent lesson set also blocks all writes.
The dialog returns to an editable state and displays the complete set of
problems.

### Confirm

After successful preflight, the dialog presents the exact plan:

```text
12 users matched
4 lessons selected
37 accesses need opening
11 are already open and will be skipped
```

The operator must explicitly confirm before the feature issues the first write.
If every selected pair is already open, the tool skips confirmation and
finishes with a no-change summary.

### Execute

Execution is sequential and preserves a short delay between writes to avoid
bursty WebSocket traffic. Only `needsOpening` pairs produce requests.

Inputs and close actions stay locked during execution. Progress shows:

- completed planned writes out of total planned writes;
- the current email and lesson name;
- running success and failure counts;
- the number of already-open pairs skipped during preflight.

A failed write does not stop subsequent pairs. An unexpected internal error
that indicates invalid workflow state stops new writes and produces a
partial-run summary rather than continuing with potentially corrupted state.

### Summary

The final view contains:

- unique emails requested;
- pupils matched;
- lessons selected;
- accesses opened;
- already-open accesses skipped;
- failed accesses;
- total request attempts.

Failures identify the email, lesson, number of attempts, error category, and
final message. They do not include full pupil objects or server payloads.

`Copy report` copies a plain-text operational report. `Run another batch` clears
emails, lesson selections, progress, and results while retaining the loaded
marathon roster and lesson catalogue. `Close` becomes available again.

Rerunning a completed batch is safe because preflight classifies previously
successful pairs as `alreadyOpen`.

## Architecture

The feature follows the existing isolated-world and main-world separation:

```text
popup.js
  OPEN_BATCH_LESSON_ACCESS
        |
        v
src/isolated.js
  EDVIBE_TOOLBOX_OPEN_BATCH_LESSON_ACCESS
        |
        v
src/main.js
  batchLessonAccessFeature.open()
        |
        +--> WebSocket transport
        +--> operation guard
        +--> batch access dialog
```

### `src/features/batch-lesson-access.js`

Add a UMD-style feature module matching the existing feature modules. It owns:

- marathon ID parsing;
- email parsing, normalization, and validation;
- roster and lesson pagination;
- exact email resolution;
- access-state preflight and execution-plan construction;
- transient retry behavior;
- sequential write execution;
- result aggregation and report formatting;
- orchestration of dialog states.

The module exposes pure helpers where practical so parsing, matching,
classification, retry, and aggregation can be tested without a browser.

Suggested factory:

```js
createBatchLessonAccessFeature({
    sendRequest,
    getConnectionState,
    wait,
    canStart,
    onActiveChange,
    createDialog,
    log
}) // => { open, isRunning }
```

The feature registers with the existing operation guard under a distinct
`batch-access` operation. It may not run concurrently with export or reset
workflows.

### `src/components/batch-lesson-access-dialog.js`

Add a custom element with a shadow root. The component owns rendering, focus,
selection interaction, confirmation interaction, and semantic custom events.
It receives data and status from the feature and does not parse emails, call the
transport, classify errors, or construct reports.

The component has explicit states:

- `initializing`;
- `configure`;
- `validating`;
- `confirm`;
- `executing`;
- `validation-error`;
- `complete`;
- `partial-complete`.

### `src/components/batch-lesson-access-dialog.css`

Keep all component presentation in this dedicated stylesheet. JavaScript may
toggle semantic classes and attributes but must not assign presentation styles.
Expose the stylesheet through `web_accessible_resources`.

### `src/shared/websocket-transport.js`

Extend transport errors with stable machine-readable metadata while preserving
existing human-readable messages:

```js
{
    code,
    controller,
    method,
    requestId,
    serverErrorCode,
    cause
}
```

The relevant error codes are:

- `WS_UNAVAILABLE`: no active open socket;
- `REQUEST_TIMEOUT`: no correlated response before the timeout;
- `SEND_FAILED`: sending failed because of socket/connection state;
- `SERVER_REJECTED`: a correlated response had `IsSuccess !== true`;
- `INVALID_RESPONSE`: a feature received a structurally invalid or unconfirmed
  successful response.

The transport should also expose a read-only connection-state method so retry
logic can distinguish an open socket from a disconnected page without touching
transport internals. Existing callers continue to receive `Error` instances and
do not require behavior changes.

### `src/main.js`

`main.js` remains the composition root. It creates the feature with the shared
transport and operation guard, creates a scoped `BatchAccess` logger, and routes
`EDVIBE_TOOLBOX_OPEN_BATCH_LESSON_ACCESS` to the feature.

No parsing, pagination, retry, mutation, or rendering logic belongs in
`main.js`.

### `src/isolated.js` and `popup.js`

Add one minimal trusted command path:

```text
OPEN_BATCH_LESSON_ACCESS
    -> EDVIBE_TOOLBOX_OPEN_BATCH_LESSON_ACCESS
```

The isolated-world message includes only the command type and component
stylesheet URL. Emails, roster data, lesson state, and results remain in the
page world and are not stored in `chrome.storage`.

Add the popup card to the management group with a marathon-page requirement and
`closeOnSuccess: true`.

### `manifest.json`

Add the component stylesheet to `web_accessible_resources` and include the new
component and feature scripts in the `MAIN` content-script list. Preserve the
established dependency order:

1. shared modules;
2. component modules;
3. feature modules;
4. `src/main.js`.

## Pagination and Validation

Roster pagination follows `Value.Page.Count`, uses the accumulated item count
as the next `Skip`, and rejects malformed totals, non-array items, empty pages
before the reported total, or totals that become inconsistent.

Pupil lesson pagination follows the nested `Page` request shape recorded for
`GetMarathonLessonsForPupilPagination`. It likewise loads until the accumulated
item count reaches `Value.Page.Count` and rejects premature empty or malformed
pages.

Duplicate pupil rows with the same email are not silently collapsed. An email
resolving to more than one `MarathonPupilId` is ambiguous and blocks the batch.

For every resolved pupil, preflight requires exactly one entry for each selected
`MarathonLessonId`. A missing or duplicate selected lesson is inconsistent data
and blocks all writes. Non-selected lessons do not affect the plan.

`IsOpen === true` means `alreadyOpen`. Any other boolean value means
`needsOpening`. A missing or non-boolean `IsOpen` is an invalid response and
blocks all writes.

## Error Classification and Retry

Only these categories are transient:

- `WS_UNAVAILABLE`;
- `REQUEST_TIMEOUT`;
- `SEND_FAILED` when the cause indicates socket or connection loss.

`SERVER_REJECTED`, `INVALID_RESPONSE`, email validation failures, permission
failures, authorization failures, validation failures, and ordinary
server-declared errors are permanent and are never retried. The feature does
not infer that an Edvibe server error is retryable from a numeric server error
code.

The retry policy applies to preflight reads and mutation writes:

1. attempt immediately;
2. after a transient failure, wait 1 second and attempt again;
3. after another transient failure, wait 3 seconds and make a final attempt.

There are at most three total attempts. Before retrying, inspect transport
connection state. The feature does not construct or reconnect WebSockets; the
Edvibe page owns reconnection. If no open socket exists when an attempt is due,
that attempt is recorded as `WS_UNAVAILABLE`.

An operation that changes from a transient to a permanent error stops retrying
immediately. Each final mutation failure records its actual attempt count and
does not prevent later planned writes.

## Logging and Data Handling

Treat email addresses and lesson data as potentially sensitive. Routine console
logs contain counts, pupil IDs, marathon lesson IDs, controller/method names,
and error categories. They do not include complete roster objects, request or
response payloads, or email lists.

The copied report contains the operator-provided emails because they are needed
to act on failures, but copying is explicit and the report excludes unrelated
pupil data.

No batch input or result is persisted. Closing the completed dialog discards
the in-memory workflow state.

## Validation

### Automated Tests

Add focused Node tests for:

- comma, semicolon, and line-break email splitting;
- trimming, case-insensitive normalization, stable deduplication, and syntax
  failures;
- exact case-insensitive roster matching;
- missing and ambiguous email aggregation;
- complete roster pagination;
- complete lesson pagination;
- malformed and prematurely exhausted pagination responses;
- collection of every validation error before rejection;
- no access-state reads after failed email resolution;
- no writes after any validation or preflight failure;
- selected lesson consistency checks;
- `alreadyOpen` classification and skipping;
- exact `ChangeIsOpenLessonForPupil` payloads;
- successful mutation requiring `Value === true`;
- transient-only retries with 1- and 3-second delays;
- a maximum of three total attempts;
- immediate failure for server-declared and invalid-response errors;
- continuation after an individual write failure;
- accurate summary counts, attempt totals, and report contents;
- dialog initialization, unchecked defaults, select-all, clear-all, locking,
  confirmation, progress, failure display, and reset behavior;
- popup, isolated-world, main-world, stylesheet, and manifest wiring;
- preservation of existing manifest script ordering.

Existing transport and feature tests must continue to pass after typed error
metadata is introduced.

### Manual Validation

1. Reload the unpacked extension and confirm Chrome reports no manifest errors.
2. Open a marathon page and launch the batch access tool from the popup.
3. Confirm lessons load, all are unchecked, and selection controls work.
4. Submit a mixture of valid, malformed, duplicate, and unknown emails; verify
   every problem is reported and no access changes occur.
5. Submit a valid small batch containing at least one already-open pair; verify
   it is skipped and the confirmation count is correct.
6. Confirm the batch and verify successful pairs become open in Edvibe.
7. If practical, interrupt connectivity to verify timeout/disconnection retries
   and continuation after an exhausted failure.
8. Verify the final summary and copied report match the observed results.
9. Rerun the same batch and verify all previously successful pairs are skipped.

## Acceptance Criteria

- The feature is available only on Edvibe marathon pages.
- Operators can enter multiple delimited emails and select any non-empty lesson
  subset, with no lessons selected by default.
- Every submitted email is validated against the complete marathon roster
  before any write.
- All validation errors are shown together.
- Every selected pupil/lesson state is read successfully before any write.
- Already-open pairs issue no mutation request.
- The operator sees and confirms exact pending and skipped counts.
- Only transient connection failures receive at most three total attempts with
  1- and 3-second delays.
- Permanent server, validation, authorization, and response-shape errors are not
  retried.
- A failed access write does not stop remaining writes.
- The final summary accurately reports successes, skips, failures, attempts, and
  actionable per-pair errors.
- The implementation preserves the Manifest V3 execution-world split, operation
  guard, throttled request behavior, sensitive-data handling, and Web Component
  styling rules.
