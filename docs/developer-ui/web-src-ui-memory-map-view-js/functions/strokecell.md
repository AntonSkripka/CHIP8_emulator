# `strokeCell`

**Source:** `web/src/ui/memory_map_view.js` · **Declaration:** `strokeCell(context, '#f00', x, y, cellSize, 2)`

## Essence

Draws an inset or full-cell outline with the requested color and thickness.

## Contract

- **Input:** `context, color, x, y, cellSize, lineWidth, inset = true` from the source declaration.
- **Output:** No explicit return value (`undefined`).
- **Side effects:** Draws to canvas.

## Deep explanation

Draws an inset or full-cell outline with the requested color and thickness. The concrete calls in this body are `strokeRect()`.

## Potential weak points

Canvas dimensions and 2D contexts are assumed available after construction; a zero-sized or unavailable canvas prevents useful drawing or coordinate mapping.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
