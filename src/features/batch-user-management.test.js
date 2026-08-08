const test = require('node:test');
const assert = require('node:assert/strict');

const {
    parseMarathonId,
    parseEmailInput,
    appendPage,
    loadAllPupils,
    resolveUsersByEmail,
    buildUserPlan,
    runWithRetry,
    executeUserPlan,
    createBatchUserManagementFeature
} = require('./batch-user-management.js');

function createRow(overrides = {}) {
    return {
        email: 'user@example.com',
        normalizedEmail: 'user@example.com',
        pupil: { MarathonPupilId: 22, Email: 'user@example.com', Name: 'User' },
        marathonPupilId: 22,
        hasCurator: true,
        actionable: true,
        unassignSelected: false,
        deleteSelected: false,
        unassign: null,
        delete: null,
        result: { status: 'pending', message: 'Not started' },
        ...overrides
    };
}

function createFeatureDialog() {
    const listeners = new Map();
    const calls = [];
    const dialog = {
        calls,
        addEventListener(type, listener) {
            const typeListeners = listeners.get(type) || [];
            typeListeners.push(listener);
            listeners.set(type, typeListeners);
        },
        async emit(type, detail) {
            for (const listener of listeners.get(type) || []) {
                await listener({ detail });
            }
        }
    };

    for (const method of [
        'configure',
        'showChecking',
        'showConfigure',
        'setEmailState',
        'showValidationErrors',
        'showReview',
        'showExecution',
        'showComplete',
        'showFatalError'
    ]) {
        dialog[method] = (...args) => {
            calls.push({ method, args });
            return dialog;
        };
    }

    return dialog;
}

function installFeatureBrowser({
    href = 'https://edvibe.com/cabinet/marathon/18508/students',
    existingOverlay = null
} = {}) {
    const previousWindow = global.window;
    const previousDocument = global.document;
    const appended = [];
    const alerts = [];

    global.window = {
        location: { href },
        alert: (message) => alerts.push(message)
    };
    global.document = {
        getElementById: () => existingOverlay,
        body: {
            appendChild(element) {
                appended.push(element);
                return element;
            }
        }
    };

    return {
        appended,
        alerts,
        restore() {
            global.window = previousWindow;
            global.document = previousDocument;
        }
    };
}

function findDialogCalls(dialog, method) {
    return dialog.calls.filter((call) => call.method === method);
}

test('parseEmailInput preserves first spelling and removes case-insensitive duplicates', () => {
    assert.deepEqual(
        parseEmailInput(' First@Example.com, second@example.com\nfirst@example.com ; bad '),
        {
            entries: [
                { input: 'First@Example.com', normalized: 'first@example.com' },
                { input: 'second@example.com', normalized: 'second@example.com' }
            ],
            malformed: ['bad'],
            items: [
                { input: 'First@Example.com', normalized: 'first@example.com', isValid: true },
                { input: 'second@example.com', normalized: 'second@example.com', isValid: true },
                { input: 'bad', normalized: 'bad', isValid: false }
            ]
        }
    );
});

test('parseEmailInput exposes valid and malformed tokens in first-seen order', () => {
    assert.deepEqual(
        parseEmailInput('first@example.com; bad address; second@example.com'),
        {
            entries: [
                { input: 'first@example.com', normalized: 'first@example.com' },
                { input: 'second@example.com', normalized: 'second@example.com' }
            ],
            malformed: ['bad address'],
            items: [
                { input: 'first@example.com', normalized: 'first@example.com', isValid: true },
                { input: 'bad address', normalized: 'bad address', isValid: false },
                { input: 'second@example.com', normalized: 'second@example.com', isValid: true }
            ]
        }
    );
});

test('parseMarathonId accepts only marathon path IDs', () => {
    assert.equal(parseMarathonId('https://edvibe.com/cabinet/marathon/18508/students'), 18508);
    assert.equal(parseMarathonId('https://edvibe.com/cabinet/marathons'), null);
});

test('appendPage rejects inconsistent pagination data', () => {
    assert.throws(
        () => appendPage([{ Id: 1 }], 3, [], 3, 'GetMarathonPupils'),
        (error) => error.code === 'INVALID_RESPONSE'
    );
    assert.throws(
        () => appendPage([], null, [{ Id: 1 }], 1.5, 'GetMarathonPupils'),
        (error) => error.code === 'INVALID_RESPONSE'
    );
});

test('loadAllPupils requests every roster page', async () => {
    const calls = [];
    const pupils = await loadAllPupils({
        marathonId: 18508,
        pageSize: 2,
        sendRequest: async (controller, method, project, value) => {
            calls.push({ controller, method, project, value });
            return value.Skip === 0
                ? {
                    Value: {
                        Items: [{ MarathonPupilId: 1 }, { MarathonPupilId: 2 }],
                        Page: { Count: 3 }
                    }
                }
                : {
                    Value: {
                        Items: [{ MarathonPupilId: 3 }],
                        Page: { Count: 3 }
                    }
                };
        }
    });

    assert.deepEqual(pupils.map((pupil) => pupil.MarathonPupilId), [1, 2, 3]);
    assert.deepEqual(calls, [
        {
            controller: 'MarathonPupilsWsController',
            method: 'GetMarathonPupils',
            project: 'Marathons',
            value: { MarathonId: 18508, Skip: 0, Take: 2 }
        },
        {
            controller: 'MarathonPupilsWsController',
            method: 'GetMarathonPupils',
            project: 'Marathons',
            value: { MarathonId: 18508, Skip: 2, Take: 2 }
        }
    ]);
});

test('loadAllPupils rejects an empty page before the expected total', async () => {
    await assert.rejects(
        loadAllPupils({
            marathonId: 18508,
            sendRequest: async () => ({
                Value: { Items: [], Page: { Count: 1 } }
            })
        }),
        (error) => error.code === 'INVALID_RESPONSE'
    );
});

test('resolveUsersByEmail keeps matched, missing, and ambiguous rows in input order', () => {
    const result = resolveUsersByEmail(
        [
            { input: 'FOUND@example.com', normalized: 'found@example.com' },
            { input: 'missing@example.com', normalized: 'missing@example.com' },
            { input: 'duplicate@example.com', normalized: 'duplicate@example.com' }
        ],
        [
            { MarathonPupilId: 1, Email: 'found@example.com', Name: 'Found' },
            { MarathonPupilId: 2, Email: 'duplicate@example.com', Name: 'First duplicate' },
            { MarathonPupilId: 3, Email: 'DUPLICATE@example.com', Name: 'Second duplicate' }
        ]
    );

    assert.deepEqual(result.rows.map((row) => row.status), ['matched', 'missing', 'ambiguous']);
    assert.equal(result.rows[0].pupil.MarathonPupilId, 1);
    assert.equal(result.rows[1].pupil, null);
    assert.equal(result.rows[2].pupil, null);
    assert.deepEqual(result.errors.map((error) => error.type), ['missing', 'ambiguous']);
});

test('buildUserPlan detects curators and starts all operation selections unchecked', () => {
    const rows = buildUserPlan({
        rows: [
            {
                email: 'with@example.com',
                normalizedEmail: 'with@example.com',
                pupil: {
                    MarathonPupilId: 22,
                    Email: 'with@example.com',
                    Name: 'With curator',
                    Moderators: [{ TeacherId: 5 }]
                },
                status: 'matched',
                message: ''
            },
            {
                email: 'without@example.com',
                normalizedEmail: 'without@example.com',
                pupil: {
                    MarathonPupilId: 23,
                    Email: 'without@example.com',
                    Name: 'Without curator',
                    Moderators: []
                },
                status: 'matched',
                message: ''
            },
            {
                email: 'missing@example.com',
                normalizedEmail: 'missing@example.com',
                pupil: null,
                status: 'missing',
                message: 'No marathon pupil found.'
            }
        ]
    });

    assert.equal(rows[0].marathonPupilId, 22);
    assert.equal(rows[0].hasCurator, true);
    assert.equal(rows[1].hasCurator, false);
    assert.equal(rows[2].actionable, false);
    for (const row of rows) {
        assert.equal(row.unassignSelected, false);
        assert.equal(row.deleteSelected, false);
        assert.equal(row.result.status, 'pending');
    }
    assert.equal(rows[0].result.message, 'Not started');
    assert.equal(rows[2].result.message, 'No marathon pupil found.');
});

test('runWithRetry retries transient failures twice and returns total attempts', async () => {
    let attempts = 0;
    const waits = [];
    const result = await runWithRetry(async () => {
        attempts += 1;
        if (attempts < 3) {
            const error = new Error('temporary');
            error.code = 'REQUEST_TIMEOUT';
            throw error;
        }
        return 'ok';
    }, {
        wait: async (delay) => waits.push(delay),
        getConnectionState: () => ({ isOpen: true })
    });

    assert.deepEqual(result, { value: 'ok', attempts: 3 });
    assert.deepEqual(waits, [1000, 3000]);
});

test('runWithRetry does not retry a non-transient failure', async () => {
    let attempts = 0;
    await assert.rejects(
        runWithRetry(async () => {
            attempts += 1;
            const error = new Error('rejected');
            error.code = 'SERVER_REJECTED';
            throw error;
        }, {
            wait: async () => {},
            getConnectionState: () => ({ isOpen: true })
        }),
        (error) => error.code === 'SERVER_REJECTED' && error.attempts === 1
    );
    assert.equal(attempts, 1);
});

test('runWithRetry reports three attempts after transient exhaustion', async () => {
    let attempts = 0;
    await assert.rejects(
        runWithRetry(async () => {
            attempts += 1;
            const error = new Error('timeout');
            error.code = 'REQUEST_TIMEOUT';
            throw error;
        }, {
            wait: async () => {},
            getConnectionState: () => ({ isOpen: true })
        }),
        (error) => error.code === 'REQUEST_TIMEOUT' && error.attempts === 3
    );
    assert.equal(attempts, 3);
});

test('executeUserPlan sends curator removal before deletion with recorded payloads', async () => {
    const calls = [];
    const result = await executeUserPlan({
        marathonId: 18508,
        rows: [createRow({ unassignSelected: true, deleteSelected: true })],
        sendRequest: async (controller, method, project, value) => {
            calls.push({ controller, method, project, value });
            return method === 'AddModeratorsToPupil'
                ? { Value: { IsSuccess: true, Status: 0 } }
                : { Value: 22 };
        },
        wait: async () => {},
        getConnectionState: () => ({ isOpen: true })
    });

    assert.deepEqual(calls, [
        {
            controller: 'MarathonPupilsWsController',
            method: 'AddModeratorsToPupil',
            project: 'Marathons',
            value: {
                MarathonId: 18508,
                MarathonPupilId: 22,
                SelectedModeratorsIds: []
            }
        },
        {
            controller: 'MarathonPupilsWsController',
            method: 'DeleteMarathonPupil',
            project: 'Marathons',
            value: { MarathonPupilId: 22 }
        }
    ]);
    assert.equal(result.rows[0].unassign.status, 'success');
    assert.equal(result.rows[0].delete.status, 'success');
    assert.equal(result.attempts, 2);
});

test('executeUserPlan rejects invalid mutation responses as row failures', async () => {
    const unassignResult = await executeUserPlan({
        marathonId: 18508,
        rows: [createRow({ unassignSelected: true })],
        sendRequest: async () => ({ Value: { IsSuccess: false } }),
        wait: async () => {},
        getConnectionState: () => ({ isOpen: true })
    });
    assert.equal(unassignResult.rows[0].unassign.code, 'INVALID_RESPONSE');
    assert.equal(unassignResult.rows[0].result.status, 'failed');

    const deleteResult = await executeUserPlan({
        marathonId: 18508,
        rows: [createRow({ hasCurator: false, deleteSelected: true })],
        sendRequest: async () => ({ Value: 21 }),
        wait: async () => {},
        getConnectionState: () => ({ isOpen: true })
    });
    assert.equal(deleteResult.rows[0].delete.code, 'INVALID_RESPONSE');
    assert.equal(deleteResult.rows[0].result.status, 'failed');
});

test('unassign without a curator is a successful no-op and still permits deletion', async () => {
    const calls = [];
    const result = await executeUserPlan({
        marathonId: 18508,
        rows: [createRow({ hasCurator: false, unassignSelected: true, deleteSelected: true })],
        sendRequest: async (controller, method, project, value) => {
            calls.push({ controller, method, project, value });
            return { Value: 22 };
        },
        wait: async () => {},
        getConnectionState: () => ({ isOpen: true })
    });

    assert.deepEqual(calls.map((call) => call.method), ['DeleteMarathonPupil']);
    assert.equal(result.rows[0].unassign.status, 'noop');
    assert.equal(result.rows[0].delete.status, 'success');
});

test('failed curator removal skips deletion for that row', async () => {
    const methods = [];
    const result = await executeUserPlan({
        marathonId: 18508,
        rows: [createRow({ unassignSelected: true, deleteSelected: true })],
        sendRequest: async (_controller, method) => {
            methods.push(method);
            const error = new Error('permission denied');
            error.code = 'SERVER_REJECTED';
            throw error;
        },
        wait: async () => {},
        getConnectionState: () => ({ isOpen: true })
    });

    assert.deepEqual(methods, ['AddModeratorsToPupil']);
    assert.equal(result.rows[0].unassign.status, 'failed');
    assert.equal(result.rows[0].delete.status, 'skipped');
    assert.equal(result.failures, 1);
    assert.match(result.rows[0].result.message, /Curator removal failed/);
    assert.match(result.rows[0].result.message, /Deletion skipped/);
});

test('a failed row does not stop a later row', async () => {
    const result = await executeUserPlan({
        marathonId: 18508,
        rows: [
            createRow({ email: 'failed@example.com', unassignSelected: true }),
            createRow({
                email: 'deleted@example.com',
                normalizedEmail: 'deleted@example.com',
                pupil: { MarathonPupilId: 23, Email: 'deleted@example.com', Name: 'Deleted' },
                marathonPupilId: 23,
                hasCurator: false,
                deleteSelected: true
            })
        ],
        sendRequest: async (_controller, method, _project, value) => {
            if (method === 'AddModeratorsToPupil') {
                const error = new Error('write failed');
                error.code = 'SERVER_REJECTED';
                throw error;
            }
            return { Value: value.MarathonPupilId };
        },
        wait: async () => {},
        getConnectionState: () => ({ isOpen: true })
    });

    assert.equal(result.rows[0].result.status, 'failed');
    assert.equal(result.rows[1].delete.status, 'success');
    assert.equal(result.successes, 1);
    assert.equal(result.failures, 1);
});

test('progress reports current operation and completed row counts', async () => {
    const progress = [];
    await executeUserPlan({
        marathonId: 18508,
        rows: [createRow({ email: 'delete@example.com', hasCurator: false, deleteSelected: true })],
        sendRequest: async () => ({ Value: 22 }),
        wait: async () => {},
        getConnectionState: () => ({ isOpen: true }),
        onProgress: (snapshot) => progress.push(snapshot)
    });

    assert.deepEqual(progress.map((snapshot) => snapshot.completed), [0, 1]);
    assert.deepEqual(progress.map((snapshot) => snapshot.current), [
        { email: 'delete@example.com', operation: 'delete' },
        { email: 'delete@example.com', operation: 'delete' }
    ]);
});

test('batch user feature refuses duplicate overlays and unavailable operation slots', async () => {
    const duplicate = installFeatureBrowser({ existingOverlay: {} });
    try {
        const feature = createBatchUserManagementFeature({
            sendRequest: async () => assert.fail('duplicate overlay must not read data'),
            getConnectionState: () => ({ isOpen: true }),
            wait: async () => {},
            canStart: () => true,
            onActiveChange: () => assert.fail('duplicate overlay must not activate'),
            createDialog: () => assert.fail('duplicate overlay must not create a dialog'),
            log: () => {}
        });
        await feature.open();
        assert.deepEqual(duplicate.appended, []);
    } finally {
        duplicate.restore();
    }

    const blocked = installFeatureBrowser();
    try {
        const feature = createBatchUserManagementFeature({
            sendRequest: async () => assert.fail('blocked operation must not read data'),
            getConnectionState: () => ({ isOpen: true }),
            wait: async () => {},
            canStart: () => false,
            onActiveChange: () => assert.fail('blocked operation must not activate'),
            createDialog: () => assert.fail('blocked operation must not create a dialog'),
            log: () => {}
        });
        await feature.open();
        assert.deepEqual(blocked.alerts, [
            'Another Edvibe Toolbox operation is already running.'
        ]);
    } finally {
        blocked.restore();
    }
});

test('batch user feature loads the roster once and resolves visible rows on check', async () => {
    const browser = installFeatureBrowser();
    const dialog = createFeatureDialog();
    const activeChanges = [];
    const roster = [
        {
            MarathonPupilId: 22,
            Email: 'found@example.com',
            Name: 'Found',
            Moderators: [{ TeacherId: 7 }]
        },
        {
            MarathonPupilId: 23,
            Email: 'duplicate@example.com',
            Name: 'Duplicate 1',
            Moderators: []
        },
        {
            MarathonPupilId: 24,
            Email: 'DUPLICATE@example.com',
            Name: 'Duplicate 2',
            Moderators: []
        }
    ];
    const requests = [];

    try {
        const feature = createBatchUserManagementFeature({
            sendRequest: async (controller, method, project, value) => {
                requests.push({ controller, method, project, value });
                return {
                    Value: {
                        Items: roster.slice(value.Skip, value.Skip + value.Take),
                        Page: { Count: roster.length }
                    }
                };
            },
            getConnectionState: () => ({ isOpen: true }),
            wait: async () => {},
            canStart: () => true,
            onActiveChange: (active) => activeChanges.push(active),
            createDialog: () => dialog,
            log: () => {}
        });

        await feature.open({ stylesheetUrl: 'chrome-extension://id/user.css' });
        assert.equal(requests.length, 1);
        assert.deepEqual(findDialogCalls(dialog, 'configure')[0].args, [
            { stylesheetUrl: 'chrome-extension://id/user.css' }
        ]);

        await dialog.emit('edvibe-batch-user-management-check', {
            emailInput: 'found@example.com; missing@example.com; duplicate@example.com'
        });

        const review = findDialogCalls(dialog, 'showReview').at(-1).args[0];
        assert.deepEqual(review.rows.map((row) => row.status), [
            'matched',
            'missing',
            'ambiguous'
        ]);
        assert.equal(review.rows[0].hasCurator, true);
        assert.equal(feature.isRunning(), false);
        assert.deepEqual(activeChanges, [true]);

        await dialog.emit('edvibe-dialog-close');
        assert.deepEqual(activeChanges, [true, false]);
    } finally {
        browser.restore();
    }
});

test('batch user feature preserves malformed rows in submitted order', async () => {
    const browser = installFeatureBrowser();
    const dialog = createFeatureDialog();
    const roster = [
        { MarathonPupilId: 22, Email: 'first@example.com', Name: 'First', Moderators: [] },
        { MarathonPupilId: 23, Email: 'second@example.com', Name: 'Second', Moderators: [] }
    ];

    try {
        const feature = createBatchUserManagementFeature({
            sendRequest: async () => ({
                Value: { Items: roster, Page: { Count: roster.length } }
            }),
            getConnectionState: () => ({ isOpen: true }),
            wait: async () => {},
            canStart: () => true,
            onActiveChange: () => {},
            createDialog: () => dialog,
            log: () => {}
        });

        await feature.open();
        await dialog.emit('edvibe-batch-user-management-check', {
            emailInput: 'first@example.com; malformed; second@example.com'
        });

        assert.deepEqual(
            findDialogCalls(dialog, 'showReview').at(-1).args[0].rows.map((row) => row.email),
            ['first@example.com', 'malformed', 'second@example.com']
        );
    } finally {
        browser.restore();
    }
});

test('batch user feature updates its cached roster after successful mutations', async () => {
    const browser = installFeatureBrowser();
    const dialog = createFeatureDialog();
    const roster = [
        {
            MarathonPupilId: 22,
            Email: 'unassigned@example.com',
            Name: 'Unassigned',
            Moderators: [{ TeacherId: 7 }]
        },
        {
            MarathonPupilId: 23,
            Email: 'deleted@example.com',
            Name: 'Deleted',
            Moderators: []
        }
    ];

    try {
        const feature = createBatchUserManagementFeature({
            sendRequest: async (_controller, method, _project, value) => {
                if (method === 'GetMarathonPupils') {
                    return { Value: { Items: roster, Page: { Count: roster.length } } };
                }
                if (method === 'AddModeratorsToPupil') {
                    return { Value: { IsSuccess: true } };
                }
                return { Value: value.MarathonPupilId };
            },
            getConnectionState: () => ({ isOpen: true }),
            wait: async () => {},
            canStart: () => true,
            onActiveChange: () => {},
            createDialog: () => dialog,
            log: () => {}
        });

        await feature.open();
        await dialog.emit('edvibe-batch-user-management-check', {
            emailInput: 'unassigned@example.com; deleted@example.com'
        });
        const rows = findDialogCalls(dialog, 'showReview').at(-1).args[0].rows;
        rows[0].unassignSelected = true;
        rows[1].deleteSelected = true;
        await dialog.emit('edvibe-batch-user-management-start', { rows });
        await dialog.emit('edvibe-batch-user-management-restart');
        await dialog.emit('edvibe-batch-user-management-check', {
            emailInput: 'unassigned@example.com; deleted@example.com'
        });

        const refreshedRows = findDialogCalls(dialog, 'showReview').at(-1).args[0].rows;
        assert.equal(refreshedRows[0].status, 'matched');
        assert.equal(refreshedRows[0].hasCurator, false);
        assert.equal(refreshedRows[1].status, 'missing');
    } finally {
        browser.restore();
    }
});

test('batch user feature executes only roster-backed rows from the current review', async () => {
    const browser = installFeatureBrowser();
    const dialog = createFeatureDialog();
    const requests = [];
    const roster = [
        { MarathonPupilId: 22, Email: 'safe@example.com', Name: 'Safe', Moderators: [] }
    ];

    try {
        const feature = createBatchUserManagementFeature({
            sendRequest: async (_controller, method, _project, value) => {
                requests.push({ method, value });
                if (method === 'GetMarathonPupils') {
                    return { Value: { Items: roster, Page: { Count: roster.length } } };
                }
                return { Value: value.MarathonPupilId };
            },
            getConnectionState: () => ({ isOpen: true }),
            wait: async () => {},
            canStart: () => true,
            onActiveChange: () => {},
            createDialog: () => dialog,
            log: () => {}
        });

        await feature.open();
        await dialog.emit('edvibe-batch-user-management-check', {
            emailInput: 'safe@example.com'
        });
        await dialog.emit('edvibe-batch-user-management-start', {
            rows: [{
                ...createRow({
                    email: 'safe@example.com',
                    normalizedEmail: 'safe@example.com',
                    marathonPupilId: 999,
                    deleteSelected: true
                })
            }]
        });

        assert.deepEqual(
            requests.filter((request) => request.method === 'DeleteMarathonPupil'),
            [{
                method: 'DeleteMarathonPupil',
                value: { MarathonPupilId: 22 }
            }]
        );
    } finally {
        browser.restore();
    }
});

test('batch user feature shows a fatal error and releases the guard for an empty roster', async () => {
    const browser = installFeatureBrowser();
    const dialog = createFeatureDialog();
    const activeChanges = [];

    try {
        const feature = createBatchUserManagementFeature({
            sendRequest: async () => ({ Value: { Items: [], Page: { Count: 0 } } }),
            getConnectionState: () => ({ isOpen: true }),
            wait: async () => {},
            canStart: () => true,
            onActiveChange: (active) => activeChanges.push(active),
            createDialog: () => dialog,
            log: () => {}
        });

        await feature.open();
        assert.equal(findDialogCalls(dialog, 'showFatalError').length, 1);
        assert.equal(findDialogCalls(dialog, 'showFatalError')[0].args[0].code, 'EMPTY_ROSTER');
        assert.deepEqual(activeChanges, [true, false]);
        assert.equal(feature.isRunning(), false);
    } finally {
        browser.restore();
    }
});

test('batch user feature releases the guard when dialog initialization throws', async () => {
    const browser = installFeatureBrowser();
    const activeChanges = [];

    try {
        const feature = createBatchUserManagementFeature({
            sendRequest: async () => ({ Value: { Items: [], Page: { Count: 0 } } }),
            getConnectionState: () => ({ isOpen: true }),
            wait: async () => {},
            canStart: () => true,
            onActiveChange: (active) => activeChanges.push(active),
            createDialog: () => {
                throw new TypeError('dialog construction failed');
            },
            log: () => {}
        });

        await feature.open();
        assert.deepEqual(activeChanges, [true, false]);
        assert.equal(feature.isRunning(), false);
    } finally {
        browser.restore();
    }
});
