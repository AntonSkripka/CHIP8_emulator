# loads selected module exports from .chip files and preserves module source maps

**Source:** `tests/compiler.test.js` · **Declaration:** anonymous `test()` callback

## Essence

Exercises `loads selected module exports from .chip files and preserves module source maps` with an injected module/source fixture and checks the resulting import, export, resolution or source-map behavior.

## Contract

- **Input:** The test's named fixture and the behavior in its title: `loads selected module exports from .chip files and preserves module source maps`.
- **Output:** Passes when its assertions hold; otherwise Node's test runner reports the failed assertion.
- **Side effects:** Runs production code and mutates the test-owned mock or WASM machine state; it does not change browser persistent state.

## Deep explanation

The case is named `loads selected module exports from .chip files and preserves module source maps` and runs in `tests/compiler.test.js` using its local fixture. It exercises `compile()`. Its assertions use `assert.deepEqual`, `assert.match`, `assert.equal`, `assert.ok`. This verifies the named behavior at the tested compiler/runtime boundary.

## Potential weak points

The fixture covers the module shape and import/export combination in this case; other combinations and resolver implementations are outside this assertion.

## Glossary

- **Fixture:** Controlled input or dependency used by a test.
- **Assertion:** A condition that fails the test when false.
- **Regression:** Reintroduction of behavior that a prior fix removed.
