# `appendValueRow`

**Source:** `web/src/ui/emulator_monitor.js` · **Declaration:** `appendValueRow(container, 'PC', '0x000', 'pc-row')`

## Essence

Appends one labeled value row and returns its value span for later updates.

## Contract

- **Input:** `container, label, initialValue, className = ''` from the source declaration.
- **Output:** Returns the source expression(s) `row.querySelector('span')`; the branches determine which one is selected.
- **Side effects:** Mutates DOM nodes or focus/selection state. Creates/appends debugger DOM nodes.

## Deep explanation

Appends one labeled value row and returns its value span for later updates. Control is gated by `className`. The concrete calls in this body are `createElement()`, `add()`, `appendChild()`, `querySelector()`. Return paths include `row.querySelector('span')`.

## Potential weak points

Its behavior is scoped to the specific state and DOM region it updates; it does not reconcile unrelated screen state or rebuild missing markup.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
