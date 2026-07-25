(function initializePopupToolComponents(root) {
    'use strict';

    class PopupToolCard extends root.HTMLElement {
        configure({ tool, disabled, reason, busy, onExecute }) {
            this.replaceChildren();
            this.dataset.toolId = tool.id;
            this.dataset.disabled = String(disabled);
            const header = document.createElement('div');
            const copy = document.createElement('div');
            const title = document.createElement('h3');
            const description = document.createElement('p');
            const button = document.createElement('button');
            header.className = 'tool-card-header';
            copy.className = 'tool-copy';
            title.className = 'tool-title';
            title.textContent = tool.title;
            description.className = 'tool-description';
            description.textContent = tool.description;
            button.className = 'tool-action';
            button.type = 'button';
            button.textContent = busy ? tool.busyLabel : tool.actionLabel;
            button.disabled = disabled;
            button.classList.toggle('is-danger', tool.appearance === 'danger');
            button.addEventListener('click', () => onExecute(tool.id));
            copy.append(title, description);
            if (reason) {
                const requirement = document.createElement('p');
                requirement.className = 'tool-requirement';
                requirement.textContent = reason;
                copy.append(requirement);
            }
            header.append(copy, button);
            this.append(header);
            return this;
        }
    }

    class PopupToolGroup extends root.HTMLElement {
        configure({ title, tools, getState, onExecute }) {
            this.replaceChildren();
            const heading = document.createElement('h2');
            const list = document.createElement('div');
            heading.className = 'tool-group-title';
            heading.textContent = title;
            list.className = 'tool-list';
            for (const tool of tools) {
                const card = document.createElement('popup-tool-card');
                card.configure({ tool, ...getState(tool), onExecute });
                list.append(card);
            }
            this.append(heading, list);
            return this;
        }
    }

    root.customElements.define('popup-tool-card', PopupToolCard);
    root.customElements.define('popup-tool-group', PopupToolGroup);
})(globalThis);
