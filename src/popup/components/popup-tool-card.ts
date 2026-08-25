import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { popupToolCardStyles } from '#src/popup/components/popup-tool-card.styles.js';
import { getToolViewModel } from '#src/popup/popup-model.js';
import type { PageContext, ToolDefinition, ToolViewModel } from '#src/popup/popup-model.js';
import { popupElementStyles } from '#src/popup/styles/primitives.js';

const POPUP_TOOL_CARD_TAG = 'popup-tool-card';

@customElement(POPUP_TOOL_CARD_TAG)
class PopupToolCard extends LitElement {
    static styles = [
        popupElementStyles,
        popupToolCardStyles,
    ];

    @property({ attribute: false })
    tool = {} as ToolDefinition;

    @property({ attribute: false })
    pageContext: PageContext = { type: 'loading' };

    @property({ type: Boolean })
    exportInProgress = false;

    @property({ attribute: false })
    pendingToolId: string | null = null;

    get toolViewModel(): ToolViewModel {
        return getToolViewModel(this.tool, {
            pageContext: this.pageContext,
            exportInProgress: this.exportInProgress,
            pendingToolId: this.pendingToolId
        });
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
            composed: true,
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

export { POPUP_TOOL_CARD_TAG, PopupToolCard };
