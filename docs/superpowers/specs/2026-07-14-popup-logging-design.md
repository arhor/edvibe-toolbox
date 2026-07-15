# Popup Logging Update

## Goal

Make popup logs concise, accurate, and useful for tracing export and lesson
reset actions without logging response payloads.

## Design

`popup.js` will keep the existing `[Edvibe Toolbox][Popup]` prefix. Logs will
describe concrete events: the popup initialization, export-state restoration,
received export-status updates, commands sent to a tab, and lesson-reset
startup and success.

Existing vague or inaccurate text will be replaced. In particular, the popup
does not send an execution token or communicate with a page environment; it
sends a named command to an active tab. Command acknowledgements will log the
command and the returned status only, rather than the full response object.

## Constraints

- Do not change popup commands, button behavior, or error handling.
- Do not log tab URLs, full response objects, or sensitive educational data.
- Preserve existing error logs, adjusted only for clarity if necessary.

## Verification

- Parse-check `popup.js` with `node --check popup.js`.
- Manually verify the popup console shows the expected lifecycle logs for both
  the export and reset actions.
