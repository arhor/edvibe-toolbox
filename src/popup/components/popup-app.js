import { html, LitElement, nothing } from 'lit';

import { EXPORT_STATES } from '@/shared/message-protocol.js';
import { createPopupChromeClient } from '@/popup/popup-chrome-client.js';
import {
    TOOL_DEFINITIONS,
    TOOL_GROUPS,
    getPageContextContent,
    getToolViewModel,
    getUnavailableReason
} from '@/popup/popup-model.js';
import '@/popup/components/popup-tool-group.js';

const POPUP_APP_TAG = 'popup-app';

class PopupApp extends LitElement {
    static properties = {
        pageContext: { state: true },
        initialized: { state: true },
        exportInProgress: { state: true },
        pendingToolId: { state: true },
        status: { state: true }
    };

    constructor() {
        super();
        this.client = createPopupChromeClient(chrome);
        this.pageContext = { type: 'loading' };
        this.initialized = false;
        this.exportInProgress = false;
        this.pendingToolId = null;
        this.status = null;
        this.connectionVersion = 0;
        this.exportStatusObserved = false;
        this.unsubscribeFromExportStatus = null;
    }

    createRenderRoot() {
        return this;
    }

    connectedCallback() {
        super.connectedCallback();
        const version = ++this.connectionVersion;
        this.exportStatusObserved = false;
        this.unsubscribeFromExportStatus = this.client.subscribeToExportStatus((message) => {
            this.handleExportStatus(message);
        });
        void this.initialize(version);
    }

    disconnectedCallback() {
        this.connectionVersion += 1;
        this.unsubscribeFromExportStatus?.();
        this.unsubscribeFromExportStatus = null;
        super.disconnectedCallback();
    }

    async initialize(version) {
        const [contextResult, storageResult] = await Promise.allSettled([
            this.client.getPageContext(),
            this.client.getExportInProgress()
        ]);
        if (version !== this.connectionVersion || !this.isConnected) {
            return;
        }

        this.pageContext = contextResult.status === 'fulfilled'
            ? contextResult.value
            : { type: 'unavailable' };
        if (storageResult.status === 'fulfilled' && !this.exportStatusObserved) {
            this.exportInProgress = storageResult.value;
        }
        this.initialized = true;
    }

    handleExportStatus(message) {
        this.exportStatusObserved = true;
        this.exportInProgress = message.state === EXPORT_STATES.STARTED;
        if (message.state === EXPORT_STATES.COMPLETE) {
            this.status = { message: 'Экспорт завершён.', isError: false };
        } else if (message.state === EXPORT_STATES.ERROR) {
            this.status = {
                message: message.message || 'Не удалось экспортировать марафон.',
                isError: true
            };
        }
    }

    get toolsByGroup() {
        const state = {
            pageContext: this.pageContext,
            exportInProgress: this.exportInProgress,
            pendingToolId: this.pendingToolId
        };
        return Object.entries(TOOL_GROUPS).map(([id, title]) => ({
            id,
            title,
            tools: TOOL_DEFINITIONS
                .filter((tool) => tool.group === id)
                .map((tool) => getToolViewModel(tool, state))
        }));
    }

    async executeTool(toolId) {
        const tool = TOOL_DEFINITIONS.find((item) => item.id === toolId);
        if (!tool
            || getUnavailableReason(tool, this.pageContext)
            || !this.pageContext.tabId
            || this.exportInProgress
            || this.pendingToolId !== null) {
            return;
        }

        this.status = null;
        this.pendingToolId = tool.id;
        if (tool.id === 'marathon-export') {
            this.exportInProgress = true;
        }

        const version = this.connectionVersion;
        try {
            await this.client.sendCommand(this.pageContext.tabId, tool.command);
            if (version !== this.connectionVersion || !this.isConnected) {
                return;
            }
            this.pendingToolId = null;
            if (tool.closeOnSuccess) {
                window.close();
            }
        } catch (error) {
            if (version !== this.connectionVersion || !this.isConnected) {
                return;
            }
            if (tool.id === 'marathon-export') {
                this.exportInProgress = false;
            }
            this.pendingToolId = null;
            this.status = {
                message: error.message || 'Не удалось запустить инструмент.',
                isError: true
            };
        }
    }

    handleToolActivate(event) {
        void this.executeTool(event.detail.toolId);
    }

    render() {
        const contextContent = getPageContextContent(this.pageContext);
        return html`
            <header class="app-header">
                <div class="app-mark" aria-hidden="true">ET</div>
                <div>
                    <h1>Edvibe Toolbox</h1>
                    <p>Инструменты для текущей страницы</p>
                </div>
            </header>

            <main @popup-tool-activate=${this.handleToolActivate}>
                <section class="page-context is-${this.pageContext.type}" aria-live="polite">
                    <span class="context-indicator" aria-hidden="true"></span>
                    <div>
                        <strong>${contextContent.title}</strong>
                        <span>${contextContent.description}</span>
                    </div>
                </section>

                ${this.initialized ? html`
                    <div class="tool-groups">
                        ${this.toolsByGroup.map((group) => html`
                            <popup-tool-group
                                .title=${group.title}
                                .tools=${group.tools}
                            ></popup-tool-group>
                        `)}
                    </div>
                ` : nothing}

                ${this.status ? html`
                    <p class="popup-status ${this.status.isError ? 'is-error' : ''}" role="status">
                        ${this.status.message}
                    </p>
                ` : nothing}
            </main>
        `;
    }
}

if (!customElements.get(POPUP_APP_TAG)) {
    customElements.define(POPUP_APP_TAG, PopupApp);
}

export { POPUP_APP_TAG, PopupApp };
