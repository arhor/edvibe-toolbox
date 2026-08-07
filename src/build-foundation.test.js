const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const readJson = (relativePath) => JSON.parse(read(relativePath));
const viteConfigPromise = import(pathToFileURL(path.join(root, 'vite.config.mjs')).href);

test('package exposes pinned CRXJS/Vite development and production commands', () => {
    const packageJson = readJson('package.json');

    assert.equal(packageJson.scripts.dev, 'vite build --watch --mode development');
    assert.equal(packageJson.scripts.build, 'vite build');
    assert.equal(packageJson.devDependencies['@crxjs/vite-plugin'], '2.7.1');
    assert.equal(packageJson.devDependencies.vite, '8.1.5');
});

test('build manifest preserves source wiring while separating isolated logger evaluation', async () => {
    const {
        buildManifest,
        sourceManifest,
        standaloneFiles
    } = await viteConfigPromise;
    const manifest = readJson('manifest.json');
    const sourceIsolated = manifest.content_scripts.find((entry) => entry.world === 'ISOLATED');
    const buildIsolated = buildManifest.content_scripts.find((entry) => entry.world === 'ISOLATED');
    const sourceMain = manifest.content_scripts.find((entry) => entry.world === 'MAIN');
    const buildMain = buildManifest.content_scripts.find((entry) => entry.world === 'MAIN');

    assert.deepEqual(sourceManifest, manifest);
    assert.deepEqual(sourceIsolated.js, ['src/shared//logger.js', 'src/isolated.js']);
    assert.deepEqual(buildIsolated.js, ['build/isolated-logger.js', 'src/isolated.js']);
    assert.deepEqual(buildMain, sourceMain);
    assert.equal(buildIsolated.run_at, 'document_start');
    assert.equal(buildMain.run_at, 'document_start');

    const buildScripts = buildManifest.content_scripts.flatMap(({ js = [] }) => js);
    assert.deepEqual(standaloneFiles, buildScripts);
    assert.equal(new Set(standaloneFiles).size, standaloneFiles.length);
});

test('build covers popup scripts and exact web-accessible stylesheet paths', async () => {
    const {
        RAW_POPUP_SCRIPTS,
        buildManifest,
        watchedAssets
    } = await viteConfigPromise;

    assert.deepEqual(RAW_POPUP_SCRIPTS, [
        'popup.js',
        'src/components/popup-tool-list.js'
    ]);

    for (const file of RAW_POPUP_SCRIPTS) {
        assert.ok(fs.existsSync(path.join(root, file)), `${file} should exist`);
        assert.ok(watchedAssets.includes(file), `${file} should be watched`);
    }

    const stylesheets = buildManifest.web_accessible_resources
        .flatMap(({ resources = [] }) => resources);
    assert.ok(stylesheets.length > 0);
    for (const file of stylesheets) {
        assert.ok(fs.existsSync(path.join(root, file)), `${file} should exist`);
        assert.ok(watchedAssets.includes(file), `${file} should be watched`);
    }
});

test('isolated logger shim evaluates the shared logger through a distinct build entry', () => {
    assert.equal(
        read('build/isolated-logger.js').trim(),
        "import '../src/shared/logger.js';"
    );
});
