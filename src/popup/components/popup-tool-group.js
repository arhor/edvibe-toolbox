import { html, LitElement } from 'lit';

import '@/popup/components/popup-tool-card.js';

export class PopupToolGroup extends LitElement {

    static properties = {
        configuration: { state: true }
    };

    constructor() {
        super();
        this.configuration = {};
    }

    createRenderRoot() {
        return this;
    }

    configure(options = {}) {
        this.configuration = options && typeof options === 'object' ? options : {};
        return this;
    }

    render() {
        const tools = Array.isArray(this.configuration.tools) ? this.configuration.tools : [];
        const getState = typeof this.configuration.getState === 'function' ? this.configuration.getState : () => ({});

        return html`
            <h2 class="tool-group-title">
                ${String(this.configuration.title || '')}
            </h2>
            <div class="tool-list">
                ${tools.map((tool) => html`
                    <popup-tool-card
                        .configuration=${{
                            tool,
                            ...getState(tool),
                            onExecute: this.configuration.onExecute
                        }}
                    ></popup-tool-card>
                `)}
            </div>
        `;
    }
}

customElements.define('popup-tool-group', PopupToolGroup);