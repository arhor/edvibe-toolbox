import assert from 'node:assert/strict';
import test from 'node:test';

import { createBatchUserOnboardingFeatureV2 } from '#src/content/main/features/batch-user-onboarding/batch-user-onboarding.js';
import { OperationGuard } from '#src/content/main/infrastructure/operation-guard.js';

function createDialog() {
    return {
        configuration: null,
        configure(configuration) {
            this.configuration = configuration;
        },
        remove() { },
        showConfigure() { },
        showLoading() { }
    };
}

function installBrowserGlobals(dialog) {
    const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
    const previousDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
    const alerts = [];
    const appended = [];
    Object.defineProperty(globalThis, 'window', {
        configurable: true,
        writable: true,
        value: {
            alert(message) {
                alerts.push(message);
            }
        }
    });
    Object.defineProperty(globalThis, 'document', {
        configurable: true,
        writable: true,
        value: {
            body: {
                appendChild(element) {
                    appended.push(element);
                }
            },
            createElement() {
                return dialog;
            }
        }
    });

    return {
        alerts,
        appended,
        restore() {
            if (previousWindow) {
                Object.defineProperty(globalThis, 'window', previousWindow);
            } else {
                delete globalThis.window;
            }
            if (previousDocument) {
                Object.defineProperty(globalThis, 'document', previousDocument);
            } else {
                delete globalThis.document;
            }
        }
    };
}

test('createBatchUserOnboardingFeatureV2 should use runtime page context and Edvibe API', async (t) => {
    // Given
    const dialog = createDialog();
    const browser = installBrowserGlobals(dialog);
    t.after(browser.restore);
    const pupilRequests = [];
    const transportRequests = [];
    const operationGuard = new OperationGuard();
    const logger = {
        createChildLogger() {
            return { log() { } };
        }
    };
    const feature = createBatchUserOnboardingFeatureV2({
        transport: {
            async sendRequest(controller, method, projectName, value) {
                transportRequests.push({ controller, method, projectName, value });
                return { Value: { Items: [] } };
            },
            getConnectionState: () => ({ isOpen: true })
        },
        operationGuard,
        logger,
        executionHistoryService: {
            persistTerminal: async () => ({ stored: true })
        },
        dispatch() { },
        edvibeApi: {
            async loadAllPupils(options) {
                pupilRequests.push(options);
                return [{ Email: 'student@example.com' }];
            }
        },
        pageContext: {
            marathonId: 777,
            marathonName: 'Runtime-owned marathon',
            hostname: 'edvibe.com'
        }
    });

    // When
    await feature.open();

    // Then
    assert.deepEqual(pupilRequests, [{ marathonId: 777 }]);
    assert.equal(transportRequests.length, 1);
    assert.deepEqual(transportRequests[0], {
        controller: 'MarathonModeratorWsController',
        method: 'GetMarathonModerators',
        projectName: 'Marathons',
        value: { MarathonId: 777 }
    });
    assert.equal(operationGuard.canStart(), false);
    assert.deepEqual(browser.appended, [dialog]);
    assert.deepEqual(browser.alerts, []);
    assert.ok(dialog.configuration);

    // When
    dialog.configuration.onClose();

    // Then
    assert.equal(operationGuard.canStart(), true);
});
