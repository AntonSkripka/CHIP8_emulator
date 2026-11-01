# `clampAxis`

**Source:** `web/src/ui/memory_map_view.js` · **Declaration:** `clampAxis(this.state.pointX, this.state.cols * this.state.gridSize * this.state.scale, this.canvas.width)`

## Essence

Bounds one axis offset using the content and viewport sizes, centering content when it is smaller.

## Contract

- **Input:** `offset, contentSize, viewportSize` from the source declaration.
- **Output:** The offset clamped between the minimum and maximum permitted positions for that axis.
- **Side effects:** No external mutation; it computes a value from the supplied arguments.

## Deep explanation

Bounds one axis offset using the content and viewport sizes, centering content when it is smaller. The concrete calls in this body are `min()`, `max()`. Return paths include `Math.max(minOffset, Math.min(maxOffset, offset))`.

## Potential weak points

Canvas dimensions and 2D contexts are assumed available after construction; a zero-sized or unavailable canvas prevents useful drawing or coordinate mapping.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
