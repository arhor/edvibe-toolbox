const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const readJson = (relativePath) => JSON.parse(read(relativePath));

test('runtime libraries are pinned package-managed dependencies', () => {
    const packageJson = readJson('package.json');
    const packageLock = readJson('package-lock.json');

    assert.deepEqual(packageJson.dependencies, {
        jszip: '3.10.1',
        lit: '3.3.1',
        turndown: '7.2.2'
    });
    assert.deepEqual(packageLock.packages[''].dependencies, packageJson.dependencies);
    assert.doesNotThrow(() => require.resolve('jszip'));
    assert.doesNotThrow(() => require.resolve('lit'));
    assert.doesNotThrow(() => require.resolve('turndown'));
    assert.equal(fs.existsSync(path.join(root, 'lib/jszip.min.js')), false);
    assert.equal(fs.existsSync(path.join(root, 'lib/turndown.min.js')), false);
});

test('marathon export consumes package modules without legacy runtime globals or vendored bridges', () => {
    const exportSource = read('src/features/marathon-export.js');

    assert.match(exportSource, /import JSZip from 'jszip';/);
    assert.match(exportSource, /import TurndownService from 'turndown';/);
    assert.doesNotMatch(exportSource, /window\.JSZip|window\.TurndownService/);
    assert.equal(fs.existsSync(path.join(root, 'src/entrypoints/runtime-dependencies.js')), false);
    assert.equal(fs.existsSync(path.join(root, 'lib/jszip.min.js')), false);
    assert.equal(fs.existsSync(path.join(root, 'lib/turndown.min.js')), false);
});