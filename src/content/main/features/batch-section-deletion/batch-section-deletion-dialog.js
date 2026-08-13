import { LitElement, html, nothing } from 'lit';
import { componentFoundationStyles, dialogFoundationStyles } from '#src/content/main/styles/foundations.js';
import {
    controlStyles,
    dialogShellStyles,
    fieldStyles,
    noticeStyles
} from '#src/content/main/styles/primitives.js';
import { batchSectionDeletionDialogStyles } from '#src/content/main/features/batch-section-deletion/batch-section-deletion-dialog.styles.js';

const BATCH_SECTION_DELETION_DIALOG_TAG = 'edvibe-toolbox-batch-section-deletion-dialog';

class BatchSectionDeletionDialog extends LitElement {
    static styles = [
        componentFoundationStyles,
        dialogFoundationStyles,
        dialogShellStyles,
        controlStyles,
        fieldStyles,
        noticeStyles,
        batchSectionDeletionDialogStyles
    ];

    static properties = {
        options: {state: true},
        sectionName: {state: true},
        selectedLessonIds: {state: true},
        plan: {state: true},
        executionId: {state: true},
        busy: {state: true},
        statusMessage: {state: true},
        statusVisible: {state: true},
        resultReport: {state: true},
        resultVisible: {state: true}
    };

    constructor() {
        super();
        this.options = null;
        this.sectionName = '';
        this.selectedLessonIds = new Set();
        this.plan = null;
        this.executionId = null;
        this.busy = false;
        this.statusMessage = '';
        this.statusVisible = false;
        this.resultReport = '';
        this.resultVisible = false;
    }

    configure(options = {}) {
        this.options = options && typeof options === 'object' ? options : {};
        this.selectedLessonIds = new Set();
        this.plan = null;
        this.executionId = null;
        this.resultReport = '';
        this.resultVisible = false;
        return this;
    }

    selectedIds() {
        return [...this.selectedLessonIds];
    }

    setLessonSelected(lessonId, selected) {
        if (this.busy) return;
        const next = new Set(this.selectedLessonIds);
        if (selected) next.add(Number(lessonId));
        else next.delete(Number(lessonId));
        this.selectedLessonIds = next;
    }

    selectAll() {
        if (this.busy) return;
        this.selectedLessonIds = new Set(
            (this.options?.lessons || []).map((lesson) => Number(lesson.lessonId))
        );
    }

    clearSelection() {
        if (this.busy) return;
        this.selectedLessonIds = new Set();
    }

    setBusy(message) {
        this.busy = true;
        this.showStatus(message);
    }

    clearBusy() {
        this.busy = false;
    }

    async inspect() {
        const selectedLessonIds = this.selectedIds();
        if (!this.sectionName.trim() || selectedLessonIds.length === 0) {
            this.showStatus('Enter a section name and select at least one lesson.');
            return;
        }
        this.setBusy('Inspecting lessons…');
        try {
            this.plan = await this.options.onInspect({
                sectionName: this.sectionName,
                selectedLessonIds,
                onProgress: ({current, total}) => this.showStatus(`Inspecting ${current}/${total}…`)
            });
        } catch (error) {
            this.showStatus(error.message || 'Inspection failed.');
        } finally {
            this.clearBusy();
        }
    }

    async execute() {
        if (!this.plan || this.plan.eligible.length === 0) return;
        this.setBusy('Deleting sections…');
        try {
            const result = await this.options.onExecute(
                this.plan,
                ({current, total}) => this.showStatus(`Deleting ${current}/${total}…`)
            );
            this.resultReport = String(result.report || '');
            this.resultVisible = true;
            this.executionId = result.history?.stored ? result.history.record?.id || null : null;
            const outcome = result.fatalError
                ? 'Stopped after an operation-wide error. Partial results retained.'
                : 'Deletion finished.';
            const history = result.history?.stored
                ? ' Saved to execution history.'
                : result.history?.persistenceError
                    ? ' The visible report is intact, but history could not be saved.'
                    : '';
            this.showStatus(`${outcome}${history}`);
        } catch (error) {
            this.showStatus(error.message || 'Deletion failed.');
        } finally {
            this.clearBusy();
        }
    }

    showStatus(message) {
        this.statusMessage = String(message || '');
        this.statusVisible = true;
    }

    close() {
        if (!this.busy) this.options?.onClose?.();
    }

    openHistory() {
        if (this.executionId) this.options?.onOpenHistory?.(this.executionId);
    }

    renderPlanGroup(title, items, formatter) {
        return html`
            <h4>${title}</h4>
            <ul>${items.length
                ? items.map((item) => html`<li>${formatter(item)}</li>`)
                : html`<li>None</li>`}</ul>
        `;
    }

    renderPlan() {
        if (!this.plan) return nothing;
        return html`
            <section class="preflight" data-notice>
                <h3>Preflight</h3>
                <dl>
                    <div><dt>Selected</dt><dd>${this.plan.selectedCount}</dd></div>
                    <div><dt>Eligible</dt><dd>${this.plan.eligible.length}</dd></div>
                    <div><dt>Rejected</dt><dd>${this.plan.rejected.length}</dd></div>
                </dl>
                ${this.renderPlanGroup('Will delete', this.plan.eligible,
                    (item) => `#${item.number} ${item.name} → section ${item.sectionId}`)}
                ${this.renderPlanGroup('Will not modify', this.plan.rejected,
                    (item) => `#${item.number} ${item.name}: ${item.code} — ${item.message}`)}
            </section>
        `;
    }

    render() {
        const lessons = this.options?.lessons || [];
        const canExecute = Boolean(this.plan?.eligible?.length) && !this.resultVisible;
        return html`
            <div class="overlay" data-part="overlay">
                <section class="dialog" data-part="dialog" role="dialog" aria-modal="true" aria-labelledby="title">
                    <header>
                        <div><h2 id="title">Delete section from lessons</h2><p>Every lesson is inspected before any deletion.</p></div>
                        <button class="icon close" data-control="secondary" type="button" aria-label="Close" ?disabled=${this.busy}
                            @click=${() => this.close()}>×</button>
                    </header>
                    <main>
                        <label data-field>Exact section name<input class="section-name" type="text" autocomplete="off"
                            placeholder="Ogłoszenie" .value=${this.sectionName} ?disabled=${this.busy}
                            @input=${(event) => { this.sectionName = event.currentTarget.value; }}></label>
                        <div class="toolbar" data-part="actions">
                            <button class="select-all" data-control="secondary" type="button" ?disabled=${this.busy} @click=${this.selectAll}>Select all</button>
                            <button class="clear" data-control="secondary" type="button" ?disabled=${this.busy} @click=${this.clearSelection}>Clear</button>
                            <span class="selection">${this.selectedLessonIds.size} selected</span>
                        </div>
                        <div class="lessons">
                            ${lessons.map((lesson) => html`
                                <label class="lesson">
                                    <input type="checkbox" .value=${String(lesson.lessonId)}
                                        .checked=${this.selectedLessonIds.has(Number(lesson.lessonId))}
                                        ?disabled=${this.busy}
                                        @change=${(event) => this.setLessonSelected(lesson.lessonId, event.currentTarget.checked)}>
                                    <span>#${lesson.number} ${lesson.name}</span>
                                </label>
                            `)}
                        </div>
                        <div class="status" data-notice ?hidden=${!this.statusVisible}>${this.statusMessage}</div>
                        ${this.renderPlan()}
                        <section class="result" ?hidden=${!this.resultVisible}>
                            <label data-field><span>Report</span><textarea readonly .value=${this.resultReport}></textarea></label>
                            <div class="result-actions" data-part="actions">
                                <button class="copy" data-control="secondary" type="button" ?disabled=${this.busy}
                                    @click=${() => this.options?.onCopy?.(this.resultReport)}>Copy report</button>
                                <button class="history" data-control type="button" ?hidden=${!this.executionId}
                                    ?disabled=${this.busy} @click=${this.openHistory}>Open in history</button>
                            </div>
                        </section>
                    </main>
                    <footer data-part="actions">
                        <button class="secondary close" data-control="secondary" type="button" ?disabled=${this.busy}
                            @click=${() => this.close()}>Cancel</button>
                        <button class="inspect" data-control type="button" ?hidden=${this.resultVisible} ?disabled=${this.busy}
                            @click=${this.inspect}>${this.plan ? 'Run preflight again' : 'Inspect selected lessons'}</button>
                        <button class="danger execute" data-control="danger" type="button" ?hidden=${!canExecute} ?disabled=${this.busy}
                            @click=${this.execute}>Confirm deletion</button>
                    </footer>
                </section>
            </div>
        `;
    }
}

if (!customElements.get(BATCH_SECTION_DELETION_DIALOG_TAG)) {
    customElements.define(BATCH_SECTION_DELETION_DIALOG_TAG, BatchSectionDeletionDialog);
}

export {BATCH_SECTION_DELETION_DIALOG_TAG, BatchSectionDeletionDialog};
