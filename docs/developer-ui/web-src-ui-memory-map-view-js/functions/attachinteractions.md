# `attachInteractions`

**Source:** `web/src/ui/memory_map_view.js` · **Declaration:** `attachInteractions()`

## Essence

Adds wheel zoom, drag start and window-level pointer movement/release listeners if a canvas exists.

## Contract

- **Input:** No arguments.
- **Output:** Returns the value described by the source branches.
- **Side effects:** Registers/removes DOM or window listeners.

## Deep explanation

Adds wheel zoom, drag start and window-level pointer movement/release listeners if a canvas exists. Control is gated by `!this.canvas`. The concrete calls in this body are `addEventListener()`, `zoom()`, `beginPan()`, `movePointer()`, `endPan()`.

## Potential weak points

Listeners are installed on the canvas and window but are anonymous callbacks, so the class cannot later remove those exact listener references.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
