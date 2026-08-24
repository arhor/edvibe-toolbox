import { html, LitElement } from 'lit';

import { popupToolGroupStyles } from '#src/popup/components/popup-tool-group.styles.js';
import { popupElementStyles } from '#src/popup/styles/primitives.js';
import '#src/popup/components/popup-tool-card.js';

const POPUP_TOOL_GROUP_TAG = 'popup-tool-group';

class PopupToolGroup extends LitElement {
    static styles = [
        popupElementStyles,
        popupToolGroupStyles,
    ];

    static properties = {
        title: { type: String },
        tools: { attribute: false },
        pageContext: { attribute: false },
        exportInProgress: { type: Boolean },
        pendingToolId: { attribute: false },
    };

    constructor() {
        super();
        this.title = '';
        this.tools = [];
        this.pageContext = { type: 'loading' };
        this.exportInProgress = false;
        this.pendingToolId = null;
    }

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

customElements.define(POPUP_TOOL_GROUP_TAG, PopupToolGroup);

export { POPUP_TOOL_GROUP_TAG, PopupToolGroup };
