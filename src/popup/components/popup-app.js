import { html, LitElement, nothing } from 'lit';

import { EXPORT_STATES, isPopupCommandMessage, isRuntimeExportStatusMessage } from '../../shared/message-protocol.js';
import {
    TOOL_GROUPS,
    getPageContextContent,
    getToolDefinition,
    getUnavailableReason,
    resolvePageContext
} from '../popup-model.js';

import './popup-tool-group.js';

async function getPageContext() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return resolvePageContext(tab);
}

async function getExportInProgress() {
    const result = await chrome.storage.local.get('exportInProgress');
    return Boolean(result.exportInProgress);
}

function sendCommand(tabId, action) {
    const message = { action };

    if (!isPopupCommandMessage(message)) {
        return Promise.reject(new Error('Unsupported Toolbox command.'));
    }

    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, message, (response) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
            } else {
                resolve(response);
            }
        });
    });
}

function subscribeToExportStatus(listener) {
    const handleMessage = (message) => {
        if (isRuntimeExportStatusMessage(message)) {
            listener(message);
        }
    };
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
}

export class PopupApp extends LitElement {
    static properties = {
        pageContext: { state: true },
        initialized: { state: true },
        exportInProgress: { state: true },
        pendingToolId: { state: true },
        status: { state: true }
    };

    constructor() {
        super();
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
        this.unsubscribeFromExportStatus = subscribeToExportStatus((message) => {
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
        const [pageContextResult, exportInProgressResult] = await Promise.allSettled([
            getPageContext(),
            getExportInProgress()
        ]);
        if (version !== this.connectionVersion || !this.isConnected) {
            return;
        }

        this.pageContext = pageContextResult.status === 'fulfilled'
            ? pageContextResult.value
            : { type: 'unavailable' };

        if (exportInProgressResult.status === 'fulfilled' && !this.exportStatusObserved) {
            this.exportInProgress = exportInProgressResult.value;
        }
        this.initialized = true;
    }

    handleExportStatus(message) {
        this.exportStatusObserved = true;
        this.exportInProgress = message.state === EXPORT_STATES.STARTED;

        if (message.state === EXPORT_STATES.COMPLETE) {
            this.status = {
                message: 'Экспорт завершён.',
                isError: false
            };
        } else if (message.state === EXPORT_STATES.ERROR) {
            this.status = {
                message: message.message || 'Не удалось экспортировать марафон.',
                isError: true
            };
        }
    }

    async executeTool(toolId) {
        const tool = getToolDefinition(toolId);
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
            await sendCommand(this.pageContext.tabId, tool.command);

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
                        ${TOOL_GROUPS.map((group) => html`
                            <popup-tool-group
                                .title=${group.title}
                                .tools=${group.tools}
                                .pageContext=${this.pageContext}
                                ?exportInProgress=${this.exportInProgress}
                                .pendingToolId=${this.pendingToolId}
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

customElements.define('popup-app', PopupApp);
