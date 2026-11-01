# `getCanvasPosition`

**Source:** `web/src/ui/memory_map_view.js` · **Declaration:** `getCanvasPosition(event.clientX, event.clientY)`

## Essence

Converts viewport client coordinates into canvas backing-store coordinates.

## Contract

- **Input:** `clientX, clientY` from the source declaration.
- **Output:** An `{x, y}` object scaled from CSS client coordinates to canvas backing-store coordinates.
- **Side effects:** No external mutation; it computes a value from the supplied arguments.

## Deep explanation

Converts viewport client coordinates into canvas backing-store coordinates. The concrete calls in this body are `getBoundingClientRect()`.

## Potential weak points

The conversion divides by the DOM rectangle width/height; a hidden or zero-size canvas can yield invalid coordinates.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
