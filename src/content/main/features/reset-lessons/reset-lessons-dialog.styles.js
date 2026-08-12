import { css } from 'lit';

export const resetLessonsDialogStyles = css`
:host([hidden]) {
    display: none !important;
}

:host(.is-running) .edvibe-reset-body {
    display: none;
}

[hidden] {
    display: none !important;
}

.edvibe-reset-card {
    display: flex;
    flex-direction: column;
    width: min(760px, calc(100vw - 32px));
    max-height: min(820px, calc(100vh - 32px));
    padding: 24px;
}

.edvibe-reset-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
}

.edvibe-reset-title {
    margin: 0;
    color: var(--edvibe-text-strong);
    font-size: 21px;
    line-height: 1.3;
}

.edvibe-reset-subtitle {
    margin: 5px 0 0;
    color: var(--edvibe-text-muted);
    font-size: 13px;
}

.edvibe-reset-step-indicator {
    margin-right: 8px;
    color: var(--edvibe-primary);
    font-weight: 700;
}

.edvibe-reset-close {
    min-width: 36px;
    padding: 0;
    font-size: 24px;
    line-height: 1;
}

.edvibe-reset-body {
    flex: 1 1 auto;
    overflow: auto;
    min-height: 0;
    margin-top: 18px;
}

.edvibe-reset-search-field {
    font-size: 13px;
}

.edvibe-reset-label {
    display: block;
    margin-bottom: 7px;
    color: var(--edvibe-text);
    font-size: 13px;
    font-weight: 650;
}

.edvibe-reset-list {
    overflow: auto;
    max-height: 250px;
    margin-top: 10px;
    border: 1px solid var(--edvibe-border-subtle);
    border-radius: var(--edvibe-radius-panel);
    background: var(--edvibe-surface);
}

.edvibe-reset-pupils-shell {
    position: relative;
}

.edvibe-reset-pupils-shell.is-loading {
    min-height: 96px;
}

.edvibe-reset-pupils-shell.is-loading .edvibe-reset-pupils {
    opacity: .45;
    pointer-events: none;
}

.edvibe-reset-pupils-loading {
    position: absolute;
    inset: 10px 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-radius: var(--edvibe-radius-panel);
    background: color-mix(in srgb, var(--edvibe-surface) 72%, transparent);
    color: var(--edvibe-text);
    font-size: 13px;
    font-weight: 650;
}

.edvibe-reset-spinner {
    width: 22px;
    height: 22px;
    border: 3px solid var(--edvibe-info-border);
    border-top-color: var(--edvibe-primary);
    border-radius: 50%;
    animation: edvibe-reset-spinner-rotate .8s linear infinite;
}

.edvibe-reset-row {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 10px;
    padding: 11px 12px;
    border: 0;
    border-bottom: 1px solid var(--edvibe-border-subtle);
    background: var(--edvibe-surface);
    color: var(--edvibe-text);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.edvibe-reset-row:last-child {
    border-bottom: 0;
}

.edvibe-reset-row:hover,
.edvibe-reset-row.is-selected {
    background: var(--edvibe-info-surface);
}

.edvibe-reset-row:focus-visible {
    outline: 3px solid var(--edvibe-focus-outline);
    outline-offset: -3px;
}

.edvibe-reset-row:disabled {
    cursor: not-allowed;
    opacity: .58;
}

.edvibe-reset-row-copy {
    min-width: 0;
}

.edvibe-reset-row-name,
.edvibe-reset-row-email {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.edvibe-reset-row-name {
    font-size: 14px;
    font-weight: 650;
}

.edvibe-reset-row-email {
    margin-top: 2px;
    color: var(--edvibe-text-muted);
    font-size: 12px;
}

.edvibe-reset-select-all {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 650;
}

.edvibe-reset-select-all input:disabled {
    cursor: not-allowed;
    opacity: .58;
}

.edvibe-reset-lesson {
    align-items: flex-start;
    cursor: default;
}

.edvibe-reset-lesson input {
    margin-top: 3px;
}

.edvibe-reset-empty {
    margin: 0;
}

.edvibe-reset-status {
    min-height: 38px;
    margin: 0;
    font-size: 13px;
    line-height: 1.4;
    white-space: pre-line;
}

.edvibe-reset-live-region {
    flex: 0 0 auto;
    padding-top: 16px;
}

.edvibe-reset-status.is-error {
    color: var(--edvibe-danger);
}

.edvibe-reset-status.is-success {
    color: var(--edvibe-success);
}

.edvibe-reset-progress {
    display: none;
    height: 11px;
    margin-top: 10px;
    accent-color: var(--edvibe-danger);
}

.edvibe-reset-progress.is-visible {
    display: block;
}

.edvibe-reset-footer {
    margin-top: 18px;
}

.edvibe-reset-button {
    font-size: 13px;
}

@keyframes edvibe-reset-spinner-rotate {
    to {
        transform: rotate(360deg);
    }
}

@media (prefers-reduced-motion:reduce) {
    .edvibe-reset-spinner {
        animation: none;
    }
}

`;
