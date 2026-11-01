# `updateSelectedAddress`

**Source:** `web/src/ui/memory_map_view.js` · **Declaration:** `updateSelectedAddress(event.clientX, event.clientY)`

## Essence

Converts pointer coordinates into a 64×64 byte address, updates selected state and info text, or clears selection outside valid memory.

## Contract

- **Input:** `clientX, clientY` from the source declaration.
- **Output:** Returns the value described by the source branches.
- **Side effects:** Mutates DOM nodes or focus/selection state. Mutates the instance or shell's retained state.

## Deep explanation

Converts pointer coordinates into a 64×64 byte address, updates selected state and info text, or clears selection outside valid memory. Control is gated by `!this.infoElement`, `column >= 0 && column < this.state.cols && row >= 0 && row < this.state.rows && address < 4096`, `!memory`. The concrete calls in this body are `getCanvasPosition()`, `floor()`, `getMemoryView()`, `toString()`, `toUpperCase()`.

## Potential weak points

The mapping assumes a fixed 64×64 grid and a 4096-byte address space; changing the core memory geometry would make the hard-coded bound stale.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
