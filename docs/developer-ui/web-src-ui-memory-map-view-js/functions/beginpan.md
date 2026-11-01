# `beginPan`

**Source:** `web/src/ui/memory_map_view.js` · **Declaration:** `beginPan(event)`

## Essence

Starts drag-panning by storing pointer-to-map offsets and adding the panning class.

## Contract

- **Input:** `event` from the source declaration.
- **Output:** No explicit return value (`undefined`).
- **Side effects:** Mutates DOM nodes or focus/selection state. Mutates the instance or shell's retained state.

## Deep explanation

Starts drag-panning by storing pointer-to-map offsets and adding the panning class. The concrete calls in this body are `getCanvasPosition()`, `add()`.

## Potential weak points

Canvas dimensions and 2D contexts are assumed available after construction; a zero-sized or unavailable canvas prevents useful drawing or coordinate mapping.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
