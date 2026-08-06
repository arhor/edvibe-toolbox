(function initializeDialog(root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.EdVibeBatchSectionDeletionDialog = api;
})(typeof globalThis !== 'undefined' ? globalThis : window, function createModule() {
    'use strict';
    const BATCH_SECTION_DELETION_DIALOG_TAG = 'edvibe-toolbox-batch-section-deletion-dialog';

    if (typeof customElements !== 'undefined' && !customElements.get(BATCH_SECTION_DELETION_DIALOG_TAG)) {
        customElements.define(BATCH_SECTION_DELETION_DIALOG_TAG, class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.plan = null;
                this.options = null;
                this.executionId = null;
            }

            configure(options) {
                this.options = options;
                this.render();
            }

            render() {
                const root = this.shadowRoot;
                root.innerHTML = '';
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = this.options.stylesheetUrl;
                root.append(link);

                const overlay = document.createElement('div');
                overlay.className = 'overlay';
                overlay.innerHTML = `
                    <section class="dialog" role="dialog" aria-modal="true" aria-labelledby="title">
                        <header><div><h2 id="title">Delete section from lessons</h2><p>Every lesson is inspected before any deletion.</p></div><button class="icon close" aria-label="Close">×</button></header>
                        <main>
                            <label>Exact section name<input class="section-name" type="text" autocomplete="off" placeholder="Ogłoszenie"></label>
                            <div class="toolbar"><button class="select-all">Select all</button><button class="clear">Clear</button><span class="selection"></span></div>
                            <div class="lessons"></div>
                            <div class="status" hidden></div>
                            <section class="preflight" hidden></section>
                            <section class="result" hidden><textarea readonly></textarea><div class="result-actions"><button class="copy">Copy report</button><button class="history" hidden>Open in history</button></div></section>
                        </main>
                        <footer><button class="secondary close">Cancel</button><button class="inspect">Inspect selected lessons</button><button class="danger execute" hidden>Confirm deletion</button></footer>
                    </section>`;
                root.append(overlay);

                const lessons = root.querySelector('.lessons');
                for (const lesson of this.options.lessons) {
                    const label = document.createElement('label');
                    label.className = 'lesson';
                    label.innerHTML = `<input type="checkbox" value="${lesson.lessonId}"><span>#${lesson.number} ${this.escape(lesson.name)}</span>`;
                    lessons.append(label);
                }
                const update = () => root.querySelector('.selection').textContent = `${this.selectedIds().length} selected`;
                lessons.addEventListener('change', update);
                root.querySelector('.select-all').addEventListener('click', () => { root.querySelectorAll('.lesson input').forEach((item) => item.checked = true); update(); });
                root.querySelector('.clear').addEventListener('click', () => { root.querySelectorAll('.lesson input').forEach((item) => item.checked = false); update(); });
                root.querySelectorAll('.close').forEach((button) => button.addEventListener('click', () => this.options.onClose()));
                root.querySelector('.inspect').addEventListener('click', () => this.inspect());
                root.querySelector('.execute').addEventListener('click', () => this.execute());
                root.querySelector('.copy').addEventListener('click', () => this.options.onCopy(root.querySelector('textarea').value));
                root.querySelector('.history').addEventListener('click', () => {
                    if (this.executionId) this.options.onOpenHistory?.(this.executionId);
                });
                update();
            }

            selectedIds() {
                return [...this.shadowRoot.querySelectorAll('.lesson input:checked')].map((item) => Number(item.value));
            }

            setBusy(message) {
                const status = this.shadowRoot.querySelector('.status');
                status.hidden = false;
                status.textContent = message;
                this.shadowRoot.querySelectorAll('button, input').forEach((element) => element.disabled = true);
            }

            clearBusy() {
                this.shadowRoot.querySelector('.status').hidden = true;
                this.shadowRoot.querySelectorAll('button, input').forEach((element) => element.disabled = false);
            }

            async inspect() {
                const sectionName = this.shadowRoot.querySelector('.section-name').value;
                const selectedLessonIds = this.selectedIds();
                if (!sectionName.trim() || selectedLessonIds.length === 0) {
                    this.showStatus('Enter a section name and select at least one lesson.');
                    return;
                }
                this.setBusy('Inspecting lessons…');
                try {
                    this.plan = await this.options.onInspect({ sectionName, selectedLessonIds, onProgress: ({ current, total }) => this.showStatus(`Inspecting ${current}/${total}…`) });
                    this.renderPlan();
                } catch (error) {
                    this.showStatus(error.message || 'Inspection failed.');
                } finally {
                    this.clearBusy();
                }
            }

            renderPlan() {
                const section = this.shadowRoot.querySelector('.preflight');
                const eligible = this.plan.eligible.map((item) => `<li>#${item.number} ${this.escape(item.name)} → section ${item.sectionId}</li>`).join('');
                const rejected = this.plan.rejected.map((item) => `<li>#${item.number} ${this.escape(item.name)}: ${item.code} — ${this.escape(item.message)}</li>`).join('');
                section.innerHTML = `<h3>Preflight</h3><dl><div><dt>Selected</dt><dd>${this.plan.selectedCount}</dd></div><div><dt>Eligible</dt><dd>${this.plan.eligible.length}</dd></div><div><dt>Rejected</dt><dd>${this.plan.rejected.length}</dd></div></dl><h4>Will delete</h4><ul>${eligible || '<li>None</li>'}</ul><h4>Will not modify</h4><ul>${rejected || '<li>None</li>'}</ul>`;
                section.hidden = false;
                this.shadowRoot.querySelector('.execute').hidden = this.plan.eligible.length === 0;
                this.shadowRoot.querySelector('.inspect').textContent = 'Run preflight again';
            }

            async execute() {
                if (!this.plan || this.plan.eligible.length === 0) return;
                this.setBusy('Deleting sections…');
                try {
                    const result = await this.options.onExecute(this.plan, ({ current, total }) => this.showStatus(`Deleting ${current}/${total}…`));
                    const area = this.shadowRoot.querySelector('.result');
                    area.hidden = false;
                    area.querySelector('textarea').value = result.report;
                    this.executionId = result.history?.stored ? result.history.record?.id || null : null;
                    area.querySelector('.history').hidden = !this.executionId;
                    this.shadowRoot.querySelector('.execute').hidden = true;
                    this.shadowRoot.querySelector('.inspect').hidden = true;
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
                const status = this.shadowRoot.querySelector('.status');
                status.hidden = false;
                status.textContent = message;
            }

            escape(value) {
                return String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
            }
        });
    }

    return Object.freeze({ BATCH_SECTION_DELETION_DIALOG_TAG });
});
