import { css } from 'lit';

export const batchSectionImageUploadStyles = css`
    .edvibe-batch-section-file-input {
        cursor: pointer;
    }

    .edvibe-batch-section-file-details {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-top: 8px;
        color: var(--toolfox-text-muted);
        font-size: 12px;
        line-height: 1.4;
    }

    .edvibe-batch-section-file-details button {
        flex: 0 0 auto;
        min-height: 32px;
        padding: 5px 9px;
        font-size: 12px;
    }

    .edvibe-batch-section-file-error {
        margin: 8px 0 0;
        font-size: 12px;
        line-height: 1.4;
    }

    .edvibe-batch-section-image-preview {
        display: block;
        width: 100%;
        max-height: 240px;
        margin-top: 10px;
        object-fit: contain;
        border: 1px solid var(--toolfox-border-subtle);
        border-radius: var(--toolfox-radius-panel);
        background: var(--toolfox-surface-subtle);
    }
`;
