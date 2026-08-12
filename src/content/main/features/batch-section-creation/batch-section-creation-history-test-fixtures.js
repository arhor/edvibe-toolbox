export function sectionDefinition() {
    return {
        name: 'Summer promotion',
        blocks: [
            { id: 'banner', type: 'image', clientId: 'image-upload-client', url: 'https://cdn.example/banner.jpg', alt: 'Sale' },
            { id: 'copy', type: 'text', text: '<p>Save twenty percent.</p>' },
            { id: 'cta', type: 'link', label: 'Open offer', url: 'https://example.com/offer' }
        ]
    };
}

export function lessons() {
    return [
        { lessonId: 101, marathonLessonId: 1001, number: 1, name: 'Welcome' },
        { lessonId: 102, marathonLessonId: 1002, number: 2, name: 'Practice' },
        { lessonId: 103, marathonLessonId: 1003, number: 3, name: 'Review' }
    ];
}

export function plan({ eligible = lessons(), rejected = [], selectedLessonIds = [101, 102, 103] } = {}) {
    return Object.freeze({
        definition: Object.freeze(sectionDefinition()),
        selectedLessonIds: Object.freeze([...selectedLessonIds]),
        eligible: Object.freeze(eligible.map((entry) => Object.freeze({ ...entry }))),
        rejected: Object.freeze(rejected.map((entry) => Object.freeze({ ...entry }))),
        blockSummary: Object.freeze([])
    });
}

export function build(history, options = {}) {
    return history.buildExecutionHistoryInput({
        plan: options.plan || plan(),
        result: options.result || {},
        startedAt: '2026-08-06T05:00:00.000Z',
        completedAt: '2026-08-06T05:00:03.000Z',
        marathonId: '77',
        marathonName: 'Demo marathon',
        terminalStatus: options.terminalStatus || null,
        fatalError: options.fatalError || null
    });
}
