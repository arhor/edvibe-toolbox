import { LitElement, html, nothing } from 'lit';
import {
    componentFoundationStyles,
    dialogFoundationStyles
} from '../../../../components/styles/foundations.js';
import { exportProgressDialogStyles } from './export-progress-dialog.styles.js';

const EXPORT_PROGRESS_TAG = 'edvibe-toolbox-export-progress';

class ExportProgressDialog extends LitElement {
    static styles = [componentFoundationStyles, dialogFoundationStyles, exportProgressDialogStyles];

    static properties = {
        statusText: { state: true },
        loadedSections: { state: true },
        totalSections: { state: true },
        countText: { state: true },
        progressState: { state: true }
    };

    constructor() {
        super();
        this.statusText = 'Preparing export...';
        this.loadedSections = 0;
        this.totalSections = 0;
        this.countText = undefined;
        this.progressState = 'loading';
    }

    setProgress(options = {}) {
        options = options && typeof options === 'object' ? options : {};
        const { statusText = '', loadedSections = 0, totalSections = 0, countText, state = 'loading' } = options;
        this.statusText = String(statusText || '');
        this.loadedSections = Number(loadedSections) || 0;
        this.totalSections = Number(totalSections) || 0;
        this.countText = countText;
        this.progressState = String(state || 'loading');
        this.syncHostState();
        return this;
    }

    syncHostState() {
        const hasTotal = this.totalSections > 0;
        this.toggleAttribute('indeterminate', !hasTotal && this.progressState === 'loading');
        this.toggleAttribute('complete', this.progressState === 'complete');
        this.toggleAttribute('error', this.progressState === 'error');
    }

    complete(statusText, totalSections) {
        return this.setProgress({
            statusText,
            loadedSections: totalSections,
            totalSections,
            state: 'complete'
        });
    }

    error(statusText) {
        return this.setProgress({ statusText, state: 'error' });
    }

    dismissAfter(ms) {
        const delay = Number.isFinite(Number(ms)) ? Math.max(0, Number(ms)) : 0;
        setTimeout(() => this.remove(), delay);
    }

    render() {
        const hasTotal = this.totalSections > 0;
        const progressPercent = this.progressState === 'complete'
            ? 100
            : hasTotal
                ? Math.min(100, Math.round((this.loadedSections / this.totalSections) * 100))
                : 0;
        const count = this.countText ?? (hasTotal
            ? `${this.loadedSections} / ${this.totalSections} sections loaded`
            : this.progressState === 'complete'
                ? 'Export complete'
                : 'Discovering sections...');
        const progressValue = hasTotal || this.progressState === 'complete'
            ? progressPercent
            : nothing;

        return html`
            <div class="overlay">
                <section class="card" role="dialog" aria-modal="true" aria-labelledby="export-progress-title">
                    <h2 id="export-progress-title">Exporting marathon</h2>
                    <p class="status">${this.statusText}</p>
                    <progress class="progress" max="100" value=${progressValue}></progress>
                    <div class="meta">
                        <span class="count">${count}</span>
                        <span class="percent">${progressPercent}%</span>
                    </div>
                    <button class="close" type="button" @click=${() => this.remove()}>Close</button>
                </section>
            </div>
        `;
    }
}

if (!customElements.get(EXPORT_PROGRESS_TAG)) {
    customElements.define(EXPORT_PROGRESS_TAG, ExportProgressDialog);
}

export { EXPORT_PROGRESS_TAG, ExportProgressDialog };
