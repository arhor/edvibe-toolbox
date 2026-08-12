import { LitElement, html } from 'lit';
import { componentFoundationStyles, dialogFoundationStyles } from './styles/foundations.js';
import { executionHistoryDialogStyles } from './execution-history-dialog.styles.js';

const EXECUTION_HISTORY_DIALOG_TAG = 'edvibe-toolbox-execution-history-dialog';
const STATUS_LABELS = Object.freeze({
    completed: 'Completed',
    completed_with_failures: 'Completed with failures',
    cancelled: 'Cancelled',
    interrupted: 'Interrupted'
});

function formatExecutionStatus(status) {
    return STATUS_LABELS[status] || String(status || 'Unknown');
}

function formatExecutionDate(value, locale) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value || '') : new Intl.DateTimeFormat(locale || undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(date);
}

function createSummary(record) {
    return Object.freeze({
        title: record.operationType,
        subtitle: record.pageContext?.marathonName
            || (record.pageContext?.marathonId
                ? `Marathon #${record.pageContext.marathonId}`
                : 'No marathon context'),
        outcome: `${record.counts.successful} successful · ${record.counts.failed} failed · ${record.counts.skipped} skipped`
    });
}

const FAILED_OUTCOME_STATUSES = new Set(['failed', 'rejected', 'interrupted']);

function formatDiagnosticSummary(value) {
    if (value === null || value === undefined) return 'Not available';
    return JSON.stringify(value, null, 2);
}

function isExecutionInterruption(result) {
    return FAILED_OUTCOME_STATUSES.has(result.status) && !result.itemId;
}

class ExecutionHistoryDialog extends LitElement {
    static styles = [componentFoundationStyles, dialogFoundationStyles, executionHistoryDialogStyles];

    static properties = {
        options: {state: true},
        records: {state: true},
        selectedRecord: {state: true},
        operationTypes: {state: true},
        filterOperationType: {state: true},
        filterStatus: {state: true},
        filterMarathonId: {state: true},
        filterFrom: {state: true},
        filterTo: {state: true},
        listState: {state: true},
        listMessage: {state: true},
        preferences: {state: true},
        toastMessage: {state: true},
        toastError: {state: true}
    };

    constructor() {
        super();
        this.options = null;
        this.records = [];
        this.selectedRecord = null;
        this.operationTypes = [];
        this.filterOperationType = '';
        this.filterStatus = '';
        this.filterMarathonId = '';
        this.filterFrom = '';
        this.filterTo = '';
        this.listState = 'loading';
        this.listMessage = 'Loading history…';
        this.preferences = {
            mode: 'limits',
            maxCount: '',
            maxAgeDays: '',
            autoExport: false
        };
        this.toastMessage = '';
        this.toastError = false;
        this.initializationPromise = null;
        this.handleKeydownBound = (event) => {
            if (event.key === 'Escape') this.options?.onClose?.();
        };
    }

    configure(options = {}) {
        this.options = options && typeof options === 'object' ? options : {};
        if (this.isConnected) this.initialize();
        return this;
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('keydown', this.handleKeydownBound);
        this.initialize();
    }

    disconnectedCallback() {
        this.removeEventListener('keydown', this.handleKeydownBound);
        super.disconnectedCallback();
    }

    initialize() {
        if (!this.options) return Promise.resolve();
        if (this.initializationPromise) return this.initializationPromise;
        this.initializationPromise = (async () => {
            await this.updateComplete;
            this.shadowRoot?.querySelector('[data-action="close"]')?.focus();
            await this.loadPreferences();
            await this.loadRecords();
            if (this.options.initialExecutionId) {
                await this.openRecord(this.options.initialExecutionId);
            }
        })();
        return this.initializationPromise;
    }

    get filters() {
        const entries = {
            operationType: this.filterOperationType,
            status: this.filterStatus,
            marathonId: this.filterMarathonId,
            from: this.filterFrom,
            to: this.filterTo
        };
        return Object.fromEntries(Object.entries(entries).filter(([, value]) => value !== ''));
    }

    setFilter(name, value) {
        const normalized = String(value || '');
        if (name === 'operationType') this.filterOperationType = normalized;
        if (name === 'status') this.filterStatus = normalized;
        if (name === 'marathonId') this.filterMarathonId = normalized;
        if (name === 'from') this.filterFrom = normalized;
        if (name === 'to') this.filterTo = normalized;
    }

    async loadRecords() {
        this.listState = 'loading';
        this.listMessage = 'Loading history…';
        try {
            this.records = await this.options.service.list(this.filters);
            this.operationTypes = [...new Set([
                ...this.operationTypes,
                ...this.records.map((record) => record.operationType)
            ])].sort();
            this.listState = this.records.length === 0 ? 'empty' : 'ready';
            this.listMessage = this.records.length === 0
                ? 'No executions match these filters.'
                : '';
        } catch (error) {
            this.records = [];
            this.listState = 'error';
            this.listMessage = error.message || 'Could not load execution history.';
        }
    }

    renderEmptyDetail() {
        this.selectedRecord = null;
    }

    async openRecord(executionId) {
        try {
            const record = await this.options.service.get(executionId);
            if (!record) throw new Error('Execution record was not found.');
            this.selectedRecord = record;
        } catch (error) {
            this.showToast(error.message || 'Could not open the execution.', true);
        }
    }

    async loadPreferences() {
        try {
            const preferences = await this.options.service.getPreferences();
            this.preferences = {
                mode: preferences.mode,
                maxCount: preferences.maxCount,
                maxAgeDays: preferences.maxAgeDays,
                autoExport: Boolean(preferences.autoExport)
            };
        } catch (error) {
            this.showToast(error.message || 'Could not load retention settings.', true);
        }
    }

    updatePreference(name, value) {
        this.preferences = {...this.preferences, [name]: value};
    }

    async savePreferences() {
        const preferences = {
            mode: this.preferences.mode,
            maxCount: Number(this.preferences.maxCount),
            maxAgeDays: Number(this.preferences.maxAgeDays),
            autoExport: Boolean(this.preferences.autoExport)
        };
        try {
            await this.options.service.setPreferences(preferences);
            this.showToast('Retention settings saved.');
        } catch (error) {
            this.showToast(error.message || 'Could not save retention settings.', true);
        }
    }

    async resetFilters() {
        this.filterOperationType = '';
        this.filterStatus = '';
        this.filterMarathonId = '';
        this.filterFrom = '';
        this.filterTo = '';
        await this.loadRecords();
    }

    confirm(message) {
        return this.ownerDocument.defaultView.confirm(message);
    }

    async runAction(action, successMessage, failureMessage) {
        try {
            await action();
            this.showToast(successMessage);
        } catch (error) {
            this.showToast(error.message || failureMessage, true);
        }
    }

    async runMutation(action, successMessage, failureMessage) {
        try {
            await action();
            this.renderEmptyDetail();
            await this.loadRecords();
            this.showToast(successMessage);
        } catch (error) {
            this.showToast(error.message || failureMessage, true);
        }
    }

    async handleAction(action) {
        if (action === 'close') this.options.onClose?.();
        if (action === 'reset-filters') await this.resetFilters();
        if (action === 'export-filtered') {
            await this.runAction(
                () => this.options.service.exportFiltered(this.filters),
                'Filtered history exported.',
                'Could not export history.'
            );
        }
        if (action === 'download-one' && this.selectedRecord) {
            await this.runAction(
                () => this.options.service.exportRecord(this.selectedRecord.id),
                'Execution exported.',
                'Could not export execution.'
            );
        }
        if (
            action === 'delete-one'
            && this.selectedRecord
            && this.confirm(`Delete execution ${this.selectedRecord.id}?`)
        ) {
            await this.runMutation(
                () => this.options.service.delete(this.selectedRecord.id),
                'Execution deleted.',
                'Could not delete the execution.'
            );
        }
        if (action === 'clear-all' && this.confirm('Clear all execution history? This cannot be undone.')) {
            await this.runMutation(
                () => this.options.service.clear(),
                'Execution history cleared.',
                'Could not clear execution history.'
            );
        }
        if (action === 'save-preferences') await this.savePreferences();
    }

    showToast(message, isError = false) {
        this.toastMessage = String(message || '');
        this.toastError = Boolean(isError);
    }

    renderRecord(record) {
        const summary = createSummary(record);
        return html`
            <button type="button" class="record-card" data-execution-id=${record.id}
                data-status=${record.status}
                aria-pressed=${String(this.selectedRecord?.id === record.id)}
                @click=${() => this.openRecord(record.id)}>
                <span class="record-heading">
                    <strong>${summary.title}</strong>
                    <span class="status-chip">${formatExecutionStatus(record.status)}</span>
                </span>
                <span class="record-context">${summary.subtitle}</span>
                <span class="record-outcome">${summary.outcome}</span>
                <time>${formatExecutionDate(record.completedAt)}</time>
            </button>
        `;
    }

    renderOutcome(result) {
        const hasData = result.data && Object.keys(result.data).length > 0;
        return html`
            <article class="outcome-card" data-status=${result.status}>
                <div><strong>${result.label}</strong><span class="status-chip">${result.status}</span></div>
                <p>${result.message}</p>
                <small>${result.code} · ${result.attempts} attempt${result.attempts === 1 ? '' : 's'}</small>
                ${hasData ? html`
                    <details><summary>Item details</summary><pre>${JSON.stringify(result.data, null, 2)}</pre></details>
                ` : ''}
                ${FAILED_OUTCOME_STATUSES.has(result.status) ? this.renderDiagnostics(result.diagnostics) : ''}
            </article>
        `;
    }

    renderDiagnostics(diagnostics) {
        if (!diagnostics?.requestAttempts?.length) return '';
        return html`
            <details class="diagnostics">
                <summary>Request diagnostics</summary>
                <div class="diagnostic-attempts">
                    ${diagnostics.requestAttempts.map((attempt) => html`
                        <section class="diagnostic-attempt" aria-label=${`Request attempt ${attempt.attemptNumber}`}>
                            <dl class="diagnostic-metadata">
                                <div><dt>Endpoint</dt><dd>${attempt.method} · ${[attempt.projectName, attempt.controller, attempt.operationName].filter(Boolean).join(' / ')}</dd></div>
                                <div><dt>Request ID</dt><dd>${attempt.requestId || 'Not available'}</dd></div>
                                <div><dt>Attempt</dt><dd>${attempt.attemptNumber}</dd></div>
                                <div><dt>Duration</dt><dd>${attempt.durationMs == null ? 'Not available' : `${attempt.durationMs} ms`}</dd></div>
                                <div><dt>Transport code</dt><dd>${attempt.transportCode || 'Not available'}</dd></div>
                                <div><dt>Server code</dt><dd>${attempt.serverErrorCode || 'Not available'}</dd></div>
                            </dl>
                            <div class="diagnostic-message"><strong>Server message</strong><p>${attempt.serverErrorMessage || 'Not available'}</p></div>
                            <div class="diagnostic-summaries">
                                <section aria-label="Request summary"><h5>Request summary</h5><pre>${formatDiagnosticSummary(attempt.requestSummary)}</pre></section>
                                <section aria-label="Response summary"><h5>Response summary</h5><pre>${formatDiagnosticSummary(attempt.responseSummary)}</pre></section>
                            </div>
                        </section>
                    `)}
                </div>
            </details>
        `;
    }

    renderDetail() {
        const record = this.selectedRecord;
        if (!record) {
            return html`
                <div class="detail-placeholder">
                    <span aria-hidden="true">↗</span>
                    <h3>Select an execution</h3>
                    <p>Its summary and ordered item outcomes will appear here.</p>
                </div>
            `;
        }
        const context = [
            ['Execution ID', record.id],
            ['Marathon', record.pageContext?.marathonName || record.pageContext?.marathonId || 'Not recorded'],
            ['Started', formatExecutionDate(record.startedAt)],
            ['Completed', formatExecutionDate(record.completedAt)]
        ];
        const interruptions = record.results.filter(isExecutionInterruption);
        const itemResults = record.results.filter((result) => !isExecutionInterruption(result));
        return html`
            <section class="detail-header">
                <div>
                    <h3>${record.operationType}</h3>
                    <p>${formatExecutionStatus(record.status)} · ${formatExecutionDate(record.completedAt)}</p>
                </div>
                <div class="detail-actions">
                    <button type="button" class="secondary" @click=${() => this.handleAction('download-one')}>Download JSON</button>
                    <button type="button" class="danger secondary" @click=${() => this.handleAction('delete-one')}>Delete</button>
                </div>
            </section>
            <dl class="summary-grid">
                ${context.map(([label, value]) => html`<div><dt>${label}</dt><dd>${value}</dd></div>`)}
            </dl>
            <section class="counts">
                ${Object.entries(record.counts).map(([key, value]) => html`
                    <div><strong>${value}</strong><span>${key.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)}</span></div>
                `)}
            </section>
            <section class="outcomes">
                ${interruptions.length ? html`
                    <section class="interruptions" aria-labelledby="interruption-heading">
                        <h4 id="interruption-heading">Execution interruption</h4>
                        <p class="muted">Failures that stopped the execution before they could be associated with an item.</p>
                        ${interruptions.map((result) => this.renderOutcome(result))}
                    </section>
                ` : ''}
                <h4>Item outcomes (${itemResults.length})</h4>
                ${itemResults.length === 0
                    ? html`<p class="muted">No per-item outcomes were recorded.</p>`
                    : itemResults.map((result) => this.renderOutcome(result))}
            </section>
        `;
    }

    render() {
        const listVisible = this.listState === 'ready';
        const stateVisible = !listVisible;
        const stateClass = `state-card${this.listState === 'error' ? ' is-error' : ''}`;
        const indefinite = this.preferences.mode === 'indefinite';
        const toastClass = `toast${this.toastError ? ' is-error' : ''}`;

        return html`
<div class="overlay">
                <section class="dialog" role="dialog" aria-modal="true" aria-labelledby="history-title">
                    <header class="dialog-header">
                        <div><p class="eyebrow">Edvibe Toolbox</p><h2 id="history-title">Execution history</h2><p class="header-copy">Browse terminal operation reports stored in this browser.</p></div>
                        <button class="icon-button" type="button" data-action="close" aria-label="Close" @click=${() => this.handleAction('close')}>×</button>
                    </header>
                    <div class="workspace">
                        <aside class="browser-panel">
                            <form class="filters" data-role="filters" @submit=${(event) => { event.preventDefault(); this.loadRecords(); }}>
                                <label>Operation<select name="operationType" .value=${this.filterOperationType} @change=${(event) => this.setFilter('operationType', event.currentTarget.value)}>
                                    <option value="">All operations</option>
                                    ${this.operationTypes.map((operationType) => html`<option value=${operationType}>${operationType}</option>`)}
                                </select></label>
                                <label>Status<select name="status" .value=${this.filterStatus} @change=${(event) => this.setFilter('status', event.currentTarget.value)}>
                                    <option value="">All statuses</option><option value="completed">Completed</option><option value="completed_with_failures">Completed with failures</option><option value="cancelled">Cancelled</option><option value="interrupted">Interrupted</option>
                                </select></label>
                                <label>Marathon<input name="marathonId" type="search" inputmode="numeric" placeholder="Any marathon" .value=${this.filterMarathonId} @input=${(event) => this.setFilter('marathonId', event.currentTarget.value)}></label>
                                <div class="date-fields">
                                    <label>From<input name="from" type="date" .value=${this.filterFrom} @input=${(event) => this.setFilter('from', event.currentTarget.value)}></label>
                                    <label>To<input name="to" type="date" .value=${this.filterTo} @input=${(event) => this.setFilter('to', event.currentTarget.value)}></label>
                                </div>
                                <div class="filter-actions"><button type="submit">Apply</button><button type="button" class="secondary" @click=${() => this.handleAction('reset-filters')}>Reset</button></div>
                            </form>
                            <div class="list-toolbar"><strong data-role="record-count">${this.records.length} execution${this.records.length === 1 ? '' : 's'}</strong><button type="button" class="secondary compact" @click=${() => this.handleAction('export-filtered')}>Export filtered</button></div>
                            <div class=${stateClass} data-role="state" ?hidden=${!stateVisible}>${this.listMessage}</div>
                            <div class="record-list" data-role="record-list" ?hidden=${!listVisible}>${this.records.map((record) => this.renderRecord(record))}</div>
                        </aside>
                        <main class="detail-panel" data-role="detail">${this.renderDetail()}</main>
                    </div>
                    <footer class="dialog-footer">
                        <details class="retention-settings"><summary>Retention & automatic export</summary><div class="settings-grid">
                            <label class="checkbox"><input type="checkbox" name="keepIndefinitely" .checked=${indefinite} @change=${(event) => this.updatePreference('mode', event.currentTarget.checked ? 'indefinite' : 'limits')}>Keep indefinitely</label>
                            <label>Newest executions<input type="number" name="maxCount" min="1" step="1" .value=${String(this.preferences.maxCount)} ?disabled=${indefinite} @input=${(event) => this.updatePreference('maxCount', event.currentTarget.value)}></label>
                            <label>Maximum age, days<input type="number" name="maxAgeDays" min="1" step="1" .value=${String(this.preferences.maxAgeDays)} ?disabled=${indefinite} @input=${(event) => this.updatePreference('maxAgeDays', event.currentTarget.value)}></label>
                            <label class="checkbox"><input type="checkbox" name="autoExport" .checked=${this.preferences.autoExport} @change=${(event) => this.updatePreference('autoExport', event.currentTarget.checked)}>Download JSON after persistence</label>
                            <button type="button" @click=${() => this.handleAction('save-preferences')}>Save settings</button>
                        </div></details>
                        <div class="footer-actions"><button type="button" class="danger secondary" @click=${() => this.handleAction('clear-all')}>Clear all history</button><button type="button" @click=${() => this.handleAction('close')}>Close</button></div>
                        <p class=${toastClass} data-role="toast" role="status" ?hidden=${!this.toastMessage}>${this.toastMessage}</p>
                    </footer>
                </section>
            </div>
        `;
    }
}

if (!customElements.get(EXECUTION_HISTORY_DIALOG_TAG)) {
    customElements.define(EXECUTION_HISTORY_DIALOG_TAG, ExecutionHistoryDialog);
}

const executionHistoryDialogApi = Object.freeze({
    EXECUTION_HISTORY_DIALOG_TAG,
    ExecutionHistoryDialog,
    formatExecutionStatus,
    formatExecutionDate,
    createSummary,
    formatDiagnosticSummary,
    isExecutionInterruption
});
globalThis.EdVibeExecutionHistoryDialog = executionHistoryDialogApi;

export {
    EXECUTION_HISTORY_DIALOG_TAG,
    ExecutionHistoryDialog,
    formatExecutionStatus,
    formatExecutionDate,
    createSummary,
    formatDiagnosticSummary,
    isExecutionInterruption
};
