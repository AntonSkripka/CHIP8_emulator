# `resolveModule`

**Source:** `tests/compiler.test.js` · **Declaration:** `resolveModule()`

## Essence

Exercises `resolveModule` with an injected module/source fixture and checks the resulting import, export, resolution or source-map behavior.

## Contract

- **Input:** The test's named fixture and the behavior in its title: `resolveModule`.
- **Output:** Passes when its assertions hold; otherwise Node's test runner reports the failed assertion.
- **Side effects:** Runs production code and mutates the test-owned mock or WASM machine state; it does not change browser persistent state.

## Deep explanation

The case is named `resolveModule` and runs in `tests/compiler.test.js` using its local fixture. This verifies the named behavior at the tested compiler/runtime boundary.

## Potential weak points

The fixture covers the module shape and import/export combination in this case; other combinations and resolver implementations are outside this assertion.

## Glossary

- **Read-only data:** Data emitted in a non-writable memory section.
- **Qualified name:** A symbol name that includes its module identity.
