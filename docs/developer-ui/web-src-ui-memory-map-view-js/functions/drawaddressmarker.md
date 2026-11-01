# `drawAddressMarker`

**Source:** `web/src/ui/memory_map_view.js` · **Declaration:** `drawAddressMarker(context, address, pc, indexRegister, state.selectedAddress, x, y, cellSize)`

## Essence

Strokes cells representing PC/opcode, I and the selected address, using distinct colors.

## Contract

- **Input:** `context, address, pc, indexRegister, selectedAddress, x, y, cellSize` from the source declaration.
- **Output:** No explicit return value (`undefined`).
- **Side effects:** No external mutation; it computes a value from the supplied arguments.

## Deep explanation

Strokes cells representing PC/opcode, I and the selected address, using distinct colors. Control is gated by `address === pc || address === pc + 1`, `address === indexRegister`, `address === selectedAddress`. The concrete calls in this body are `strokeCell()`.

## Potential weak points

Canvas dimensions and 2D contexts are assumed available after construction; a zero-sized or unavailable canvas prevents useful drawing or coordinate mapping.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
