import { html, LitElement } from 'lit';

import '#src/popup/components/popup-tool-card.js';

export class PopupToolGroup extends LitElement {
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

    createRenderRoot() {
        return this;
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

customElements.define('popup-tool-group', PopupToolGroup);
