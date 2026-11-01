# `updateDebug`

**Source:** `web/src/ui/emulator_monitor.js` · **Declaration:** `updateDebug()`

## Essence

Reads the emulator's V registers, PC, I, call-stack pointer and data-stack pointer and writes formatted values into existing DOM nodes.

## Contract

- **Input:** No arguments.
- **Output:** Returns the value described by the source branches.
- **Side effects:** Mutates DOM nodes or focus/selection state.

## Deep explanation

Reads the emulator's V registers, PC, I, call-stack pointer and data-stack pointer and writes formatted values into existing DOM nodes. Control is gated by `!registers`, `this.regElements[index].textContent !== value`. The concrete calls in this body are `getVRegistersView()`, `forEach()`, `toString()`, `toUpperCase()`, `padStart()`.

## Potential weak points

The core is expected to expose all 16 V registers and the PC/I/SP/SPD accessors; the method does not guard an absent register element at each index.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
