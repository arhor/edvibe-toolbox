# Reset Pupil Pagination Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Load marathon pupils in pages of 50, with delayed search pagination and infinite scrolling.

**Architecture:** Add a small shared pupil pager that owns server pagination and deduplicates concurrent page requests. The reset modal continues filtering locally, but requests more pages through the pager after a three-second unmatched-search delay or when the pupil list reaches its scroll threshold. Search generations prevent stale queries from continuing pagination.

**Tech Stack:** Vanilla JavaScript, DOM APIs, Manifest V3, Node.js built-in test runner.

---

## File Map

- Modify `resetLessons.js`: replace eager pupil loading with a reusable pager, add modal search/scroll pagination, and wire the feature to load only the first page on open.
- Modify `tests/resetLessons.test.js`: test pager validation and concurrency, delayed search behavior, scrolling, stale-query cancellation, cleanup, and feature-level initial loading.
- Verify `main.js`: syntax-check because it loads the reset module.

No new dependencies or production files are required. Commit steps are omitted because repository changes may only be committed with explicit user authorization.

### Task 1: Add a shared pupil pager

**Files:**
- Modify: `tests/resetLessons.test.js:4-22`
- Modify: `tests/resetLessons.test.js:248-262`
- Modify: `resetLessons.js:86-111`
- Modify: `resetLessons.js:1142-1160`

- [ ] **Step 1: Write failing tests for one-page loading and pagination state**

Replace the `loadAllPupils` import with `createPupilPager`:

```js
const {
    parseMarathonId,
    filterPupilsByEmail,
    collectLessonSections,
    shouldDeleteLastRequest,
    buildLoadExercisesPayload,
    buildResetAnswerPayload,
    createPupilPager,
    discoverResetWork,
    executeResetWork,
    createResetModal,
    createResetLessonsFeature,
    getResetModalMarkup,
    getResetRunningStyles,
    getResetPupilSelectionState,
    getResetWizardViewState,
    hasLoadedLessonsForPupil,
    setResetRunningState,
    getErrorType
} = require('../resetLessons.js');
```

Replace the existing `loadAllPupils` test with:

```js
test('pupil pager loads one page at a time with a default size of 50', async () => {
    const calls = [];
    const pages = [
        { Value: { Items: [{ PupilId: 1 }, { PupilId: 2 }], Page: { Count: 3 } } },
        { Value: { Items: [{ PupilId: 3 }], Page: { Count: 3 } } }
    ];
    const pager = createPupilPager(async (...args) => {
        calls.push(args);
        return pages[calls.length - 1];
    }, 18508);

    const first = await pager.loadNext();
    assert.deepEqual(first.pupils.map((pupil) => pupil.PupilId), [1, 2]);
    assert.equal(first.total, 3);
    assert.equal(first.hasMore, true);
    assert.equal(calls.length, 1);
    assert.deepEqual(calls[0][3], { MarathonId: 18508, Skip: 0, Take: 50 });

    const second = await pager.loadNext();
    assert.deepEqual(second.pupils.map((pupil) => pupil.PupilId), [1, 2, 3]);
    assert.equal(second.hasMore, false);
    assert.equal(calls[1][3].Skip, 2);
});

test('pupil pager shares an in-flight next-page request', async () => {
    let resolveRequest;
    let callCount = 0;
    const pager = createPupilPager(() => {
        callCount += 1;
        return new Promise((resolve) => {
            resolveRequest = resolve;
        });
    }, 18508);

    const first = pager.loadNext();
    const duplicate = pager.loadNext();
    assert.equal(callCount, 1);

    resolveRequest({
        Value: {
            Items: [{ PupilId: 1 }],
            Page: { Count: 1 }
        }
    });

    assert.deepEqual(await first, await duplicate);
    assert.equal(callCount, 1);
});

test('pupil pager rejects an empty page before the reported total', async () => {
    const pager = createPupilPager(async () => ({
        Value: {
            Items: [],
            Page: { Count: 2 }
        }
    }), 18508);

    await assert.rejects(
        pager.loadNext(),
        /pagination stopped before all pupils were loaded/
    );
});
```

- [ ] **Step 2: Run the focused tests and verify they fail**

Run:

```bash
node --test --test-name-pattern="pupil pager" tests/resetLessons.test.js
```

Expected: FAIL because `createPupilPager` is not exported.

- [ ] **Step 3: Replace eager loading with the pager**

Replace `loadAllPupils` with:

```js
function createPupilPager(sendRequest, marathonId, pageSize = 50) {
    let pupils = [];
    let total = null;
    let inFlight = null;

    function snapshot() {
        return {
            pupils: [...pupils],
            total,
            hasMore: total === null || pupils.length < total
        };
    }

    async function requestNextPage() {
        if (total !== null && pupils.length >= total) return snapshot();

        const response = await sendRequest(
            'MarathonPupilsWsController',
            'GetMarathonPupils',
            'Marathons',
            { MarathonId: marathonId, Skip: pupils.length, Take: pageSize }
        );
        const items = response.Value?.Items;
        const nextTotal = Number(response.Value?.Page?.Count);

        if (!Array.isArray(items) || !Number.isFinite(nextTotal) || nextTotal < 0) {
            throw new Error('GetMarathonPupils returned an invalid response.');
        }
        if (items.length === 0 && pupils.length < nextTotal) {
            throw new Error(
                'GetMarathonPupils pagination stopped before all pupils were loaded.'
            );
        }

        pupils = pupils.concat(items);
        total = nextTotal;
        return snapshot();
    }

    return {
        loadNext() {
            if (inFlight) return inFlight;
            inFlight = requestNextPage().finally(() => {
                inFlight = null;
            });
            return inFlight;
        },
        getSnapshot: snapshot
    };
}
```

Export `createPupilPager` in place of `loadAllPupils`.

- [ ] **Step 4: Run pager tests and the full suite**

Run:

```bash
node --test --test-name-pattern="pupil pager" tests/resetLessons.test.js
node --test tests/resetLessons.test.js
```

Expected: all tests pass.

### Task 2: Add delayed unmatched-search pagination

**Files:**
- Modify: `tests/resetLessons.test.js:24-163`
- Modify: `tests/resetLessons.test.js:591-693`
- Modify: `resetLessons.js:679-956`

- [ ] **Step 1: Extend the fake DOM with scroll dimensions**

Add these defaults to the `FakeElement` constructor:

```js
this.scrollTop = 0;
this.clientHeight = 0;
this.scrollHeight = 0;
```

- [ ] **Step 2: Write failing tests for immediate filtering and delayed loading**

Add:

```js
test('modal delays unmatched search pagination and stops on the first match', async (t) => {
    const originalDocument = global.document;
    global.document = createModalTestDocument();
    t.after(() => {
        global.document = originalDocument;
    });

    const timers = [];
    const modal = createResetModal({
        onClose() {},
        schedule(callback, delay) {
            timers.push({ callback, delay, cancelled: false });
            return timers.length - 1;
        },
        cancelScheduled(id) {
            timers[id].cancelled = true;
        }
    });
    const search = modal.overlay.querySelector('.edvibe-reset-search');
    const pupilsList = modal.overlay.querySelector('.edvibe-reset-pupils');
    const pages = [
        {
            pupils: [
                { PupilId: 1, Email: 'first@example.com' },
                { PupilId: 2, Email: 'target@example.com' }
            ],
            total: 3,
            hasMore: true
        }
    ];
    let loadCount = 0;

    modal.showPupils({
        pupils: [{ PupilId: 1, Email: 'first@example.com' }],
        total: 3,
        onSelectPupil: async () => {},
        onLoadNext: async () => {
            loadCount += 1;
            return pages[loadCount - 1];
        }
    });

    search.value = 'target';
    await search.emit('input');
    assert.equal(pupilsList.children[0].textContent, 'Пользователи не найдены.');
    assert.equal(loadCount, 0);
    assert.equal(timers[0].delay, 3000);

    await timers[0].callback();
    assert.equal(loadCount, 1);
    assert.equal(pupilsList.children.length, 1);
    assert.equal(pupilsList.children[0].children[0].children[1].textContent,
        'target@example.com');
});

test('modal does not schedule pupil loading for blank or locally matched search', async (t) => {
    const originalDocument = global.document;
    global.document = createModalTestDocument();
    t.after(() => {
        global.document = originalDocument;
    });

    const timers = [];
    const modal = createResetModal({
        onClose() {},
        schedule(callback, delay) {
            timers.push({ callback, delay });
            return timers.length - 1;
        },
        cancelScheduled() {}
    });
    const search = modal.overlay.querySelector('.edvibe-reset-search');

    modal.showPupils({
        pupils: [{ PupilId: 1, Email: 'first@example.com' }],
        total: 10,
        onSelectPupil: async () => {},
        onLoadNext: async () => {
            throw new Error('must not load');
        }
    });

    search.value = '   ';
    await search.emit('input');
    search.value = 'FIRST@';
    await search.emit('input');

    assert.equal(timers.length, 0);
});

test('modal restarts the three-second delay after each input change', async (t) => {
    const originalDocument = global.document;
    global.document = createModalTestDocument();
    t.after(() => {
        global.document = originalDocument;
    });

    const timers = [];
    const cancelled = [];
    const modal = createResetModal({
        onClose() {},
        schedule(callback, delay) {
            timers.push({ callback, delay });
            return timers.length - 1;
        },
        cancelScheduled(id) {
            cancelled.push(id);
        }
    });
    const search = modal.overlay.querySelector('.edvibe-reset-search');

    modal.showPupils({
        pupils: [{ PupilId: 1, Email: 'first@example.com' }],
        total: 10,
        onSelectPupil: async () => {},
        onLoadNext: async () => ({
            pupils: [],
            total: 0,
            hasMore: false
        })
    });

    search.value = 'miss';
    await search.emit('input');
    search.value = 'missing';
    await search.emit('input');

    assert.deepEqual(cancelled, [0]);
    assert.equal(timers.length, 2);
    assert.equal(timers[1].delay, 3000);
});
```

- [ ] **Step 3: Run the delayed-search tests and verify they fail**

Run:

```bash
node --test --test-name-pattern="modal (delays|does not schedule|restarts)" tests/resetLessons.test.js
```

Expected: FAIL because the modal does not accept paginated pupil configuration or schedule delayed loading.

- [ ] **Step 4: Inject timers and add pupil pagination state**

Change the modal signature:

```js
function createResetModal({
    onClose,
    schedule = setTimeout,
    cancelScheduled = clearTimeout,
    searchDelay = 3000
}) {
```

Keep the current function body and add these declarations immediately after
`let closed = false`:

```js
let pupilTotal = 0;
let loadNextPupilsHandler = null;
let pupilPagePromise = null;
let searchTimer = null;
let searchGeneration = 0;
```

Add these helpers after `setStatus`:

```js
function normalizeSearchQuery(value) {
    return String(value || '').trim().toLowerCase();
}

function hasMorePupils() {
    return allPupils.length < pupilTotal;
}

async function loadNextPupilPage() {
    if (closed || !loadNextPupilsHandler || !hasMorePupils()) return false;
    if (pupilPagePromise) return pupilPagePromise;

    pupilPagePromise = (async () => {
        try {
            const page = await loadNextPupilsHandler();
            if (closed) return false;
            allPupils = page.pupils;
            pupilTotal = page.total;
            renderPupils();
            setStatus(`Загружено пользователей: ${allPupils.length} из ${pupilTotal}`);
            return true;
        } catch (error) {
            if (!closed) {
                console.error(
                    `[Edvibe Toolbox][Reset] Failed to load another pupil page `
                    + `(${getErrorType(error)}).`
                );
                setStatus(error.message, 'error');
            }
            return false;
        } finally {
            pupilPagePromise = null;
        }
    })();

    return pupilPagePromise;
}

async function continueSearch(generation, query) {
    while (
        !closed
        && generation === searchGeneration
        && query === normalizeSearchQuery(search.value)
        && filterPupilsByEmail(allPupils, query).length === 0
        && hasMorePupils()
    ) {
        const loaded = await loadNextPupilPage();
        if (!loaded) return;
    }
}

function handleSearchInput() {
    renderPupils();
    searchGeneration += 1;
    if (searchTimer !== null) {
        cancelScheduled(searchTimer);
        searchTimer = null;
    }

    const query = normalizeSearchQuery(search.value);
    if (!query || filterPupilsByEmail(allPupils, query).length > 0 || !hasMorePupils()) {
        return;
    }

    const generation = searchGeneration;
    searchTimer = schedule(() => {
        searchTimer = null;
        return continueSearch(generation, query);
    }, searchDelay);
}
```

Replace:

```js
search.addEventListener('input', renderPupils);
```

with:

```js
search.addEventListener('input', handleSearchInput);
```

- [ ] **Step 5: Update modal initialization and cleanup**

Replace `showPupils(pupils, onSelectPupil)` with:

```js
showPupils({ pupils, total, onSelectPupil, onLoadNext }) {
    allPupils = pupils;
    pupilTotal = total;
    selectPupilHandler = onSelectPupil;
    loadNextPupilsHandler = onLoadNext;
    currentStep = 'user';
    loading = false;
    setStatus(`Загружено пользователей: ${pupils.length} из ${total}`);
    renderPupils();
    updateInteractiveState();
    search.focus();
},
```

In `close()`, clear pending search work before removing the overlay:

```js
closed = true;
searchGeneration += 1;
if (searchTimer !== null) {
    cancelScheduled(searchTimer);
    searchTimer = null;
}
document.removeEventListener('keydown', handleKeydown);
overlay.remove();
onClose();
```

Update existing modal tests to call:

```js
modal.showPupils({
    pupils,
    total: pupils.length,
    onSelectPupil,
    onLoadNext: async () => ({
        pupils,
        total: pupils.length,
        hasMore: false
    })
});
```

For the same-pupil selection test, define `onSelectPupil` immediately before
that call:

```js
const onSelectPupil = async (pupil) => {
    loadedPupilIds.push(pupil.PupilId);
    modal.setLoading(`Loading ${pupil.PupilId}`);
    modal.showLessons(pupil, [{
        MarathonLessonId: pupil.PupilId * 10,
        Number: 0,
        Name: `Lesson ${pupil.PupilId}`
    }]);
};
```

For the recoverable lesson-loading test, define:

```js
const onSelectPupil = async (selectedPupil) => {
    attempts += 1;
    modal.setLoading('Loading lessons...');
    if (attempts === 1) {
        throw new Error('lesson request failed');
    }
    modal.showLessons(selectedPupil, []);
};
```

- [ ] **Step 6: Run delayed-search tests and the full suite**

Run:

```bash
node --test --test-name-pattern="modal (delays|does not schedule|restarts)" tests/resetLessons.test.js
node --test tests/resetLessons.test.js
```

Expected: all tests pass.

### Task 3: Cover stale searches, exhausted pagination, and cleanup

**Files:**
- Modify: `tests/resetLessons.test.js`
- Modify: `resetLessons.js:766-776`

- [ ] **Step 1: Write a failing stale-query test**

Add:

```js
test('modal prevents a stale search from loading another page', async (t) => {
    const originalDocument = global.document;
    global.document = createModalTestDocument();
    t.after(() => {
        global.document = originalDocument;
    });

    const timers = [];
    let resolvePage;
    let loadCount = 0;
    const modal = createResetModal({
        onClose() {},
        schedule(callback) {
            timers.push(callback);
            return timers.length - 1;
        },
        cancelScheduled() {}
    });
    const search = modal.overlay.querySelector('.edvibe-reset-search');

    modal.showPupils({
        pupils: [{ PupilId: 1, Email: 'first@example.com' }],
        total: 3,
        onSelectPupil: async () => {},
        onLoadNext: () => {
            loadCount += 1;
            return new Promise((resolve) => {
                resolvePage = resolve;
            });
        }
    });

    search.value = 'missing';
    await search.emit('input');
    const staleSearch = timers[0]();
    search.value = 'first';
    await search.emit('input');
    resolvePage({
        pupils: [
            { PupilId: 1, Email: 'first@example.com' },
            { PupilId: 2, Email: 'second@example.com' }
        ],
        total: 3,
        hasMore: true
    });
    await staleSearch;

    assert.equal(loadCount, 1);
});
```

- [ ] **Step 2: Write a failing cleanup test**

Add:

```js
test('modal cancels delayed search when it closes', async (t) => {
    const originalDocument = global.document;
    global.document = createModalTestDocument();
    t.after(() => {
        global.document = originalDocument;
    });

    const cancelled = [];
    const modal = createResetModal({
        onClose() {},
        schedule() {
            return 42;
        },
        cancelScheduled(id) {
            cancelled.push(id);
        }
    });
    const overlay = modal.overlay;
    const search = overlay.querySelector('.edvibe-reset-search');

    modal.showPupils({
        pupils: [],
        total: 10,
        onSelectPupil: async () => {},
        onLoadNext: async () => {
            throw new Error('must not load');
        }
    });
    search.value = 'missing';
    await search.emit('input');
    await overlay.querySelector('.edvibe-reset-close').emit('click');

    assert.deepEqual(cancelled, [42]);
    assert.equal(overlay.removed, true);
});

test('modal keeps pupil pagination failures recoverable', async (t) => {
    const originalDocument = global.document;
    const originalConsoleError = console.error;
    global.document = createModalTestDocument();
    console.error = () => {};
    t.after(() => {
        global.document = originalDocument;
        console.error = originalConsoleError;
    });

    const timers = [];
    const modal = createResetModal({
        onClose() {},
        schedule(callback) {
            timers.push(callback);
            return timers.length - 1;
        },
        cancelScheduled() {}
    });
    const search = modal.overlay.querySelector('.edvibe-reset-search');
    const status = modal.overlay.querySelector('.edvibe-reset-status');

    modal.showPupils({
        pupils: [],
        total: 10,
        onSelectPupil: async () => {},
        onLoadNext: async () => {
            throw new Error('pupil page failed');
        }
    });
    search.value = 'missing';
    await search.emit('input');
    await timers[0]();

    assert.equal(status.textContent, 'pupil page failed');
    assert.equal(status.classList.names.has('is-error'), true);
    assert.equal(modal.overlay.removed, undefined);
});
```

- [ ] **Step 3: Run both tests**

Run:

```bash
node --test --test-name-pattern="stale search|cancels delayed search|pagination failures" tests/resetLessons.test.js
```

Expected after Task 2: PASS. If either fails, correct generation checks or close cleanup before proceeding.

- [ ] **Step 4: Add an exhausted-search test**

Add:

```js
test('modal stops unmatched search when all pupils are loaded', async (t) => {
    const originalDocument = global.document;
    global.document = createModalTestDocument();
    t.after(() => {
        global.document = originalDocument;
    });

    const timers = [];
    let loadCount = 0;
    const modal = createResetModal({
        onClose() {},
        schedule(callback) {
            timers.push(callback);
            return timers.length - 1;
        },
        cancelScheduled() {}
    });
    const search = modal.overlay.querySelector('.edvibe-reset-search');

    modal.showPupils({
        pupils: [{ PupilId: 1, Email: 'first@example.com' }],
        total: 2,
        onSelectPupil: async () => {},
        onLoadNext: async () => {
            loadCount += 1;
            return {
                pupils: [
                    { PupilId: 1, Email: 'first@example.com' },
                    { PupilId: 2, Email: 'second@example.com' }
                ],
                total: 2,
                hasMore: false
            };
        }
    });

    search.value = 'missing';
    await search.emit('input');
    await timers[0]();

    assert.equal(loadCount, 1);
});
```

- [ ] **Step 5: Run the full suite**

Run:

```bash
node --test tests/resetLessons.test.js
```

Expected: all tests pass.

### Task 4: Add infinite scrolling through the same loader

**Files:**
- Modify: `tests/resetLessons.test.js`
- Modify: `resetLessons.js:888-895`

- [ ] **Step 1: Write failing scroll pagination tests**

Add:

```js
test('modal loads one pupil page when the list scrolls near the bottom', async (t) => {
    const originalDocument = global.document;
    global.document = createModalTestDocument();
    t.after(() => {
        global.document = originalDocument;
    });

    const modal = createResetModal({ onClose() {} });
    const pupilsList = modal.overlay.querySelector('.edvibe-reset-pupils');
    let loadCount = 0;
    const firstPupil = { PupilId: 1, Email: 'first@example.com' };
    const secondPupil = { PupilId: 2, Email: 'second@example.com' };

    modal.showPupils({
        pupils: [firstPupil],
        total: 2,
        onSelectPupil: async () => {},
        onLoadNext: async () => {
            loadCount += 1;
            return {
                pupils: [firstPupil, secondPupil],
                total: 2,
                hasMore: false
            };
        }
    });

    pupilsList.scrollTop = 176;
    pupilsList.clientHeight = 100;
    pupilsList.scrollHeight = 300;
    await pupilsList.emit('scroll');

    assert.equal(loadCount, 1);
    assert.equal(pupilsList.children.length, 2);
});

test('modal shares a page request triggered by search and scrolling', async (t) => {
    const originalDocument = global.document;
    global.document = createModalTestDocument();
    t.after(() => {
        global.document = originalDocument;
    });

    const timers = [];
    let resolvePage;
    let loadCount = 0;
    const modal = createResetModal({
        onClose() {},
        schedule(callback) {
            timers.push(callback);
            return timers.length - 1;
        },
        cancelScheduled() {}
    });
    const search = modal.overlay.querySelector('.edvibe-reset-search');
    const pupilsList = modal.overlay.querySelector('.edvibe-reset-pupils');
    const firstPupil = { PupilId: 1, Email: 'first@example.com' };

    modal.showPupils({
        pupils: [firstPupil],
        total: 2,
        onSelectPupil: async () => {},
        onLoadNext: () => {
            loadCount += 1;
            return new Promise((resolve) => {
                resolvePage = resolve;
            });
        }
    });

    search.value = 'second';
    await search.emit('input');
    const searchLoad = timers[0]();
    pupilsList.scrollTop = 176;
    pupilsList.clientHeight = 100;
    pupilsList.scrollHeight = 300;
    const scrollLoad = pupilsList.emit('scroll');
    assert.equal(loadCount, 1);

    resolvePage({
        pupils: [firstPupil, { PupilId: 2, Email: 'second@example.com' }],
        total: 2,
        hasMore: false
    });
    await Promise.all([searchLoad, scrollLoad]);
    assert.equal(loadCount, 1);
});
```

- [ ] **Step 2: Run the scroll tests and verify they fail**

Run:

```bash
node --test --test-name-pattern="modal (loads one pupil page|shares a page request)" tests/resetLessons.test.js
```

Expected: FAIL because the pupil list has no scroll listener.

- [ ] **Step 3: Add the near-bottom scroll listener**

Add near the existing input listener:

```js
search.addEventListener('input', handleSearchInput);
pupilsList.addEventListener('scroll', () => {
    const distanceFromBottom = pupilsList.scrollHeight
        - pupilsList.scrollTop
        - pupilsList.clientHeight;
    if (distanceFromBottom <= 24) {
        return loadNextPupilPage();
    }
});
```

The listener must use `loadNextPupilPage`; do not call the feature callback directly.

- [ ] **Step 4: Run scroll tests and the full suite**

Run:

```bash
node --test --test-name-pattern="modal (loads one pupil page|shares a page request)" tests/resetLessons.test.js
node --test tests/resetLessons.test.js
```

Expected: all tests pass.

### Task 5: Wire initial page loading into the workflow

**Files:**
- Modify: `tests/resetLessons.test.js`
- Modify: `resetLessons.js:1022-1136`

- [ ] **Step 1: Make modal creation injectable for feature-level testing**

Extend `createResetLessonsFeature`:

```js
function createResetLessonsFeature({
    sendRequest,
    sendWithoutResponse,
    wait,
    canStart,
    onActiveChange,
    createModal = createResetModal
}) {
```

Replace:

```js
const modal = createResetModal({ onClose: releaseOperation });
```

with:

```js
const modal = createModal({ onClose: releaseOperation });
```

- [ ] **Step 2: Write a failing feature-level initial-load test**

Add:

```js
test('reset workflow opens with exactly one 50-pupil request', async (t) => {
    const originalDocument = global.document;
    const originalWindow = global.window;
    global.document = {
        getElementById: () => null,
        body: { appendChild() {} }
    };
    global.window = {
        location: { href: 'https://app.edvibe.com/marathon/18508' },
        alert() {},
        confirm: () => false
    };
    t.after(() => {
        global.document = originalDocument;
        global.window = originalWindow;
    });

    const calls = [];
    let pupilConfig;
    const modal = {
        overlay: {},
        onReset() {},
        setLoading() {},
        showPupils(config) {
            pupilConfig = config;
        },
        showError(error) {
            throw error;
        }
    };
    const feature = createResetLessonsFeature({
        sendRequest: async (...args) => {
            calls.push(args);
            return {
                Value: {
                    Items: [{ PupilId: 1, Email: 'first@example.com' }],
                    Page: { Count: 120 }
                }
            };
        },
        sendWithoutResponse() {},
        wait: async () => {},
        canStart: () => true,
        onActiveChange() {},
        createModal: () => modal
    });

    await feature.open();

    assert.equal(calls.length, 1);
    assert.equal(calls[0][1], 'GetMarathonPupils');
    assert.deepEqual(calls[0][3], { MarathonId: 18508, Skip: 0, Take: 50 });
    assert.equal(pupilConfig.pupils.length, 1);
    assert.equal(pupilConfig.total, 120);
    assert.equal(typeof pupilConfig.onLoadNext, 'function');
});
```

- [ ] **Step 3: Run the feature test and verify it fails**

Run:

```bash
node --test --test-name-pattern="reset workflow opens with exactly one" tests/resetLessons.test.js
```

Expected: FAIL because `open()` still calls `loadAllPupils`.

- [ ] **Step 4: Replace eager workflow loading**

Inside the `try` block in `open()`, replace eager loading and the old `showPupils` call with:

```js
modal.setLoading('Loading marathon pupils...');
const pupilPager = createPupilPager(sendRequest, marathonId);
const initialPage = await pupilPager.loadNext();
console.log(
    `[Edvibe Toolbox][Reset] Loaded ${initialPage.pupils.length} of `
    + `${initialPage.total} pupil(s) for MarathonId ${marathonId}.`
);
modal.showPupils({
    pupils: initialPage.pupils,
    total: initialPage.total,
    onLoadNext: () => pupilPager.loadNext(),
    onSelectPupil: async (pupil) => {
        console.log(
            `[Edvibe Toolbox][Reset] Loading lessons for PupilId ${pupil.PupilId}.`
        );
        modal.setLoading(`Loading lessons for ${pupil.Email}...`);
        const response = await sendRequest(
            'MarathonLessonWsController',
            'GetMarathonLessonsForPupil',
            'Marathons',
            {
                PupilId: pupil.PupilId,
                MarathonId: marathonId,
                SearchTerm: '',
                Domain: 'edvibe.com'
            }
        );
        if (!Array.isArray(response.Value)) {
            throw new Error('GetMarathonLessonsForPupil returned invalid data.');
        }
        console.log(
            `[Edvibe Toolbox][Reset] Loaded ${response.Value.length} lesson(s) `
            + `for PupilId ${pupil.PupilId}.`
        );
        modal.showLessons(pupil, response.Value);
    }
});
```

- [ ] **Step 5: Run the feature test and full suite**

Run:

```bash
node --test --test-name-pattern="reset workflow opens with exactly one" tests/resetLessons.test.js
node --test tests/resetLessons.test.js
```

Expected: all tests pass.

### Task 6: Final verification

**Files:**
- Verify: `resetLessons.js`
- Verify: `main.js`
- Verify: `tests/resetLessons.test.js`

- [ ] **Step 1: Run automated verification**

Run:

```bash
node --test tests/resetLessons.test.js
node --check resetLessons.js
node --check main.js
```

Expected: all tests pass and both syntax checks exit successfully.

- [ ] **Step 2: Reload the unpacked extension**

Open `chrome://extensions`, reload Edvibe Toolbox, and verify Chrome reports no content-script or manifest errors.

- [ ] **Step 3: Verify initial loading**

Open reset lessons on a marathon with more than 50 pupils. Confirm the network traffic contains exactly one initial `GetMarathonPupils` request with `Skip: 0` and `Take: 50`.

- [ ] **Step 4: Verify delayed search**

Type an email fragment absent from the first page. Confirm no pupil request is sent during typing, the first additional request begins three seconds after the final input change, and requests stop as soon as a matching page arrives. Clear the field and confirm no new request is sent.

- [ ] **Step 5: Verify scrolling and race behavior**

Scroll the pupil list to the bottom and confirm one next page is appended. Scroll repeatedly while that request is pending and confirm no duplicate page request occurs. Repeat while an unmatched search is active and confirm `Skip` values remain ordered without duplicates.

- [ ] **Step 6: Verify existing wizard behavior**

Select a pupil, advance to lessons, return with `Назад`, and complete a controlled reset. Confirm lesson loading, retained selections, pupil changes, progress, errors, and close locking behave as before.

## Completion Criteria

- Opening the workflow loads at most 50 pupils in one request.
- Search filters loaded pupils immediately and waits three seconds before loading more.
- Blank or locally matched search does not request another page.
- Unmatched search stops on the first matching page or at the reported total.
- Stale searches cannot continue loading pages.
- Near-bottom scrolling loads one additional page.
- Search and scrolling cannot duplicate an in-flight page request.
- Closing the modal cancels pending delayed search work.
- Existing reset wizard and reset execution tests remain green.
- `node --test tests/resetLessons.test.js`, `node --check resetLessons.js`, and `node --check main.js` succeed.
