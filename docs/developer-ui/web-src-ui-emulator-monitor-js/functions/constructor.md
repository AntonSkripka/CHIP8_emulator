# `constructor`

**Source:** `web/src/ui/emulator_monitor.js` · **Declaration:** `constructor({ core, documentRef, debugPanel, stackContainer })`

## Essence

Stores the core and DOM containers, initializes register/stack render caches, and immediately creates the debug register/value rows.

## Contract

- **Input:** `{ core, documentRef, debugPanel, stackContainer }` from the source declaration.
- **Output:** No explicit value; `new` creates the initialized instance.
- **Side effects:** No external mutation; it computes a value from the supplied arguments.

## Deep explanation

Stores the core and DOM containers, initializes register/stack render caches, and immediately creates the debug register/value rows. The concrete calls in this body are `createDebugUI()`.

## Potential weak points

Its behavior is scoped to the specific state and DOM region it updates; it does not reconcile unrelated screen state or rebuild missing markup.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
