# `clampPan`

**Source:** `web/src/ui/memory_map_view.js` · **Declaration:** `clampPan()`

## Essence

Clamps horizontal and vertical map offsets so the map cannot be panned beyond its viewport bounds.

## Contract

- **Input:** No arguments.
- **Output:** No explicit return value (`undefined`).
- **Side effects:** Mutates the instance or shell's retained state.

## Deep explanation

Clamps horizontal and vertical map offsets so the map cannot be panned beyond its viewport bounds. The concrete calls in this body are `clampAxis()`.

## Potential weak points

Canvas dimensions and 2D contexts are assumed available after construction; a zero-sized or unavailable canvas prevents useful drawing or coordinate mapping.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
