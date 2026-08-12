# Toolbox design foundations

This document is the canonical design vocabulary for Edvibe Toolbox UI. It is
derived from the popup and the MAIN-world components as they exist today. It
defines what later primitives and migrations should converge on; it does not
require an existing feature to change appearance merely to replace a literal.

## Audit boundary

The audit covers the popup styles in `src/popup/components/popup-app.css`, the
shared MAIN Lit styles in `src/content/main/styles/foundations.js`, and the
feature styles and templates under `src/content/main/features/`.

The current UI has a consistent shape despite literal drift:

- white surfaces over a slate overlay or pale application background;
- dark slate text with gray secondary copy;
- blue primary actions, red destructive actions, and green/orange/red status
  treatments;
- 8--16 px corner radii, with 8 px for controls and notices, 10--11 px for
  cards and list rows, and 14--16 px for dialog surfaces;
- compact 11--13 px supporting text and 16--21 px titles;
- visible blue focus rings, muted disabled controls, and large elevated dialog
  shadows.

The most common literals support that vocabulary. White is the dominant
surface; `#1f2937`, `#111827`, and `#374151` are overlapping text roles;
`#6b7280`, `#64748b`, and popup `#697386` are overlapping muted-text roles;
`#d1d5db`, `#d9dfe9`, `#dfe4ee`, and `#e5e7eb` are overlapping borders; and
`#2563eb` and `#4055d3` are the two current primary accents. These families are
migration inputs, not additional semantic roles.

## Semantic tokens

Use semantic names in component styles. Do not add a raw palette token merely
because a new literal appears once. The canonical values preserve the dominant
MAIN visual language while retaining the popup's existing indigo as a separate
brand accent.

The executable source of truth is `src/shared/ui-design-tokens.js`. MAIN Lit
styles consume it through `src/content/main/styles/foundations.js`, while the
popup applies the same values to its light-DOM root during startup. The table
below documents that exported contract and must change with it.

| Token | Canonical value | Purpose |
| --- | --- | --- |
| `--edvibe-font-family` | `"Segoe UI", Inter, Arial, system-ui, sans-serif` | Controls and in-page UI typography |
| `--edvibe-z-dialog` | `2147483647` | Top-level MAIN dialog layer |
| `--edvibe-overlay` | `rgba(15, 23, 42, 0.6)` | Modal backdrop |
| `--edvibe-surface` | `#fff` | Dialogs, cards, fields, and raised panels |
| `--edvibe-surface-subtle` | `#f8fafc` | Secondary panels and disabled surfaces |
| `--edvibe-surface-app` | `#f4f6fa` | Popup application background |
| `--edvibe-text` | `#1f2937` | Default text |
| `--edvibe-text-strong` | `#111827` | Headings and emphasized values |
| `--edvibe-text-muted` | `#6b7280` | Descriptions, metadata, and empty states |
| `--edvibe-border` | `#d1d5db` | Controls and ordinary boundaries |
| `--edvibe-border-subtle` | `#e5e7eb` | Section and row separators |
| `--edvibe-primary` | `#2563eb` | Primary actions, active controls, and progress |
| `--edvibe-brand` | `#4055d3` | Toolbox identity and popup activity accents |
| `--edvibe-danger` | `#b91c1c` | Destructive actions and error text |
| `--edvibe-danger-surface` | `#fef2f2` | Error notice background |
| `--edvibe-danger-border` | `#fecaca` | Error notice boundary |
| `--edvibe-warning` | `#9a3412` | Warning text |
| `--edvibe-warning-surface` | `#fff7ed` | Warning notice background |
| `--edvibe-warning-border` | `#fed7aa` | Warning notice boundary |
| `--edvibe-success` | `#166534` | Success text and state |
| `--edvibe-success-surface` | `#f0fdf4` | Success notice background |
| `--edvibe-success-border` | `#bbf7d0` | Success notice boundary |
| `--edvibe-info` | `#1e3a8a` | Informational text |
| `--edvibe-info-surface` | `#eff6ff` | Informational panel background |
| `--edvibe-info-border` | `#bfdbfe` | Informational panel boundary |
| `--edvibe-focus-outline` | `#2563eb` | Solid `:focus-visible` outline with sufficient contrast |
| `--edvibe-focus-halo` | `rgba(37, 99, 235, 0.25)` | Optional outer halo used in addition to the solid outline |
| `--edvibe-radius-control` | `8px` | Inputs, buttons, and notices |
| `--edvibe-radius-panel` | `10px` | Cards, rows, and secondary panels |
| `--edvibe-radius-dialog` | `16px` | Modal surface |
| `--edvibe-radius-pill` | `999px` | Progress tracks, badges, and chips |
| `--edvibe-shadow-card` | `0 2px 7px rgba(30, 42, 70, 0.04)` | Low-elevation interactive card |
| `--edvibe-shadow-dialog` | `0 24px 80px rgba(15, 23, 42, 0.38)` | Modal elevation |

Spacing remains a deliberately small scale: `4px`, `8px`, `12px`, `16px`,
`24px`, and `32px`. Components may use an intermediate value when layout
requires it, but should not introduce a token for every measured gap. Body copy
uses `13px`; supporting copy uses `11px` or `12px`; dialog titles use `21px`.
Keep these typography choices as styles rather than multiplying tokens until a
real type primitive has more than one consumer.

Interactive states follow these rules:

- `:focus-visible` uses a 2 px solid primary outline with a 2 px offset. An
  optional translucent halo may reinforce it, but must not replace the solid
  outline. Focus must not be conveyed by border color alone.
- Disabled controls keep readable text, remove pointer affordance, and use a
  subtle surface plus reduced opacity only when contrast remains sufficient.
- Destructive actions use the danger role; they do not become primary merely
  because they are the only action in a footer.
- Status color supplements, rather than replaces, text and live-region
  semantics.

## Abstraction levels and ownership

There are three abstraction levels. A repeated visual value is not, by itself,
a reason to create a custom element.

| Level | Responsibility | Owner |
| --- | --- | --- |
| Semantic token | Stable visual meaning shared by otherwise independent UI | One authoritative shared definition of names and values, delivered to popup and MAIN through runtime-specific adapters when required |
| Reusable Lit style | Repeated presentation with no independent behavior, such as a dialog shell, field, action row, notice, or progress treatment | `src/content/main/styles/`; MAIN only |
| Reusable Web Component | A stable public contract with cross-cutting behavior, lifecycle, events, accessibility, or state | `src/content/main/components/` when multiple MAIN features consume it; shared UI only after both runtime contexts can import it safely |

The popup is light-DOM UI with global CSS. MAIN feature elements use Shadow DOM
and Lit `css` modules. Consequently, `src/content/main/styles/foundations.js` is
MAIN-owned even when its token names match this document. Token values must not
be independently maintained in the two runtime roots: follow-up implementation
must establish one shared source of truth, while popup and MAIN may use
different adapters or generated delivery artifacts. The exact mechanism (for
example a JS token map or CSS artifact) is intentionally left to that task.

Do not import popup CSS into MAIN, inject MAIN styles into the page, or move a
presentation abstraction to `src/shared/` solely because the names agree. A
cross-runtime delivery mechanism is justified only when both entry points can
consume it without changing the isolated/MAIN world boundary or
`document_start` evaluation order.

Shared Lit styles need a small semantic markup contract. Adoption may normalize
internal classes or add stable attributes such as `data-part` so a style module
does not know every feature-specific selector. Keep that normalization limited
to presentation hooks: DOM semantics, feature behavior, and public custom-
element methods, properties, and events remain unchanged.

## Pattern inventory

| Pattern and evidence | Classification | Ownership / decision |
| --- | --- | --- |
| Color, typography, spacing, radii, border, shadow, focus, disabled, and status families across the popup and all MAIN dialogs | Token | Use the vocabulary above; runtime roots expose values locally |
| Modal overlay, centered scroll container, elevated surface, header/body/footer, and responsive radius in batch access, section creation/deletion, user management/onboarding, reset lessons, export progress, and execution history | Reusable Lit style | MAIN `dialog-shell` style module; preserve each component's dimensions and template |
| Labels plus input/textarea/select, helper text, validation, and focus/disabled states in batch access, section creation, user management/onboarding, reset lessons, and history filters | Reusable Lit style | MAIN `field` style module; native form controls remain in feature templates |
| Footer/toolbar button groups with primary, secondary, and danger appearances in every MAIN dialog | Reusable Lit style | MAIN `actions` and `button` style modules |
| Error, warning, info, and success blocks in batch access, onboarding, section creation, execution history, and popup status | Token + reusable style | Token roles are cross-runtime; MAIN notice presentation is a Lit style module; popup keeps a local light-DOM rule |
| Native progress plus status/live region in export progress, batch access, section creation, user management, and onboarding | Reusable Lit style | MAIN progress/status style module; retain feature-owned messages and progress state |
| Empty-result copy in recorder, reset lessons, batch access, and section creation | Reusable Lit style | MAIN empty-state style; no component until richer behavior repeats |
| Bordered cards/list rows in popup tool cards, history records/outcomes, recorder operations, reset rows, lesson lists, and section result lists | Token + feature-specific UI | Share surface/border/radius tokens; keep markup feature-specific because selection and action contracts differ |
| Status chips/badges in execution history and row statuses elsewhere | Reusable Lit style candidate | Wait for a second true chip consumer before creating a component |
| Dialog close behavior, Escape handling, modal semantics, and cleanup repeated across MAIN dialogs; initial and return focus are inconsistent or missing | Reusable Web Component/controller candidate | MAIN-owned behavioral primitive should make focus behavior consistent as part of its contract; migrate in a dedicated task |
| Image upload registry, preview, and object-URL lifecycle in batch section creation | Feature-specific controller/helper + styles | Keep `BatchSectionImageUploadController`, its helpers, and presentation with batch section creation until a second real upload consumer proves a reusable contract |
| Popup tool group and tool card rendering | Feature-specific Web Components | Popup-owned; their page-context command behavior is not a generic card API |
| Recorder frame inspection, history filtering/detail, lesson selection, section builder, and onboarding table | Feature-specific UI | Keep with the owning feature |

## Migration candidates

Follow-up work should proceed from low-risk foundations to behavioral
primitives. Each candidate below has multiple real consumers or a cross-cutting
responsibility.

1. Establish one authoritative shared definition for the canonical token names
   and values. Adapt or generate runtime-specific delivery for popup and MAIN,
   preserving temporary aliases for existing MAIN token names.
2. Extract MAIN-only Lit style modules for dialog shell, buttons/action rows,
   fields, notices, progress/status, and empty states. Adopt them incrementally,
   allowing minimal internal class or `data-part` normalization needed to share
   the visual contract; do not combine this with structural template rewrites.
3. Migrate batch lesson access, batch section creation, batch user management,
   and batch user onboarding first. Their near-identical modal structures offer
   the clearest proof and expose compatibility gaps early.
4. Migrate execution history, reset lessons, export progress, and section
   deletion while preserving their distinct layout and public methods/events.
5. Normalize popup literals to the same semantic roles in
   `popup-app.css`. Keep its light-DOM architecture and brand accent.
6. Design a MAIN modal primitive or controller around behavior: Escape and
   backdrop dismissal policy, consistent initial/return focus, scroll
   containment, `aria-modal`, and cleanup. Preserve existing custom-element
   tags and feature events during migration.
7. Re-evaluate chips/badges and richer empty states only after another consumer
   demonstrates a stable public contract.

Do not create a general-purpose component library, abstract a single consumer,
or migrate feature orchestration into presentation components. Each migration
must preserve tag names, public methods/properties/events, Shadow DOM behavior,
and the MAIN runtime's eager `document_start` composition.
