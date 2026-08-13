import { css, html, nothing } from 'lit';

const EMAIL_VALIDATION_CODES = new Set(['EMAIL_NON_ASCII', 'INVALID_EMAIL_FORMAT']);

function buildHighlightedSegments(input, offendingCharacters = []) {
    const value = String(input || '');
    const segments = [];
    let cursor = 0;

    for (const offending of offendingCharacters) {
        const index = Number(offending?.index);
        const character = String(offending?.character || '');
        if (!Number.isInteger(index) || index < cursor || index > value.length || !character) continue;
        if (index > cursor) segments.push({text: value.slice(cursor, index), offending: false});
        segments.push({text: value.slice(index, index + character.length), offending: true});
        cursor = index + character.length;
    }
    if (cursor < value.length) segments.push({text: value.slice(cursor), offending: false});
    return segments;
}

function buildEmailValidationSummary(invalidEntries = []) {
    const entries = (Array.isArray(invalidEntries) ? invalidEntries : []).map((entry) => {
        const offendingCharacters = Array.isArray(entry?.offendingCharacters)
            ? entry.offendingCharacters
            : [];
        return {
            input: String(entry?.input || ''),
            code: entry?.code,
            segments: buildHighlightedSegments(entry?.input, offendingCharacters),
            descriptions: offendingCharacters.map(({character, script}) => `«${character}» (${script})`)
        };
    });
    return {
        entries,
        hasNonAscii: entries.some((entry) => entry.code === 'EMAIL_NON_ASCII')
    };
}

function renderEmailValidationSummary(invalidEntries = []) {
    const summary = buildEmailValidationSummary(invalidEntries);
    if (summary.entries.length === 0) return nothing;

    return html`
        <section class="email-validation-summary">
            <strong class="email-validation-heading">Некоторые email некорректны:</strong>
            <ul class="email-validation-list">
                ${summary.entries.map((entry) => html`<li>
                    <span class="email-validation-address">«${entry.segments.map((segment) => segment.offending
            ? html`<span class="email-validation-offending">${segment.text}</span>`
            : segment.text)}»</span>
                    — ${entry.code === 'EMAIL_NON_ASCII'
            ? html`недопустимые символы: ${entry.descriptions.join(', ')}`
            : 'некорректный формат'}
                </li>`)}
            </ul>
            ${summary.hasNonAscii
            ? html`<p class="email-validation-guidance">Используйте только латинские буквы, цифры и стандартные символы email.</p>`
            : nothing}
        </section>
    `;
}

const emailValidationSummaryStyles = css`
    .email-validation-summary {
        color: var(--edvibe-text);
        display: grid;
        flex: 1 0 100%;
        gap: 6px;
        margin-top: 4px;
        width: 100%;
    }

    .email-validation-heading,
    .email-validation-address {
        color: var(--edvibe-text-strong);
    }

    .email-validation-list {
        display: grid;
        gap: 4px;
        list-style-position: outside;
        margin: 0;
        padding-left: 20px;
    }

    .email-validation-offending {
        color: var(--edvibe-danger);
    }

    .email-validation-guidance {
        margin: 2px 0 0;
    }
`;

export {
    EMAIL_VALIDATION_CODES,
    buildEmailValidationSummary,
    emailValidationSummaryStyles,
    renderEmailValidationSummary
};
