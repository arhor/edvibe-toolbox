import { html, LitElement } from 'lit';

class PopupToolCard extends LitElement {

    static properties = {
        configuration: { state: true }
    };

    constructor() {
        super();
        this.configuration = {};
        this.addEventListener('click', () => this.activate());
        this.addEventListener('keydown', (event) => this.handleKeydown(event));
    }

    connectedCallback() {
        super.connectedCallback();
        this.setAttribute('role', 'button');
    }

    createRenderRoot() {
        return this;
    }

    configure(options = {}) {
        this.configuration = options && typeof options === 'object' ? options : {};
        this.syncHostState();
        return this;
    }

    get tool() {
        const tool = this.configuration?.tool;
        return tool && typeof tool === 'object' ? tool : null;
    }

    get disabled() {
        return Boolean(this.configuration?.disabled);
    }

    get toolId() {
        return String(this.tool?.id || '');
    }

    get onExecute() {
        return typeof this.configuration?.onExecute === 'function'
            ? this.configuration.onExecute
            : null;
    }

    activate() {
        if (this.disabled || !this.onExecute || !this.toolId) {
            return;
        }
        this.onExecute(this.toolId);
    }

    handleKeydown(event) {
        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }
        event.preventDefault();
        this.activate();
    }

    syncHostState() {
        if (!this.tool) {
            return;
        }
        this.dataset.toolId = this.toolId;
        this.dataset.disabled = String(this.disabled);
        this.setAttribute('aria-disabled', String(this.disabled));
        this.tabIndex = this.disabled ? -1 : 0;
        this.dataset.danger = String(this.tool.appearance === 'danger');
    }

    updated(changedProperties) {
        if (changedProperties.has('configuration')) {
            this.syncHostState();
        }
    }

    render() {
        const tool = this.tool || {};
        const reason = this.configuration?.reason || '';
        const busy = Boolean(this.configuration?.busy);

        return html`
            <div class="tool-card-header">
                <div class="tool-copy">
                    <h3 class="tool-title">${tool.title || ''}</h3>
                    <p class="tool-description">${tool.description || ''}</p>
                    <p class="tool-requirement" ?hidden=${!reason}>${reason}</p>
                    <p class="tool-busy" ?hidden=${!busy}>${tool.busyLabel || ''}</p>
                </div>
            </div>
        `;
    }
}

customElements.define('popup-tool-card', PopupToolCard);
