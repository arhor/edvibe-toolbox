# Batch Lesson Access Loading Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show an explicit initial lesson-loading state and preserve pasted email validation while the lesson catalogue loads.

**Architecture:** Keep async loading in `batch-lesson-access.js` and presentation/state transitions in the Web Component. Add a loading dialog method, retain email state when `showConfigure` receives only lessons, and cover both boundaries with regression tests.

**Tech Stack:** Plain JavaScript Web Component, shadow DOM, CSS, Node built-in test runner.

## Global Constraints

- Do not read, modify, stage, or commit `edvibe-ws-recording-2026-07-30T06-43-54-919Z.json`.
- Keep all dynamically created UI as Web Component markup and all presentation in the dedicated CSS file.
- Preserve the existing Manifest V3 architecture and logging/data-handling rules.

---

### Task 1: Cover loading and state retention in the dialog

**Files:**
- Modify: `tests/batchLessonAccessDialog.test.js`
- Modify: `src/components/batch-lesson-access-dialog.js`
- Modify: `src/components/batch-lesson-access-dialog.css`

**Interfaces:**
- Produces `BatchLessonAccessDialog.showLoading(message)` and a `loading` mode.
- `showConfigure({ lessons })` retains existing `emailState`; explicit `emailState` remains supported.

- [x] **Step 1: Add failing component tests**

Add tests asserting `showLoading` sets loading status, exposes the progress indicator as indeterminate, keeps the email field enabled, and disables lesson selection; add a test that sets email state/input, calls `showConfigure({ lessons })`, and expects the email state and enabled submit state to remain.

- [x] **Step 2: Run the focused dialog tests and verify failure**

Run: `node --test tests/batchLessonAccessDialog.test.js`

Expected: FAIL because `showLoading` is not defined and `showConfigure` currently receives/resets an explicit zero email state in the initialization path.

- [x] **Step 3: Implement the minimal dialog behavior**

Add a status region containing loading text and a spinner in the template; style the spinner in `src/components/batch-lesson-access-dialog.css`. Implement `showLoading`, include `loading` in the locked lesson-control states while leaving the textarea enabled, show the progress element as indeterminate during loading, and only call `setEmailState` from `showConfigure` when `options.emailState` is explicitly provided.

- [x] **Step 4: Run the focused dialog tests and verify they pass**

Run: `node --test tests/batchLessonAccessDialog.test.js`

Expected: PASS with all dialog tests passing.

### Task 2: Wire loading state and preserve email state during feature initialization

**Files:**
- Modify: `tests/batchLessonAccess.test.js`
- Modify: `src/features/batch-lesson-access.js`

**Interfaces:**
- Consumes `dialog.showLoading` and `dialog.showConfigure({ lessons })` from Task 1.

- [x] **Step 1: Add a failing initialization regression test**

Use the existing deferred-request browser harness to assert the dialog receives `showLoading` immediately after append and that the final `showConfigure` call contains the lesson catalogue without an email-state reset. Emit an input-change event before initialization resolves and assert its state remains available.

- [x] **Step 2: Run the focused feature test and verify failure**

Run: `node --test tests/batchLessonAccess.test.js`

Expected: FAIL because initialization does not call `showLoading` and passes `{ validCount: 0, malformedCount: 0 }` to `showConfigure`.

- [x] **Step 3: Implement the minimal feature wiring**

Call `dialog.showLoading()` after appending the dialog and replace the final `showConfigure` options with `{ lessons: lessonCatalogue }` so component-managed email state survives initialization.

- [x] **Step 4: Run the focused feature tests and verify they pass**

Run: `node --test tests/batchLessonAccess.test.js`

Expected: PASS with all batch access tests passing.

### Task 3: Full verification

**Files:**
- Verify: `src/components/batch-lesson-access-dialog.js`
- Verify: `src/components/batch-lesson-access-dialog.css`
- Verify: `src/features/batch-lesson-access.js`
- Verify: `tests/batchLessonAccessDialog.test.js`
- Verify: `tests/batchLessonAccess.test.js`

- [x] **Step 1: Check JavaScript syntax**

Run: `node --check src/components/batch-lesson-access-dialog.js && node --check src/features/batch-lesson-access.js`

- [x] **Step 2: Run the complete test suite**

Run: `node --test`

- [x] **Step 3: Inspect the final diff and protected-file status**

Run: `git diff --check && git status --short --untracked-files=all`

Confirm only the intended source/tests/docs plan files changed and the JSON recording remains unmodified and unstaged.
