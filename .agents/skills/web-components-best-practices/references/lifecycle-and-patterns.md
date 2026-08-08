# Lit Lifecycle and Platform Patterns

This reference supplements the repository's Lit convention with the browser lifecycle details that still matter underneath `LitElement`.

## Lit and custom-element lifecycle

| Hook | Proper use in this repository | Avoid |
| --- | --- | --- |
| `constructor()` | Initialize reactive state, stable injected dependencies, and bound handlers; call `super()` first | Reading layout/parent context, fetching, starting timers, or manually constructing the rendered UI |
| `connectedCallback()` | Call `super.connectedCallback()` and start connection-scoped external work such as document/window listeners, observers, or timers | Assuming it runs once or duplicating listeners on reconnect |
| `disconnectedCallback()` | Release connection-scoped listeners, observers, timers, object URLs, and other external resources; call `super.disconnectedCallback()` | Treating disconnection as permanent or leaving resources attached to a detached element |
| `willUpdate(changed)` | Derive reactive state that genuinely benefits from changed-property information before rendering | DOM reads or side effects that belong outside rendering |
| `render()` | Return declarative Lit templates from current state | Network/persistence work, imperative DOM patching, or mutating reactive state as a rendering side effect |
| `firstUpdated(changed)` | One-time work that requires the first rendered DOM | General initialization that does not need rendered nodes |
| `updated(changed)` | Small post-render effects that genuinely depend on committed DOM | Recreating an imperative render/synchronization layer |
| `updateComplete` | Await rendering in integration code or browser tests before inspecting the updated DOM | Using arbitrary timeouts to guess when Lit finished rendering |

Call the Lit superclass implementation when overriding standard Lit lifecycle callbacks so the reactive update machinery remains intact.

## Reactive state

Use reactive properties/state as the single source of truth for visible component state. Template output should be derived from those values.

For mutable collections, publish a new observable value when the UI must update:

```js
const selected = new Set(this.selectedIds);
selected.add(id);
this.selectedIds = selected;
```

Likewise, replace arrays/objects rather than mutating them in place when Lit otherwise cannot observe the change.

Prefer ordinary getters or pure helper methods for derived values that do not require storage:

```js
get canSubmit() {
    return this.mode === 'review' && this.selectedIds.size > 0;
}
```

## Declarative rendering

Use Lit bindings instead of querying rendered nodes just to synchronize them afterward:

```js
render() {
    return html`
        <button
            type="button"
            ?disabled=${!this.canSubmit}
            @click=${this.onSubmit}
        >
            Confirm
        </button>
    `;
}
```

Useful binding forms include:

- `@event=${handler}` for listeners
- `.property=${value}` for DOM properties
- `?attribute=${boolean}` for boolean attributes
- normal `${value}` expressions for text/attribute interpolation
- `nothing` for an absent conditional region

Do not cache a map of rendered nodes and then maintain visibility, text, disabled state, or list contents imperatively. If the value is visible state, express it in reactive data and the template.

## External effects and asynchronous work

Rendering should stay side-effect free. Transport, persistence, and feature orchestration normally belong to feature/service modules. Components may call injected callbacks/controllers when that is their established public boundary, but should not absorb unrelated infrastructure during a UI refactor.

When a component owns asynchronous work:

1. record or version the active request,
2. ignore stale completion after newer state supersedes it,
3. cancel work when the API supports cancellation and ownership ends,
4. keep loading/error/result states explicit and reactive.

## Connection and cleanup

A custom element can connect, disconnect, and reconnect. Make external resource ownership symmetric.

Typical cleanup targets include:

- document/window listeners
- `MutationObserver`, `ResizeObserver`, or `IntersectionObserver`
- timers and animation handles
- object URLs from local image previews
- subscriptions to external services
- pending controller resources that are owned by the component

Lit removes template listeners when rendered nodes disappear, so do not duplicate template event handling with manual listener registration.

## Events

Expose component-level actions as stable semantic `CustomEvent`s when surrounding feature code consumes them. Decide deliberately whether events need to bubble or cross a shadow boundary:

```js
this.dispatchEvent(new CustomEvent('edvibe-confirm', {
    detail: {selection: [...this.selectedIds]},
    bubbles: true,
    composed: true
}));
```

Do not expose private shadow nodes as the public integration contract when a semantic event or method can express the interaction.

## Shadow DOM and CSS

Shadow DOM is an integration choice, not a Lit requirement. Preserve the component's established mode unless the task explicitly changes its styling contract.

- With Shadow DOM, remember event retargeting and explicitly expose only intentional styling/integration hooks.
- With light DOM, ensure existing global/component stylesheet rules continue to apply.
- Keep repository component CSS in dedicated source `.css` files.
- Use source asset paths and build configuration for CSS/static resources. Generated copies under `dist/` are not source files.

## Accessibility

Use native semantic controls whenever possible. Preserve accessible names, labels, focus visibility, keyboard operation, disabled/read-only behavior, errors, and logical focus order. Lit changes how markup is produced, not the browser semantics users rely on.

## Browser tests

Component tests run in real Chrome/Chromium. Prefer user-visible state transitions and public contracts over implementation details.

A typical test flow is:

1. create the custom element with the fixture helper,
2. configure it through its public API,
3. await `elementUpdated(element)`,
4. interact through real DOM events,
5. await updates before DOM assertions,
6. assert semantic events and cleanup behavior,
7. remove/cleanup the fixture.

Do not replace meaningful assertions with sleeps. The runner's outer timeout is only a guard for a browser that never reports a result.
