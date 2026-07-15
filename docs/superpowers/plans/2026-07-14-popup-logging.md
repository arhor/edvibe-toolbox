# Popup Logging Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make popup logs accurately describe export and lesson-reset lifecycle events without exposing response payloads.

**Architecture:** Update only `popup.js` logging statements. Retain the existing popup log prefix, add state-transition and reset lifecycle logs, and replace vague export command wording with the concrete command name and tab ID.

**Tech Stack:** Manifest V3 Chrome extension, vanilla JavaScript, Chrome extension APIs.

---

### Task 1: Make popup lifecycle logs accurate and concise

**Files:**
- Modify: `popup.js:1-100`
- Test: manual popup console validation in Chrome

- [ ] **Step 1: Add logs for export-status processing and storage restoration**

Add a status log after the `EXPORT_STATUS` guard and a storage-state log in
the `chrome.storage.local.get` callback. Log the status string and Boolean
state only:

```js
console.log(`[Edvibe Toolbox][Popup] Received export status: ${message.state}`);

chrome.storage.local.get('exportInProgress').then((value) => {
    const isExporting = Boolean(value.exportInProgress);
    console.log(`[Edvibe Toolbox][Popup] Restored export state: ${isExporting}`);
    setExportButtonState(isExporting);
});
```

- [ ] **Step 2: Replace ambiguous automation logs**

Replace the click, command, acknowledgement, and error messages in
`startAutomation` with logs that name the operation and command:

```js
console.log('[Edvibe Toolbox][Popup] Starting marathon export.');
console.log(`[Edvibe Toolbox][Popup] Sending START_FULL_AUTOMATION to tab ${tab.id}.`);
console.log(`[Edvibe Toolbox][Popup] START_FULL_AUTOMATION acknowledged: ${response?.status || 'unknown'}.`);
console.error('[Edvibe Toolbox][Popup] Failed to start marathon export:', error);
```

- [ ] **Step 3: Add reset lifecycle logs**

Log reset startup before tab lookup, log the command destination after lookup,
and log success before closing the popup:

```js
console.log('[Edvibe Toolbox][Popup] Starting lesson reset.');
console.log(`[Edvibe Toolbox][Popup] Sending OPEN_LESSON_RESET to tab ${tab.id}.`);
console.log('[Edvibe Toolbox][Popup] OPEN_LESSON_RESET acknowledged.');
```

- [ ] **Step 4: Parse-check the edited JavaScript**

Run:

```bash
node --check popup.js
```

Expected: exits with code `0` and prints no syntax errors.

- [ ] **Step 5: Manually validate popup logs**

1. Reload the unpacked extension in `chrome://extensions/`.
2. Open the popup on an Edvibe marathon page and confirm the console logs
   restored export state, export startup, the command with only its tab ID,
   and its acknowledgement status.
3. Trigger the lesson reset and confirm the console logs reset startup,
   `OPEN_LESSON_RESET` with only its tab ID, and acknowledgement before the
   popup closes.
4. Trigger either action on a non-marathon page and confirm its existing
   alert and concise error log still appear.
