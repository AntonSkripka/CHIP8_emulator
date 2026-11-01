# `createDebugUI`

**Source:** `web/src/ui/emulator_monitor.js` · **Declaration:** `createDebugUI(debugPanel)`

## Essence

Creates rows for all 16 V registers and the PC/I/SP/SPD values, appending them to the panel or document body.

## Contract

- **Input:** `debugPanel` from the source declaration.
- **Output:** No explicit return value (`undefined`).
- **Side effects:** Mutates DOM nodes or focus/selection state. Creates/appends debugger DOM nodes.

## Deep explanation

Creates rows for all 16 V registers and the PC/I/SP/SPD values, appending them to the panel or document body. The concrete calls in this body are `createElement()`, `add()`, `toString()`, `toUpperCase()`, `appendChild()`.

## Potential weak points

Its behavior is scoped to the specific state and DOM region it updates; it does not reconcile unrelated screen state or rebuild missing markup.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
