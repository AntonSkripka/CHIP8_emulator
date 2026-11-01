# `resize`

**Source:** `web/src/ui/animated_background.js` · **Declaration:** `resize()`

## Essence

Recomputes canvas dimensions, tile counts and capped device-pixel ratio, recreates sprites and requests a redraw.

## Contract

- **Input:** No arguments.
- **Output:** No explicit return value (`undefined`).
- **Side effects:** Mutates the instance or shell's retained state.

## Deep explanation

Recomputes canvas dimensions, tile counts and capped device-pixel ratio, recreates sprites and requests a redraw. The concrete calls in this body are `max()`, `floor()`, `min()`, `round()`, `setTransform()`.

## Potential weak points

Canvas dimensions and 2D contexts are assumed available after construction; a zero-sized or unavailable canvas prevents useful drawing or coordinate mapping.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
