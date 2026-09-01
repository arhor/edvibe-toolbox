export const TOOLFOX_DESIGN_TOKENS = Object.freeze({
    '--toolfox-font-family': '"Segoe UI", Inter, Arial, system-ui, sans-serif',
    '--toolfox-z-dialog': '2147483647',
    '--toolfox-overlay': 'rgba(15, 23, 42, 0.6)',
    '--toolfox-surface': '#fff',
    '--toolfox-surface-subtle': '#f8fafc',
    '--toolfox-surface-app': '#f4f6fa',
    '--toolfox-text': '#1f2937',
    '--toolfox-text-strong': '#111827',
    '--toolfox-text-muted': '#6b7280',
    '--toolfox-border': '#d1d5db',
    '--toolfox-border-subtle': '#e5e7eb',
    '--toolfox-primary': '#2563eb',
    '--toolfox-brand': '#4055d3',
    '--toolfox-danger': '#b91c1c',
    '--toolfox-danger-surface': '#fef2f2',
    '--toolfox-danger-border': '#fecaca',
    '--toolfox-warning': '#9a3412',
    '--toolfox-warning-surface': '#fff7ed',
    '--toolfox-warning-border': '#fed7aa',
    '--toolfox-success': '#166534',
    '--toolfox-success-surface': '#f0fdf4',
    '--toolfox-success-border': '#bbf7d0',
    '--toolfox-info': '#1e3a8a',
    '--toolfox-info-surface': '#eff6ff',
    '--toolfox-info-border': '#bfdbfe',
    '--toolfox-focus-outline': '#2563eb',
    '--toolfox-focus-halo': 'rgba(37, 99, 235, 0.25)',
    '--toolfox-radius-control': '8px',
    '--toolfox-radius-panel': '10px',
    '--toolfox-radius-dialog': '16px',
    '--toolfox-radius-pill': '999px',
    '--toolfox-shadow-card': '0 2px 7px rgba(30, 42, 70, 0.04)',
    '--toolfox-shadow-dialog': '0 24px 80px rgba(15, 23, 42, 0.38)'
});

export function createDesignTokenDeclarations(tokens = TOOLFOX_DESIGN_TOKENS) {
    return Object.entries(tokens)
        .map(([name, value]) => `${name}: ${value};`)
        .join('\n');
}

export function applyDesignTokens(target, tokens = TOOLFOX_DESIGN_TOKENS) {
    for (const [name, value] of Object.entries(tokens)) {
        target.style.setProperty(name, value);
    }
}
