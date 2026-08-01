---
name: web-components-best-practices
description: Design, implement, optimize, or review standards-based Web Components and custom elements in vanilla JavaScript. Use for component APIs, Shadow DOM, templates, slots, lifecycle callbacks, form-associated custom elements, events, styling, accessibility, testing, performance, or refactoring dynamically created UI into maintainable Web Components.
---

# Web Components Best Practices

Build platform-native components that remain understandable, accessible, and efficient. Prefer the simplest standards-based design that satisfies the component's actual encapsulation needs.

## Workflow

1. Inspect repository conventions, target browsers, existing component APIs, and surrounding ownership of markup and CSS.
2. Define the public contract before implementation: element name, attributes, properties, methods, events, slots, parts, states, and form behavior.
3. Decide whether Shadow DOM adds useful encapsulation. Use light DOM when global styling, semantics, or content integration matters more.
4. Choose lifecycle callbacks deliberately. Read [lifecycle-and-patterns.md](references/lifecycle-and-patterns.md) whenever creating or reviewing lifecycle behavior, form association, rendering, events, or performance.
5. Implement one-time setup separately from repeatable connection and update work.
6. Validate lifecycle symmetry, accessibility, keyboard behavior, disconnect/reconnect behavior, attribute/property reflection, and representative performance.

## Non-negotiable Practices

- Use a lowercase hyphenated custom-element name and guard registration when duplicate evaluation is possible.
- Keep the constructor cheap and synchronous. Initialize internal state, attach an allowed shadow root, and create `ElementInternals` there; do not inspect children, attributes, or parent context.
- Make connection and disconnection idempotent. Assume an instance can connect, disconnect, move, adopt, and reconnect repeatedly.
- Observe only attributes that affect behavior or rendering. Parse at the boundary, compare normalized values, and prevent reflection loops.
- Expose rich JavaScript values through properties; use attributes for declarative string/boolean/number configuration and reflect only when useful.
- Preserve consumer-owned light-DOM children. Prefer slots over cloning or rewriting them.
- Dispatch semantic `CustomEvent`s from the host. Choose `bubbles`, `composed`, and `cancelable` intentionally; do not expose private shadow nodes as the public contract.
- Keep component CSS in a dedicated `.css` file when repository policy requires it. Use custom properties for theming and `::part()` only for deliberate styling hooks.
- Preserve native semantics whenever possible. Supply an accessible name, keyboard operation, focus behavior, states, and reduced-motion behavior appropriate to the control.
- Avoid customized built-in elements unless browser targets explicitly support them and their interoperability tradeoff is accepted.
- Do not optimize by sacrificing clarity. Measure first, then reduce repeated DOM work, layout churn, listeners, observers, allocations, or scheduling.

## Rendering Rules

- Render only when externally visible state changes.
- Prefer a small, readable render method with stable node references. For substantial templates, clone a cached `template` once per instance and patch changing fields afterward.
- Avoid replacing the entire shadow tree on every change; it can discard focus, selection, media state, element identity, and listeners.
- Batch multiple synchronous updates into one microtask when that preserves observable behavior. Use `requestAnimationFrame` only for visual work that should align with paint.
- Separate reads from writes when layout measurements are necessary. Avoid forced synchronous layout inside loops.
- Use event delegation where it simplifies repeated-child handling. Use an `AbortController` to make listener cleanup obvious and reliable.
- Prefer CSS for visual state and animations; use JavaScript only when behavior or measurement requires it.

## Review Checklist

- Confirm every implemented callback has a clear responsibility and repeated invocation is safe.
- Confirm `observedAttributes` and `attributeChangedCallback` agree, including removal, invalid input, and initial upgrade values.
- Confirm resources started while connected are stopped while disconnected, unless ownership intentionally outlives connection.
- Confirm moves use `Element.moveBefore()` plus `connectedMoveCallback()` only when target-browser support and state-preserving semantics are intentional; otherwise tolerate disconnect/reconnect.
- Confirm form-associated elements implement the relevant form callbacks and use `ElementInternals` correctly.
- Confirm public events cross the shadow boundary only when consumers need them.
- Confirm no render path destroys consumer state unnecessarily.
- Confirm accessible semantics and keyboard flows in both light and shadow DOM.
- Confirm code remains direct enough for the next maintainer to modify safely.

## Validation

Exercise the component through creation before and after definition, initial connection, removal, reconnection, attribute addition/change/removal, property updates, document adoption when relevant, and state-preserving movement when supported. For form-associated controls, also test association changes, disabled inheritance, reset, submission, validation, and state restoration. Use browser performance tooling only for a representative workload; report measured bottlenecks rather than speculative micro-optimizations.
