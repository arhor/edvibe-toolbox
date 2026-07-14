(function initializeMarathonExport(root, factory) {
    const api = factory();
    root.EdVibeMarathonExport = api;

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createMarathonExportModule() {
    'use strict';

    const EXPORT_PROGRESS_OVERLAY_ID = 'edvibe-toolbox-export-progress';
    const EXPORT_PROGRESS_STYLE_ID = 'edvibe-toolbox-export-progress-styles';

    function parseMarathonId(url) {
        const match = String(url || '').match(/marathon\/(\d+)/);
        return match ? Number(match[1]) : null;
    }

    function ensureExportProgressStyles() {
        if (document.getElementById(EXPORT_PROGRESS_STYLE_ID)) return;

        const style = document.createElement('style');
        style.id = EXPORT_PROGRESS_STYLE_ID;
        style.textContent = `
            #${EXPORT_PROGRESS_OVERLAY_ID} {
                position: fixed;
                inset: 0;
                z-index: 2147483647;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(15, 23, 42, 0.55);
                font-family: "Segoe UI", Arial, sans-serif;
            }

            #${EXPORT_PROGRESS_OVERLAY_ID} .edvibe-export-card {
                width: min(630px, calc(100vw - 32px));
                padding: 24px;
                border-radius: 16px;
                background: #ffffff;
                box-shadow: 0 24px 80px rgba(15, 23, 42, 0.35);
                color: #1f2937;
            }

            #${EXPORT_PROGRESS_OVERLAY_ID} .edvibe-export-title {
                margin: 0 0 8px;
                font-size: 20px;
                line-height: 1.3;
                font-weight: 700;
                color: #111827;
            }

            #${EXPORT_PROGRESS_OVERLAY_ID} .edvibe-export-status {
                margin: 0 0 16px;
                min-height: 40px;
                font-size: 14px;
                line-height: 1.4;
                white-space: pre-line;
                color: #4b5563;
            }

            #${EXPORT_PROGRESS_OVERLAY_ID} .edvibe-export-track {
                overflow: hidden;
                height: 12px;
                border-radius: 999px;
                background: #e5e7eb;
            }

            #${EXPORT_PROGRESS_OVERLAY_ID} .edvibe-export-bar {
                width: 0%;
                height: 100%;
                border-radius: inherit;
                background: linear-gradient(90deg, #3498db, #22c55e);
                transition: width 0.25s ease;
            }

            #${EXPORT_PROGRESS_OVERLAY_ID}.is-indeterminate .edvibe-export-bar {
                width: 40%;
                animation: edvibe-export-progress-slide 1.2s ease-in-out infinite;
            }

            #${EXPORT_PROGRESS_OVERLAY_ID} .edvibe-export-meta {
                display: flex;
                justify-content: space-between;
                gap: 16px;
                margin-top: 10px;
                font-size: 12px;
                color: #6b7280;
            }

            #${EXPORT_PROGRESS_OVERLAY_ID} .edvibe-export-close {
                display: none;
                margin-top: 18px;
                width: 100%;
                padding: 9px 12px;
                border: 0;
                border-radius: 8px;
                background: #3498db;
                color: #ffffff;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
            }

            #${EXPORT_PROGRESS_OVERLAY_ID}.is-complete .edvibe-export-close,
            #${EXPORT_PROGRESS_OVERLAY_ID}.is-error .edvibe-export-close {
                display: block;
            }

            #${EXPORT_PROGRESS_OVERLAY_ID}.is-error .edvibe-export-bar {
                background: #e74c3c;
            }

            @keyframes edvibe-export-progress-slide {
                0% { transform: translateX(-120%); }
                50% { transform: translateX(80%); }
                100% { transform: translateX(260%); }
            }
        `;

        (document.head || document.documentElement).appendChild(style);
    }

    function createExportProgressOverlay() {
        ensureExportProgressStyles();
        document.getElementById(EXPORT_PROGRESS_OVERLAY_ID)?.remove();

        const overlay = document.createElement('div');
        overlay.id = EXPORT_PROGRESS_OVERLAY_ID;
        overlay.className = 'is-indeterminate';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.innerHTML = `
            <div class="edvibe-export-card">
                <h2 class="edvibe-export-title">Exporting marathon</h2>
                <p class="edvibe-export-status">Preparing export...</p>
                <div class="edvibe-export-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                    <div class="edvibe-export-bar"></div>
                </div>
                <div class="edvibe-export-meta">
                    <span class="edvibe-export-count">Discovering sections...</span>
                    <span class="edvibe-export-percent">0%</span>
                </div>
                <button class="edvibe-export-close" type="button">Close</button>
            </div>
        `;

        (document.body || document.documentElement).appendChild(overlay);

        const status = overlay.querySelector('.edvibe-export-status');
        const track = overlay.querySelector('.edvibe-export-track');
        const bar = overlay.querySelector('.edvibe-export-bar');
        const count = overlay.querySelector('.edvibe-export-count');
        const percent = overlay.querySelector('.edvibe-export-percent');
        const closeButton = overlay.querySelector('.edvibe-export-close');

        closeButton.addEventListener('click', () => overlay.remove());

        function update({
            statusText,
            loadedSections = 0,
            totalSections = 0,
            countText,
            state = 'loading'
        }) {
            const hasTotal = totalSections > 0;
            const progressPercent = state === 'complete'
                ? 100
                : hasTotal
                    ? Math.min(100, Math.round((loadedSections / totalSections) * 100))
                    : 0;

            overlay.classList.toggle(
                'is-indeterminate',
                !hasTotal && state === 'loading'
            );
            overlay.classList.toggle('is-complete', state === 'complete');
            overlay.classList.toggle('is-error', state === 'error');

            status.textContent = statusText;
            count.textContent = countText ?? (hasTotal
                ? `${loadedSections} / ${totalSections} sections loaded`
                : state === 'complete'
                    ? 'Export complete'
                    : 'Discovering sections...');
            percent.textContent = `${progressPercent}%`;
            bar.style.width = hasTotal || state === 'complete'
                ? `${progressPercent}%`
                : '';
            track.setAttribute('aria-valuenow', String(progressPercent));
        }

        return {
            update,
            complete(statusText, totalSections) {
                update({
                    statusText,
                    loadedSections: totalSections,
                    totalSections,
                    state: 'complete'
                });
            },
            error(statusText) {
                update({ statusText, state: 'error' });
            },
            dismissAfter(ms) {
                setTimeout(() => overlay.remove(), ms);
            }
        };
    }

    function createMarathonExportFeature({
        sendRequest,
        wait,
        canStart,
        onActiveChange,
        compileToZip,
        notifyStatus,
        createProgressOverlay = createExportProgressOverlay,
        getCurrentUrl = () => window.location.href,
        now = () => new Date().toISOString(),
        logger = console
    }) {
        async function start() {
            if (!canStart()) {
                const message = 'Cannot start export while another operation is active.';
                logger.warn(`[Edvibe Toolbox][Export] ${message}`);
                notifyStatus('error', message);
                return;
            }

            onActiveChange(true);
            let progressOverlay = null;

            try {
                notifyStatus('started');
                logger.log('[Edvibe Toolbox][Export] Starting marathon export...');
                progressOverlay = createProgressOverlay();
                progressOverlay.update({
                    statusText: 'Finding marathon lessons...',
                    loadedSections: 0,
                    totalSections: 0
                });
                const marathonId = parseMarathonId(getCurrentUrl());
                if (!marathonId) {
                    progressOverlay.error(
                        'Failed to find a valid MarathonId in the current page URL.'
                    );
                    notifyStatus('error', 'Invalid marathon URL.');
                    return;
                }

                const backupBundle = {
                    exportedAt: now(),
                    marathonId,
                    totalLessons: 0,
                    lessons: []
                };
                const paginationData = await sendRequest(
                    'MarathonLessonWsController',
                    'GetMarathonLessonsPagination',
                    'Marathons',
                    {
                        MarathonId: marathonId,
                        SearchTerm: '',
                        Page: { Skip: 0, Take: 100 }
                    }
                );
                const marathonLessons = paginationData.Value?.Items || [];
                backupBundle.totalLessons = marathonLessons.length;
                progressOverlay.update({
                    statusText: `Found ${marathonLessons.length} lessons. `
                        + 'Loading lesson sections...',
                    loadedSections: 0,
                    totalSections: 0
                });

                const lessonQueue = [];
                let totalSections = 0;

                for (const [lessonIndex, lessonNode] of marathonLessons.entries()) {
                    progressOverlay.update({
                        statusText: `Loading sections for lesson `
                            + `${lessonIndex + 1} of ${marathonLessons.length}: `
                            + lessonNode.Name,
                        loadedSections: 0,
                        totalSections: 0
                    });
                    const lessonStructure = await sendRequest(
                        'LessonWsController',
                        'GetLessonWithId',
                        'Books',
                        { LessonId: lessonNode.LessonId }
                    );
                    const sections = [...(lessonStructure.Value?.Sections || [])];
                    if (lessonStructure.Value?.HomeworkSection) {
                        sections.push(lessonStructure.Value.HomeworkSection);
                    }
                    totalSections += sections.length;
                    lessonQueue.push({ lessonNode, lessonStructure, sections });
                }

                progressOverlay.update({
                    statusText: `Found ${totalSections} sections. `
                        + 'Loading exercise assets...',
                    loadedSections: 0,
                    totalSections
                });

                let loadedSections = 0;
                for (const { lessonNode, lessonStructure, sections } of lessonQueue) {
                    const lessonEntry = {
                        lessonId: lessonNode.LessonId,
                        marathonLessonId: lessonNode.MarathonLessonId,
                        name: lessonNode.Name,
                        imageUrl: lessonStructure.Value?.ImageUrl || lessonNode.Image,
                        sections: []
                    };

                    for (const section of sections) {
                        progressOverlay.update({
                            statusText: `Lesson: ${lessonNode.Name}\n`
                                + `Section: ${section.Name}`,
                            loadedSections,
                            totalSections
                        });
                        await wait(300);
                        const exerciseResponse = await sendRequest(
                            'GetExerciseWsController',
                            'LoadExercises',
                            'Exercises',
                            {
                                IsTeacher: true,
                                SectionId: section.Id,
                                LessonId: lessonNode.LessonId,
                                LessonSection: 0
                            }
                        );
                        const parsedValue = typeof exerciseResponse.Value === 'string'
                            ? JSON.parse(exerciseResponse.Value)
                            : exerciseResponse.Value;
                        lessonEntry.sections.push({
                            sectionId: section.Id,
                            name: section.Name,
                            isHomework: section.IsHomework || false,
                            items: parsedValue?.Items || []
                        });
                        loadedSections += 1;
                        progressOverlay.update({
                            statusText: `Loaded "${section.Name}" `
                                + `from "${lessonNode.Name}".`,
                            loadedSections,
                            totalSections
                        });
                    }

                    backupBundle.lessons.push(lessonEntry);
                }

                progressOverlay.update({
                    statusText: 'All sections loaded.\n'
                        + 'Processing lesson content and archiving workspace...\n'
                        + 'Downloading images — this may take a few minutes.',
                    loadedSections: 0,
                    totalSections: 0
                });

                await compileToZip(backupBundle, {
                    onProgress({ message, current, total }) {
                        const isCompressing = message === 'Compressing archive...';
                        progressOverlay.update({
                            statusText: isCompressing
                                ? 'Processing lesson content and archiving workspace...\n'
                                    + 'Compressing archive...'
                                : 'Processing lesson content and archiving workspace...\n'
                                    + message,
                            loadedSections: isCompressing ? 0 : (current || 0),
                            totalSections: isCompressing ? 0 : (total || 0),
                            countText: isCompressing
                                ? 'Compressing archive...'
                                : total
                                    ? `${current} / ${total} lessons processed`
                                    : 'Preparing archive...'
                        });
                    }
                });

                progressOverlay.complete(
                    'ZIP workspace archive downloaded successfully.',
                    totalSections
                );
                progressOverlay.dismissAfter(3000);
                notifyStatus('complete');
            } catch (error) {
                logger.error(
                    '[Edvibe Toolbox][Export] Export workflow failed:',
                    error
                );
                progressOverlay?.error(`Export failed: ${error.message}`);
                notifyStatus('error', error.message);
            } finally {
                onActiveChange(false);
            }
        }

        return { start };
    }

    return {
        parseMarathonId,
        createExportProgressOverlay,
        createMarathonExportFeature
    };
});
