# `constructor`

**Source:** `web/src/ui/animated_background.js` · **Declaration:** `constructor({ container, documentRef, windowRef })`

## Essence

Creates three 2D canvases, checks all contexts, initializes the 42px tile and animation state, subscribes to window/document/motion events, then sizes sprites and schedules the first draw.

## Contract

- **Input:** `{ container, documentRef, windowRef }` from the source declaration.
- **Output:** No explicit value; `new` creates the initialized instance.
- **Side effects:** Mutates DOM nodes or focus/selection state. Registers/removes DOM or window listeners. Mutates the instance or shell's retained state.

## Deep explanation

Creates three 2D canvases, checks all contexts, initializes the 42px tile and animation state, subscribes to window/document/motion events, then sizes sprites and schedules the first draw. Control is gated by `!this.context`, `!this.spriteContext`, `!this.bloomContext`. The concrete calls in this body are `createElement()`, `getContext()`, `Error()`, `matchMedia()`, `appendChild()`.

## Potential weak points

Listeners are attached to the supplied canvas/window/document and this class exposes no complete teardown method, so repeated construction can retain callbacks.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
