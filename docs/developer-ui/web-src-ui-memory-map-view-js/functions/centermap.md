# `centerMap`

**Source:** `web/src/ui/memory_map_view.js` · **Declaration:** `centerMap()`

## Essence

Centers the scaled memory grid inside the current canvas dimensions.

## Contract

- **Input:** No arguments.
- **Output:** No explicit return value (`undefined`).
- **Side effects:** Mutates the instance or shell's retained state.

## Deep explanation

Centers the scaled memory grid inside the current canvas dimensions. Centers the scaled memory grid inside the current canvas dimensions.

## Potential weak points

Canvas dimensions and 2D contexts are assumed available after construction; a zero-sized or unavailable canvas prevents useful drawing or coordinate mapping.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
