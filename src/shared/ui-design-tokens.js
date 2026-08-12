export const TOOLBOX_DESIGN_TOKENS = Object.freeze({
    '--edvibe-font-family': '"Segoe UI", Inter, Arial, system-ui, sans-serif',
    '--edvibe-z-dialog': '2147483647',
    '--edvibe-overlay': 'rgba(15, 23, 42, 0.6)',
    '--edvibe-surface': '#fff',
    '--edvibe-surface-subtle': '#f8fafc',
    '--edvibe-surface-app': '#f4f6fa',
    '--edvibe-text': '#1f2937',
    '--edvibe-text-strong': '#111827',
    '--edvibe-text-muted': '#6b7280',
    '--edvibe-border': '#d1d5db',
    '--edvibe-border-subtle': '#e5e7eb',
    '--edvibe-primary': '#2563eb',
    '--edvibe-brand': '#4055d3',
    '--edvibe-danger': '#b91c1c',
    '--edvibe-danger-surface': '#fef2f2',
    '--edvibe-danger-border': '#fecaca',
    '--edvibe-warning': '#9a3412',
    '--edvibe-warning-surface': '#fff7ed',
    '--edvibe-warning-border': '#fed7aa',
    '--edvibe-success': '#166534',
    '--edvibe-success-surface': '#f0fdf4',
    '--edvibe-success-border': '#bbf7d0',
    '--edvibe-info': '#1e3a8a',
    '--edvibe-info-surface': '#eff6ff',
    '--edvibe-info-border': '#bfdbfe',
    '--edvibe-focus-outline': '#2563eb',
    '--edvibe-focus-halo': 'rgba(37, 99, 235, 0.25)',
    '--edvibe-radius-control': '8px',
    '--edvibe-radius-panel': '10px',
    '--edvibe-radius-dialog': '16px',
    '--edvibe-radius-pill': '999px',
    '--edvibe-shadow-card': '0 2px 7px rgba(30, 42, 70, 0.04)',
    '--edvibe-shadow-dialog': '0 24px 80px rgba(15, 23, 42, 0.38)'
});

export function createDesignTokenDeclarations(tokens = TOOLBOX_DESIGN_TOKENS) {
    return Object.entries(tokens)
        .map(([name, value]) => `${name}: ${value};`)
        .join('\n');
}

export function applyDesignTokens(target, tokens = TOOLBOX_DESIGN_TOKENS) {
    for (const [name, value] of Object.entries(tokens)) target.style.setProperty(name, value);
}
