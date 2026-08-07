const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const readJson = (relativePath) => JSON.parse(read(relativePath));

test('JSZip and Turndown are pinned package-managed runtime dependencies', () => {
    const packageJson = readJson('package.json');
    const packageLock = readJson('package-lock.json');

    assert.deepEqual(packageJson.dependencies, {
        jszip: '3.10.1',
        turndown: '7.2.2'
    });
    assert.deepEqual(packageLock.packages[''].dependencies, packageJson.dependencies);
    assert.doesNotThrow(() => require.resolve('jszip'));
    assert.doesNotThrow(() => require.resolve('turndown'));
    assert.equal(fs.existsSync(path.join(root, 'lib/jszip.min.js')), false);
    assert.equal(fs.existsSync(path.join(root, 'lib/turndown.min.js')), false);
});

test('MAIN runtime bridges bundled package modules to the existing export globals', () => {
    const bridge = read('src/entrypoints/runtime-dependencies.js');
    const mainEntry = read('src/entrypoints/main.js');

    assert.match(bridge, /import JSZip from 'jszip';/);
    assert.match(bridge, /import TurndownService from 'turndown';/);
    assert.match(bridge, /window\.JSZip = JSZip;/);
    assert.match(bridge, /window\.TurndownService = TurndownService;/);
    assert.ok(
        mainEntry.indexOf("import './runtime-dependencies.js';")
        < mainEntry.indexOf("import '../features/marathon-export.js';")
    );
    assert.doesNotMatch(mainEntry, /lib\/(?:jszip|turndown)\.min\.js/);
});
