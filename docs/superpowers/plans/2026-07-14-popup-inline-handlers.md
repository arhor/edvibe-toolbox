# Popup Inline Handlers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Declare popup button actions through inline `onclick` attributes while preserving all export and reset behavior.

**Architecture:** `popup.html` invokes globally exposed functions from
`popup.js`, passing the clicked button as `this`. `popup.js` retains the
export-button query only for status-driven and storage-driven UI updates;
neither button uses JavaScript event-listener registration.

**Tech Stack:** Manifest V3 Chrome extension, HTML, vanilla JavaScript,
Chrome extension APIs.

---

### Task 1: Replace popup click-listener registration with inline handlers

**Files:**
- Modify: `popup.html:92-93`
- Modify: `popup.js:67-106`
- Test: manual popup validation in Chrome

- [ ] **Step 1: Update the two button declarations in `popup.html`**

```html
<button id="startCaptureBtn" class="btn btn-backup" onclick="startAutomation(this)">Выгрузить марафон</button>
<button id="resetLessonsBtn" class="btn btn-danger" onclick="openLessonReset(this)">Сброс уроков</button>
```

- [ ] **Step 2: Replace the listener-registration blocks in `popup.js` with global handlers**

```js
syncExportButtonFromStorage();

async function startAutomation(button) {
    if (button.disabled) return;

    console.log('[Edvibe Toolbox][Popup] Click event detected on main unified execution button.');

    try {
        const tab = await getActiveMarathonTab();
        setExportButtonState(true);
        console.log(`[Edvibe Toolbox][Popup] Sending execution token to tab identifier: ${tab.id}`);
        const response = await sendTabCommand(tab.id, 'START_FULL_AUTOMATION');
        console.log('[Edvibe Toolbox][Popup] Acknowledgment received from the page environment:', response);
    } catch (error) {
        console.error('[Edvibe Toolbox][Popup] Fatal exception occurred during automation startup:', error);
        alert(error.message);
        setExportButtonState(false);
    }
}

async function openLessonReset(button) {
    if (button.disabled) return;

    button.disabled = true;
    try {
        const tab = await getActiveMarathonTab();
        await sendTabCommand(tab.id, 'OPEN_LESSON_RESET');
        window.close();
    } catch (error) {
        console.error('[Edvibe Toolbox][Popup] Failed to open lesson reset:', error);
        alert(error.message);
        button.disabled = false;
    }
}

window.startAutomation = startAutomation;
window.openLessonReset = openLessonReset;
```

The replacement starts at the existing `if (runAutomationBtn)` block and
removes both `addEventListener` registrations and their element-not-found
warning. Keep `runAutomationBtn`, `setExportButtonState`, and
`syncExportButtonFromStorage`, because export status can change without a
button click.

- [ ] **Step 3: Parse-check the edited JavaScript**

Run:

```bash
node --check popup.js
```

Expected: exits with code `0` and prints no syntax error.

- [ ] **Step 4: Manually validate the popup**

1. Open `chrome://extensions/`, reload the unpacked Edvibe Toolbox extension,
   and confirm no manifest or popup script error appears.
2. Open the popup on an Edvibe marathon page and click “Выгрузить марафон.”
   Confirm the button disables, the export command is sent, and its status
   still returns the button to the normal state.
3. Click “Сброс уроков.” Confirm the reset command opens the existing reset
   flow and the popup closes on success.
4. On a non-marathon page, click each button and confirm the existing alert
   appears; the export button returns to normal and the reset button becomes
   enabled again.

- [ ] **Step 5: Commit the implementation when explicitly requested**

```bash
git add popup.html popup.js
git commit -m "refactor: use inline popup button handlers"
```
