# Reset Pupil Pagination Design

## Goal

Stop loading every marathon pupil when the reset-lessons workflow opens. Load pupils in pages of 50 and fetch additional pages only when delayed search or list scrolling requires them.

## Initial Loading

Opening the reset-lessons workflow sends one `GetMarathonPupils` request with:

- `Skip: 0`
- `Take: 50`

The response's `Page.Count` is the total number of available pupils. The modal displays the first page immediately and keeps enough pagination state to determine whether another page is available.

## Shared Pagination State

Search and scrolling use one loader and one ordered pupil collection. The loader tracks:

- loaded pupils;
- the server-reported total count;
- whether a page request is in progress;
- whether another page is available;
- the current search generation.

Only one page request may run at a time. Callers share the in-flight request instead of requesting the same page twice. Each successful page is appended once, preserving server order.

An invalid response or an empty page received before the reported total is reached is treated as an error. The modal remains open and displays a recoverable error.

## Local Filtering

Email matching remains case-insensitive substring matching after trimming surrounding whitespace.

Every input event resets a three-second debounce timer. Until that timer expires, the currently rendered rows remain in place, the pupil table is visually dimmed, and a spinner overlay communicates that search is pending. The latest query is applied only after three seconds without another input change. Clearing the field follows the same delay and then displays all loaded pupils.

An empty or whitespace-only search never starts a pupil request.

## Delayed Search Loading

When the debounce timer expires:

1. Normalize the current query.
2. Render matches from the pupils already loaded.
3. Stop if the query is blank.
4. Stop if any loaded pupil already matches.
5. Otherwise, request the next page and filter again.
6. Repeat until a matching pupil is found or all pages are exhausted.

Search stops after the first page that produces at least one match. It does not continue loading later possible matches.

Each input change advances the search generation. A search loop checks its generation before continuing, so a response started for an older query may still be safely added to the shared pupil collection but cannot continue loading pages for that stale query.

The table remains dimmed and the spinner remains visible throughout delayed filtering and any follow-up pagination. If no user matches after all pages are exhausted, the spinner is removed and the table displays `Пользователи не найдены.` Existing rows must not disappear during the waiting/loading phase.

## Infinite Scrolling

When the pupil list is scrolled near its bottom and another page is available, request one next page. Reaching the threshold repeatedly while a request is in progress does not create overlapping requests.

After a page is appended, render the list using the current search query. Scrolling may load another page even when a search query is active.

Scroll loading requests one page per scroll-triggered attempt. Further pages require another near-bottom scroll event or the active delayed-search loop.

## Modal Integration

The modal receives a paginated pupil source instead of a completed array:

- initial pupils and total count populate the first render;
- a load-next callback supplies additional pages;
- successful page loads append and re-render;
- loading state prevents duplicate requests without disabling unrelated wizard actions longer than necessary.

Selecting a pupil, advancing to lesson selection, returning with `Назад`, and preserving or invalidating lesson selections retain their existing behavior.

Any pending search timer is cleared when the modal closes. Search or scroll continuations must not update a closed modal.

## Validation

Automated tests should verify:

- opening requests exactly 50 pupils and does not request the second page;
- `Skip` advances by the number of loaded pupils and `Take` remains 50;
- input leaves existing rows visible and delays local filtering for three seconds;
- the pupil table is dimmed and displays a spinner during debounce and pagination;
- a completed search with no match displays `Пользователи не найдены.`;
- a matching loaded pupil causes no delayed request;
- blank and whitespace-only input cause no delayed request;
- delayed search waits three seconds after the latest input change;
- delayed search loads until the first matching page;
- delayed search stops when the total count is reached;
- changing the query prevents a stale loop from loading further pages;
- scroll near the bottom loads one page when available;
- repeated scroll events do not overlap requests;
- search and scroll share pagination without duplicate pages;
- pagination failures remain recoverable;
- existing wizard and reset behavior remains unchanged.

Manual validation should confirm the three-second delay, dimmed-table spinner state, scrolling behavior, completed no-results state, error presentation, and pupil selection on a marathon with more than 50 pupils.
