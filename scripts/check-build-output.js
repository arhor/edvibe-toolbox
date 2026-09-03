import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');

const BUDGETS = Object.freeze({
    mainBytes: 600_000,
    isolatedBytes: 50_000,
    popupBytes: 100_000,
    totalJavaScriptBytes: 650_000,
    maxJavaScriptFiles: 4
});

async function walk(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const absolute = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            files.push(...await walk(absolute));
        } else if (entry.isFile()) {
            files.push(absolute);
        }
    }
    return files;
}

function relative(file) {
    return path.relative(distDir, file).split(path.sep).join('/');
}

function formatBytes(bytes) {
    return `${(bytes / 1024).toFixed(1)} KiB`;
}

async function fileSize(file) {
    return (await stat(file)).size;
}

async function gzipSize(file) {
    return gzipSync(await readFile(file)).byteLength;
}

function assertBudget(label, actual, limit) {
    if (actual > limit) {
        throw new Error(`${label} is ${formatBytes(actual)}, above the ${formatBytes(limit)} regression budget.`);
    }
}

function uniqueEntries(contentScripts, world) {
    return [...new Set(
        contentScripts
            .filter((contentScript) => contentScript.world === world)
            .flatMap((contentScript) => contentScript.js || [])
    )];
}

async function main() {
    const manifest = JSON.parse(await readFile(path.join(distDir, 'manifest.json'), 'utf8'));
    const contentScripts = manifest.content_scripts || [];
    const mainEntries = uniqueEntries(contentScripts, 'MAIN');
    const isolatedEntries = uniqueEntries(contentScripts, 'ISOLATED');
    if (mainEntries.length === 0 || isolatedEntries.length === 0) {
        throw new Error('Built manifest must expose MAIN and ISOLATED content-script entry points.');
    }

    const contentScriptEntries = new Set([...mainEntries, ...isolatedEntries]);
    const allFiles = await walk(distDir);
    const javascriptFiles = allFiles.filter((file) => file.endsWith('.js'));
    const contentScriptFiles = [...contentScriptEntries].map((entry) => path.join(distDir, entry));
    const popupFiles = javascriptFiles.filter((file) => !contentScriptFiles.includes(file));

    if (contentScriptFiles.some((file) => !javascriptFiles.includes(file))) {
        throw new Error('Built content-script entry points are missing from dist/.');
    }
    if (popupFiles.length !== 1) {
        throw new Error(`Expected one popup JavaScript asset, found ${popupFiles.length}. Review chunking policy before changing this invariant.`);
    }

    const measurements = [];
    for (const file of javascriptFiles) {
        measurements.push({
            file: relative(file),
            bytes: await fileSize(file),
            gzipBytes: await gzipSize(file)
        });
    }
    measurements.sort((left, right) => right.bytes - left.bytes);

    const bytesForEntries = (entries) => entries.reduce((total, entry) => {
        const measurement = measurements.find(({ file }) => file === entry);
        return total + (measurement?.bytes ?? 0);
    }, 0);
    const mainBytes = bytesForEntries(mainEntries);
    const isolatedBytes = bytesForEntries(isolatedEntries);
    const popupBytes = popupFiles.reduce((total, file) => {
        const measurement = measurements.find(({ file: name }) => name === relative(file));
        return total + (measurement?.bytes ?? 0);
    }, 0);
    const totalJavaScriptBytes = measurements.reduce((total, { bytes }) => total + bytes, 0);

    assertBudget('MAIN bundles', mainBytes, BUDGETS.mainBytes);
    assertBudget('ISOLATED bundles', isolatedBytes, BUDGETS.isolatedBytes);
    assertBudget('Popup JavaScript', popupBytes, BUDGETS.popupBytes);
    assertBudget('Total JavaScript', totalJavaScriptBytes, BUDGETS.totalJavaScriptBytes);
    if (javascriptFiles.length > BUDGETS.maxJavaScriptFiles) {
        throw new Error(`Build emitted ${javascriptFiles.length} JavaScript files; policy allows at most ${BUDGETS.maxJavaScriptFiles}. Review chunking before raising the limit.`);
    }

    console.log('Production JavaScript output:');
    for (const { file, bytes, gzipBytes } of measurements) {
        console.log(`  ${file}: ${formatBytes(bytes)} (${formatBytes(gzipBytes)} gzip)`);
    }
    console.log(`  total: ${formatBytes(totalJavaScriptBytes)}`);
    console.log('Bundle regression policy passed.');
}

await main();
