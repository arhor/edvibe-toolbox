# Popup Inline Handlers

## Goal

Move popup button click wiring from JavaScript `getElementById` and
`addEventListener` calls into declarative `onclick` attributes in
`popup.html`, without changing the existing export or lesson-reset behavior.

## Design

The two popup buttons will declare their actions directly:

- The export button calls `startAutomation(this)`.
- The reset button calls `openLessonReset(this)`.

`popup.js` exposes those two named handler functions on `window`, which is
required for handlers referenced from HTML attributes. Each function accepts
the clicked button as its argument. This removes the need to look up a button
solely to attach its click listener.

The export button lookup remains because the popup's status-message listener
and storage synchronization must update the button even without a click
event. The reset button is not queried: its handler uses the received button
to apply and restore the disabled state. Neither button uses JavaScript to
register a click listener.

## Preserved Behavior

- Export status messages still update the export button.
- Existing active-tab validation and Chrome tab messages are unchanged.
- Export failures still show an alert and restore the button state.
- Reset failures still show an alert and re-enable the reset button.
- A successful reset still closes the popup.

## Verification

- Parse-check `popup.js`.
- Reload the unpacked extension and confirm Chrome accepts the popup.
- Confirm export state is restored when the popup opens.
- Confirm each button dispatches its existing command and handles errors as
  before.
