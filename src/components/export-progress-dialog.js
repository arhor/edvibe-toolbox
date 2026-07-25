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
    const exportProgressTemplate = root.document?.createElement?.('template') || null;

    if (exportProgressTemplate) {
        exportProgressTemplate.innerHTML = `
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
    }

    class ExportProgressDialog extends HTMLElementBase {
        constructor() {
            super();
            this.stylesheetUrl = '';
            this.rendered = false;
            this.elements = null;
            if (typeof this.attachShadow !== 'function' || !exportProgressTemplate) return;
            const shadowRoot = this.attachShadow({ mode: 'open' });
            shadowRoot.append(exportProgressTemplate.content.cloneNode(true));
            this.elements = {
                stylesheet: shadowRoot.querySelector('link'),
                status: shadowRoot.querySelector('.status'),
                progress: shadowRoot.querySelector('.progress'),
                count: shadowRoot.querySelector('.count'),
                percent: shadowRoot.querySelector('.percent'),
                close: shadowRoot.querySelector('.close')
            };
            this.elements.close?.addEventListener('click', () => this.remove());
            this.rendered = true;
        }

        configure(options = {}) {
            const stylesheetUrl = options && typeof options === 'object'
                ? options.stylesheetUrl
                : '';
            this.stylesheetUrl = String(stylesheetUrl || '');
            if (this.elements?.stylesheet) this.elements.stylesheet.href = this.stylesheetUrl;
            return this;
        }

        connectedCallback() {
            this.render();
        }

        render() {
            return this.rendered;
        }

        update(options = {}) {
            if (!this.elements) return this;
            options = options && typeof options === 'object' ? options : {};
            const {
                statusText = '',
                loadedSections = 0,
                totalSections = 0,
                countText,
                state = 'loading'
            } = options;
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
            return this;
        }

        complete(statusText, totalSections) {
            this.update({ statusText, loadedSections: totalSections, totalSections,
                state: 'complete' });
        }

        error(statusText) {
            this.update({ statusText, state: 'error' });
        }

        dismissAfter(ms) {
            const delay = Number.isFinite(Number(ms)) ? Math.max(0, Number(ms)) : 0;
            setTimeout(() => this.remove?.(), delay);
        }
    }

    if (root.customElements && root.HTMLElement
        && !root.customElements.get(EXPORT_PROGRESS_TAG)) {
        root.customElements.define(EXPORT_PROGRESS_TAG, ExportProgressDialog);
    }
    return { EXPORT_PROGRESS_TAG, ExportProgressDialog };
});
