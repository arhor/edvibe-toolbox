# Clickable Popup Cards and Export-State Reset

## Goal

Prevent a page reload during marathon export from leaving the popup permanently
blocked, and simplify the popup by making each feature card launch its feature
without a separate action button.

## Export-State Lifecycle

The persisted `exportInProgress` flag allows separately opened popup instances to
reflect a live export. Reloading the Edvibe page destroys the page-world export
workflow before it can send a completion or error status, so the persisted flag
can remain stale.

On each isolated content-script initialization, reset `exportInProgress` to
`false`. A new isolated-script instance means the corresponding page context has
loaded again, and no export from its previous page context can still be running.
Normal export status messages continue to set and clear the stored flag while the
current page remains loaded.

## Clickable Feature Cards

Remove the visible action button from `popup-tool-card` and remove unused
`actionLabel` values from the tool catalogue. The custom element itself becomes
the interaction target.

An enabled card:

- launches its configured tool when clicked;
- launches it from the keyboard with Enter or Space;
- exposes button semantics and a keyboard focus target;
- receives hover and focus styling that makes its interactivity apparent.

A disabled, busy, or pending card:

- does not launch from pointer or keyboard input;
- exposes its disabled state to assistive technology;
- is removed from the keyboard tab order;
- retains the existing availability or blocking explanation.

Busy and pending cards display their existing `busyLabel` as a small status
inside the card. The reset tool retains a restrained danger appearance at card
level rather than on a removed button.

## Component Responsibilities

`popup.js` remains responsible for the tool catalogue, page requirements,
pending/export state, and command execution.

`src/components/popup-tool-list.js` remains responsible for rendering cards and
translating pointer and keyboard activation into `onExecute(toolId)` calls.

`popup.css` supplies card-level interactive, focus, disabled, busy-status, and
danger styling. No presentation styles are assigned from JavaScript.

`src/isolated.js` owns the page-load reset because its initialization tracks the
lifecycle event that invalidates the persisted export flag.

## Error and Concurrency Behavior

Existing command errors, popup status messages, page requirements, and
single-operation blocking remain unchanged. Repeated activation is prevented by
the pending state before the asynchronous tab command is sent.

The page-load reset does not attempt to resume or report a cancelled export. It
only releases the stale popup lock, matching the fact that reload has already
terminated the export workflow.

## Verification

Automated checks will cover:

- isolated-script initialization clears stale export state;
- export status updates still persist active and inactive states;
- cards contain no action buttons;
- enabled cards activate via click, Enter, and Space;
- disabled cards cannot activate and expose disabled semantics;
- busy cards render their status text;
- popup catalogue and styles no longer depend on action-button labels or
  selectors.

Focused syntax checks and the repository's Node test suite will run after the
change. Manual validation should reload an Edvibe marathon page during export,
reopen the popup, and confirm all eligible cards become available again.
