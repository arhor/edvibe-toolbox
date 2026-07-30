# Batch Lesson Access Loading and Input State Design

## Goal

Make the batch lesson access dialog explicit and reliable while its initial
lesson catalogue is loading. Users may paste email addresses immediately after
the dialog opens, and the eventual lesson-list render must not erase the email
validation state that enables the primary action.

## Design

The dialog receives a dedicated loading state immediately after it is appended
to the page. This state keeps the email textarea available, displays a visible
indeterminate spinner with an accessible status message, and leaves lesson
selection controls unavailable until the catalogue arrives. The existing
initialization request continues to run in the feature coordinator.

When the feature calls `showConfigure` after loading lessons, it supplies the
catalogue only. The dialog retains the email text and parsed email counters
already received through its input-change event. `showConfigure` continues to
accept an explicit `emailState` for callers that need to initialize or reset
the state, but does not overwrite the state when that option is omitted.

## Data flow and states

1. Feature creates and appends the dialog.
2. Feature calls `showLoading`.
3. User may paste/type emails; the feature parses them and updates the dialog's
   email counters.
4. Feature loads the roster and lesson catalogue.
5. Feature calls `showConfigure({ lessons })`; the existing email value/state is
   retained, lessons are rendered, and the submit button is enabled when the
   user has valid emails and selected lessons.
6. Initialization errors continue to use the existing fatal-error state.

The loading indicator is a semantic `role="status"` region containing an
indeterminate spinner, with text that communicates that lessons are loading.
No lesson data or email contents are logged.

## Testing

Add component tests for the loading state and for preserving input/state when
lessons are configured without a replacement email state. Add a feature test
that verifies loading is shown before the asynchronous initialization requests
and that the final `showConfigure` call does not reset the email state.

Manual validation remains required on an Edvibe marathon page: open the tool,
confirm the loader is visible, paste emails before lessons finish loading,
select lessons, and confirm the primary button enables without editing the
textarea again.
