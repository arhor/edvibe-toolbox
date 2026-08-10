import { gzipSync } from 'node:zlib';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');

const BUDGETS = Object.freeze({
    mainBytes: 600_000,
    isolatedBytes: 50_000,
    popupBytes: 100_000,
    totalJavaScriptBytes: 650_000,
    maxJavaScriptFiles: 3
});

async function walk(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const absolute = path.join(directory, entry.name);
        if (entry.isDirectory()) files.push(...await walk(absolute));
        else if (entry.isFile()) files.push(absolute);
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

async function main() {
    const manifest = JSON.parse(await readFile(path.join(distDir, 'manifest.json'), 'utf8'));
    const mainEntry = manifest.content_scripts?.find(({ world }) => world === 'MAIN')?.js?.[0];
    const isolatedEntry = manifest.content_scripts?.find(({ world }) => world === 'ISOLATED')?.js?.[0];
    if (!mainEntry || !isolatedEntry) {
        throw new Error('Built manifest must expose MAIN and ISOLATED content-script entry points.');
    }

    const allFiles = await walk(distDir);
    const javascriptFiles = allFiles.filter((file) => file.endsWith('.js'));
    const mainFile = path.join(distDir, mainEntry);
    const isolatedFile = path.join(distDir, isolatedEntry);
    const popupFiles = javascriptFiles.filter((file) => file !== mainFile && file !== isolatedFile);

    if (!javascriptFiles.includes(mainFile) || !javascriptFiles.includes(isolatedFile)) {
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

    const mainBytes = measurements.find(({ file }) => file === mainEntry)?.bytes ?? 0;
    const isolatedBytes = measurements.find(({ file }) => file === isolatedEntry)?.bytes ?? 0;
    const popupBytes = popupFiles.reduce((total, file) => {
        const measurement = measurements.find(({ file: name }) => name === relative(file));
        return total + (measurement?.bytes ?? 0);
    }, 0);
    const totalJavaScriptBytes = measurements.reduce((total, { bytes }) => total + bytes, 0);

    assertBudget('MAIN bundle', mainBytes, BUDGETS.mainBytes);
    assertBudget('ISOLATED bundle', isolatedBytes, BUDGETS.isolatedBytes);
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