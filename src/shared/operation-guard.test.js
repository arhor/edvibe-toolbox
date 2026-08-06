const test = require('node:test');
const assert = require('node:assert/strict');

const { createOperationGuard } = require('../src/shared/operation-guard.js');

test('operation guard activates one named operation', () => {
    const guard = createOperationGuard();

    assert.equal(guard.canStart(), true);
    assert.equal(guard.activate('export'), true);
    assert.equal(guard.canStart(), false);
    assert.equal(guard.getActiveOperation(), 'export');
    assert.equal(guard.activate('reset'), false);
    assert.equal(guard.getActiveOperation(), 'export');
});

test('operation guard only releases the matching operation', () => {
    const guard = createOperationGuard();
    guard.activate('export');

    assert.equal(guard.release('reset'), false);
    assert.equal(guard.getActiveOperation(), 'export');
    assert.equal(guard.release('export'), true);
    assert.equal(guard.getActiveOperation(), null);
    assert.equal(guard.canStart(), true);
});
