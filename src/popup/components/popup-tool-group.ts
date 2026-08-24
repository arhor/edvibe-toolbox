import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { popupToolGroupStyles } from '#src/popup/components/popup-tool-group.styles.js';
import { popupElementStyles } from '#src/popup/styles/primitives.js';
import '#src/popup/components/popup-tool-card.js';

const POPUP_TOOL_GROUP_TAG = 'popup-tool-group';

@customElement(POPUP_TOOL_GROUP_TAG)
class PopupToolGroup extends LitElement {
    static styles = [
        popupElementStyles,
        popupToolGroupStyles,
    ];

    @property({ type: String })
    title = '';

    @property({ attribute: false })
    tools: Array<Record<string, unknown>> = [];

    @property({ attribute: false })
    pageContext: Record<string, unknown> = { type: 'loading' };

    @property({ type: Boolean })
    exportInProgress = false;

    @property({ attribute: false })
    pendingToolId: string | null = null;

    render() {
        return html`
            <h2 class="tool-group-title">${this.title}</h2>
            <div class="tool-list">
                ${this.tools.map((tool) => html`
                    <popup-tool-card
                        .tool=${tool}
                        .pageContext=${this.pageContext}
                        .exportInProgress=${this.exportInProgress}
                        .pendingToolId=${this.pendingToolId}
                    ></popup-tool-card>
                `)}
            </div>
        `;
    }
}

export { POPUP_TOOL_GROUP_TAG, PopupToolGroup };
