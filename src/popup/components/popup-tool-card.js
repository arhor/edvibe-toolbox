import { html, LitElement, nothing } from 'lit';

import { getToolViewModel } from '#src/popup/popup-model.js';

export class PopupToolCard extends LitElement {
    static properties = {
        tool: { attribute: false },
        pageContext: { attribute: false },
        exportInProgress: { type: Boolean },
        pendingToolId: { attribute: false }
    };

    constructor() {
        super();
        this.tool = {};
        this.pageContext = { type: 'loading' };
        this.exportInProgress = false;
        this.pendingToolId = null;
    }

    get toolViewModel() {
        return getToolViewModel(this.tool, {
            pageContext: this.pageContext,
            exportInProgress: this.exportInProgress,
            pendingToolId: this.pendingToolId
        });
    }

    createRenderRoot() {
        return this;
    }

    activate() {
        const { id, disabled } = this.toolViewModel;

        if (disabled || !id) {
            return;
        }
        this.dispatchEvent(new CustomEvent('popup-tool-activate', {
            detail: {
                toolId: id,
            },
            bubbles: true,
        }));
    }

    render() {
        const { id, title, description, appearance, busyLabel, disabled, reason, busy } = this.toolViewModel;

        return html`
            <button
                type="button"
                data-tool-id=${id}
                data-danger=${appearance === 'danger' ? 'true' : nothing}
                ?disabled=${disabled}
                @click=${this.activate}
            >
                <span class="tool-card-header">
                    <span class="tool-copy">
                        <strong class="tool-title">${title}</strong>
                        <span class="tool-description">${description}</span>

                        ${reason
                            ? html`<span class="tool-requirement">${reason}</span>`
                            : nothing}

                        ${busy
                            ? html`<span class="tool-busy">${busyLabel}</span>`
                            : nothing}
                    </span>
                </span>
            </button>
        `;
    }
}

customElements.define('popup-tool-card', PopupToolCard);
