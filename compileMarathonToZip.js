// compileMarathonToZip.js - Converts an Edvibe marathon JSON backup into a structured ZIP workspace

console.log('[Edvibe Toolbox][Zip] Marathon ZIP compiler module loaded.');

const FORBIDDEN_PATH_CHARS = /[\\/:*?"<>|]/g;

/** Remove characters that are invalid in cross-platform directory/file names. */
function sanitizePathName(name, fallback = 'untitled') {
    const cleaned = String(name || '')
        .replace(FORBIDDEN_PATH_CHARS, '')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\.+$/, '');

    return cleaned || fallback;
}

/** Ensure folder/file names are unique within a sibling set. */
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

/** Configure TurndownService for Edvibe HTML fragments. */
function createMarkdownTurndownService() {
    const service = new window.TurndownService({
        headingStyle: 'atx',
        bulletListMarker: '-',
        codeBlockStyle: 'fenced',
        emDelimiter: '*',
        strongDelimiter: '**',
        br: '\n'
    });

    // Strip inline style wrappers (span/font) while keeping inner text.
    service.addRule('stripInlineStyles', {
        filter: ['span', 'font'],
        replacement: (content) => content
    });

    // Remove hidden exercise correlation markers injected by the platform UI.
    service.addRule('hideExerciseIds', {
        filter: (node) => node.nodeName === 'EM' && node.classList?.contains('hide-id-exercise-item'),
        replacement: () => ''
    });

    return service;
}

/** Normalize noisy HTML before Turndown conversion. */
function preprocessHtml(html) {
    if (!html) return '';

    return String(html)
        .replace(/<br\s+style="[^"]*"\s*\/?>/gi, '<br>')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\u00A0/g, ' ')
        .replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>');
}

/** Collapse excessive whitespace produced during conversion. */
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
        console.warn('[Edvibe Toolbox][Zip] HTML conversion failed, falling back to plain text:', error);
        return preprocessed.replace(/<[^>]+>/g, '').trim();
    }
}

function extensionFromUrl(url) {
    try {
        const pathname = new URL(url).pathname;
        const ext = pathname.split('.').pop()?.toLowerCase();
        if (ext && /^[a-z0-9]{2,5}$/.test(ext)) return ext;
    } catch (_) {
        // Ignore malformed URLs and use a safe default below.
    }

    return 'jpg';
}

/**
 * Download a remote image into the lesson images folder.
 * Failures are logged and the original URL is returned so compilation continues.
 */
async function localizeImage(url, imageId, imagesFolder, urlMap) {
    if (!url) return null;
    if (urlMap.has(url)) return urlMap.get(url);

    const filename = `${imageId || 'img'}_${crypto.randomUUID().slice(0, 8)}.${extensionFromUrl(url)}`;
    const relativePath = `./images/${filename}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const blob = await response.blob();
        imagesFolder.file(filename, blob);
        urlMap.set(url, relativePath);
        return relativePath;
    } catch (error) {
        console.warn(`[Edvibe Toolbox][Zip] Image fetch failed for ${url}:`, error.message);
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

/**
 * Type 2 / 27 blocks pair Descriptions[] entries with Images[] by index.
 * Either side may be empty for a given slot.
 */
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
            parts.push(await renderImageMarkdown(images[index], ctx.imagesFolder, ctx.urlMap));
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

/**
 * Map a single exercise item to Markdown based on its Type field.
 *
 * Observed types in marathon exports:
 *   2  - image gallery (Descriptions[] aligned with Images[])
 *   3  - embedded video links
 *  10  - rich text / coded interactive content
 *  13  - true/false style coded exercises
 *  27  - text + image layout block
 *  29  - external link button (forms, Drive, Telegram, etc.)
 */
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
            appendRichTextBlocks(item.QuestionWithCodingTexts, sections, ctx.htmlToMarkdown);
            break;

        case 3:
            for (const video of item.Videos || []) {
                if (!video.Link) continue;
                const label = video.Text
                    ? ctx.htmlToMarkdown(video.Text)
                    : 'Watch video';
                sections.push(`[${label.replace(/\n+/g, ' ').trim() || 'Watch video'}](${video.Link})`);
            }
            break;

        default:
            appendRichTextBlocks(item.QuestionWithCodingTexts, sections, ctx.htmlToMarkdown);

            if (item.Descriptions?.length) {
                for (const description of item.Descriptions) {
                    if (description && description.trim()) {
                        sections.push(ctx.htmlToMarkdown(description));
                    }
                }
            }

            if (item.Button?.Link) {
                const label = item.Button.Text
                    ? ctx.htmlToMarkdown(item.Button.Text)
                    : item.Button.Link;
                sections.push(`[${label.replace(/\n+/g, ' ').trim() || 'Open link'}](${item.Button.Link})`);
            }

            for (const video of item.Videos || []) {
                if (video.Link) {
                    sections.push(`[${video.Text || 'Watch video'}](${video.Link})`);
                }
            }

            if (item.Images?.length) {
                for (const image of item.Images) {
                    sections.push(await renderImageMarkdown(image, ctx.imagesFolder, ctx.urlMap));
                }
            }

            if (item.Text) {
                sections.push(ctx.htmlToMarkdown(item.Text));
            }

            if (sections.length === 0) {
                console.debug(`[Edvibe Toolbox][Zip] Unhandled item Type ${item.Type} (Id: ${item.Id})`);
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

/**
 * Compile a marathon backup JSON object into a self-contained ZIP workspace.
 *
 * Layout:
 *   marathon_{id}/
 *     {Lesson Name}/
 *       images/
 *       {Section Name}.md
 *
 * @param {object} backupData - Parsed marathon export (exportedAt, marathonId, lessons[])
 * @returns {Promise<Blob>} Generated ZIP blob (also triggers browser download)
 */
async function compileMarathonToZip(backupData) {
    if (!window.JSZip) {
        throw new Error('JSZip is not loaded. Ensure lib/jszip.min.js is injected before this script.');
    }
    if (!window.TurndownService) {
        throw new Error('TurndownService is not loaded. Ensure lib/turndown.min.js is injected before this script.');
    }
    if (!backupData || !Array.isArray(backupData.lessons)) {
        throw new Error('Invalid backup data: expected an object with a lessons array.');
    }

    console.log('[Edvibe Toolbox][Zip] Starting marathon workspace compilation...');

    const zip = new window.JSZip();
    const turndown = createMarkdownTurndownService();
    const archiveRootName = `marathon_${backupData.marathonId || 'export'}`;
    const rootFolder = zip.folder(archiveRootName);
    const usedLessonNames = new Set();

    for (const lesson of backupData.lessons) {
        const lessonFolderName = uniquePathName(lesson.name, usedLessonNames, `lesson_${lesson.lessonId}`);
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
            await localizeImage(lesson.imageUrl, `lesson_${lesson.lessonId}`, imagesFolder, ctx.urlMap);
        }

        for (const section of lesson.sections || []) {
            const sectionBaseName = uniquePathName(section.name, usedSectionNames, `section_${section.sectionId}`);
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

            while (markdownParts.length && markdownParts[markdownParts.length - 1] === '---') {
                markdownParts.pop();
            }

            if (markdownParts.length <= 2) {
                markdownParts.push('_No content in this section._');
            }

            lessonFolder.file(sectionFileName, `${markdownParts.join('\n\n').trim()}\n`);
        }
    }

    rootFolder.file('_export_meta.json', JSON.stringify({
        exportedAt: backupData.exportedAt,
        marathonId: backupData.marathonId,
        totalLessons: backupData.totalLessons,
        compiledAt: new Date().toISOString()
    }, null, 2));

    const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
    });

    const downloadName = `edvibe_marathon_${backupData.marathonId || 'export'}_workspace.zip`;
    triggerBlobDownload(zipBlob, downloadName);

    console.log('[Edvibe Toolbox][Zip] Marathon workspace archive downloaded:', downloadName);
    return zipBlob;
}

window.compileMarathonToZip = compileMarathonToZip;
