# `zoom`

**Source:** `web/src/ui/memory_map_view.js` · **Declaration:** `zoom(event)`

## Essence

Prevents wheel scrolling and changes scale around the pointer while keeping that memory point anchored.

## Contract

- **Input:** `event` from the source declaration.
- **Output:** No explicit return value (`undefined`).
- **Side effects:** No external mutation; it computes a value from the supplied arguments.

## Deep explanation

Prevents wheel scrolling and changes scale around the pointer while keeping that memory point anchored. The concrete calls in this body are `preventDefault()`, `getCanvasPosition()`, `max()`, `min()`, `clampPan()`.

## Potential weak points

Canvas dimensions and 2D contexts are assumed available after construction; a zero-sized or unavailable canvas prevents useful drawing or coordinate mapping.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
