import { html, LitElement } from 'lit';

import './popup-tool-card.js';

const POPUP_TOOL_GROUP_TAG = 'popup-tool-group';

class PopupToolGroup extends LitElement {
    static properties = {
        title: { type: String },
        tools: { attribute: false }
    };

    constructor() {
        super();
        this.title = '';
        this.tools = [];
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
                        ?disabled=${tool.disabled}
                        .reason=${tool.reason}
                        ?busy=${tool.busy}
                    ></popup-tool-card>
                `)}
            </div>
        `;
    }
}

if (!customElements.get(POPUP_TOOL_GROUP_TAG)) {
    customElements.define(POPUP_TOOL_GROUP_TAG, PopupToolGroup);
}

export { POPUP_TOOL_GROUP_TAG, PopupToolGroup };
