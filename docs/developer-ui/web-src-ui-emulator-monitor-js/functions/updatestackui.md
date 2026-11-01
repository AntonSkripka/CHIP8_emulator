# `updateStackUI`

**Source:** `web/src/ui/emulator_monitor.js` · **Declaration:** `updateStackUI()`

## Essence

Displays at most the newest 64 data-stack values, skipping DOM work when depth and visible range are unchanged.

## Contract

- **Input:** No arguments.
- **Output:** Returns the value described by the source branches.
- **Side effects:** Mutates DOM nodes or focus/selection state. Creates/appends debugger DOM nodes.

## Deep explanation

Displays at most the newest 64 data-stack values, skipping DOM work when depth and visible range are unchanged. Control is gated by `!this.stackContainer || !this.core.hasStackSupport()`, `this.lastStackSize === stackSize && this.lastStackStart === startIndex`. The concrete calls in this body are `hasStackSupport()`, `getSpd()`, `max()`, `replaceChildren()`, `createElement()`.

## Potential weak points

Only the newest 64 stack values are rendered, and a stable depth skips refresh even if an external stack value changes in place.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
