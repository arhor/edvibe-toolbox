import assert from 'node:assert/strict';
import test from 'node:test';

import { createFeatureSession } from '#src/content/main/application/feature-session.js';

function createOperationGuard() {
    let activeOperation = null;
    const activations = [];
    const releases = [];
    return {
        activations,
        releases,
        activate(operationName) {
            activations.push(operationName);
            if (activeOperation !== null) {
                return false;
            }
            activeOperation = operationName;
            return true;
        },
        release(operationName) {
            releases.push(operationName);
            if (activeOperation !== operationName) {
                return false;
            }
            activeOperation = null;
            return true;
        },
        canStart() {
            return activeOperation === null;
        }
    };
}

function createDialog({ remove = () => {} } = {}) {
    return { remove };
}

test('feature session should acquire the operation guard once and block duplicate activation', () => {
    // Given
    const operationGuard = createOperationGuard();
    const session = createFeatureSession({ operationGuard, operationName: 'example' });

    // When
    const firstActivation = session.activate();
    const duplicateActivation = session.activate();

    // Then
    assert.equal(firstActivation, true);
    assert.equal(duplicateActivation, false);
    assert.equal(session.isActive(), true);
    assert.equal(operationGuard.canStart(), false);
    assert.deepEqual(operationGuard.activations, ['example']);
});

test('feature session should release guard ownership exactly once on normal close', () => {
    // Given
    const operationGuard = createOperationGuard();
    let removeCount = 0;
    const dialog = createDialog({ remove: () => {
        removeCount += 1; 
    } });
    const session = createFeatureSession({ operationGuard, operationName: 'example' });
    session.activate();
    session.ownDialog(dialog);

    // When
    session.close();
    const duplicateRelease = session.release();

    // Then
    assert.equal(removeCount, 1);
    assert.equal(duplicateRelease, false);
    assert.equal(session.isOpen(), false);
    assert.equal(operationGuard.canStart(), true);
    assert.deepEqual(operationGuard.releases, ['example']);
});

test('feature session should release the guard while retaining an initialization error dialog', () => {
    // Given
    const operationGuard = createOperationGuard();
    let removeCount = 0;
    const dialog = createDialog({ remove: () => {
        removeCount += 1; 
    } });
    const session = createFeatureSession({ operationGuard, operationName: 'example' });
    session.activate();
    session.ownDialog(dialog);

    // When
    session.release();

    // Then
    assert.equal(session.isActive(), false);
    assert.equal(session.isOpen(), true);
    assert.equal(session.getDialog(), dialog);
    assert.equal(removeCount, 0);
    assert.equal(operationGuard.canStart(), true);
    assert.equal(session.activate(), false);

    // When the visible error dialog is later closed
    session.close();

    // Then
    assert.equal(removeCount, 1);
    assert.equal(session.isOpen(), false);
    assert.equal(operationGuard.canStart(), true);
    assert.deepEqual(operationGuard.releases, ['example']);
});

test('feature session should release the guard even when dialog removal fails', () => {
    // Given
    const operationGuard = createOperationGuard();
    const session = createFeatureSession({ operationGuard, operationName: 'example' });
    session.activate();
    session.ownDialog(createDialog({
        remove() {
            throw new Error('remove failed');
        }
    }));

    // When / Then
    assert.throws(() => session.close(), /remove failed/);
    assert.equal(session.isOpen(), false);
    assert.equal(operationGuard.canStart(), true);
    assert.deepEqual(operationGuard.releases, ['example']);
});

test('feature session should allow a fresh dialog after close and reopen', () => {
    // Given
    const operationGuard = createOperationGuard();
    const session = createFeatureSession({ operationGuard, operationName: 'example' });
    const firstDialog = createDialog();
    const secondDialog = createDialog();
    session.activate();
    session.ownDialog(firstDialog);
    session.close();

    // When
    const reopened = session.activate();
    session.ownDialog(secondDialog);

    // Then
    assert.equal(reopened, true);
    assert.equal(session.getDialog(), secondDialog);
    assert.equal(operationGuard.canStart(), false);
});
