# Execution history architecture

This document defines the application boundary for execution history in the MAIN runtime.
It is the design target for issue #154 and the canonical reference for later history-enabled
features.

## What execution history records

Execution history records **operations that actually started** and their outcomes.

An operation is the application-level mutation invoked after all configuration, validation,
preflight/inspection, and user confirmation have completed. Conceptually, it is a function
with an input and one of two outcomes:

```text
input -> execute -> result
                 -> error
```

History starts at the call boundary of `execute`. It does not observe or own the UI/session
lifecycle that produced the input.

The following are therefore **not execution-history events**:

- opening or closing a feature dialog;
- editing configuration;
- validation or preflight that never reaches execution;
- reviewing a plan;
- restarting configuration;
- closing the dialog or otherwise changing one's mind before execution starts.

A user cancellation before the mutation operation is invoked produces no history record.
Existing persisted `cancelled` records remain readable for schema compatibility, but new
operation wrappers do not create them.

## Terminal outcomes

New execution records use these semantic outcomes:

- `completed`: the operation returned a successful result;
- `completed_with_failures`: the operation returned normally, but its result contains one or
  more expected item-level failures, rejections, skips, or other partial outcomes;
- `interrupted`: the operation could not return normally because an unexpected/fatal error
  stopped execution. If the operation exposes a safe partial result, history records it.

Expected batch-item failures belong in a normal result and do not become thrown errors merely
for history classification.

## Cross-cutting integration

Execution history is an aspect-like application concern implemented as an explicit function
wrapper/decorator, not through dialog method replacement and not through feature lifecycle
callbacks.

The intended shape is:

```js
const executeWithHistory = withExecutionHistory({
    execute,
    persistExecution,
    buildHistoryInput,
    onPersistence,
    now,
    logger
});

const result = await executeWithHistory(input);
```

The wrapped function preserves the business operation's observable contract:

- the same input is passed to `execute`;
- the same result is returned;
- the same execution error is rethrown;
- history serialization or persistence failures never replace the operation result/error.

The wrapper owns only execution timing and the `result | error` observation. Feature-specific
serialization remains feature-owned through `buildHistoryInput({ input, result, error,
startedAt, completedAt })` or an equivalent narrow mapper.

## Ownership

| Concern | Owner |
| --- | --- |
| Mutation/preflight/business rules | Feature/application operation |
| Execution boundary instrumentation | MAIN application history wrapper |
| Mapping operation input/result/error to an execution record | Feature-specific pure history module |
| Record validation/schema and retention rules | MAIN application history modules |
| IndexedDB, browser storage, downloads | MAIN infrastructure adapters |
| Showing saved/failed history status and "open in history" actions | Runtime composition/presentation callback |
| Dialog/session activation and operation guarding | Feature session / composition, outside history |

A feature's core orchestration should not call history lifecycle methods such as `begin`,
`observe`, `complete`, `cancel`, or `interrupt`. Removing the history decorator should leave
business execution behavior essentially unchanged.

## Progress and diagnostics

Progress is a feature concern. History does not need progress notifications to know its
lifecycle. The final result or a safe partial result on error is the source of truth for the
record.

Request diagnostics may be carried by operation results/errors or collected by an
operation-scoped instrumentation capability. They must describe requests made by the actual
mutation execution. Preflight reads are not included merely because they happened before the
user confirmed the operation.

## Persistence failure invariant

History is observational. Failure to build, store, retain, or export a history record must not
change mutation semantics.

For a normally returned operation result, the result remains usable even when history storage
fails. For a thrown operation error, the original error is rethrown even when history storage
also fails. Persistence outcomes may be reported to composition/presentation and logs.

## Migration plan for #154

1. Keep the pure record/schema/retention and browser adapter separation already introduced by
   the branch.
2. Replace `ExecutionAttemptReporter` with one application-level `withExecutionHistory`
   wrapper and focused behavioral tests.
3. Make each history-enabled feature expose/inject its actual mutation operation so runtime
   composition can decorate it.
4. Remove history calls from preflight, dialog close/restart, progress rendering, and feature
   session lifecycle.
5. Preserve feature-specific record richness by mapping operation input, normal result, and
   safe partial result/error at the history boundary.
6. Preserve existing persisted schema compatibility, including reading older `cancelled`
   records, while no longer writing cancellation records for pre-execution user actions.
7. Cover success, returned partial failure, fatal interruption with partial result where
   available, and history persistence failure without requiring a Lit dialog.
