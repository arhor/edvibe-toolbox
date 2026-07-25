(function initializePopupToolComponents(root) {
    'use strict';

    const cardTemplate = root.document?.createElement?.('template') || null;
    const groupTemplate = root.document?.createElement?.('template') || null;

    if (cardTemplate) {
        cardTemplate.innerHTML = `
            <div class="tool-card-header">
                <div class="tool-copy">
                    <h3 class="tool-title"></h3>
                    <p class="tool-description"></p>
                    <p class="tool-requirement" hidden></p>
                </div>
                <button class="tool-action" type="button"></button>
            </div>
        `;
    }
    if (groupTemplate) {
        groupTemplate.innerHTML = `
            <h2 class="tool-group-title"></h2>
            <div class="tool-list"></div>
        `;
    }

    class PopupToolCard extends root.HTMLElement {
        constructor() {
            super();
            this.toolId = '';
            this.onExecute = null;
            this.elements = null;
            this.pendingOptions = {};
        }

        connectedCallback() {
            if (!this.elements && cardTemplate) {
                this.append(cardTemplate.content.cloneNode(true));
                this.elements = {
                    title: this.querySelector('.tool-title'),
                    description: this.querySelector('.tool-description'),
                    requirement: this.querySelector('.tool-requirement'),
                    button: this.querySelector('.tool-action')
                };
                this.elements.button?.addEventListener('click', () => {
                    if (typeof this.onExecute === 'function' && this.toolId) {
                        this.onExecute(this.toolId);
                    }
                });
            }
            this.applyOptions();
        }

        configure(options = {}) {
            this.pendingOptions = options && typeof options === 'object' ? options : {};
            this.applyOptions();
            return this;
        }

        applyOptions() {
            const options = this.pendingOptions;
            const tool = options.tool;
            if (!tool || !this.elements) {
                return;
            }
            const disabled = Boolean(options.disabled);
            const reason = String(options.reason || '');
            this.toolId = String(tool.id || '');
            this.onExecute = typeof options.onExecute === 'function' ? options.onExecute : null;
            this.dataset.toolId = this.toolId;
            this.dataset.disabled = String(disabled);
            this.elements.title.textContent = String(tool.title || '');
            this.elements.description.textContent = String(tool.description || '');
            this.elements.requirement.textContent = reason;
            this.elements.requirement.hidden = !reason;
            this.elements.button.textContent = String(
                options.busy ? tool.busyLabel || '' : tool.actionLabel || ''
            );
            this.elements.button.disabled = disabled;
            this.elements.button.classList.toggle(
                'is-danger',
                tool.appearance === 'danger'
            );
        }
    }

    class PopupToolGroup extends root.HTMLElement {
        constructor() {
            super();
            this.elements = null;
            this.pendingOptions = {};
        }

        connectedCallback() {
            if (!this.elements && groupTemplate) {
                this.append(groupTemplate.content.cloneNode(true));
                this.elements = {
                    heading: this.querySelector('.tool-group-title'),
                    list: this.querySelector('.tool-list')
                };
            }
            this.applyOptions();
        }

        configure(options = {}) {
            this.pendingOptions = options && typeof options === 'object' ? options : {};
            this.applyOptions();
            return this;
        }

        applyOptions() {
            if (!this.elements) {
                return;
            }
            const options = this.pendingOptions;
            const tools = Array.isArray(options.tools) ? options.tools : [];
            const getState = typeof options.getState === 'function'
                ? options.getState
                : () => ({});
            this.elements.heading.textContent = String(options.title || '');
            this.elements.list.replaceChildren();
            for (const tool of tools) {
                const card = root.document.createElement('popup-tool-card');
                card.configure?.({
                    tool,
                    ...getState(tool),
                    onExecute: options.onExecute
                });
                this.elements.list.append(card);
            }
        }
    }

    if (root.customElements && root.HTMLElement) {
        if (!root.customElements.get('popup-tool-card')) {
            root.customElements.define('popup-tool-card', PopupToolCard);
        }
        if (!root.customElements.get('popup-tool-group')) {
            root.customElements.define('popup-tool-group', PopupToolGroup);
        }
    }
})(globalThis);
