import { html, LitElement, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { popupAppStyles } from '#src/popup/components/popup-app.styles.js';
import {
    TOOL_GROUPS,
    getPageContextContent,
    getToolDefinition,
    getUnavailableReason,
    resolvePageContext
} from '#src/popup/popup-model.js';
import type { PageContext } from '#src/popup/popup-model.js';
import { popupElementStyles } from '#src/popup/styles/primitives.js';
import '#src/popup/components/popup-tool-group.js';
import { EXPORT_STATES, isPopupCommandMessage, isRuntimeExportStatusMessage } from '#src/shared/messaging/index.js';
import type { PopupCommand, RuntimeExportStatusMessage } from '#src/shared/messaging/index.js';

interface PopupStatus {
    readonly message: string;
    readonly isError: boolean;
}

interface PopupToolActivateDetail {
    readonly toolId: string;
}

async function getPageContext(): Promise<PageContext> {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return resolvePageContext(tab);
}

async function getExportInProgress(): Promise<boolean> {
    const result = await chrome.storage.local.get('exportInProgress');
    return Boolean(result.exportInProgress);
}

function sendCommand(tabId: number, action: PopupCommand): Promise<unknown> {
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

function subscribeToExportStatus(listener: (message: RuntimeExportStatusMessage) => void): () => void {
    const handleMessage = (message: unknown) => {
        if (isRuntimeExportStatusMessage(message)) {
            listener(message);
        }
    };
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
}

const POPUP_APP_TAG = 'popup-app';

@customElement(POPUP_APP_TAG)
class PopupApp extends LitElement {
    static styles = [
        popupElementStyles,
        popupAppStyles,
    ];

    @state()
    pageContext: PageContext = { type: 'loading' };

    @state()
    initialized: boolean = false;

    @state()
    exportInProgress: boolean = false;

    @state()
    pendingToolId: string | null = null;

    @state()
    status: PopupStatus | null = null;

    connectionVersion: number = 0;
    exportStatusObserved: boolean = false;
    unsubscribeFromExportStatus: (() => void) | null = null;

    connectedCallback() {
        super.connectedCallback();
        const version = ++this.connectionVersion;
        this.exportStatusObserved = false;
        this.unsubscribeFromExportStatus = subscribeToExportStatus((message) => this.handleExportStatus(message));
        void this.initialize(version);
    }

    disconnectedCallback() {
        this.connectionVersion += 1;
        this.unsubscribeFromExportStatus?.();
        this.unsubscribeFromExportStatus = null;
        super.disconnectedCallback();
    }

    async initialize(version: number): Promise<void> {
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

    handleExportStatus(message: RuntimeExportStatusMessage): void {
        this.exportStatusObserved = true;
        this.exportInProgress = message.state === EXPORT_STATES.STARTED;

        switch (message.state) {
            case EXPORT_STATES.COMPLETE:
                this.status = {
                    message: 'Экспорт завершён.',
                    isError: false
                };
                break;
            case EXPORT_STATES.ERROR:
                this.status = {
                    message: message.message || 'Не удалось экспортировать марафон.',
                    isError: true
                };
                break;
        }
    }

    async executeTool(toolId: string): Promise<void> {
        const tool = getToolDefinition(toolId);
        const tabId = 'tabId' in this.pageContext ? this.pageContext.tabId : undefined;
        if (!tool
            || getUnavailableReason(tool, this.pageContext)
            || tabId === undefined
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
            await sendCommand(tabId, tool.command);

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
                message: error instanceof Error ? error.message : 'Не удалось запустить инструмент.',
                isError: true
            };
        }
    }

    handleToolActivate(event: CustomEvent<PopupToolActivateDetail>): void {
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
                    <p class="popup-status ${classMap({ 'is-error': this.status.isError })}" role="status">
                        ${this.status.message}
                    </p>
                ` : nothing}
            </main>
        `;
    }
}

export { POPUP_APP_TAG, PopupApp };
