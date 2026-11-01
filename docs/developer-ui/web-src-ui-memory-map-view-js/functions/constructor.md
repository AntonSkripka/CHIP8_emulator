# `constructor`

**Source:** `web/src/ui/memory_map_view.js` · **Declaration:** `constructor({ core, canvas, infoElement, windowRef })`

## Essence

Stores core/canvas/info/window, creates a 64×64 ImageData buffer when a context exists, initializes scale/pan/address state, centers and clamps the map, then installs pointer listeners.

## Contract

- **Input:** `{ core, canvas, infoElement, windowRef }` from the source declaration.
- **Output:** No explicit value; `new` creates the initialized instance.
- **Side effects:** No external mutation; it computes a value from the supplied arguments.

## Deep explanation

Stores core/canvas/info/window, creates a 64×64 ImageData buffer when a context exists, initializes scale/pan/address state, centers and clamps the map, then installs pointer listeners. The concrete calls in this body are `getContext()`, `createImageData()`, `centerMap()`, `clampPan()`, `attachInteractions()`.

## Potential weak points

Canvas dimensions and 2D contexts are assumed available after construction; a zero-sized or unavailable canvas prevents useful drawing or coordinate mapping.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
