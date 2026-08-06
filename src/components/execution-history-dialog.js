(function initializeExecutionHistoryDialog(root, factory) {
    const api = factory(root);
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.EdVibeExecutionHistoryDialog = api;
})(typeof globalThis !== 'undefined' ? globalThis : window, function createModule(root) {
    'use strict';

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
                || (record.pageContext?.marathonId ? `Marathon #${record.pageContext.marathonId}` : 'No marathon context'),
            outcome: `${record.counts.successful} successful · ${record.counts.failed} failed · ${record.counts.skipped} skipped`
        });
    }

    function createNode(documentApi, tagName, className = '', text = '') {
        const element = documentApi.createElement(tagName);
        if (className) element.className = className;
        if (text !== '') element.textContent = String(text);
        return element;
    }

    if (root.customElements && root.HTMLElement && !root.customElements.get(EXECUTION_HISTORY_DIALOG_TAG)) {
        root.customElements.define(EXECUTION_HISTORY_DIALOG_TAG, class ExecutionHistoryDialog extends root.HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.options = null;
                this.records = [];
                this.selectedRecord = null;
                this.connection = null;
                this.shellRendered = false;
            }

            configure(options = {}) {
                this.options = options;
                if (this.isConnected) this.initialize();
                return this;
            }

            connectedCallback() { this.initialize(); }
            disconnectedCallback() { this.connection?.abort(); this.connection = null; }

            initialize() {
                if (!this.options) return;
                const firstRender = !this.shellRendered;
                if (firstRender) { this.shellRendered = true; this.renderShell(); }
                if (this.connection) return;
                this.connection = new AbortController();
                const signal = this.connection.signal;
                this.shadowRoot.addEventListener('click', (event) => this.handleClick(event), { signal });
                this.shadowRoot.addEventListener('change', (event) => this.handleChange(event), { signal });
                this.addEventListener('keydown', (event) => {
                    if (event.key === 'Escape') this.options.onClose?.();
                }, { signal });
                if (!firstRender) return;
                this.shadowRoot.querySelector('[data-action="close"]')?.focus();
                this.loadPreferences();
                this.loadRecords().then(() => {
                    if (this.options.initialExecutionId) this.openRecord(this.options.initialExecutionId);
                });
            }

            renderShell() {
                this.shadowRoot.innerHTML = `
                    <link rel="stylesheet" href="${String(this.options.stylesheetUrl || '')}">
                    <div class="overlay"><section class="dialog" role="dialog" aria-modal="true" aria-labelledby="history-title">
                        <header class="dialog-header"><div><p class="eyebrow">Edvibe Toolbox</p><h2 id="history-title">Execution history</h2><p class="header-copy">Browse terminal operation reports stored in this browser.</p></div><button class="icon-button" type="button" data-action="close" aria-label="Close">×</button></header>
                        <div class="workspace">
                            <aside class="browser-panel">
                                <form class="filters" data-role="filters">
                                    <label>Operation<select name="operationType"><option value="">All operations</option></select></label>
                                    <label>Status<select name="status"><option value="">All statuses</option><option value="completed">Completed</option><option value="completed_with_failures">Completed with failures</option><option value="cancelled">Cancelled</option><option value="interrupted">Interrupted</option></select></label>
                                    <label>Marathon<input name="marathonId" type="search" inputmode="numeric" placeholder="Any marathon"></label>
                                    <div class="date-fields"><label>From<input name="from" type="date"></label><label>To<input name="to" type="date"></label></div>
                                    <div class="filter-actions"><button type="submit">Apply</button><button type="button" class="secondary" data-action="reset-filters">Reset</button></div>
                                </form>
                                <div class="list-toolbar"><strong data-role="record-count">0 executions</strong><button type="button" class="secondary compact" data-action="export-filtered">Export filtered</button></div>
                                <div class="state-card" data-role="state">Loading history…</div><div class="record-list" data-role="record-list" hidden></div>
                            </aside>
                            <main class="detail-panel" data-role="detail"></main>
                        </div>
                        <footer class="dialog-footer">
                            <details class="retention-settings"><summary>Retention & automatic export</summary><div class="settings-grid">
                                <label class="checkbox"><input type="checkbox" name="keepIndefinitely">Keep indefinitely</label>
                                <label>Newest executions<input type="number" name="maxCount" min="1" step="1"></label>
                                <label>Maximum age, days<input type="number" name="maxAgeDays" min="1" step="1"></label>
                                <label class="checkbox"><input type="checkbox" name="autoExport">Download JSON after persistence</label>
                                <button type="button" data-action="save-preferences">Save settings</button>
                            </div></details>
                            <div class="footer-actions"><button type="button" class="danger secondary" data-action="clear-all">Clear all history</button><button type="button" data-action="close">Close</button></div>
                            <p class="toast" data-role="toast" role="status" hidden></p>
                        </footer>
                    </section></div>`;
                this.shadowRoot.querySelector('[data-role="filters"]').addEventListener('submit', (event) => {
                    event.preventDefault();
                    this.loadRecords();
                });
                this.renderEmptyDetail();
            }

            get filters() {
                const data = new FormData(this.shadowRoot.querySelector('[data-role="filters"]'));
                return Object.fromEntries([...data.entries()].filter(([, value]) => value !== ''));
            }

            async loadRecords() {
                this.showState('Loading history…');
                try {
                    this.records = await this.options.service.list(this.filters);
                    this.populateOperationTypes();
                    this.renderRecords();
                } catch (error) {
                    this.showState(error.message || 'Could not load execution history.', true);
                }
            }

            populateOperationTypes() {
                const select = this.shadowRoot.querySelector('[name="operationType"]');
                const selected = select.value;
                const existing = new Set([...select.options].map((option) => option.value));
                for (const operationType of [...new Set(this.records.map((record) => record.operationType))].sort()) {
                    if (existing.has(operationType)) continue;
                    const option = this.ownerDocument.createElement('option');
                    option.value = operationType;
                    option.textContent = operationType;
                    select.append(option);
                }
                select.value = selected;
            }

            showState(message, isError = false) {
                const state = this.shadowRoot.querySelector('[data-role="state"]');
                state.textContent = message;
                state.classList.toggle('is-error', isError);
                state.hidden = false;
                this.shadowRoot.querySelector('[data-role="record-list"]').hidden = true;
            }

            renderRecords() {
                const documentApi = this.ownerDocument;
                const list = this.shadowRoot.querySelector('[data-role="record-list"]');
                const state = this.shadowRoot.querySelector('[data-role="state"]');
                this.shadowRoot.querySelector('[data-role="record-count"]').textContent = `${this.records.length} execution${this.records.length === 1 ? '' : 's'}`;
                list.replaceChildren();
                if (this.records.length === 0) { this.showState('No executions match these filters.'); return; }
                for (const record of this.records) {
                    const summary = createSummary(record);
                    const button = createNode(documentApi, 'button', 'record-card');
                    button.type = 'button';
                    button.dataset.executionId = record.id;
                    button.dataset.status = record.status;
                    button.setAttribute('aria-pressed', String(this.selectedRecord?.id === record.id));
                    const heading = createNode(documentApi, 'span', 'record-heading');
                    heading.append(createNode(documentApi, 'strong', '', summary.title), createNode(documentApi, 'span', 'status-chip', formatExecutionStatus(record.status)));
                    button.append(heading, createNode(documentApi, 'span', 'record-context', summary.subtitle), createNode(documentApi, 'span', 'record-outcome', summary.outcome), createNode(documentApi, 'time', '', formatExecutionDate(record.completedAt)));
                    list.append(button);
                }
                state.hidden = true;
                list.hidden = false;
            }

            renderEmptyDetail() {
                this.selectedRecord = null;
                const panel = this.shadowRoot.querySelector('[data-role="detail"]');
                panel.innerHTML = '<div class="detail-placeholder"><span aria-hidden="true">↗</span><h3>Select an execution</h3><p>Its summary and ordered item outcomes will appear here.</p></div>';
            }

            async openRecord(executionId) {
                try {
                    const record = await this.options.service.get(executionId);
                    if (!record) throw new Error('Execution record was not found.');
                    this.selectedRecord = record;
                    this.renderRecords();
                    this.renderDetail(record);
                } catch (error) {
                    this.showToast(error.message || 'Could not open the execution.', true);
                }
            }

            renderDetail(record) {
                const documentApi = this.ownerDocument;
                const panel = this.shadowRoot.querySelector('[data-role="detail"]');
                panel.replaceChildren();
                const header = createNode(documentApi, 'section', 'detail-header');
                const heading = createNode(documentApi, 'div');
                heading.append(createNode(documentApi, 'h3', '', record.operationType), createNode(documentApi, 'p', '', `${formatExecutionStatus(record.status)} · ${formatExecutionDate(record.completedAt)}`));
                const actions = createNode(documentApi, 'div', 'detail-actions');
                for (const [action, label, className] of [['download-one', 'Download JSON', 'secondary'], ['delete-one', 'Delete', 'danger secondary']]) {
                    const button = createNode(documentApi, 'button', className, label); button.type = 'button'; button.dataset.action = action; actions.append(button);
                }
                header.append(heading, actions);

                const context = createNode(documentApi, 'dl', 'summary-grid');
                for (const [label, value] of [['Execution ID', record.id], ['Marathon', record.pageContext?.marathonName || record.pageContext?.marathonId || 'Not recorded'], ['Started', formatExecutionDate(record.startedAt)], ['Completed', formatExecutionDate(record.completedAt)]]) {
                    const group = createNode(documentApi, 'div'); group.append(createNode(documentApi, 'dt', '', label), createNode(documentApi, 'dd', '', value)); context.append(group);
                }

                const counts = createNode(documentApi, 'section', 'counts');
                for (const [key, value] of Object.entries(record.counts)) {
                    const item = createNode(documentApi, 'div'); item.append(createNode(documentApi, 'strong', '', value), createNode(documentApi, 'span', '', key.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`))); counts.append(item);
                }

                const outcomes = createNode(documentApi, 'section', 'outcomes');
                outcomes.append(createNode(documentApi, 'h4', '', `Item outcomes (${record.results.length})`));
                if (record.results.length === 0) outcomes.append(createNode(documentApi, 'p', 'muted', 'No per-item outcomes were recorded.'));
                for (const result of record.results) outcomes.append(this.renderOutcome(result));
                panel.append(header, context, counts, outcomes);
            }

            renderOutcome(result) {
                const documentApi = this.ownerDocument;
                const article = createNode(documentApi, 'article', 'outcome-card');
                article.dataset.status = result.status;
                const row = createNode(documentApi, 'div');
                row.append(createNode(documentApi, 'strong', '', result.label), createNode(documentApi, 'span', 'status-chip', result.status));
                article.append(row, createNode(documentApi, 'p', '', result.message), createNode(documentApi, 'small', '', `${result.code} · ${result.attempts} attempt${result.attempts === 1 ? '' : 's'}`));
                if (result.data && Object.keys(result.data).length > 0) {
                    const details = createNode(documentApi, 'details');
                    details.append(createNode(documentApi, 'summary', '', 'Item details'), createNode(documentApi, 'pre', '', JSON.stringify(result.data, null, 2)));
                    article.append(details);
                }
                return article;
            }

            async loadPreferences() {
                try {
                    const preferences = await this.options.service.getPreferences();
                    this.shadowRoot.querySelector('[name="keepIndefinitely"]').checked = preferences.mode === 'indefinite';
                    this.shadowRoot.querySelector('[name="maxCount"]').value = preferences.maxCount;
                    this.shadowRoot.querySelector('[name="maxAgeDays"]').value = preferences.maxAgeDays;
                    this.shadowRoot.querySelector('[name="autoExport"]').checked = preferences.autoExport;
                    this.syncPreferenceControls();
                } catch (error) { this.showToast(error.message || 'Could not load retention settings.', true); }
            }

            syncPreferenceControls() {
                const indefinite = this.shadowRoot.querySelector('[name="keepIndefinitely"]').checked;
                this.shadowRoot.querySelector('[name="maxCount"]').disabled = indefinite;
                this.shadowRoot.querySelector('[name="maxAgeDays"]').disabled = indefinite;
            }

            async savePreferences() {
                const preferences = {
                    mode: this.shadowRoot.querySelector('[name="keepIndefinitely"]').checked ? 'indefinite' : 'limits',
                    maxCount: Number(this.shadowRoot.querySelector('[name="maxCount"]').value),
                    maxAgeDays: Number(this.shadowRoot.querySelector('[name="maxAgeDays"]').value),
                    autoExport: this.shadowRoot.querySelector('[name="autoExport"]').checked
                };
                try { await this.options.service.setPreferences(preferences); this.showToast('Retention settings saved.'); }
                catch (error) { this.showToast(error.message || 'Could not save retention settings.', true); }
            }

            async handleClick(event) {
                const target = event.target.closest('[data-action], [data-execution-id]');
                if (!target) return;
                if (target.dataset.executionId) { await this.openRecord(target.dataset.executionId); return; }
                const action = target.dataset.action;
                if (action === 'close') this.options.onClose?.();
                if (action === 'reset-filters') { this.shadowRoot.querySelector('[data-role="filters"]').reset(); await this.loadRecords(); }
                if (action === 'export-filtered') await this.runAction(() => this.options.service.exportFiltered(this.filters), 'Filtered history exported.', 'Could not export history.');
                if (action === 'download-one' && this.selectedRecord) await this.runAction(() => this.options.service.exportRecord(this.selectedRecord.id), 'Execution exported.', 'Could not export execution.');
                if (action === 'delete-one' && this.selectedRecord && this.confirm(`Delete execution ${this.selectedRecord.id}?`)) {
                    await this.runMutation(() => this.options.service.delete(this.selectedRecord.id), 'Execution deleted.', 'Could not delete the execution.');
                }
                if (action === 'clear-all' && this.confirm('Clear all execution history? This cannot be undone.')) {
                    await this.runMutation(() => this.options.service.clear(), 'Execution history cleared.', 'Could not clear execution history.');
                }
                if (action === 'save-preferences') await this.savePreferences();
            }

            confirm(message) { return this.ownerDocument.defaultView.confirm(message); }

            async runAction(action, successMessage, failureMessage) {
                try { await action(); this.showToast(successMessage); }
                catch (error) { this.showToast(error.message || failureMessage, true); }
            }

            async runMutation(action, successMessage, failureMessage) {
                try { await action(); this.renderEmptyDetail(); await this.loadRecords(); this.showToast(successMessage); }
                catch (error) { this.showToast(error.message || failureMessage, true); }
            }

            handleChange(event) {
                if (event.target.name === 'keepIndefinitely') this.syncPreferenceControls();
            }

            showToast(message, isError = false) {
                const toast = this.shadowRoot.querySelector('[data-role="toast"]');
                toast.textContent = message;
                toast.classList.toggle('is-error', isError);
                toast.hidden = false;
            }
        });
    }

    return Object.freeze({ EXECUTION_HISTORY_DIALOG_TAG, formatExecutionStatus, formatExecutionDate, createSummary });
});
