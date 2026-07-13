# Reset Pupil Search Feedback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Delay pupil filtering until three seconds of input inactivity and display a spinner over a dimmed pupil table while search or pagination is pending.

**Architecture:** Keep the existing pager and stale-search generation logic. Separate the input value from the last applied query, and add explicit pupil-search/page-loading state that controls a spinner overlay without clearing the currently rendered rows.

**Tech Stack:** Vanilla JavaScript, DOM/CSS, Node.js built-in test runner.

---

### Task 1: Test delayed local filtering and loading feedback

**Files:**
- Modify: `tests/resetLessons.test.js`

- [ ] **Step 1: Extend the fake modal DOM**

Add `.edvibe-reset-pupils-shell` and `.edvibe-reset-pupils-loading` to the fake selector list so tests can inspect loading state.

- [ ] **Step 2: Replace the immediate-filter expectation**

Update the delayed-search test to verify:

```js
search.value = 'target';
await search.emit('input');

assert.equal(pupilsList.children[0].children[0].children[1].textContent,
    'first@example.com');
assert.equal(pupilsShell.classList.names.has('is-loading'), true);
assert.equal(pupilsLoading.hidden, false);
assert.equal(timers[0].delay, 3000);

await timers[0].callback();

assert.equal(pupilsShell.classList.names.has('is-loading'), false);
assert.equal(pupilsLoading.hidden, true);
assert.equal(pupilsList.children[0].children[0].children[1].textContent,
    'target@example.com');
```

- [ ] **Step 3: Add a no-results completion test**

Use an exhausted one-page pupil source, enter an unmatched query, fire the timer, and assert that the loading state clears before `Пользователи не найдены.` is rendered.

- [ ] **Step 4: Run focused tests and verify failure**

Run:

```bash
node --test --test-name-pattern="modal (delays|shows no results)" tests/resetLessons.test.js
```

Expected: FAIL because filtering still happens immediately and no spinner shell exists.

### Task 2: Add spinner markup and styles

**Files:**
- Modify: `resetLessons.js`

- [ ] **Step 1: Wrap the pupil list**

Render:

```html
<div class="edvibe-reset-pupils-shell">
    <div class="edvibe-reset-list edvibe-reset-pupils" role="listbox"
        aria-label="Пользователи марафона"></div>
    <div class="edvibe-reset-pupils-loading" role="status" aria-live="polite" hidden>
        <span class="edvibe-reset-spinner" aria-hidden="true"></span>
        <span>Загрузка пользователей...</span>
    </div>
</div>
```

- [ ] **Step 2: Add scoped loading styles**

Make the shell positioned, overlay the loading element, dim and block pointer events on the pupil list while `.is-loading` is present, and animate a CSS border spinner. Respect `prefers-reduced-motion` by disabling rotation.

- [ ] **Step 3: Add a loading-state helper**

Inside the modal:

```js
function updatePupilLoadingState() {
    const busy = searchPending || pupilPagePromise !== null || loading;
    pupilsShell.classList.toggle('is-loading', busy);
    pupilsLoading.hidden = !busy;
}
```

Call it whenever initial loading, delayed search, page loading, lesson loading, or completion changes the relevant state.

### Task 3: Delay application of the local query

**Files:**
- Modify: `resetLessons.js`
- Modify: `tests/resetLessons.test.js`

- [ ] **Step 1: Track the last applied query**

Add:

```js
let appliedSearchQuery = '';
let searchPending = false;
```

Change `renderPupils()` to filter with `appliedSearchQuery`, not `search.value`.

- [ ] **Step 2: Replace input handling**

On every input:

1. advance `searchGeneration`;
2. cancel the prior timer;
3. set `searchPending = true` and update the spinner;
4. schedule one callback for `searchDelay`;
5. after the delay, check loaded matches;
6. if unmatched and more pages exist, paginate until a match or exhaustion;
7. only for the latest generation, assign `appliedSearchQuery`, render once, clear `searchPending`, and update the spinner.

Do not render or clear existing rows before the latest callback finishes.

- [ ] **Step 3: Preserve stale-query safety**

An old request may append pupils to shared pager state, but only the current generation may apply a query, clear the spinner, or render final no-results state.

- [ ] **Step 4: Run focused and full tests**

Run:

```bash
node --test --test-name-pattern="modal (delays|shows no results|restarts|prevents a stale search|cancels delayed search)" tests/resetLessons.test.js
node --test tests/resetLessons.test.js
node --check resetLessons.js
```

Expected: all tests pass.

### Task 4: Final verification

**Files:**
- Verify: `resetLessons.js`
- Verify: `main.js`
- Verify: `tests/resetLessons.test.js`

- [ ] **Step 1: Run automated checks**

```bash
node --check resetLessons.js
node --check main.js
node --test tests/resetLessons.test.js
git diff --check
```

- [ ] **Step 2: Manual browser check**

Reload the extension, type several query changes less than three seconds apart, and confirm existing rows remain dimmed beneath the spinner. Confirm only the final query applies, pagination continues under the spinner when needed, and exhausted searches end with `Пользователи не найдены.`

Do not create commits unless the user explicitly asks.
