(function initializeMarathonExport(root, factory) {
    const api = factory();
    root.EdVibeMarathonExport = api;

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createMarathonExportModule() {
    'use strict';

    const FORBIDDEN_PATH_CHARS = /[\\/:*?"<>|]/g;

    function sanitizePathName(name, fallback = 'untitled') {
        const cleaned = String(name || '')
            .replace(FORBIDDEN_PATH_CHARS, '')
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/\.+$/, '');

        return cleaned || fallback;
    }

    function uniquePathName(baseName, usedNames, fallback = 'untitled') {
        let candidate = sanitizePathName(baseName, fallback);

        if (!usedNames.has(candidate)) {
            usedNames.add(candidate);
            return candidate;
        }

        let counter = 2;
        while (usedNames.has(`${candidate} (${counter})`)) {
            counter += 1;
        }

        candidate = `${candidate} (${counter})`;
        usedNames.add(candidate);
        return candidate;
    }

    function createMarkdownTurndownService() {
        const service = new window.TurndownService({
            headingStyle: 'atx',
            bulletListMarker: '-',
            codeBlockStyle: 'fenced',
            emDelimiter: '*',
            strongDelimiter: '**',
            br: '\n'
        });

        service.addRule('stripInlineStyles', {
            filter: ['span', 'font'],
            replacement: (content) => content
        });

        service.addRule('hideExerciseIds', {
            filter: (node) =>
                node.nodeName === 'EM'
                && node.classList?.contains('hide-id-exercise-item'),
            replacement: () => ''
        });

        return service;
    }

    function preprocessHtml(html) {
        if (!html) return '';

        return String(html)
            .replace(/<br\s+style="[^"]*"\s*\/?>/gi, '<br>')
            .replace(/&nbsp;/gi, ' ')
            .replace(/\u00A0/g, ' ')
            .replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>');
    }

    function postprocessMarkdown(markdown) {
        return markdown
            .replace(/[ \t]+\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    }

    function htmlToMarkdown(html, turndown) {
        const preprocessed = preprocessHtml(html);
        if (!preprocessed.trim()) return '';

        try {
            return postprocessMarkdown(turndown.turndown(preprocessed));
        } catch (error) {
            console.warn(
                '[Edvibe Toolbox][Zip] HTML conversion failed, '
                + 'falling back to plain text:',
                error
            );
            return preprocessed.replace(/<[^>]+>/g, '').trim();
        }
    }

    function extensionFromUrl(url) {
        try {
            const pathname = new URL(url).pathname;
            const ext = pathname.split('.').pop()?.toLowerCase();
            if (ext && /^[a-z0-9]{2,5}$/.test(ext)) return ext;
        } catch (_) {
            // Use a safe default for malformed URLs.
        }

        return 'jpg';
    }

    async function localizeImage(url, imageId, imagesFolder, urlMap) {
        if (!url) return null;
        if (urlMap.has(url)) return urlMap.get(url);

        const filename = `${imageId || 'img'}_`
            + `${crypto.randomUUID().slice(0, 8)}.${extensionFromUrl(url)}`;
        const relativePath = `./images/${filename}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const blob = await response.blob();
            imagesFolder.file(filename, blob);
            urlMap.set(url, relativePath);
            return relativePath;
        } catch (error) {
            console.warn(
                `[Edvibe Toolbox][Zip] Image fetch failed for ${url}:`,
                error.message
            );
            urlMap.set(url, url);
            return url;
        }
    }

    async function renderImageMarkdown(imageEntry, imagesFolder, urlMap) {
        const url = imageEntry.UrlFull || imageEntry.Url;
        if (!url) return '';

        const localPath = await localizeImage(
            url,
            imageEntry.ImageId || imageEntry.ImageFullId,
            imagesFolder,
            urlMap
        );

        return `![Illustration](${localPath})`;
    }

    async function processDescriptionsAndImages(item, ctx) {
        const parts = [];
        const descriptions = item.Descriptions || [];
        const images = item.Images || [];
        const slotCount = Math.max(descriptions.length, images.length);

        for (let index = 0; index < slotCount; index += 1) {
            const description = descriptions[index];
            if (description && description.trim()) {
                parts.push(ctx.htmlToMarkdown(description));
            }

            if (images[index]) {
                parts.push(await renderImageMarkdown(
                    images[index],
                    ctx.imagesFolder,
                    ctx.urlMap
                ));
            }
        }

        return parts.filter(Boolean).join('\n\n');
    }

    function appendRichTextBlocks(blocks, item, htmlToMarkdownFn) {
        for (const block of blocks || []) {
            if (block.Question) {
                item.push(htmlToMarkdownFn(block.Question));
            }
            if (block.Text) {
                item.push(htmlToMarkdownFn(block.Text));
            }
        }
    }

    async function processItemToMarkdown(item, ctx) {
        const sections = [];

        if (item.Name && String(item.Name).trim()) {
            sections.push(`### ${ctx.htmlToMarkdown(item.Name)}`);
        }

        switch (item.Type) {
            case 27:
            case 2:
                sections.push(await processDescriptionsAndImages(item, ctx));
                break;

            case 29:
                if (item.Button?.Link) {
                    const label = item.Button.Text
                        ? ctx.htmlToMarkdown(item.Button.Text)
                        : item.Button.Link;
                    const linkText = label.replace(/\n+/g, ' ').trim() || 'Open link';
                    sections.push(`[${linkText}](${item.Button.Link})`);
                }
                break;

            case 10:
            case 13:
                appendRichTextBlocks(
                    item.QuestionWithCodingTexts,
                    sections,
                    ctx.htmlToMarkdown
                );
                break;

            case 3:
                for (const video of item.Videos || []) {
                    if (!video.Link) continue;
                    const label = video.Text
                        ? ctx.htmlToMarkdown(video.Text)
                        : 'Watch video';
                    const linkText = label.replace(/\n+/g, ' ').trim()
                        || 'Watch video';
                    sections.push(`[${linkText}](${video.Link})`);
                }
                break;

            default:
                appendRichTextBlocks(
                    item.QuestionWithCodingTexts,
                    sections,
                    ctx.htmlToMarkdown
                );

                for (const description of item.Descriptions || []) {
                    if (description && description.trim()) {
                        sections.push(ctx.htmlToMarkdown(description));
                    }
                }

                if (item.Button?.Link) {
                    const label = item.Button.Text
                        ? ctx.htmlToMarkdown(item.Button.Text)
                        : item.Button.Link;
                    const linkText = label.replace(/\n+/g, ' ').trim() || 'Open link';
                    sections.push(`[${linkText}](${item.Button.Link})`);
                }

                for (const video of item.Videos || []) {
                    if (video.Link) {
                        sections.push(
                            `[${video.Text || 'Watch video'}](${video.Link})`
                        );
                    }
                }

                for (const image of item.Images || []) {
                    sections.push(await renderImageMarkdown(
                        image,
                        ctx.imagesFolder,
                        ctx.urlMap
                    ));
                }

                if (item.Text) {
                    sections.push(ctx.htmlToMarkdown(item.Text));
                }

                if (sections.length === 0) {
                    console.debug(
                        `[Edvibe Toolbox][Zip] Unhandled item Type ${item.Type} `
                        + `(Id: ${item.Id})`
                    );
                }
                break;
        }

        for (const pdf of item.Pdfs || []) {
            const pdfUrl = pdf.Url || pdf.Link;
            if (pdfUrl) {
                const pdfLabel = pdf.Name || pdf.Text || 'PDF document';
                sections.push(`[${pdfLabel}](${pdfUrl})`);
            }
        }

        return sections.filter(Boolean).join('\n\n');
    }

    function triggerBlobDownload(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    async function compileMarathonToZip(backupData, options = {}) {
        if (!window.JSZip) {
            throw new Error(
                'JSZip is not loaded. Ensure lib/jszip.min.js is injected '
                + 'before this script.'
            );
        }
        if (!window.TurndownService) {
            throw new Error(
                'TurndownService is not loaded. Ensure lib/turndown.min.js '
                + 'is injected before this script.'
            );
        }
        if (!backupData || !Array.isArray(backupData.lessons)) {
            throw new Error(
                'Invalid backup data: expected an object with a lessons array.'
            );
        }

        console.log('[Edvibe Toolbox][Zip] Starting marathon workspace compilation...');

        const zip = new window.JSZip();
        const turndown = createMarkdownTurndownService();
        const archiveRootName = `marathon_${backupData.marathonId || 'export'}`;
        const rootFolder = zip.folder(archiveRootName);
        const backupJsonName = `edvibe_marathon_`
            + `${backupData.marathonId || 'export'}_backup.json`;

        rootFolder.file(backupJsonName, JSON.stringify(backupData, null, 2));

        const usedLessonNames = new Set();
        const totalLessons = backupData.lessons.length;

        for (const [lessonIndex, lesson] of backupData.lessons.entries()) {
            options.onProgress?.({
                message: `Processing lesson ${lessonIndex + 1} `
                    + `of ${totalLessons}: ${lesson.name}`,
                current: lessonIndex + 1,
                total: totalLessons
            });
            const lessonFolderName = uniquePathName(
                lesson.name,
                usedLessonNames,
                `lesson_${lesson.lessonId}`
            );
            const lessonFolder = rootFolder.folder(lessonFolderName);
            const imagesFolder = lessonFolder.folder('images');
            const usedSectionNames = new Set();
            const ctx = {
                turndown,
                imagesFolder,
                urlMap: new Map(),
                htmlToMarkdown: (html) => htmlToMarkdown(html, turndown)
            };

            if (lesson.imageUrl) {
                await localizeImage(
                    lesson.imageUrl,
                    `lesson_${lesson.lessonId}`,
                    imagesFolder,
                    ctx.urlMap
                );
            }

            for (const [sectionIndex, section] of (lesson.sections || []).entries()) {
                const numberedSectionName = `${sectionIndex + 1} - ${section.name}`;
                const sectionBaseName = uniquePathName(
                    numberedSectionName,
                    usedSectionNames,
                    `section_${section.sectionId}`
                );
                const sectionFileName = `${sectionBaseName}.md`;
                const markdownParts = [`# ${section.name}`];

                if (section.isHomework) {
                    markdownParts.push('> Homework section');
                }

                markdownParts.push('');

                for (const item of section.items || []) {
                    if (item.IsHideExercise) continue;

                    const block = await processItemToMarkdown(item, ctx);
                    if (!block) continue;

                    markdownParts.push(block);
                    markdownParts.push('---');
                }

                while (
                    markdownParts.length
                    && markdownParts[markdownParts.length - 1] === '---'
                ) {
                    markdownParts.pop();
                }

                if (markdownParts.length <= 2) {
                    markdownParts.push('_No content in this section._');
                }

                lessonFolder.file(
                    sectionFileName,
                    `${markdownParts.join('\n\n').trim()}\n`
                );
            }
        }

        rootFolder.file('_export_meta.json', JSON.stringify({
            exportedAt: backupData.exportedAt,
            marathonId: backupData.marathonId,
            totalLessons: backupData.totalLessons,
            compiledAt: new Date().toISOString()
        }, null, 2));

        options.onProgress?.({ message: 'Compressing archive...' });

        const zipBlob = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        });
        const downloadName = `edvibe_marathon_`
            + `${backupData.marathonId || 'export'}_workspace.zip`;
        triggerBlobDownload(zipBlob, downloadName);

        console.log(
            '[Edvibe Toolbox][Zip] Marathon workspace archive downloaded:',
            downloadName
        );
        return zipBlob;
    }

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
        compileToZip = compileMarathonToZip,
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
        compileMarathonToZip,
        createExportProgressOverlay,
        createMarathonExportFeature
    };
});
