# Clickable Popup Cards and Export-State Reset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clear stale marathon-export state whenever its Edvibe page reloads and replace redundant popup action buttons with accessible, clickable feature cards.

**Architecture:** Keep export persistence and command orchestration in the existing popup/isolated bridge. Reset the persisted export flag when the isolated content script initializes, while the popup card Web Component owns pointer and keyboard activation semantics and CSS owns all presentation.

**Tech Stack:** Manifest V3 Chrome extension, vanilla JavaScript, Web Components, CSS, Node.js built-in test runner.

## Global Constraints

- Keep the project framework-free and add no package manager or build step.
- Preserve the isolated-world/main-world responsibility split.
- Dynamically created UI remains implemented as Web Components.
- Keep all presentation in `popup.css`; do not assign presentation styles from JavaScript.
- Preserve existing commands, requirements, error messages, and single-operation blocking.
- Do not edit `lib/jszip.min.js`, other vendored files, or generated `export-*.json` files.

## File Structure

- `src/isolated.js`: clear stale export persistence on page-context initialization and continue relaying live export statuses.
- `src/components/popup-tool-list.js`: render accessible card-level controls and translate click/keyboard input into tool execution.
- `popup.js`: remove obsolete action labels while retaining busy labels and tool state orchestration.
- `popup.css`: replace button styling with interactive, disabled, busy, and danger card styling.
- `tests/popupHandlers.test.js`: regression assertions for initialization reset, catalogue shape, component semantics, activation, and styling.

---

### Task 1: Reset stale export state on page reload

**Files:**
- Modify: `tests/popupHandlers.test.js`
- Modify: `src/isolated.js:1-75`

**Interfaces:**
- Consumes: Chrome `storage.local.set({ exportInProgress: boolean }, callback)` and runtime messaging.
- Produces: isolated-script initialization that persists `exportInProgress: false`; existing `relayExportStatus({ state, message })` behavior remains unchanged.

- [ ] **Step 1: Write the failing initialization regression test**

Add this test to `tests/popupHandlers.test.js`, after loading `src/isolated.js` into an `isolatedScript` string near the existing fixture declarations:

```js
const isolatedScript = fs.readFileSync(
    path.join(projectRoot, 'src/isolated.js'),
    'utf8'
);

test('isolated page initialization clears stale export progress', () => {
    assert.match(
        isolatedScript,
        /chrome\.storage\.local\.set\(\{\s*exportInProgress:\s*false\s*\}/
    );
    assert.match(
        isolatedScript,
        /log\('Reset stale export state for the loaded page\.'\)/
    );
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test --test-name-pattern="clears stale export progress" tests/popupHandlers.test.js
```

Expected: FAIL because `src/isolated.js` does not clear storage during initialization.

- [ ] **Step 3: Implement the page-load reset**

Immediately after the isolated initialization log in `src/isolated.js`, add:

```js
chrome.storage.local.set({ exportInProgress: false }, () => {
    log('Reset stale export state for the loaded page.');
});
```

Do not send an `EXPORT_STATUS` runtime message from this callback: opening popup instances independently restore the newly cleared value, and a page reload has no cancelled workflow to report as complete or failed.

- [ ] **Step 4: Run the focused test and syntax check**

Run:

```bash
node --test --test-name-pattern="clears stale export progress" tests/popupHandlers.test.js
node --check src/isolated.js
```

Expected: both commands PASS.

- [ ] **Step 5: Commit the lifecycle fix**

```bash
git add src/isolated.js tests/popupHandlers.test.js
git commit -m "fix: clear stale export state on page load"
```

---

### Task 2: Make feature cards accessible activation targets

**Files:**
- Modify: `tests/popupHandlers.test.js`
- Modify: `src/components/popup-tool-list.js:1-115`

**Interfaces:**
- Consumes: `PopupToolCard.configure({ tool, disabled, reason, busy, onExecute })`.
- Produces: `popup-tool-card` with `role="button"`, conditional `tabindex`, `aria-disabled`, click activation, and Enter/Space keyboard activation; `.tool-busy` displays `tool.busyLabel`.

- [ ] **Step 1: Replace the obsolete button assertions with failing card assertions**

In the CSP-safe catalogue test, replace the button-listener assertion and add component assertions:

```js
assert.doesNotMatch(popupComponents, /<button\b/);
assert.match(popupComponents, /this\.addEventListener\('click'/);
assert.match(popupComponents, /this\.addEventListener\('keydown'/);
assert.match(popupComponents, /event\.key === 'Enter' \|\| event\.key === ' '/);
assert.match(popupComponents, /this\.setAttribute\('role', 'button'\)/);
assert.match(popupComponents, /this\.setAttribute\('aria-disabled', String\(disabled\)\)/);
assert.match(popupComponents, /this\.tabIndex = disabled \? -1 : 0/);
assert.match(popupComponents, /class="tool-busy" hidden/);
```

Add a separate guard assertion:

```js
test('popup cards ignore activation while disabled', () => {
    assert.match(
        popupComponents,
        /activate\(\) \{[\s\S]*?this\.dataset\.disabled === 'true'[\s\S]*?return;/
    );
});
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```bash
node --test --test-name-pattern="CSP-safe|ignore activation" tests/popupHandlers.test.js
```

Expected: FAIL because the template still contains a button and activation is bound to it.

- [ ] **Step 3: Replace the card template action button with busy status**

Change the card template in `src/components/popup-tool-list.js` to:

```js
cardTemplate.innerHTML = `
    <div class="tool-card-header">
        <div class="tool-copy">
            <h3 class="tool-title"></h3>
            <p class="tool-description"></p>
            <p class="tool-requirement" hidden></p>
            <p class="tool-busy" hidden></p>
        </div>
    </div>
`;
```

- [ ] **Step 4: Add card-level activation**

Add the following methods to `PopupToolCard`:

```js
activate() {
    if (
        this.dataset.disabled === 'true'
        || typeof this.onExecute !== 'function'
        || !this.toolId
    ) {
        return;
    }
    this.onExecute(this.toolId);
}

handleKeydown(event) {
    if (event.key !== 'Enter' && event.key !== ' ') {
        return;
    }
    event.preventDefault();
    this.activate();
}
```

In `connectedCallback()`, cache `busy` instead of `button`, then register listeners once:

```js
busy: this.querySelector('.tool-busy')
```

```js
this.setAttribute('role', 'button');
this.addEventListener('click', () => this.activate());
this.addEventListener('keydown', (event) => this.handleKeydown(event));
```

In `applyOptions()`, replace button updates with:

```js
this.setAttribute('aria-disabled', String(disabled));
this.tabIndex = disabled ? -1 : 0;
this.classList.toggle('is-danger', tool.appearance === 'danger');
this.elements.busy.textContent = String(tool.busyLabel || '');
this.elements.busy.hidden = !options.busy;
```

- [ ] **Step 5: Run the component-focused tests**

Run:

```bash
node --test --test-name-pattern="CSP-safe|constructors|ignore activation" tests/popupHandlers.test.js
node --check src/components/popup-tool-list.js
```

Expected: both commands PASS. If the constructor rule fails, keep all DOM inspection and mutation inside `connectedCallback()` and `applyOptions()`.

- [ ] **Step 6: Commit accessible card behavior**

```bash
git add src/components/popup-tool-list.js tests/popupHandlers.test.js
git commit -m "feat: activate popup tools from cards"
```

---

### Task 3: Remove action labels and style card interaction states

**Files:**
- Modify: `tests/popupHandlers.test.js`
- Modify: `popup.js:8-55`
- Modify: `popup.css:132-205`

**Interfaces:**
- Consumes: card attributes/classes `data-disabled`, `.is-danger`, `:hover`, `:focus-visible`, and child `.tool-busy`.
- Produces: tool definitions containing `busyLabel` but no `actionLabel`; visual card affordances without `.tool-action`.

- [ ] **Step 1: Write failing catalogue and style assertions**

Update the batch-access test so its expected definition omits `actionLabel`:

```js
assert.match(
    popupScript,
    /id: 'batch-lesson-access',\s*group: 'management',\s*title: 'Открыть доступ к урокам',\s*description: 'Открыть выбранные уроки для списка учеников\.',\s*command: 'OPEN_BATCH_LESSON_ACCESS',\s*requirement: 'marathon',\s*busyLabel: 'Открывается…',\s*closeOnSuccess: true/
);
```

Add:

```js
test('popup styles interactive states on cards without action buttons', () => {
    assert.doesNotMatch(popupScript, /actionLabel:/);
    assert.doesNotMatch(popupStyles, /\.tool-action/);
    assert.match(popupStyles, /popup-tool-card:hover:not\(\[data-disabled="true"\]\)/);
    assert.match(popupStyles, /popup-tool-card:focus-visible/);
    assert.match(popupStyles, /popup-tool-card\.is-danger/);
    assert.match(popupStyles, /\.tool-busy/);
});
```

Replace the old `.tool-action.is-danger` assertion in the stylesheet-loading test with:

```js
assert.match(popupStyles, /popup-tool-card\.is-danger/);
```

- [ ] **Step 2: Run focused tests and verify RED**

Run:

```bash
node --test --test-name-pattern="batch lesson access|interactive states|loads its stylesheet" tests/popupHandlers.test.js
```

Expected: FAIL because action labels and `.tool-action` styles still exist.

- [ ] **Step 3: Remove catalogue action labels**

Delete all four `actionLabel` properties from `TOOL_DEFINITIONS` in `popup.js`. Retain every `busyLabel` exactly:

```js
busyLabel: 'Экспортируется…'
busyLabel: 'Открывается…'
```

- [ ] **Step 4: Replace action-button CSS with card-level states**

Keep the base card layout and add:

```css
popup-tool-card {
    cursor: pointer;
    transition: border-color 120ms ease, background 120ms ease,
        box-shadow 120ms ease, transform 120ms ease;
}

popup-tool-card:hover:not([data-disabled="true"]) {
    border-color: #b9c2e8;
    box-shadow: 0 4px 12px rgba(30, 42, 70, 0.09);
    transform: translateY(-1px);
}

popup-tool-card:focus-visible {
    outline: 3px solid rgba(64, 85, 211, 0.25);
    outline-offset: 2px;
}

popup-tool-card[data-disabled="true"] {
    background: #fafbfc;
    cursor: default;
}

popup-tool-card.is-danger:not([data-disabled="true"]) {
    border-color: #e4caca;
}

popup-tool-card.is-danger:hover:not([data-disabled="true"]) {
    border-color: #d6a7a7;
    background: #fffafa;
}

.tool-busy {
    margin-top: 5px;
    color: #4055d3;
    font-size: 11px;
    font-weight: 650;
    line-height: 1.4;
}
```

Remove the full `.tool-action` rule set. Preserve `.tool-card-header`,
`.tool-copy`, `.tool-title`, `.tool-description`, `.tool-requirement`, and
popup-status styling.

- [ ] **Step 5: Run popup tests and syntax checks**

Run:

```bash
node --test tests/popupHandlers.test.js
node --check popup.js
node --check src/components/popup-tool-list.js
node --check src/isolated.js
```

Expected: all commands PASS.

- [ ] **Step 6: Commit the catalogue and styling cleanup**

```bash
git add popup.js popup.css tests/popupHandlers.test.js
git commit -m "style: make popup feature cards clickable"
```

---

### Task 4: Full regression and manual verification

**Files:**
- Verify: `manifest.json`
- Verify: all modified source and test files

**Interfaces:**
- Consumes: completed page-load reset and clickable-card behavior.
- Produces: verified extension with no manifest wiring changes or unrelated artifacts.

- [ ] **Step 1: Run the complete automated suite**

Run:

```bash
node --test tests/*.test.js
```

Expected: all tests PASS with zero failures.

- [ ] **Step 2: Run focused static validation**

Run:

```bash
node --check popup.js
node --check src/isolated.js
node --check src/components/popup-tool-list.js
git diff --check
git status --short
```

Expected: syntax and diff checks PASS; status contains only the intended implementation and plan changes, with no vendored or generated export files.

- [ ] **Step 3: Perform browser validation**

Load the extension unpacked and verify:

1. On a marathon page, each enabled card has hover/focus feedback and launches its existing feature by click.
2. Tab to an enabled card and confirm Enter and Space each launch it once.
3. On a non-marathon Edvibe page, marathon-only cards cannot receive focus or launch and show `Откройте страницу марафона.`
4. Start marathon export and confirm its card displays `Экспортируется…` while other cards show `Дождитесь завершения другого инструмента.`
5. Reload the page mid-export, reopen the popup, and confirm the stale busy/blocking state is gone.
6. Confirm Chrome reports no manifest or content-script errors.

- [ ] **Step 4: Commit any final test-only corrections**

Only if browser validation required a correction, repeat the relevant failing
test-first cycle, rerun Steps 1–3, then commit the exact corrected files:

```bash
git add popup.js popup.css src/isolated.js src/components/popup-tool-list.js tests/popupHandlers.test.js
git commit -m "test: verify popup card and export reset behavior"
```
