import { LitElement, html, nothing } from 'lit';

import { videoAttachmentDialogStyles } from '#src/content/main/features/video-attachment/video-attachment-dialog.styles.js';
import {
    getLessonSectionSelectionState,
    selectAllLessonSections
} from '#src/content/main/features/video-attachment/video-attachment.js';
import { componentFoundationStyles, dialogFoundationStyles } from '#src/content/main/styles/foundations.js';
import {
    controlStyles,
    dialogShellStyles,
    fieldStyles,
    noticeStyles
} from '#src/content/main/styles/primitives.js';

const VIDEO_ATTACHMENT_DIALOG_TAG = 'edvibe-toolbox-video-attachment-dialog';

function createLessonEntry(lesson) {
    return Object.freeze({
        ...lesson,
        expanded: false,
        loading: false,
        error: '',
        sections: null,
        selectedSectionIds: Object.freeze([])
    });
}

class VideoAttachmentDialog extends LitElement {
    static styles = [
        componentFoundationStyles,
        dialogFoundationStyles,
        dialogShellStyles,
        controlStyles,
        fieldStyles,
        noticeStyles,
        videoAttachmentDialogStyles
    ];

    static properties = {
        options: { state: true },
        lessons: { state: true },
        loadingLessons: { state: true },
        loadError: { state: true },
        videoUrl: { state: true },
        busy: { state: true },
        statusMessage: { state: true },
        statusKind: { state: true }
    };

    constructor() {
        super();
        this.options = null;
        this.lessons = [];
        this.loadingLessons = false;
        this.loadError = '';
        this.videoUrl = '';
        this.busy = false;
        this.statusMessage = '';
        this.statusKind = '';
        this.sectionLoadPromises = new Map();
    }

    configure(options = {}) {
        this.options = options && typeof options === 'object' ? options : {};
        this.lessons = (this.options.lessons || []).map(createLessonEntry);
        this.loadingLessons = Boolean(this.options.loadingLessons);
        this.loadError = '';
        this.videoUrl = '';
        this.busy = false;
        this.statusMessage = '';
        this.statusKind = '';
        this.sectionLoadPromises.clear();
        return this;
    }

    setLessons(lessons) {
        this.lessons = (lessons || []).map(createLessonEntry);
        this.loadingLessons = false;
        this.loadError = '';
    }

    setLoadError(error) {
        this.loadingLessons = false;
        this.loadError = error?.message || 'Failed to load marathon lessons.';
    }

    showStatus(message, kind = '') {
        this.statusMessage = String(message || '');
        this.statusKind = kind;
    }

    getLesson(lessonId) {
        return this.lessons.find((lesson) => lesson.lessonId === Number(lessonId));
    }

    updateLesson(lessonId, update) {
        const targetId = Number(lessonId);
        this.lessons = this.lessons.map((lesson) => {
            if (lesson.lessonId !== targetId) return lesson;
            const next = typeof update === 'function' ? update(lesson) : { ...lesson, ...update };
            return Object.freeze(next);
        });
    }

    async ensureSections(lessonId) {
        const existing = this.getLesson(lessonId);
        if (existing?.sections) return existing.sections;
        if (this.sectionLoadPromises.has(lessonId)) return this.sectionLoadPromises.get(lessonId);

        this.updateLesson(lessonId, (lesson) => ({
            ...lesson,
            loading: true,
            error: ''
        }));

        const promise = Promise.resolve(this.options?.onLoadSections?.(lessonId))
            .then((sections) => {
                const normalized = Object.freeze((sections || []).map(Object.freeze));
                this.updateLesson(lessonId, (lesson) => ({
                    ...lesson,
                    loading: false,
                    error: '',
                    sections: normalized
                }));
                return normalized;
            })
            .catch((error) => {
                this.updateLesson(lessonId, (lesson) => ({
                    ...lesson,
                    loading: false,
                    error: error?.message || 'Failed to load lesson sections.',
                    sections: null
                }));
                throw error;
            })
            .finally(() => {
                this.sectionLoadPromises.delete(lessonId);
            });

        this.sectionLoadPromises.set(lessonId, promise);
        return promise;
    }

    async toggleExpanded(lessonId) {
        if (this.busy) return;
        const lesson = this.getLesson(lessonId);
        if (!lesson) return;

        const expanded = !lesson.expanded;
        this.updateLesson(lessonId, { ...lesson, expanded });
        if (expanded && !lesson.sections) {
            try {
                await this.ensureSections(lessonId);
            } catch (_) {
                // The row renders the load error and offers retry.
            }
        }
    }

    async setLessonSelected(lessonId, selected) {
        if (this.busy) return;
        if (!selected) {
            this.updateLesson(lessonId, (lesson) => ({
                ...lesson,
                selectedSectionIds: Object.freeze([])
            }));
            return;
        }

        try {
            const sections = await this.ensureSections(lessonId);
            this.updateLesson(lessonId, (lesson) => ({
                ...lesson,
                selectedSectionIds: selectAllLessonSections(sections)
            }));
        } catch (_) {
            this.showStatus('Could not select the lesson because its sections failed to load.', 'danger');
        }
    }

    setSectionSelected(lessonId, sectionId, selected) {
        if (this.busy) return;
        const normalizedSectionId = Number(sectionId);
        this.updateLesson(lessonId, (lesson) => {
            const current = new Set(lesson.selectedSectionIds);
            if (selected) current.add(normalizedSectionId);
            else current.delete(normalizedSectionId);
            return {
                ...lesson,
                selectedSectionIds: Object.freeze([...current])
            };
        });
    }

    selectedTargets() {
        return this.lessons.flatMap((lesson) => {
            const selected = new Set(lesson.selectedSectionIds);
            return (lesson.sections || [])
                .filter(({ sectionId }) => selected.has(sectionId))
                .map((section) => Object.freeze({
                    lessonId: lesson.lessonId,
                    lessonNumber: lesson.number,
                    lessonName: lesson.name,
                    sectionId: section.sectionId,
                    sectionName: section.name
                }));
        });
    }

    applyResult(result) {
        const successfulSectionIds = new Set(
            (result?.results || [])
                .filter((entry) => entry.status === 'attached')
                .map((entry) => entry.sectionId)
        );
        if (successfulSectionIds.size === 0) return;

        this.lessons = this.lessons.map((lesson) => Object.freeze({
            ...lesson,
            selectedSectionIds: Object.freeze(
                lesson.selectedSectionIds.filter((sectionId) => !successfulSectionIds.has(sectionId))
            )
        }));
    }

    async attach() {
        if (this.busy) return;
        const targets = this.selectedTargets();
        if (!this.videoUrl.trim()) {
            this.showStatus('Enter a YouTube video URL.', 'danger');
            return;
        }
        if (targets.length === 0) {
            this.showStatus('Select at least one lesson section.', 'danger');
            return;
        }

        this.busy = true;
        this.showStatus(`Attaching video to ${targets.length} section${targets.length === 1 ? '' : 's'}…`);
        try {
            const result = await this.options?.onAttach?.({
                youtubeUrl: this.videoUrl,
                targets,
                onProgress: ({ current, total }) => {
                    this.showStatus(`Attaching video ${current}/${total}…`);
                }
            });
            this.applyResult(result);
            const summary = result?.summary || {};
            if ((summary.failed || 0) === 0 && (summary.notAttempted || 0) === 0) {
                this.showStatus(`Video attached to ${summary.successful || 0} section${summary.successful === 1 ? '' : 's'}.`, 'success');
            } else {
                this.showStatus(
                    `Attached: ${summary.successful || 0}. Failed: ${summary.failed || 0}. Not attempted: ${summary.notAttempted || 0}. Failed targets remain selected.`,
                    'warning'
                );
            }
        } catch (error) {
            this.showStatus(error.message || 'Failed to attach the video.', 'danger');
        } finally {
            this.busy = false;
        }
    }

    close() {
        if (!this.busy) this.options?.onClose?.();
    }

    renderLesson(lesson) {
        const selection = getLessonSectionSelectionState(lesson.sections || [], lesson.selectedSectionIds);
        const sectionsLoaded = Array.isArray(lesson.sections);

        return html`
            <li class="lesson-node">
                <div class="lesson-row">
                    <button class="expander" type="button"
                        aria-label=${lesson.expanded ? 'Collapse lesson' : 'Expand lesson'}
                        aria-expanded=${String(lesson.expanded)}
                        ?disabled=${this.busy}
                        @click=${() => this.toggleExpanded(lesson.lessonId)}>
                        ${lesson.expanded ? '⌄' : '›'}
                    </button>
                    <label class="lesson-check">
                        <input type="checkbox"
                            .checked=${selection.checked}
                            .indeterminate=${selection.indeterminate}
                            ?disabled=${this.busy || lesson.loading || (sectionsLoaded && selection.sectionCount === 0)}
                            @change=${(event) => {
                                void this.setLessonSelected(lesson.lessonId, event.currentTarget.checked);
                            }}>
                        <span class="lesson-title">#${lesson.number} ${lesson.name}</span>
                    </label>
                    ${lesson.loading
                        ? html`<span class="lesson-meta">Loading…</span>`
                        : sectionsLoaded
                            ? html`<span class="lesson-meta">${selection.selectedCount}/${selection.sectionCount}</span>`
                            : nothing}
                </div>
                ${lesson.expanded ? html`
                    <div class="lesson-children">
                        ${lesson.loading
                            ? html`<p class="tree-message">Loading sections…</p>`
                            : lesson.error
                                ? html`
                                    <div class="tree-error" data-notice="danger">
                                        <span>${lesson.error}</span>
                                        <button data-control="secondary" type="button" ?disabled=${this.busy}
                                            @click=${() => this.ensureSections(lesson.lessonId).catch(() => {})}>
                                            Retry
                                        </button>
                                    </div>
                                `
                                : sectionsLoaded && lesson.sections.length === 0
                                    ? html`<p class="tree-message">No sections in this lesson.</p>`
                                    : html`
                                        <ul class="section-list">
                                            ${(lesson.sections || []).map((section) => html`
                                                <li>
                                                    <label class="section-check">
                                                        <input type="checkbox"
                                                            .checked=${lesson.selectedSectionIds.includes(section.sectionId)}
                                                            ?disabled=${this.busy}
                                                            @change=${(event) => this.setSectionSelected(
                                                                lesson.lessonId,
                                                                section.sectionId,
                                                                event.currentTarget.checked
                                                            )}>
                                                        <span>${section.name}</span>
                                                    </label>
                                                </li>
                                            `)}
                                        </ul>
                                    `}
                    </div>
                ` : nothing}
            </li>
        `;
    }

    render() {
        const selectedCount = this.selectedTargets().length;
        return html`
            <div class="overlay" data-part="overlay">
                <section class="dialog" data-part="dialog" role="dialog" aria-modal="true" aria-labelledby="title">
                    <header>
                        <div>
                            <h2 id="title">Attach YouTube video</h2>
                            <p>Add the same video to selected sections across marathon lessons.</p>
                        </div>
                        <button class="icon" data-control="secondary" type="button" aria-label="Close"
                            ?disabled=${this.busy} @click=${() => this.close()}>×</button>
                    </header>
                    <main>
                        <label data-field>
                            <span>YouTube video URL</span>
                            <input type="url" inputmode="url" autocomplete="off"
                                placeholder="https://youtu.be/…"
                                .value=${this.videoUrl}
                                ?disabled=${this.busy}
                                @input=${(event) => { this.videoUrl = event.currentTarget.value; }}>
                            <span data-part="help">The original YouTube URL is attached to every selected section.</span>
                        </label>

                        <section class="selection-panel">
                            <div class="selection-header">
                                <div>
                                    <h3>Lessons and sections</h3>
                                    <p>Selecting a lesson selects all of its sections. Expand a lesson to choose individual sections.</p>
                                </div>
                                <strong>${selectedCount} selected</strong>
                            </div>

                            ${this.loadingLessons
                                ? html`<p class="tree-message">Loading marathon lessons…</p>`
                                : this.loadError
                                    ? html`<div data-notice="danger">${this.loadError}</div>`
                                    : html`
                                        <ul class="lesson-tree">
                                            ${this.lessons.map((lesson) => this.renderLesson(lesson))}
                                        </ul>
                                    `}
                        </section>

                        <div data-notice=${this.statusKind || 'info'} role="status" aria-live="polite"
                            ?hidden=${!this.statusMessage}>${this.statusMessage}</div>
                    </main>
                    <footer data-part="actions">
                        <button data-control="secondary" type="button" ?disabled=${this.busy}
                            @click=${() => this.close()}>Close</button>
                        <button data-control type="button"
                            ?disabled=${this.busy || !this.videoUrl.trim() || selectedCount === 0}
                            @click=${() => this.attach()}>
                            ${this.busy ? 'Attaching…' : `Attach to ${selectedCount || 0} section${selectedCount === 1 ? '' : 's'}`}
                        </button>
                    </footer>
                </section>
            </div>
        `;
    }
}

if (!customElements.get(VIDEO_ATTACHMENT_DIALOG_TAG)) {
    customElements.define(VIDEO_ATTACHMENT_DIALOG_TAG, VideoAttachmentDialog);
}

export { VIDEO_ATTACHMENT_DIALOG_TAG, VideoAttachmentDialog };
