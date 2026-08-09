const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const readJson = (relativePath) => JSON.parse(read(relativePath));
const readImports = (relativePath) => [...read(relativePath).matchAll(/^import ['"](.+?)['"];$/gm)]
    .map((match) => match[1]);
const viteConfigPromise = import(pathToFileURL(path.join(root, 'vite.config.mjs')).href);

test('package exposes pinned CRXJS/Vite development and production commands', () => {
    const packageJson = readJson('package.json');

    assert.equal(packageJson.scripts.dev, 'vite build --watch --mode development');
    assert.equal(packageJson.scripts.build, 'vite build');
    assert.equal(packageJson.devDependencies['@crxjs/vite-plugin'], '2.7.1');
    assert.equal(packageJson.devDependencies.vite, '8.1.5');
});

test('manifest uses standalone document-start content-script entry points', async () => {
    const { sourceManifest, standaloneFiles } = await viteConfigPromise;
    const manifest = readJson('manifest.json');
    const isolatedWorld = manifest.content_scripts.find((entry) => entry.world === 'ISOLATED');
    const mainWorld = manifest.content_scripts.find((entry) => entry.world === 'MAIN');

    assert.deepEqual(sourceManifest, manifest);
    assert.deepEqual(isolatedWorld.js, ['src/entrypoints/isolated.js']);
    assert.deepEqual(mainWorld.js, ['src/entrypoints/main.js']);
    assert.equal(isolatedWorld.run_at, 'document_start');
    assert.equal(mainWorld.run_at, 'document_start');
    assert.deepEqual(standaloneFiles, [
        'src/entrypoints/isolated.js',
        'src/entrypoints/main.js'
    ]);
});

test('popup and isolated runtimes use explicit source entry points', () => {
    const popupHtml = read('popup.html');

    assert.match(
        popupHtml,
        /<script type="module" src="src\/entrypoints\/popup\.js"><\/script>/
    );
    assert.doesNotMatch(popupHtml, /vite-ignore/);
    assert.deepEqual(readImports('src/entrypoints/popup.js'), [
        '../components/popup-tool-list.js',
        '../../popup.js'
    ]);
    assert.deepEqual(readImports('src/entrypoints/isolated.js'), [
        '../isolated.js'
    ]);
    assert.match(read('popup.js'), /from '\.\/src\/shared\/logger\.js';/);
    assert.match(read('src/isolated.js'), /from '\.\/shared\/logger\.js';/);
});

test('manifest does not expose in-page component styles as web-accessible resources', async () => {
    const { sourceManifest } = await viteConfigPromise;
    const resources = (sourceManifest.web_accessible_resources ?? [])
        .flatMap(({ resources = [] }) => resources);

    assert.equal(
        resources.some((file) => file.startsWith('src/components/') && file.endsWith('.css')),
        false
    );
});