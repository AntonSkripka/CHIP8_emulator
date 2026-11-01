# `movePointer`

**Source:** `web/src/ui/memory_map_view.js` · **Declaration:** `movePointer(event)`

## Essence

Moves the map while dragging; otherwise updates the address under the pointer.

## Contract

- **Input:** `event` from the source declaration.
- **Output:** Returns the value described by the source branches.
- **Side effects:** Mutates the instance or shell's retained state.

## Deep explanation

Moves the map while dragging; otherwise updates the address under the pointer. Control is gated by `this.state.panning`. The concrete calls in this body are `getCanvasPosition()`, `clampPan()`, `updateSelectedAddress()`.

## Potential weak points

Canvas dimensions and 2D contexts are assumed available after construction; a zero-sized or unavailable canvas prevents useful drawing or coordinate mapping.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
