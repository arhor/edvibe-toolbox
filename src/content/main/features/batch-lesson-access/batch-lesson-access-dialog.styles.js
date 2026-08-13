import { css } from 'lit';

export const batchLessonAccessDialogStyles = css`
    [hidden] {
        display: none !important;
    }

    .edvibe-batch-access-card {
        display: flex;
        flex-direction: column;
        width: min(760px, calc(100vw - 32px));
        max-height: min(820px, calc(100vh - 32px));
        padding: 24px;
    }

    .edvibe-batch-access-header,
    .edvibe-batch-access-lesson-heading,
    .edvibe-batch-access-selection-actions,
    .edvibe-batch-access-email-state,
    .edvibe-batch-access-footer {
        display: flex;
        align-items: center;
    }

    .edvibe-batch-access-header,
    .edvibe-batch-access-lesson-heading {
        justify-content: space-between;
        gap: 16px;
    }

    .edvibe-batch-access-header h2,
    .edvibe-batch-access-lesson-heading h3 {
        margin: 0;
        color: var(--edvibe-text-strong);
    }

    .edvibe-batch-access-header h2 {
        font-size: 21px;
        line-height: 1.3;
    }

    .edvibe-batch-access-description {
        margin: 5px 0 0;
        color: var(--edvibe-text-muted);
        font-size: 13px;
        line-height: 1.4;
    }

    .edvibe-batch-access-close {
        min-width: 36px;
        padding: 0;
        font-size: 24px;
        line-height: 1;
    }

    .edvibe-batch-access-body {
        flex: 1 1 auto;
        min-height: 0;
        overflow: auto;
        margin-top: 18px;
    }

    .edvibe-batch-access-email-field,
    .edvibe-batch-access-lesson-heading h3 {
        color: var(--edvibe-text);
        font-size: 13px;
    }

    .edvibe-batch-access-emails {
        min-height: 112px;
        resize: vertical;
        line-height: 1.45;
    }

    .edvibe-batch-access-email-state {
        flex-wrap: wrap;
        gap: 8px 16px;
    }

    .edvibe-batch-access-lesson-heading {
        margin-top: 20px;
    }

    .edvibe-batch-access-selection-actions {
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 8px 12px;
        color: var(--edvibe-text);
        font-size: 13px;
    }

    .edvibe-batch-access-selection-actions label {
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
    }

    .edvibe-batch-access-clear-all {
        min-height: 32px;
        padding: 5px 9px;
    }

    .edvibe-batch-access-lessons {
        overflow: auto;
        max-height: 248px;
        margin-top: 10px;
        border: 1px solid var(--edvibe-border-subtle);
        border-radius: var(--edvibe-radius-panel);
        background: var(--edvibe-surface);
    }

    .edvibe-batch-access-errors,
    .edvibe-batch-access-summary,
    .edvibe-batch-access-failures {
        overflow: auto;
        max-height: 248px;
        margin-top: 10px;
    }

    .edvibe-batch-access-lesson {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 11px 12px;
        border-bottom: 1px solid var(--edvibe-border-subtle);
        color: var(--edvibe-text);
        font-size: 14px;
        line-height: 1.4;
        cursor: pointer;
    }

    .edvibe-batch-access-lesson:last-child {
        border-bottom: 0;
    }

    .edvibe-batch-access-lesson:hover {
        background: var(--edvibe-info-surface);
    }

    .edvibe-batch-access-lesson:focus-within {
        outline: 2px solid var(--edvibe-focus-outline);
        outline-offset: -2px;
    }

    .edvibe-batch-access-lesson input {
        flex: 0 0 auto;
        margin-top: 3px;
    }

    .edvibe-batch-access-empty {
        margin: 0;
    }

    .edvibe-batch-access-error,
    .edvibe-batch-access-failure {
        margin: 0;
        color: inherit;
        font-size: 13px;
        line-height: 1.45;
        overflow-wrap: anywhere;
    }

    .edvibe-batch-access-error + .edvibe-batch-access-error,
    .edvibe-batch-access-failure + .edvibe-batch-access-failure {
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid currentColor;
    }

    .edvibe-batch-access-summary {
        font-size: 13px;
        line-height: 1.55;
        white-space: pre-line;
    }

    .edvibe-batch-access-live-region {
        flex: 0 0 auto;
        padding-top: 16px;
    }

    .edvibe-batch-access-loading-indicator {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 7px;
        border: 2px solid var(--edvibe-info-border);
        border-top-color: var(--edvibe-primary);
        border-radius: 50%;
        vertical-align: -3px;
        animation: edvibe-batch-access-spin .8s linear infinite;
    }

    @keyframes edvibe-batch-access-spin {
        to {
            transform: rotate(360deg);
        }
    }

    .edvibe-batch-access-status {
        min-height: 20px;
        margin: 0;
        font-size: 13px;
        line-height: 1.4;
    }

    .edvibe-batch-access-status.is-error {
        color: var(--edvibe-danger);
    }

    .edvibe-batch-access-progress {
        display: block;
        width: 100%;
        height: 11px;
        margin-top: 10px;
    }

    .edvibe-batch-access-footer {
        flex: 0 0 auto;
        margin-top: 18px;
    }

    .edvibe-batch-access-selection-actions input:disabled {
        cursor: not-allowed;
        opacity: .58;
    }

    @media (max-width: 560px) {
        .edvibe-batch-access-card {
            width: 100%;
            max-height: 100vh;
            padding: 18px;
        }

        .edvibe-batch-access-lesson-heading {
            align-items: flex-start;
            flex-direction: column;
        }

        .edvibe-batch-access-selection-actions {
            justify-content: flex-start;
        }

        .edvibe-batch-access-footer button {
            flex: 1 1 180px;
        }
    }
`;
