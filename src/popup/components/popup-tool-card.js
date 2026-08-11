import { html, LitElement, nothing } from 'lit';

const POPUP_TOOL_CARD_TAG = 'popup-tool-card';

class PopupToolCard extends LitElement {
    static properties = {
        tool: { attribute: false },
        disabled: { type: Boolean },
        reason: { type: String },
        busy: { type: Boolean }
    };

    constructor() {
        super();
        this.tool = {};
        this.disabled = false;
        this.reason = '';
        this.busy = false;
    }

    createRenderRoot() {
        return this;
    }

    activate() {
        const toolId = String(this.tool?.id || '');
        if (this.disabled || !toolId) {
            return;
        }
        this.dispatchEvent(new CustomEvent('popup-tool-activate', {
            detail: { toolId },
            bubbles: true
        }));
    }

    render() {
        return html`
            <button
                type="button"
                data-tool-id=${this.tool?.id || nothing}
                data-danger=${this.tool?.appearance === 'danger' ? 'true' : nothing}
                ?disabled=${this.disabled}
                @click=${this.activate}
            >
                <span class="tool-card-header">
                    <span class="tool-copy">
                        <strong class="tool-title">${this.tool?.title || ''}</strong>
                        <span class="tool-description">${this.tool?.description || ''}</span>
                        ${this.reason ? html`<span class="tool-requirement">${this.reason}</span>` : nothing}
                        ${this.busy ? html`<span class="tool-busy">${this.tool?.busyLabel || ''}</span>` : nothing}
                    </span>
                </span>
            </button>
        `;
    }
}

if (!customElements.get(POPUP_TOOL_CARD_TAG)) {
    customElements.define(POPUP_TOOL_CARD_TAG, PopupToolCard);
}

export { POPUP_TOOL_CARD_TAG, PopupToolCard };
