import { css } from 'lit';

export const batchUserOnboardingDialogStyles = css`
:host {
    all: initial;
}

[hidden] {
    display: none !important;
}

.overlay {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    box-sizing: border-box;
    background: rgba(15, 23, 42, .62);
    color: #1f2937;
    font-family: "Segoe UI", Arial, sans-serif;
}

.overlay *,
.overlay *::before,
.overlay *::after {
    box-sizing: border-box;
}

.dialog {
    display: flex;
    flex-direction: column;
    width: min(1180px, calc(100vw - 32px));
    max-height: min(880px, calc(100vh - 32px));
    padding: 24px;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 24px 80px rgba(15, 23, 42, .38);
}

.header,
.footer,
.email-state,
.review-toolbar,
.result-actions {
    display: flex;
    align-items: center;
}

.header {
    justify-content: space-between;
    gap: 18px;
}

.eyebrow {
    margin: 0 0 4px;
    color: #2563eb;
    font-size: 11px;
    font-weight: 750;
    letter-spacing: .08em;
    text-transform: uppercase;
}

.header h2 {
    margin: 0;
    color: #111827;
    font-size: 21px;
    line-height: 1.3;
}

.description {
    margin: 5px 0 0;
    color: #6b7280;
    font-size: 13px;
    line-height: 1.4;
}

.icon {
    padding: 4px 8px;
    border: 0;
    background: transparent;
    color: #6b7280;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
}

.body {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    margin-top: 18px;
}

.configure {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(240px, 1fr);
    gap: 14px 18px;
}

.field {
    display: block;
    color: #374151;
    font-size: 13px;
    font-weight: 650;
}

.field > span {
    display: block;
    margin-bottom: 7px;
}

.field small {
    display: block;
    margin-top: 5px;
    color: #6b7280;
    font-size: 11px;
    font-weight: 400;
}

.emails,
.curator,
.report {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #fff;
    color: #111827;
    font: inherit;
    line-height: 1.45;
    outline: none;
}

.emails,
.report {
    resize: vertical;
}

.emails {
    min-height: 112px;
}

.report {
    min-height: 190px;
    white-space: pre;
}

.email-state {
    grid-column: 1;
    flex-wrap: wrap;
    gap: 8px 16px;
    margin-top: -8px;
    color: #6b7280;
    font-size: 12px;
}

.curator-field {
    grid-column: 2;
    grid-row: 1 / span 2;
}

.errors {
    margin-top: 14px;
    padding: 10px 12px;
    border: 1px solid #fecaca;
    border-radius: 8px;
    background: #fef2f2;
    color: #b91c1c;
    font-size: 13px;
}

.errors p {
    margin: 0;
}

.review {
    margin-top: 18px;
}

.review-toolbar {
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
    color: #6b7280;
    font-size: 12px;
}

.review-toolbar strong {
    color: #374151;
}

.table-wrap {
    overflow: auto;
    max-height: 390px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
}

table {
    width: 100%;
    min-width: 1020px;
    border-collapse: collapse;
    color: #1f2937;
    font-size: 12px;
}

th,
td {
    padding: 10px 11px;
    border-bottom: 1px solid #f1f5f9;
    text-align: left;
    vertical-align: top;
}

th {
    position: sticky;
    top: 0;
    z-index: 1;
    background: #f8fafc;
    color: #374151;
    font-weight: 700;
}

th:nth-child(4),
th:nth-child(5),
td:nth-child(4),
td:nth-child(5) {
    width: 110px;
    text-align: center;
}

th button {
    display: block;
    margin: 5px auto 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: #2563eb;
    font: inherit;
    font-size: 10px;
    cursor: pointer;
}

td strong,
td small {
    display: block;
    overflow-wrap: anywhere;
}

td small {
    margin-top: 3px;
    color: #6b7280;
}

.is-error,
.row-status {
    overflow-wrap: anywhere;
}

.is-error {
    color: #b91c1c;
}

.row-status {
    min-width: 190px;
    color: #4b5563;
}

.preflight,
.result {
    margin-top: 18px;
    padding: 14px;
    border: 1px solid #dbeafe;
    border-radius: 10px;
    background: #f8fbff;
}

.preflight h3 {
    margin: 0 0 7px;
    color: #111827;
    font-size: 15px;
}

.preflight p,
.preflight ul {
    margin: 7px 0 0;
    color: #4b5563;
    font-size: 12px;
    line-height: 1.45;
}

.preflight ul {
    max-height: 190px;
    overflow: auto;
    padding-left: 20px;
}

.result-actions {
    justify-content: flex-end;
    gap: 8px;
    margin-top: 10px;
}

.live-region {
    flex: 0 0 auto;
    padding-top: 14px;
}

.status {
    min-height: 20px;
    margin: 0;
    color: #4b5563;
    font-size: 13px;
    line-height: 1.4;
}

.progress {
    display: block;
    width: 100%;
    height: 10px;
    margin-top: 9px;
}

.footer {
    flex: 0 0 auto;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 9px;
    margin-top: 18px;
}

.footer button,
.result-actions button {
    padding: 9px 14px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font: inherit;
    font-size: 12px;
    font-weight: 650;
    cursor: pointer;
}

.primary {
    border-color: #2563eb !important;
    background: #2563eb;
    color: #fff;
}

.secondary {
    background: #fff;
    color: #374151;
}

button:disabled,
textarea:disabled,
select:disabled,
input:disabled {
    cursor: not-allowed;
    opacity: .58;
}

button:focus-visible,
textarea:focus-visible,
select:focus-visible,
input:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
}

@media (max-width: 760px) {
    .overlay {
        padding: 8px;
    }

    .dialog {
        width: 100%;
        max-height: calc(100vh - 16px);
        padding: 18px;
        border-radius: 12px;
    }

    .configure {
        grid-template-columns: 1fr;
    }

    .email-state,
    .curator-field {
        grid-column: 1;
        grid-row: auto;
    }
}
`;
