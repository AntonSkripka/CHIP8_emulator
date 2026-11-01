# passes the virtual-disk resolver through compilation and keeps imported source locations

**Source:** `tests/emulator-runtime.test.js` · **Declaration:** anonymous `test()` callback

## Essence

Exercises `passes the virtual-disk resolver through compilation and keeps imported source locations` with an injected module/source fixture and checks the resulting import, export, resolution or source-map behavior.

## Contract

- **Input:** The test's named fixture and the behavior in its title: `passes the virtual-disk resolver through compilation and keeps imported source locations`.
- **Output:** Passes when its assertions hold; otherwise Node's test runner reports the failed assertion.
- **Side effects:** Runs production code and mutates the test-owned mock or WASM machine state; it does not change browser persistent state.

## Deep explanation

The case is named `passes the virtual-disk resolver through compilation and keeps imported source locations` and runs in `tests/emulator-runtime.test.js` using its local fixture. It exercises `createHarness()`. Its assertions use `assert.equal`, `assert.deepEqual`. This verifies the named behavior at the tested compiler/runtime boundary.

## Potential weak points

The fixture covers the module shape and import/export combination in this case; other combinations and resolver implementations are outside this assertion.

## Glossary

- **Fixture:** Controlled input or dependency used by a test.
- **Assertion:** A condition that fails the test when false.
- **Regression:** Reintroduction of behavior that a prior fix removed.
