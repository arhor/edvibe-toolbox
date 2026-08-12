import { css } from 'lit';

export const exportProgressDialogStyles = css`
:host {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    font-family: "Segoe UI", Arial, sans-serif;
}

.overlay {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    background: rgba(15, 23, 42, 0.55);
}

.card {
    width: min(630px, calc(100vw - 32px));
    padding: 24px;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 24px 80px rgba(15, 23, 42, 0.35);
    color: #1f2937;
}

h2 { margin: 0 0 8px; color: #111827; font-size: 20px; line-height: 1.3; }
.status {
    min-height: 40px;
    margin: 0 0 16px;
    color: #4b5563;
    font-size: 14px;
    line-height: 1.4;
    white-space: pre-line;
}
.progress {
    display: block;
    width: 100%;
    height: 12px;
    overflow: hidden;
    border: 0;
    border-radius: 999px;
    background: #e5e7eb;
    appearance: none;
}
.progress::-webkit-progress-bar { background: #e5e7eb; }
.progress::-webkit-progress-value {
    border-radius: 999px;
    background: linear-gradient(90deg, #3498db, #22c55e);
    transition: width 0.25s ease;
}
:host([error]) .progress::-webkit-progress-value { background: #e74c3c; }
.meta {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-top: 10px;
    color: #6b7280;
    font-size: 12px;
}
.close {
    display: none;
    width: 100%;
    margin-top: 18px;
    padding: 9px 12px;
    border: 0;
    border-radius: 8px;
    background: #3498db;
    color: #fff;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
}
:host([complete]) .close,
:host([error]) .close { display: block; }

`;
