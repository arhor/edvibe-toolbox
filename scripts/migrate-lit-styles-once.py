from pathlib import Path
import json
import re

ROOT = Path('.')
COMPONENTS = ROOT / 'src' / 'components'
STYLES_DIR = COMPONENTS / 'styles'
STYLES_DIR.mkdir(exist_ok=True)

FOUNDATIONS = """import { css } from 'lit';

export const componentFoundationStyles = css`
    :host {
        --edvibe-font-family: "Segoe UI", Inter, Arial, system-ui, sans-serif;
        --edvibe-dialog-z-index: 2147483647;
        --edvibe-overlay-background: rgba(15, 23, 42, 0.6);
        --edvibe-surface: #fff;
        --edvibe-text: #1f2937;
        --edvibe-muted-text: #6b7280;
        --edvibe-border: #d9dfe9;
        --edvibe-primary: #4055d3;
        --edvibe-danger: #c93a3a;
        --edvibe-radius: 14px;
    }

    button,
    input,
    textarea,
    select {
        font: inherit;
    }
`;

export const dialogFoundationStyles = css`
    :host {
        font-family: var(--edvibe-font-family);
    }
`;
"""
(STYLES_DIR / 'foundations.js').write_text(FOUNDATIONS, encoding='utf-8')


def camel(stem):
    parts = re.split(r'[-_]+', stem)
    return parts[0] + ''.join(part[:1].upper() + part[1:] for part in parts[1:])


def style_export(stem):
    return f'{camel(stem)}Styles'


def write_style_module(css_path):
    stem = css_path.stem
    export_name = style_export(stem)
    raw_css = css_path.read_text(encoding='utf-8')
    escaped = raw_css.replace('`', '\\`').replace('${', '\\${')
    module = f"import {{ css }} from 'lit';\n\nexport const {export_name} = css`\n{escaped}\n`;\n"
    (COMPONENTS / f'{stem}.styles.js').write_text(module, encoding='utf-8')
    return export_name


def migrate_lit_component(stem, export_name):
    js_path = COMPONENTS / f'{stem}.js'
    source = js_path.read_text(encoding='utf-8')

    source, count = re.subn(
        r"(^import\s+\{[^\n]+\}\s+from\s+'lit';\n)",
        rf"\1import {{ componentFoundationStyles, dialogFoundationStyles }} from './styles/foundations.js';\nimport {{ {export_name} }} from './{stem}.styles.js';\n",
        source,
        count=1,
        flags=re.M,
    )
    if count != 1:
        raise RuntimeError(f'Could not insert Lit style imports into {js_path}')

    source, count = re.subn(
        r'(class\s+\w+\s+extends\s+LitElement\s*\{\n)',
        rf'\1    static styles = [componentFoundationStyles, dialogFoundationStyles, {export_name}];\n\n',
        source,
        count=1,
    )
    if count != 1:
        raise RuntimeError(f'Could not add static styles to {js_path}')

    source = re.sub(
        r'^\s*stylesheetUrl:\s*\{\s*state:\s*true\s*\},?\s*\n',
        '', source, flags=re.M,
    )
    source = re.sub(
        r'^\s*this\.stylesheetUrl\s*=\s*["\']{2};\s*\n',
        '', source, flags=re.M,
    )
    source = re.sub(
        r'\n\s*if\s*\(options\.stylesheetUrl\s*!==\s*undefined\)\s*\{\s*\n'
        r'\s*this\.stylesheetUrl\s*=\s*String\(options\.stylesheetUrl\s*\|\|\s*["\']{2}\);\s*\n'
        r'\s*\}\s*',
        '\n', source,
    )
    source = re.sub(
        r'\s*<link\b(?=[^>]*rel=["\']stylesheet["\'])(?=[^>]*stylesheetUrl)[^>]*>\s*',
        '\n', source, flags=re.S,
    )
    js_path.write_text(source, encoding='utf-8')


for css_path in sorted(COMPONENTS.glob('*.css')):
    stem = css_path.stem
    export_name = write_style_module(css_path)
    if stem != 'batch-section-image-upload':
        migrate_lit_component(stem, export_name)
    css_path.unlink()

# Image-upload rules style markup rendered by the section-creation dialog. Compose
# them into that dialog rather than making the helper/controller pretend to be Lit.
creation_path = COMPONENTS / 'batch-section-creation-dialog.js'
creation = creation_path.read_text(encoding='utf-8')
creation = creation.replace(
    "import { batchSectionCreationDialogStyles } from './batch-section-creation-dialog.styles.js';",
    "import { batchSectionCreationDialogStyles } from './batch-section-creation-dialog.styles.js';\n"
    "import { batchSectionImageUploadStyles } from './batch-section-image-upload.styles.js';",
)
creation = creation.replace(
    'static styles = [componentFoundationStyles, dialogFoundationStyles, batchSectionCreationDialogStyles];',
    'static styles = [componentFoundationStyles, dialogFoundationStyles, batchSectionCreationDialogStyles, batchSectionImageUploadStyles];',
)
creation = re.sub(r'^\s*imageStylesheetUrl:\s*\{\s*state:\s*true\s*\},?\s*\n', '', creation, flags=re.M)
creation = re.sub(r'^\s*this\.imageStylesheetUrl\s*=\s*["\']{2};\s*\n', '', creation, flags=re.M)
creation = re.sub(r'^\s*this\.imageStylesheetUrl\s*=\s*resolveEnhancementStylesheet\([^\n]+\);\s*\n', '', creation, flags=re.M)
creation = re.sub(r'^\s*resolveEnhancementStylesheet,?\s*\n', '', creation, flags=re.M)
creation = re.sub(
    r'\s*<link\b(?=[^>]*rel=["\']stylesheet["\'])(?=[^>]*imageStylesheetUrl)[^>]*>\s*',
    '\n', creation, flags=re.S,
)
creation_path.write_text(creation, encoding='utf-8')

image_helper_path = COMPONENTS / 'batch-section-image-upload.js'
image_helper = image_helper_path.read_text(encoding='utf-8')
image_helper = re.sub(
    r'\nfunction resolveEnhancementStylesheet\(stylesheetUrl\) \{.*?\n\}\n',
    '\n', image_helper, flags=re.S,
)
image_helper = re.sub(r'^\s*resolveEnhancementStylesheet,?\s*\n', '', image_helper, flags=re.M)
image_helper_path.write_text(image_helper, encoding='utf-8')

# Component styles are bundled into MAIN now, so they no longer need runtime web exposure.
manifest_path = ROOT / 'manifest.json'
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
groups = []
for group in manifest.get('web_accessible_resources', []):
    kept = [
        item for item in group.get('resources', [])
        if not (item.startswith('src/components/') and item.endswith('.css'))
    ]
    if kept:
        updated = dict(group)
        updated['resources'] = kept
        groups.append(updated)
if groups:
    manifest['web_accessible_resources'] = groups
else:
    manifest.pop('web_accessible_resources', None)
manifest_path.write_text(json.dumps(manifest, indent=4) + '\n', encoding='utf-8')

# ISOLATED routes now send only protocol data, not runtime stylesheet URLs.
isolated_path = ROOT / 'src' / 'isolated.js'
isolated = isolated_path.read_text(encoding='utf-8')
isolated = re.sub(
    r"\['(EDVIBE_TOOLBOX_[A-Z_]+)',\s*'src/components/[^']+\.css',\s*'([^']+)'\]",
    r"['\1', '\2']",
    isolated,
)
isolated = isolated.replace(
    "window.postMessage({ type: 'EDVIBE_TOOLBOX_START_ALL', stylesheetUrl: chrome.runtime.getURL('src/components/export-progress-dialog.css') }, '*');",
    "window.postMessage({ type: 'EDVIBE_TOOLBOX_START_ALL' }, '*');",
)
isolated = isolated.replace(
    'const [type, stylesheet, info] = commands[message.action];',
    'const [type, info] = commands[message.action];',
)
isolated = isolated.replace(
    "window.postMessage({ type, stylesheetUrl: chrome.runtime.getURL(stylesheet) }, '*');",
    "window.postMessage({ type }, '*');",
)
isolated_path.write_text(isolated, encoding='utf-8')

# MAIN composition no longer derives or forwards style URLs.
main_path = ROOT / 'src' / 'main.js'
main = main_path.read_text(encoding='utf-8')
main = re.sub(
    r"openHistory: \(executionId, sourceStylesheetUrl\) => executionHistoryFeature\.open\(\{\s*"
    r"stylesheetUrl: new URL\('execution-history-dialog\.css', sourceStylesheetUrl\)\.href,\s*"
    r"executionId\s*\}\)",
    'openHistory: (executionId) => executionHistoryFeature.open({ executionId })',
    main,
)
main = main.replace('marathonExportFeature.start({ stylesheetUrl: data.stylesheetUrl });', 'marathonExportFeature.start();')
for feature in [
    'lessonResetFeature',
    'batchLessonAccessFeature',
    'batchUserOnboardingFeature',
    'batchUserManagementFeature',
    'batchSectionCreationFeature',
    'batchSectionDeletionFeature',
]:
    main = main.replace(f'{feature}.open({{ stylesheetUrl: data.stylesheetUrl }});', f'{feature}.open();')
main = main.replace(
    "executionHistoryFeature.open({\n            stylesheetUrl: data.stylesheetUrl,\n            executionId: data.executionId || null\n        });",
    'executionHistoryFeature.open({ executionId: data.executionId || null });',
)
main = main.replace('actionRecorderFeature.open({ stylesheetUrl: data.stylesheetUrl });', 'actionRecorderFeature.open();')
main_path.write_text(main, encoding='utf-8')

# Remove simple feature-level stylesheet pass-through while preserving every other option/callback.
for feature_path in (ROOT / 'src' / 'features').glob('*.js'):
    source = feature_path.read_text(encoding='utf-8')
    source = re.sub(r'^\s*let stylesheetUrl\s*=\s*["\']{2};\s*\n', '', source, flags=re.M)
    source = re.sub(r'^\s*stylesheetUrl\s*=\s*options\.stylesheetUrl\s*\|\|\s*stylesheetUrl;\s*\n', '', source, flags=re.M)
    source = re.sub(r'^\s*stylesheetUrl:\s*[^,\n]+,?\s*\n', '', source, flags=re.M)
    source = source.replace('panel.configure?.({ stylesheetUrl });', 'panel.configure?.();')
    feature_path.write_text(source, encoding='utf-8')

# Update current repository guidance. Historical design docs remain historical.
agents_path = ROOT / 'AGENTS.md'
agents = agents_path.read_text(encoding='utf-8')
agents = agents.replace(
    'Component source and CSS files should use matching names and live together under `src/components/`.',
    'Lit components own their styles through `static styles`; reusable visual foundations live under `src/components/styles/` and component-specific CSSResult modules stay beside their components.',
)
agents = agents.replace(
    'Keep component styles in dedicated `.css` files so they can be exposed through `web_accessible_resources`.',
    'Keep popup page CSS global, but keep in-page Lit component styles inside Lit CSSResult modules rather than runtime-loaded stylesheets.',
)
agents_path.write_text(agents, encoding='utf-8')

# Keep a temporary residue report for the follow-up cleanup pass.
needles = ('stylesheetUrl', 'imageStylesheetUrl', 'resolveEnhancementStylesheet', 'rel="stylesheet"')
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
