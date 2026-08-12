---
name: write-tests
description: Write and revise automated tests with consistent behavior-driven structure. Use when adding, updating, refactoring, or reviewing unit, component, integration, or end-to-end tests in this repository.
---

# Write Tests

Organize tests by the unit under test and make each test's setup, action, and expectations explicit.

## Structure Test Suites

- Group tests for the same unit under test in one test suite using the test framework's suite primitive, such as `describe`.
- Name the suite after the unit under test: a function, class, component, service, or other public behavior owner.
- Add nested suites only when they clarify distinct methods, states, or scenarios.
- Keep unrelated units under test in separate suites.

## Structure Each Test

Divide every test body into these sections, in this exact order:

```js
test('returns the matching lesson', () => {
  // Given
  const lessons = [{ id: 'lesson-1' }];

  // When
  const result = findLesson(lessons, 'lesson-1');

  // Then
  assert.deepEqual(result, lessons[0]);
});
```

- Write the literal comments `// Given`, `// When`, and `// Then` once in every test.
- Put fixtures, dependencies, mocks, and initial state under `// Given`.
- Put the behavior invocation or user action under `// When`.
- Put assertions and outcome verification under `// Then`.
- Keep the three sections even when one is short. Do not combine or reorder them.

## Apply Repository Conventions

- Preserve the existing test framework and assertion style unless the task explicitly changes them.
- Keep tests beside the primary source module and use kebab-case filenames ending in `.test.js`.
- Test observable behavior and public contracts rather than implementation details.
- Cover relevant success, failure, boundary, cleanup, and state-transition behavior without duplicating equivalent cases.
- Run the narrowest relevant tests while iterating, then the repository's required validation commands when the task scope warrants them.
