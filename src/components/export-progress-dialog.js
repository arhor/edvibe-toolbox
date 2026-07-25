(function initializeExportProgressDialog(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory(root);
    } else {
        root.EdVibeExportProgressDialog = factory(root);
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createExportProgressDialog(root) {
    'use strict';
    const EXPORT_PROGRESS_TAG = 'edvibe-toolbox-export-progress';
    const HTMLElementBase = root.HTMLElement || class {};

    class ExportProgressDialog extends HTMLElementBase {
        constructor() {
            super();
            this.stylesheetUrl = '';
            this.rendered = false;
            if (typeof this.attachShadow === 'function') this.attachShadow({ mode: 'open' });
        }

        configure({ stylesheetUrl = '' } = {}) {
            this.stylesheetUrl = String(stylesheetUrl || '');
            this.render();
            this.shadowRoot.querySelector('link').href = this.stylesheetUrl;
            return this;
        }

        connectedCallback() {
            this.render();
        }

        render() {
            if (this.rendered) return;
            if (!this.shadowRoot) throw new Error('Export progress dialog requires Shadow DOM.');
            this.shadowRoot.innerHTML = `
                <link rel="stylesheet">
                <div class="overlay">
                    <section class="card" role="dialog" aria-modal="true"
                        aria-labelledby="export-progress-title">
                        <h2 id="export-progress-title">Exporting marathon</h2>
                        <p class="status">Preparing export...</p>
                        <progress class="progress" max="100"></progress>
                        <div class="meta">
                            <span class="count">Discovering sections...</span>
                            <span class="percent">0%</span>
                        </div>
                        <button class="close" type="button">Close</button>
                    </section>
                </div>
            `;
            this.elements = {
                status: this.shadowRoot.querySelector('.status'),
                progress: this.shadowRoot.querySelector('.progress'),
                count: this.shadowRoot.querySelector('.count'),
                percent: this.shadowRoot.querySelector('.percent'),
                close: this.shadowRoot.querySelector('.close')
            };
            this.elements.close.addEventListener('click', () => this.remove());
            this.rendered = true;
        }

        update({ statusText, loadedSections = 0, totalSections = 0, countText,
            state = 'loading' }) {
            const hasTotal = totalSections > 0;
            const progressPercent = state === 'complete' ? 100
                : hasTotal ? Math.min(100, Math.round((loadedSections / totalSections) * 100)) : 0;
            this.toggleAttribute('indeterminate', !hasTotal && state === 'loading');
            this.toggleAttribute('complete', state === 'complete');
            this.toggleAttribute('error', state === 'error');
            this.elements.status.textContent = statusText;
            this.elements.count.textContent = countText ?? (hasTotal
                ? `${loadedSections} / ${totalSections} sections loaded`
                : state === 'complete' ? 'Export complete' : 'Discovering sections...');
            this.elements.percent.textContent = `${progressPercent}%`;
            if (hasTotal || state === 'complete') {
                this.elements.progress.value = progressPercent;
            } else {
                this.elements.progress.removeAttribute('value');
            }
        }

        complete(statusText, totalSections) {
            this.update({ statusText, loadedSections: totalSections, totalSections,
                state: 'complete' });
        }

        error(statusText) {
            this.update({ statusText, state: 'error' });
        }

        dismissAfter(ms) {
            setTimeout(() => this.remove(), ms);
        }
    }

    if (root.customElements && !root.customElements.get(EXPORT_PROGRESS_TAG)) {
        root.customElements.define(EXPORT_PROGRESS_TAG, ExportProgressDialog);
    }
    return { EXPORT_PROGRESS_TAG, ExportProgressDialog };
});
