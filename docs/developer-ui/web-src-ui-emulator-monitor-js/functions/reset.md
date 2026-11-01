# `reset`

**Source:** `web/src/ui/emulator_monitor.js` · **Declaration:** `reset()`

## Essence

Invalidates the stack-render cache and immediately refreshes the visible stack.

## Contract

- **Input:** No arguments.
- **Output:** No explicit return value (`undefined`).
- **Side effects:** No external mutation; it computes a value from the supplied arguments.

## Deep explanation

Invalidates the stack-render cache and immediately refreshes the visible stack. The concrete calls in this body are `updateStackUI()`.

## Potential weak points

Its behavior is scoped to the specific state and DOM region it updates; it does not reconcile unrelated screen state or rebuild missing markup.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
