const test = require('node:test');
const assert = require('node:assert/strict');

const {
    parseMarathonId,
    filterPupilsByEmail,
    collectLessonSections,
    shouldDeleteLastRequest,
    buildLoadExercisesPayload,
    buildResetAnswerPayload,
    loadAllPupils,
    discoverResetWork,
    executeResetWork,
    createResetModal,
    getResetModalMarkup,
    getResetRunningStyles,
    getResetPupilSelectionState,
    getResetWizardViewState,
    hasLoadedLessonsForPupil,
    setResetRunningState,
    getErrorType
} = require('../resetLessons.js');

function createModalTestDocument() {
    class FakeClassList {
        constructor() {
            this.names = new Set();
        }

        add(...names) {
            names.forEach((name) => this.names.add(name));
        }

        remove(...names) {
            names.forEach((name) => this.names.delete(name));
        }

        toggle(name, force) {
            const enabled = force === undefined ? !this.names.has(name) : force;
            if (enabled) this.names.add(name);
            else this.names.delete(name);
            return enabled;
        }
    }

    class FakeElement {
        constructor(tagName = 'div') {
            this.tagName = tagName.toUpperCase();
            this.children = [];
            this.classList = new FakeClassList();
            this.listeners = new Map();
            this.style = {};
            this.hidden = false;
            this.disabled = false;
            this.checked = false;
            this.indeterminate = false;
            this.textContent = '';
            this.value = '';
            this.focused = false;
            this.attributes = new Map();
            this.elementsBySelector = null;
        }

        set innerHTML(_markup) {
            if (this.elementsBySelector) return;

            const selectors = [
                '.edvibe-reset-search',
                '.edvibe-reset-user-step',
                '.edvibe-reset-lesson-step',
                '.edvibe-reset-step-indicator',
                '.edvibe-reset-step-description',
                '.edvibe-reset-pupils',
                '.edvibe-reset-lessons',
                '.edvibe-reset-selected-pupil',
                '.edvibe-reset-select-all-input',
                '.edvibe-reset-status',
                '.edvibe-reset-progress',
                '.edvibe-reset-progress-bar',
                '.edvibe-reset-close',
                '.edvibe-reset-cancel',
                '.edvibe-reset-back',
                '.edvibe-reset-next',
                '.edvibe-reset-submit'
            ];
            this.elementsBySelector = new Map(
                selectors.map((selector) => [selector, new FakeElement(
                    selector.includes('button')
                        || ['.edvibe-reset-close', '.edvibe-reset-cancel',
                            '.edvibe-reset-back', '.edvibe-reset-next',
                            '.edvibe-reset-submit'].includes(selector)
                        ? 'button'
                        : 'div'
                )])
            );
            this.elementsBySelector.get('.edvibe-reset-lesson-step').hidden = true;
            this.elementsBySelector.get('.edvibe-reset-back').hidden = true;
            this.elementsBySelector.get('.edvibe-reset-submit').hidden = true;
        }

        querySelector(selector) {
            return this.elementsBySelector?.get(selector) || null;
        }

        querySelectorAll(selector) {
            const tagName = selector.toUpperCase();
            const matches = [];
            const visit = (element) => {
                if (element.tagName === tagName) matches.push(element);
                element.children.forEach(visit);
            };
            this.children.forEach(visit);
            return matches;
        }

        setAttribute(name, value) {
            this.attributes.set(name, String(value));
        }

        removeAttribute(name) {
            this.attributes.delete(name);
        }

        appendChild(child) {
            this.children.push(child);
            return child;
        }

        append(...children) {
            this.children.push(...children);
        }

        replaceChildren(...children) {
            this.children = [...children];
        }

        addEventListener(type, listener) {
            const listeners = this.listeners.get(type) || [];
            listeners.push(listener);
            this.listeners.set(type, listeners);
        }

        async emit(type, event = {}) {
            const listeners = this.listeners.get(type) || [];
            await Promise.all(listeners.map((listener) => listener({ target: this, ...event })));
        }

        focus() {
            this.focused = true;
        }

        remove() {
            this.removed = true;
        }
    }

    return {
        createElement: (tagName) => new FakeElement(tagName),
        getElementById: (id) => id === 'edvibe-toolbox-reset-styles' ? {} : null,
        addEventListener() {},
        removeEventListener() {}
    };
}

test('parseMarathonId reads a numeric marathon id', () => {
    assert.equal(parseMarathonId('https://app.edvibe.com/marathon/18508'), 18508);
    assert.equal(parseMarathonId('https://app.edvibe.com/dashboard'), null);
});

test('filterPupilsByEmail uses case-insensitive includes logic', () => {
    const pupils = [
        { PupilId: 1, Email: 'first@example.com' },
        { PupilId: 2, Email: 'OTHER@EXAMPLE.COM' },
        { PupilId: 3, Email: null }
    ];

    assert.deepEqual(filterPupilsByEmail(pupils, 'other@'), [pupils[1]]);
    assert.deepEqual(filterPupilsByEmail(pupils, ''), pupils);
});

test('collectLessonSections appends homework and removes missing sections', () => {
    const regular = [{ Id: 10 }, null, { Id: 11 }];

    assert.deepEqual(
        collectLessonSections({ Sections: regular, HomeworkSection: { Id: 12 } }),
        [{ Id: 10 }, { Id: 11 }, { Id: 12 }]
    );
});

test('shouldDeleteLastRequest requires a non-zero latest status', () => {
    assert.equal(shouldDeleteLastRequest({}), false);
    assert.equal(shouldDeleteLastRequest({ LastRequest: { Id: 1, Status: 0 } }), false);
    assert.equal(shouldDeleteLastRequest({ LastRequest: { Id: 2 } }), false);
    assert.equal(shouldDeleteLastRequest({ LastRequest: { Id: 3, Status: null } }), false);
    assert.equal(shouldDeleteLastRequest({ LastRequest: { Id: 2, Status: 2 } }), true);
});

test('buildLoadExercisesPayload uses MarathonLessonId as LessonId', () => {
    assert.deepEqual(
        buildLoadExercisesPayload({
            marathonId: 18508,
            pupilId: 1397893,
            marathonLessonId: 230807,
            sectionId: 6975727
        }),
        {
            MarathonId: 18508,
            LessonId: 230807,
            SectionId: 6975727,
            PupilId: 1397893,
            IsTeacher: true,
            LessonSection: 0,
            Domain: 'edvibe.com'
        }
    );
});

test('buildResetAnswerPayload clears the saved exercise answer', () => {
    assert.deepEqual(
        buildResetAnswerPayload({
            marathonId: 18508,
            pupilId: 1397893,
            lessonId: 1468989,
            exercise: { id: 32726464, type: 10, sectionId: 6975766 }
        }),
        {
            SelfSync: false,
            IsReset: true,
            ExerciseId: 32726464,
            ExerciseType: 10,
            SectionId: 6975766,
            PupilId: 1397893,
            MarathonId: 18508,
            SingleAnswer: {},
            ManyAnswers: [],
            RepeatingManyAnswers: [],
            AnswerErrorsCount: [[]],
            StatisticsInfo: {
                CountAnswersTrue: 0,
                CountAnswersFalse: 0,
                CountAnswersPending: 0
            },
            LessonId: 1468989
        }
    );
});

test('loadAllPupils follows Page.Count until every pupil is loaded', async () => {
    const calls = [];
    const pages = [
        { Value: { Items: [{ PupilId: 1 }, { PupilId: 2 }], Page: { Count: 3 } } },
        { Value: { Items: [{ PupilId: 3 }], Page: { Count: 3 } } }
    ];

    const pupils = await loadAllPupils(async (...args) => {
        calls.push(args);
        return pages[calls.length - 1];
    }, 18508, 2);

    assert.deepEqual(pupils.map((pupil) => pupil.PupilId), [1, 2, 3]);
    assert.deepEqual(calls.map((call) => call[3].Skip), [0, 2]);
});

test('discoverResetWork loads sections and user exercises', async () => {
    const lesson = {
        LessonId: 1468983,
        MarathonLessonId: 230807,
        Name: 'Lesson 2',
        LastRequest: { Id: 3690753, Status: 2 }
    };
    const calls = [];
    const sendRequest = async (controller, method, project, value) => {
        calls.push({ controller, method, project, value });

        if (method === 'GetLessonWithId') {
            return { Value: { Sections: [{ Id: 10 }], HomeworkSection: { Id: 11 } } };
        }

        return {
            Value: {
                Items: value.SectionId === 10
                    ? [{ Id: 100, Type: 6 }, { Id: 101, Type: 10 }]
                    : [{ Id: 102, Type: 18 }]
            }
        };
    };

    const work = await discoverResetWork({
        sendRequest,
        wait: async () => {},
        marathonId: 18508,
        pupilId: 1397893,
        lessons: [lesson]
    });

    assert.deepEqual(work[0].exercises, [
        { id: 100, type: 6, sectionId: 10 },
        { id: 101, type: 10, sectionId: 10 },
        { id: 102, type: 18, sectionId: 11 }
    ]);
    assert.equal(work[0].deleteRequestId, 3690753);
    assert.equal(calls.filter((call) => call.method === 'LoadExercises').length, 2);
});

test('executeResetWork saves an empty answer before dropping exercise statistics', async () => {
    const calls = [];

    await executeResetWork({
        sendRequest: async (controller, method, project, value) => {
            calls.push({ controller, method, project, value });
            return method === 'SaveAnswer' ? { Value: {} } : { Value: true };
        },
        sendWithoutResponse: () => {},
        wait: async () => {},
        marathonId: 18508,
        pupilId: 1397893,
        work: [{
            lesson: { LessonId: 1468989, Name: 'Lesson 2' },
            exercises: [{ id: 100, type: 10, sectionId: 20 }],
            deleteRequestId: null
        }],
        onProgress: () => {}
    });

    assert.deepEqual(
        calls.map(({ controller, method, project }) => ({ controller, method, project })),
        [
            {
                controller: 'ExerciseAnswerSaveVersion1WsController',
                method: 'SaveAnswer',
                project: 'ExerciseAnswer'
            },
            {
                controller: 'MarathonStatisticService',
                method: 'DropMarathonExerciseStatistic',
                project: 'Statistic'
            }
        ]
    );
    assert.deepEqual(calls[0].value, buildResetAnswerPayload({
        marathonId: 18508,
        pupilId: 1397893,
        lessonId: 1468989,
        exercise: { id: 100, type: 10, sectionId: 20 }
    }));
});

test('executeResetWork stops when dropping statistics fails', async () => {
    const calls = [];
    const deletedIds = [];
    const sendRequest = async (_controller, method, _project, value) => {
        calls.push({ method, exerciseId: value.ExerciseId });
        if (method === 'DropMarathonExerciseStatistic' && value.ExerciseId === 101) {
            throw new Error('reset rejected');
        }
        return method === 'SaveAnswer' ? { Value: {} } : { Value: true };
    };

    await assert.rejects(
        executeResetWork({
            sendRequest,
            sendWithoutResponse: (...args) => deletedIds.push(args[3].RequestId),
            wait: async () => {},
            marathonId: 18508,
            pupilId: 1397893,
            work: [{
                lesson: { LessonId: 1468989, Name: 'Lesson 2' },
                exercises: [
                    { id: 100, type: 6, sectionId: 10 },
                    { id: 101, type: 10, sectionId: 10 },
                    { id: 102, type: 18, sectionId: 11 }
                ],
                deleteRequestId: 3690753
            }],
            onProgress: () => {}
        }),
        /Lesson 2.*101.*reset rejected/
    );

    assert.deepEqual(calls, [
        { method: 'SaveAnswer', exerciseId: 100 },
        { method: 'DropMarathonExerciseStatistic', exerciseId: 100 },
        { method: 'SaveAnswer', exerciseId: 101 },
        { method: 'DropMarathonExerciseStatistic', exerciseId: 101 }
    ]);
    assert.deepEqual(deletedIds, []);
});

test('executeResetWork does not drop statistics when saving the reset answer fails', async () => {
    const methods = [];

    await assert.rejects(
        executeResetWork({
            sendRequest: async (_controller, method) => {
                methods.push(method);
                throw new Error('answer reset rejected');
            },
            sendWithoutResponse: () => {},
            wait: async () => {},
            marathonId: 18508,
            pupilId: 1397893,
            work: [{
                lesson: { LessonId: 1468989, Name: 'Lesson 2' },
                exercises: [{ id: 100, type: 10, sectionId: 20 }],
                deleteRequestId: null
            }],
            onProgress: () => {}
        }),
        /Lesson 2.*100.*answer reset rejected/
    );

    assert.deepEqual(methods, ['SaveAnswer']);
});

test('executeResetWork leaves an applicable lesson request untouched', async () => {
    const deletedIds = [];
    const progress = [];

    await executeResetWork({
        sendRequest: async () => ({ Value: true }),
        sendWithoutResponse: (...args) => deletedIds.push(args[3].RequestId),
        wait: async () => {},
        marathonId: 18508,
        pupilId: 1397893,
        work: [{
            lesson: { LessonId: 1468989, Name: 'Lesson 2' },
            exercises: [{ id: 100, type: 10, sectionId: 20 }],
            deleteRequestId: 3690753
        }],
        onProgress: (update) => progress.push(update)
    });

    assert.deepEqual(deletedIds, []);
    assert.deepEqual(
        progress.map(({ completed, total, exerciseId }) => ({ completed, total, exerciseId })),
        [
            { completed: 1, total: 1, exerciseId: 100 }
        ]
    );
});

test('reset progress region is outside the scrollable selection body', () => {
    const markup = getResetModalMarkup();

    assert.match(
        markup,
        /<\/div>\s*<div class="edvibe-reset-live-region">[\s\S]*edvibe-reset-progress/
    );
});

test('reset modal markup separates user and lesson wizard steps', () => {
    const markup = getResetModalMarkup();

    assert.match(markup, /class="edvibe-reset-step-indicator"[^>]*>Шаг 1 из 2</);
    assert.match(markup, /class="edvibe-reset-user-step"/);
    assert.match(markup, /class="edvibe-reset-lesson-step"[^>]*hidden/);
    assert.match(markup, /class="edvibe-reset-button edvibe-reset-next"/);
    assert.match(markup, /class="edvibe-reset-button edvibe-reset-back"[^>]*hidden/);
    assert.match(markup, /class="edvibe-reset-button edvibe-reset-submit"[^>]*hidden/);
});

test('reset modal user step closes before the lesson step begins', () => {
    const markup = getResetModalMarkup();
    const userStepEnd = markup.indexOf('</section>');
    const lessonStepStart = markup.indexOf('class="edvibe-reset-lesson-step"');

    assert.ok(userStepEnd > 0);
    assert.ok(lessonStepStart > userStepEnd);
});

test('wizard user step shows Next and requires a selected pupil', () => {
    const empty = getResetWizardViewState({
        step: 'user',
        hasSelectedPupil: false,
        selectedLessonCount: 0,
        loading: false,
        locked: false,
        finished: false
    });
    const selected = getResetWizardViewState({
        step: 'user',
        hasSelectedPupil: true,
        selectedLessonCount: 0,
        loading: false,
        locked: false,
        finished: false
    });

    assert.deepEqual(empty, {
        userStepHidden: false,
        lessonStepHidden: true,
        nextHidden: false,
        nextDisabled: true,
        backHidden: true,
        backDisabled: false,
        submitHidden: true,
        submitDisabled: true,
        closeDisabled: false
    });
    assert.equal(selected.nextDisabled, false);
});

test('wizard lesson step shows Back and requires a selected lesson', () => {
    const empty = getResetWizardViewState({
        step: 'lessons',
        hasSelectedPupil: true,
        selectedLessonCount: 0,
        loading: false,
        locked: false,
        finished: false
    });
    const selected = getResetWizardViewState({
        step: 'lessons',
        hasSelectedPupil: true,
        selectedLessonCount: 2,
        loading: false,
        locked: false,
        finished: false
    });

    assert.equal(empty.userStepHidden, true);
    assert.equal(empty.lessonStepHidden, false);
    assert.equal(empty.nextHidden, true);
    assert.equal(empty.backHidden, false);
    assert.equal(empty.submitHidden, false);
    assert.equal(empty.submitDisabled, true);
    assert.equal(selected.submitDisabled, false);
});

test('wizard loading and running states block navigation', () => {
    const loading = getResetWizardViewState({
        step: 'user',
        hasSelectedPupil: true,
        selectedLessonCount: 0,
        loading: true,
        locked: false,
        finished: false
    });
    const running = getResetWizardViewState({
        step: 'lessons',
        hasSelectedPupil: true,
        selectedLessonCount: 1,
        loading: false,
        locked: true,
        finished: false
    });

    assert.equal(loading.nextDisabled, true);
    assert.equal(loading.closeDisabled, true);
    assert.equal(running.backDisabled, true);
    assert.equal(running.submitDisabled, true);
    assert.equal(running.closeDisabled, true);
});

test('selecting another pupil invalidates loaded lessons and selections', () => {
    const pupil = { PupilId: 2, Email: 'second@example.com' };
    const state = getResetPupilSelectionState({
        pupil,
        loadedPupilId: 1,
        lessons: [{ MarathonLessonId: 10 }],
        selectedLessonIds: new Set([10])
    });

    assert.deepEqual(state, {
        selectedPupil: pupil,
        loadedPupilId: null,
        lessons: [],
        selectedLessonIds: new Set()
    });
});

test('selecting the loaded pupil preserves lessons and selections', () => {
    const pupil = { PupilId: 1, Email: 'first@example.com' };
    const lessons = [{ MarathonLessonId: 10 }];
    const selectedLessonIds = new Set([10]);
    const state = getResetPupilSelectionState({
        pupil,
        loadedPupilId: 1,
        lessons,
        selectedLessonIds
    });

    assert.equal(state.selectedPupil, pupil);
    assert.equal(state.loadedPupilId, 1);
    assert.equal(state.lessons, lessons);
    assert.equal(state.selectedLessonIds, selectedLessonIds);
    assert.equal(hasLoadedLessonsForPupil(pupil, state.loadedPupilId), true);
    assert.equal(hasLoadedLessonsForPupil({ PupilId: 2 }, state.loadedPupilId), false);
});

test('modal defers lesson loading and preserves same-pupil selections on Back', async (t) => {
    const originalDocument = global.document;
    global.document = createModalTestDocument();
    t.after(() => {
        global.document = originalDocument;
    });

    const pupils = [
        { PupilId: 1, Name: 'First', Email: 'first@example.com' },
        { PupilId: 2, Name: 'Second', Email: 'second@example.com' }
    ];
    const modal = createResetModal({ onClose() {} });
    const overlay = modal.overlay;
    const pupilsList = overlay.querySelector('.edvibe-reset-pupils');
    const lessonStep = overlay.querySelector('.edvibe-reset-lesson-step');
    const lessonsList = overlay.querySelector('.edvibe-reset-lessons');
    const next = overlay.querySelector('.edvibe-reset-next');
    const back = overlay.querySelector('.edvibe-reset-back');
    const submit = overlay.querySelector('.edvibe-reset-submit');
    const loadedPupilIds = [];

    modal.showPupils(pupils, async (pupil) => {
        loadedPupilIds.push(pupil.PupilId);
        modal.setLoading(`Loading ${pupil.PupilId}`);
        modal.showLessons(pupil, [{
            MarathonLessonId: pupil.PupilId * 10,
            Number: 0,
            Name: `Lesson ${pupil.PupilId}`
        }]);
    });

    await pupilsList.children[0].emit('click');
    assert.deepEqual(loadedPupilIds, []);
    assert.equal(next.disabled, false);

    await next.emit('click');
    assert.deepEqual(loadedPupilIds, [1]);
    assert.equal(lessonStep.hidden, false);
    assert.equal(lessonsList.focused, true);

    const firstLessonCheckbox = lessonsList.children[0].children[0];
    firstLessonCheckbox.checked = true;
    await firstLessonCheckbox.emit('change');
    assert.equal(submit.disabled, false);

    await back.emit('click');
    lessonsList.focused = false;
    await next.emit('click');
    assert.deepEqual(loadedPupilIds, [1]);
    assert.equal(submit.disabled, false);
    assert.equal(lessonsList.focused, true);

    await back.emit('click');
    await pupilsList.children[1].emit('click');
    await next.emit('click');
    assert.deepEqual(loadedPupilIds, [1, 2]);
    assert.equal(submit.disabled, true);
});

test('modal keeps failed lesson loading recoverable on the user step', async (t) => {
    const originalDocument = global.document;
    const originalConsoleError = console.error;
    const loggedErrors = [];
    global.document = createModalTestDocument();
    console.error = (...args) => loggedErrors.push(args);
    t.after(() => {
        global.document = originalDocument;
        console.error = originalConsoleError;
    });

    const pupil = { PupilId: 1, Name: 'First', Email: 'first@example.com' };
    const modal = createResetModal({ onClose() {} });
    const overlay = modal.overlay;
    const pupilsList = overlay.querySelector('.edvibe-reset-pupils');
    const userStep = overlay.querySelector('.edvibe-reset-user-step');
    const lessonStep = overlay.querySelector('.edvibe-reset-lesson-step');
    const next = overlay.querySelector('.edvibe-reset-next');
    const status = overlay.querySelector('.edvibe-reset-status');
    let attempts = 0;

    modal.showPupils([pupil], async (selectedPupil) => {
        attempts += 1;
        modal.setLoading('Loading lessons...');
        if (attempts === 1) {
            throw new Error('lesson request failed');
        }
        modal.showLessons(selectedPupil, []);
    });
    await pupilsList.children[0].emit('click');

    await next.emit('click');
    assert.equal(attempts, 1);
    assert.equal(userStep.hidden, false);
    assert.equal(lessonStep.hidden, true);
    assert.equal(next.disabled, false);
    assert.equal(status.textContent, 'lesson request failed');
    assert.equal(loggedErrors.length, 1);

    await next.emit('click');
    assert.equal(attempts, 2);
    assert.equal(userStep.hidden, true);
    assert.equal(lessonStep.hidden, false);
});

test('running reset hides selection but not the live progress region', () => {
    const styles = getResetRunningStyles();

    assert.match(styles, /\.is-running \.edvibe-reset-body\s*\{[^}]*display:\s*none/);
    assert.doesNotMatch(styles, /\.is-running \.edvibe-reset-live-region\s*\{[^}]*display:\s*none/);
});

test('setResetRunningState applies the running class', () => {
    const classes = new Set();
    const overlay = {
        classList: {
            toggle(name, force) {
                if (force) classes.add(name);
                else classes.delete(name);
            }
        }
    };

    setResetRunningState(overlay, true);
    assert.equal(classes.has('is-running'), true);
    setResetRunningState(overlay, false);
    assert.equal(classes.has('is-running'), false);
});

test('getErrorType omits potentially sensitive error messages', () => {
    const result = getErrorType(new Error('Failed in "Sensitive lesson name"'));

    assert.equal(result, 'Error');
    assert.equal(result.includes('Sensitive lesson name'), false);
});
