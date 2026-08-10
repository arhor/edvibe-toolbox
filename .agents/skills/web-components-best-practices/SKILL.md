---
name: web-components-best-practices
description: Design, implement, optimize, or review Edvibe Toolbox Web Components with Lit. Use for component APIs, reactive state, Lit templates, lifecycle, Shadow DOM, events, styling, accessibility, testing, performance, or refactoring dynamic UI into maintainable custom elements.
---

# Web Components Best Practices

Edvibe Toolbox uses Lit as the standard implementation layer for custom elements. Build components with platform-native semantics and Lit's reactive rendering model rather than maintaining parallel imperative DOM synchronization code.

## Workflow

1. Inspect the existing component, its feature/service owner, stylesheet, any existing tests, and public integration contract.
2. Define or preserve the public contract before implementation: element name, properties, methods, events, states, and externally observable behavior.
3. Model UI state with Lit reactive properties/state and derive markup declaratively in `render()`.
4. Decide whether the existing integration needs Shadow DOM or light DOM. Preserve the current choice during unrelated refactors.
5. Use Lit lifecycle hooks for rendering-related work and standard custom-element callbacks only for resources that genuinely follow connection/disconnection.
6. Keep network, persistence, and feature orchestration outside the component when those responsibilities already belong to a feature or service layer.

Read [lifecycle-and-patterns.md](references/lifecycle-and-patterns.md) when lifecycle symmetry, native custom-element behavior, form association, events, Shadow DOM, or accessibility details matter. Treat it as platform background; Lit remains the repository's rendering convention.

## Non-negotiable Practices

- Extend `LitElement` for Toolbox UI custom elements unless the task has a concrete reason to use another base.
- Use lowercase hyphenated custom-element names. When registering with plain `customElements.define()`, guard against duplicate evaluation (e.g. check `customElements.get(tag)` first). Lit's `@customElement` decorator registers unconditionally, so components using it must rely on their module being evaluated only once instead.
- Keep constructors cheap. Initialize state and stable dependencies; do not perform network work or depend on connection/layout there.
- Represent externally visible state as reactive data and let `render()` produce the corresponding markup.
- Do not build a second rendering system with `innerHTML`, template cloning, cached query-selector maps, or manual show/hide synchronization when Lit can express the state directly.
- Preserve component public methods/events while refactoring unless the task explicitly changes the integration contract.
- Dispatch semantic `CustomEvent`s from the host. Choose `bubbles` and `composed` according to consumers, not convenience.
- Keep component presentation in dedicated `.css` files according to repository policy. Source styles are build inputs; never edit their generated `dist/` copies.
- Preserve native semantics, accessible names, keyboard behavior, focus behavior, and disabled states.
- Clean up timers, observers, object URLs, document/window listeners, and other external resources when ownership ends or the element disconnects.
- Avoid changing Shadow DOM versus light DOM solely as part of a rendering refactor. Styling/integration compatibility is part of the component contract.

## Lit Rendering Rules

- Keep `render()` declarative and side-effect free. Compute view output from component state.
- Update arrays, objects, `Set`s, and other collection state in ways that give Lit a new observable value when an update is required.
- Use event bindings such as `@click`, property bindings such as `.value`, boolean bindings such as `?disabled`, and conditional templates instead of post-render DOM patching.
- Use `nothing` for absent template regions rather than creating hidden placeholder DOM solely for imperative toggling.
- Await `updateComplete` in browser tests when an interaction schedules Lit rendering before asserting on the DOM.
- Use `firstUpdated`, `updated`, or `willUpdate` only when the work genuinely depends on rendered DOM or changed-property information. Prefer derived values in ordinary methods/getters when no lifecycle hook is required.
- Preserve user-managed browser state such as focus and text selection. Avoid unnecessary wholesale state resets that cause Lit to recreate controls.
- Version or cancel asynchronous work so stale results cannot overwrite newer reactive state.

## Component Boundaries

A component should primarily own presentation and interaction state. Keep these concerns behind existing non-UI boundaries when available:

- Edvibe WebSocket/HTTP transport and request validation
- execution-history repositories/services
- IndexedDB and Chrome storage
- batch-operation planning/execution
- file upload transport and reusable registries/controllers

Pass those capabilities into components through established configuration callbacks, controllers, services, or feature-level coordination. Do not make a Lit migration an excuse to collapse architectural layers.

## Review Checklist

- Public tag/method/property/event contracts remain intentional and covered.
- Reactive state represents every user-visible mode without parallel DOM bookkeeping.
- `render()` has no network/persistence side effects.
- Listeners and external resources have symmetric cleanup.
- Shadow/light DOM choice and stylesheet loading preserve existing visual integration.
- Native controls and accessibility semantics are retained.
- Collection updates trigger Lit updates reliably.
- Browser tests cover meaningful transitions, events, cleanup, and rendered output.
- No generated file under `dist/` was manually edited.

## Validation

There is currently no real-browser component test suite; it was removed and is expected to be rewritten. Until it exists, cover component behavior with Node.js tests where practical (e.g. asserting on rendered markup, source structure, and integration wiring) and note any creation/configuration, state-transition, user-event, async-update, cleanup/disconnection, or custom-event behavior that still needs manual verification in Chrome. Run the repository's complete CI validation and production build before merging.
