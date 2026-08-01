# Lifecycle and Implementation Patterns

## Contents

- Lifecycle callback matrix
- Constructor and upgrade constraints
- Connection, disconnection, movement, and adoption
- Attribute reactions
- Form-associated callbacks
- Rendering and scheduling
- Events, Shadow DOM, and accessibility
- Performance without obscurity

## Lifecycle callback matrix

Treat the constructor plus the following reactions as the complete lifecycle surface defined for custom elements. Implement only callbacks the component needs.

| Hook | Invocation | Proper use | Avoid |
| --- | --- | --- | --- |
| `constructor()` | The element is constructed or an existing element is upgraded | Initialize private fields; bind stable handlers; attach a shadow root; call `attachInternals()` when needed; create reusable instance infrastructure | Reading attributes or children; depending on connection, parents, layout, or document state; fetching; starting timers; inserting external content |
| `connectedCallback()` | The element becomes connected to a document | Start connection-scoped listeners, observers, timers, and async work; perform initial render that needs attributes or children; synchronize with surrounding DOM | Assuming it runs once; duplicating listeners; leaving work active after disconnection; expensive synchronous rendering for every reconnection |
| `disconnectedCallback()` | The element becomes disconnected | Abort listeners and requests owned by the connection; disconnect observers; cancel timers and scheduled work; release references that retain external objects | Destroying reusable internal DOM by default; assuming removal is permanent; deleting persistent component state needed on reconnection |
| `connectedMoveCallback()` | An element is moved with `Element.moveBefore()` under the standard's state-preserving move rules | Preserve existing resources and state; update only context that genuinely depends on the new parent or position | Treating ordinary `insertBefore()`, `append()`, or framework reparenting as state-preserving; relying on it without checking target support |
| `adoptedCallback(oldDocument, newDocument)` | The element is adopted into another `Document` | Rebind document/window-specific services, styles, observers, URLs, or caches; remember that adoption does not itself guarantee connection | Treating it as a normal move callback; assuming either document is currently connected or has the same global environment |
| `attributeChangedCallback(name, oldValue, newValue, namespace)` | An attribute listed by static `observedAttributes` is added, changed, removed, or initialized during upgrade | Parse and normalize one changed input; update state; reflect to ARIA/internals if appropriate; schedule a minimal render | Observing every attribute; heavy rendering per mutation; writing the same attribute recursively; assuming values are valid or non-null |
| `formAssociatedCallback(form)` | A form-associated custom element gains, loses, or changes its form owner | Cache or react to the current `HTMLFormElement` or `null`; update behavior dependent on form ownership | Reimplementing submission; assuming association occurs only once |
| `formDisabledCallback(disabled)` | The control's disabled state changes, including disabled-fieldset inheritance | Synchronize interaction, focusability, visuals, and ARIA with the effective disabled boolean | Looking only at the host's `disabled` attribute; allowing keyboard or pointer activation while disabled |
| `formResetCallback()` | The associated form resets | Restore the component's default value and related dirty state; update `ElementInternals` and rendering | Clearing blindly when the initial/default value differs; emitting user-change events for a form reset unless required by the contract |
| `formStateRestoreCallback(state, reason)` | The browser restores state for navigation/session restoration or autofill | Deserialize the `string`, `File`, `FormData`, or `null` state established through `setFormValue`; handle `reason` values `restore` and `autocomplete` | Assuming this callback always runs; conflating restored state with the submission value; accepting an unrecognized serialized format silently |

`observedAttributes` is a static getter or static field, not a lifecycle callback. It opts attributes into `attributeChangedCallback`. Static `formAssociated = true` similarly opts an autonomous custom element into form association.

## Constructor and upgrade constraints

Custom elements may be created before their definition and upgraded later. Keep construction independent of parser timing and surrounding DOM. Do not return a replacement object or call the base constructor incorrectly; call `super()` before using `this`.

Use instance fields for persistent state and a connection-scoped `AbortController` for disposable work:

```js
class UserCard extends HTMLElement {
  #connection;
  #nameNode;

  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.append(userCardTemplate.content.cloneNode(true));
    this.#nameNode = root.querySelector("[data-name]");
  }

  connectedCallback() {
    if (this.#connection) return;
    this.#connection = new AbortController();
    this.addEventListener("click", this.#onClick, {
      signal: this.#connection.signal,
    });
    this.#render();
  }

  disconnectedCallback() {
    this.#connection?.abort();
    this.#connection = undefined;
  }
}
```

## Connection, disconnection, movement, and adoption

Design `connectedCallback`/`disconnectedCallback` as a repeatable pair. A DOM reordering operation can produce disconnect/connect reactions even when an author thinks of it as a move. Preserve user-visible state outside ephemeral connection resources.

Use `connectedMoveCallback` only with `Element.moveBefore()`. If this newer behavior is unavailable in supported browsers, write ordinary lifecycle callbacks so a disconnect/reconnect pair is harmless. Feature-detect before selecting an optimization; do not build correctness around it.

Use `adoptedCallback` for cross-document dependencies. Resolve `ownerDocument`, `defaultView`, stylesheets, and observers again after adoption rather than retaining stale globals.

## Attribute reactions

Keep attribute/property behavior predictable:

```js
static observedAttributes = ["disabled", "value"];

attributeChangedCallback(name, oldValue, newValue) {
  if (oldValue === newValue) return;

  if (name === "disabled") {
    this.#disabled = newValue !== null;
  } else {
    this.#value = newValue ?? "";
  }

  this.#scheduleRender();
}
```

Boolean attributes are true by presence, including `disabled="false"`. For numbers and enumerations, define behavior for missing, empty, invalid, and out-of-range values. When reflecting a property, compare the serialized value before mutating the attribute. Do not reflect objects through JSON attributes unless the declarative API genuinely requires it.

## Form-associated callbacks

Use form association only for controls that must participate in native submission, validation, labels, reset, or restoration:

```js
class RatingInput extends HTMLElement {
  static formAssociated = true;
  #internals;
  #defaultValue = "";
  #value = "";

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  set value(value) {
    this.#value = String(value);
    this.#internals.setFormValue(this.#value, this.#value);
    this.#render();
  }

  formDisabledCallback(disabled) {
    this.toggleAttribute("data-disabled", disabled);
  }

  formResetCallback() {
    this.value = this.#defaultValue;
  }

  formStateRestoreCallback(state) {
    this.value = typeof state === "string" ? state : "";
  }
}
```

Capture the declarative default at the appropriate initialization point, and keep current value distinct from default value and restoration state. Use `setValidity()` with an appropriate message and anchor for constraint validation. Prefer `ElementInternals` accessibility semantics when supported, while ensuring explicit author-provided ARIA remains authoritative.

## Rendering and scheduling

Choose the least elaborate rendering strategy that preserves state:

- For static structure with a few dynamic fields, clone a cached template once and retain node references.
- For small conditional regions, update only the affected region.
- For lists, preserve keyed node identity when focus, selection, animation, or nested component state matters.
- For high-frequency updates, coalesce work into a microtask. Do not microtask-batch when callers must observe synchronous DOM changes as part of the public contract.
- Use `requestAnimationFrame` for paint-aligned visual writes, not as a generic debounce mechanism.
- Abort or version async work so stale responses cannot overwrite newer state.

Avoid unconditional `innerHTML` in repeat renders. Besides parsing cost, wholesale replacement resets node identity and browser-managed state. If HTML strings are unavoidable, treat untrusted input as unsafe and use the platform's available sanitization strategy rather than ad hoc escaping.

## Events, Shadow DOM, and accessibility

Use native events and controls internally when they express the behavior. For component-level notifications, dispatch from the host with a stable `detail` shape. Set `composed: true` only for public events that must leave a shadow root; set `bubbles: true` when ancestor delegation is part of the contract; set `cancelable: true` only when cancellation changes component behavior.

Shadow DOM is an encapsulation tool, not a default requirement. With it:

- Use slots for consumer content and handle `slotchange` only when derived behavior requires it.
- Understand event retargeting; use `composedPath()` when internal origin matters legitimately.
- Expose theme tokens with CSS custom properties and selected internals with `part` attributes.
- Prefer an open root unless a closed root provides a concrete invariant; closed roots are not a security boundary.
- Keep focus order logical. Use `delegatesFocus` only after validating keyboard and assistive-technology behavior.

Retain native semantic elements whenever possible. Do not recreate button, link, checkbox, dialog, or input behavior on a generic `div`. Test accessible name computation, focus visibility, keyboard activation, disabled/read-only states, labels, errors, and zoom/reflow.

## Performance without obscurity

Optimize at architectural boundaries before micro-optimizing syntax:

1. Prevent unnecessary component creation and renders.
2. Keep DOM size and mutation scope proportionate to visible UI.
3. Preserve nodes and browser state instead of rebuilding trees.
4. Share immutable templates and constructable stylesheets where target support and repository conventions justify them.
5. Delegate repeated-child events and use one cleanup mechanism per connection.
6. Lazy-start heavy observers, imports, data work, or media when visibility or interaction warrants it.
7. Batch layout reads, then writes; never alternate them across a large loop.
8. Profile realistic instances and interactions before adding caches, pooling, virtualization, or custom schedulers.

Prefer private methods with specific names such as `#parseValue`, `#scheduleRender`, and `#renderItems` over generic abstractions. Extract shared utilities only after repeated use reveals a stable concept. Comment lifecycle invariants and browser constraints, not obvious assignments.
