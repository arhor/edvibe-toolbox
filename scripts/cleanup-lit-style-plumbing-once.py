from pathlib import Path
import re

ROOT = Path('.')


def edit(path, transform):
    file_path = ROOT / path
    source = file_path.read_text(encoding='utf-8')
    updated = transform(source)
    if updated == source:
        return
    file_path.write_text(updated, encoding='utf-8')


# Special component configuration paths that did more than the common stylesheet link pattern.
def clean_section_creation_dialog(source):
    source = re.sub(
        r'\n\s*if \(options\.stylesheetUrl !== undefined\) \{\s*\n'
        r'\s*this\.stylesheetUrl = String\(options\.stylesheetUrl \|\| ["\']{2}\);\s*\n'
        r'\s*\}',
        '', source,
    )
    return source


edit('src/components/batch-section-creation-dialog.js', clean_section_creation_dialog)


def clean_export_progress_dialog(source):
    return re.sub(
        r'\n\s*configure\(options = \{\}\) \{\s*\n'
        r'\s*const stylesheetUrl = options && typeof options === ["\']object["\']\s*\n'
        r'\s*\? options\.stylesheetUrl\s*\n'
        r'\s*: ["\']{2};\s*\n'
        r'\s*this\.stylesheetUrl = String\(stylesheetUrl \|\| ["\']{2}\);\s*\n'
        r'\s*return this;\s*\n'
        r'\s*\}\n',
        '\n', source,
    )


edit('src/components/export-progress-dialog.js', clean_export_progress_dialog)


def clean_reset_dialog(source):
    source = source.replace(
        "        const { stylesheetUrl = '', searchDelay = 1000, loadLessons, loadNextPupils, log = () => {} } = options;\n",
        "        const { searchDelay = 1000, loadLessons, loadNextPupils, log = () => {} } = options;\n",
    )
    source = source.replace("        this.stylesheetUrl = String(stylesheetUrl || '');\n", '')
    source = source.replace("            stylesheet: find('.edvibe-reset-stylesheet'), ", '')
    return source


edit('src/components/reset-lessons-dialog.js', clean_reset_dialog)


# Core feature entrypoints no longer accept or forward stylesheet URLs.
feature_replacements = {
    'src/features/action-recorder.js': [
        ('    function open(options = {}) {', '    function open() {'),
        ('                stylesheetUrl,\n', ''),
    ],
    'src/features/batch-lesson-access.js': [
        ("    async function open({ stylesheetUrl = '' } = {}) {", '    async function open() {'),
        ('            dialog.configure({ stylesheetUrl });', '            dialog.configure();'),
    ],
    'src/features/batch-section-creation.js': [
        ("    async function open({ stylesheetUrl = '' } = {}) {", '    async function open() {'),
        ('            dialog.configure({ stylesheetUrl });', '            dialog.configure();'),
    ],
    'src/features/batch-user-management.js': [
        ("    async function open({ stylesheetUrl = '' } = {}) {", '    async function open() {'),
        ('            dialog.configure({ stylesheetUrl });', '            dialog.configure();'),
    ],
    'src/features/batch-user-onboarding.js': [
        ("    async function open({ stylesheetUrl = '' } = {}) {", '    async function open() {'),
        ('                stylesheetUrl,\n', ''),
        ('                    openHistory(executionId, stylesheetUrl);', '                    openHistory(executionId);'),
    ],
    'src/features/batch-section-deletion.js': [
        ('    async function open({ stylesheetUrl } = {}) {', '    async function open() {'),
        ('                stylesheetUrl,\n', ''),
        ('                    openHistory(executionId, stylesheetUrl);', '                    openHistory(executionId);'),
    ],
    'src/features/reset-lessons.js': [
        ("    async function open({ stylesheetUrl = '' } = {}) {", '    async function open() {'),
        ('                stylesheetUrl,\n', ''),
    ],
}

for path, replacements in feature_replacements.items():
    def apply_replacements(source, replacements=replacements):
        for old, new in replacements:
            source = source.replace(old, new)
        return source
    edit(path, apply_replacements)


def clean_execution_history(source):
    source = source.replace(
        "    function open({ stylesheetUrl = '', executionId = null } = {}) {",
        '    function open({ executionId = null } = {}) {',
    )
    source = source.replace('                stylesheetUrl,\n', '')
    return source


edit('src/features/execution-history.js', clean_execution_history)


def clean_marathon_export(source):
    source = source.replace(
        "function createExportProgressOverlay({ stylesheetUrl = '' } = {}) {",
        'function createExportProgressOverlay() {',
    )
    source = source.replace('    dialog.configure({ stylesheetUrl });\n', '')
    source = source.replace(
        "    async function start({ stylesheetUrl = '' } = {}) {",
        '    async function start() {',
    )
    source = source.replace(
        '            progressOverlay = createProgressOverlay({ stylesheetUrl });',
        '            progressOverlay = createProgressOverlay();',
    )
    return source


edit('src/features/marathon-export.js', clean_marathon_export)


# History decorators only need an execution id now. Remove style bookkeeping entirely.
def clean_batch_access_history(source):
    source = source.replace(
        'function addHistoryButton(dialog, executionId, stylesheetUrl, openHistory) {',
        'function addHistoryButton(dialog, executionId, openHistory) {',
    )
    source = source.replace('        openHistory(executionId, stylesheetUrl);', '        openHistory(executionId);')
    source = source.replace(
        '                            addHistoryButton(dialog, history.record.id, current.stylesheetUrl, openHistory);',
        '                            addHistoryButton(dialog, history.record.id, openHistory);',
    )
    source = source.replace('        const originalConfigure = dialog.configure.bind(dialog);\n', '')
    source = re.sub(
        r'\n\s*dialog\.configure = \(value = \{\}\) => \{\s*\n'
        r'\s*current\.stylesheetUrl = String\(value\.stylesheetUrl \|\| current\.stylesheetUrl \|\| ["\']{2}\);\s*\n'
        r'\s*return originalConfigure\(value\);\s*\n'
        r'\s*\};',
        '', source,
    )
    return source


edit('src/features/batch-lesson-access-history.js', clean_batch_access_history)


def clean_section_creation_history(source):
    source = source.replace(
        'function addHistoryButton(dialog, executionId, stylesheetUrl, openHistory) {',
        'function addHistoryButton(dialog, executionId, openHistory) {',
    )
    source = source.replace('        openHistory(executionId, stylesheetUrl);', '        openHistory(executionId);')
    source = source.replace(
        '                            addHistoryButton(dialog, history.record.id, stylesheetUrl, openHistory);',
        '                            addHistoryButton(dialog, history.record.id, openHistory);',
    )
    source = source.replace('        const originalConfigure = dialog.configure.bind(dialog);\n', '')
    source = re.sub(
        r'\n\s*dialog\.configure = \(options = \{\}\) => \{\s*\n'
        r'\s*stylesheetUrl = String\(options\?\.stylesheetUrl \|\| stylesheetUrl \|\| ["\']{2}\);\s*\n'
        r'\s*return originalConfigure\(options\);\s*\n'
        r'\s*\};',
        '', source,
    )
    return source


edit('src/features/batch-section-creation-history.js', clean_section_creation_history)


def clean_user_management_history(source):
    source = source.replace('                openHistory(executionId, stylesheetUrl);', '                openHistory(executionId);')
    source = source.replace('        const originalConfigure = dialog.configure.bind(dialog);\n', '')
    source = re.sub(
        r'\n\s*dialog\.configure = \(options = \{\}\) => \{\s*\n'
        r'\s*stylesheetUrl = String\(options\?\.stylesheetUrl \|\| stylesheetUrl \|\| ["\']{2}\);\s*\n'
        r'\s*return originalConfigure\(options\);\s*\n'
        r'\s*\};',
        '', source,
    )
    return source


edit('src/features/batch-user-management-history.js', clean_user_management_history)


# Browser component tests should configure behavior, not inject CSS URLs.
component_tests = ROOT / 'src' / 'component-tests'
for path in component_tests.glob('*.js'):
    source = path.read_text(encoding='utf-8')
    source = re.sub(r'^\s*stylesheetUrl:\s*["\'][^"\']+["\'],?\s*\n', '', source, flags=re.M)
    source = re.sub(r'\.configure\(\{\s*stylesheetUrl:\s*["\'][^"\']+["\']\s*\}\);', '.configure();', source)
    path.write_text(source, encoding='utf-8')

# Node feature tests should exercise the same public behavior without obsolete style arguments.
for path in (ROOT / 'src' / 'features').glob('*.test.js'):
    source = path.read_text(encoding='utf-8')
    source = re.sub(r'^\s*stylesheetUrl:\s*["\'][^"\']+["\'],?\s*\n', '', source, flags=re.M)
    source = re.sub(r'\.open\(\{\s*stylesheetUrl:\s*["\'][^"\']+["\']\s*\}\)', '.open()', source)
    source = re.sub(r'\.configure\(\{\s*stylesheetUrl:\s*["\'][^"\']+["\']\s*\}\)', '.configure()', source)
    path.write_text(source, encoding='utf-8')

# Architecture checks now assert the simplified command payload. Popup light-DOM CSS remains global.
for test_path in ['src/module-architecture.test.js', 'src/popup-handlers.test.js']:
    path = ROOT / test_path
    source = path.read_text(encoding='utf-8')
    source = source.replace(
        r"/window\.postMessage\(\{ type, stylesheetUrl:/",
        r"/window\.postMessage\(\{ type \}, '\*'\)/",
    )
    path.write_text(source, encoding='utf-8')

# Refresh residue report to drive the final hand-cleanup.
needles = ('stylesheetUrl', 'imageStylesheetUrl', 'resolveEnhancementStylesheet')
report = []
for path in sorted((ROOT / 'src').rglob('*')):
    if not path.is_file():
        continue
    try:
        text = path.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        continue
    for line_number, line in enumerate(text.splitlines(), 1):
        if any(needle in line for needle in needles):
            report.append(f'{path}:{line_number}:{line}')
(ROOT / '.migration-stylesheet-report.txt').write_text('\n'.join(report) + ('\n' if report else ''), encoding='utf-8')
