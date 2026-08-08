import { css } from 'lit';

export const batchUserManagementDialogStyles = css`
:host {
    all: initial;
}

.edvibe-batch-user-management-overlay {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    box-sizing: border-box;
    background: rgba(15, 23, 42, .6);
    color: #1f2937;
    font-family: "Segoe UI", Arial, sans-serif;
}

.edvibe-batch-user-management-overlay *,
.edvibe-batch-user-management-overlay *::before,
.edvibe-batch-user-management-overlay *::after {
    box-sizing: border-box;
}

[hidden] {
    display: none !important;
}

.edvibe-batch-user-management-card {
    display: flex;
    flex-direction: column;
    width: min(980px, calc(100vw - 32px));
    max-height: min(820px, calc(100vh - 32px));
    padding: 24px;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 24px 80px rgba(15, 23, 42, .38);
}

.edvibe-batch-user-management-header,
.edvibe-batch-user-management-email-state,
.edvibe-batch-user-management-footer {
    display: flex;
    align-items: center;
}

.edvibe-batch-user-management-header {
    justify-content: space-between;
    gap: 16px;
}

.edvibe-batch-user-management-header h2 {
    margin: 0;
    color: #111827;
    font-size: 21px;
    line-height: 1.3;
}

.edvibe-batch-user-management-description {
    margin: 5px 0 0;
    color: #6b7280;
    font-size: 13px;
    line-height: 1.4;
}

.edvibe-batch-user-management-close {
    padding: 4px 8px;
    border: 0;
    background: transparent;
    color: #6b7280;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
}

.edvibe-batch-user-management-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    margin-top: 18px;
}

.edvibe-batch-user-management-configure > label {
    display: block;
    color: #374151;
    font-size: 13px;
    font-weight: 650;
}

.edvibe-batch-user-management-emails {
    display: block;
    width: 100%;
    min-height: 112px;
    margin-top: 7px;
    padding: 10px 12px;
    resize: vertical;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    color: #111827;
    font: inherit;
    line-height: 1.45;
    outline: none;
}

.edvibe-batch-user-management-email-state {
    flex-wrap: wrap;
    gap: 8px 16px;
    margin-top: 7px;
    color: #6b7280;
    font-size: 12px;
}

.edvibe-batch-user-management-table-wrap,
.edvibe-batch-user-management-errors {
    overflow: auto;
    max-height: 350px;
    margin-top: 18px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
}

.edvibe-batch-user-management-table {
    width: 100%;
    border-collapse: collapse;
    color: #1f2937;
    font-size: 13px;
}

.edvibe-batch-user-management-table th,
.edvibe-batch-user-management-table td {
    padding: 11px 12px;
    border-bottom: 1px solid #f1f5f9;
    text-align: left;
    vertical-align: top;
}

.edvibe-batch-user-management-table th {
    position: sticky;
    top: 0;
    z-index: 1;
    color: #374151;
    background: #f8fafc;
    font-size: 12px;
    font-weight: 700;
}

.edvibe-batch-user-management-table tr:last-child td {
    border-bottom: 0;
}

.edvibe-batch-user-management-table th:nth-child(2),
.edvibe-batch-user-management-table th:nth-child(3),
.edvibe-batch-user-management-table td:nth-child(2),
.edvibe-batch-user-management-table td:nth-child(3) {
    width: 150px;
    text-align: center;
}

.edvibe-batch-user-management-table th button {
    display: block;
    margin: 5px auto 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: #2563eb;
    font: inherit;
    font-size: 11px;
    cursor: pointer;
}

.edvibe-batch-user-management-user {
    min-width: 220px;
    overflow-wrap: anywhere;
}

.edvibe-batch-user-management-result {
    min-width: 220px;
    color: #4b5563;
    overflow-wrap: anywhere;
}

.edvibe-batch-user-management-errors {
    border-color: #fecaca;
    background: #fef2f2;
}

.edvibe-batch-user-management-error {
    margin: 0;
    padding: 11px 12px;
    border-bottom: 1px solid #fee2e2;
    color: #b91c1c;
    font-size: 13px;
    line-height: 1.4;
}

.edvibe-batch-user-management-error:last-child {
    border-bottom: 0;
}

.edvibe-batch-user-management-live-region {
    flex: 0 0 auto;
    padding-top: 16px;
}

.edvibe-batch-user-management-status {
    min-height: 20px;
    margin: 0;
    color: #4b5563;
    font-size: 13px;
    line-height: 1.4;
}

.edvibe-batch-user-management-status.is-error {
    color: #b91c1c;
}

.edvibe-batch-user-management-progress {
    display: block;
    width: 100%;
    height: 11px;
    margin-top: 10px;
    overflow: hidden;
    border: 0;
    border-radius: 999px;
    background: #e5e7eb;
    appearance: none;
}

.edvibe-batch-user-management-progress::-webkit-progress-bar {
    background: #e5e7eb;
}

.edvibe-batch-user-management-progress::-webkit-progress-value {
    border-radius: 999px;
    background: linear-gradient(90deg, #2563eb, #dc2626);
}

.edvibe-batch-user-management-footer {
    flex: 0 0 auto;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 18px;
}

.edvibe-batch-user-management-footer button {
    padding: 10px 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #fff;
    color: #374151;
    font: inherit;
    font-size: 13px;
    font-weight: 650;
    cursor: pointer;
}

.edvibe-batch-user-management-check,
.edvibe-batch-user-management-start {
    border-color: #2563eb !important;
    background: #2563eb !important;
    color: #fff !important;
}

.edvibe-batch-user-management-footer button:disabled,
.edvibe-batch-user-management-close:disabled,
.edvibe-batch-user-management-emails:disabled {
    cursor: not-allowed;
    opacity: .58;
}

@media (max-width: 680px) {
    .edvibe-batch-user-management-card {
        width: 100%;
        max-height: calc(100vh - 16px);
        padding: 18px;
        border-radius: 12px;
    }

    .edvibe-batch-user-management-overlay {
        padding: 8px;
    }

    .edvibe-batch-user-management-table {
        min-width: 760px;
    }
}

`;
