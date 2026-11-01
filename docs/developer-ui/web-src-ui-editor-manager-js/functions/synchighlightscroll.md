# `syncHighlightScroll`

**Source:** `web/src/ui/editor_manager.js` · **Declaration:** `syncHighlightScroll()`

## Essence

Copies editor scroll offsets to the syntax overlay and translates line numbers vertically.

## Contract

- **Input:** No arguments.
- **Output:** Returns the value described by the source branches.
- **Side effects:** Mutates DOM nodes or focus/selection state.

## Deep explanation

Copies editor scroll offsets to the syntax overlay and translates line numbers vertically. Control is gated by `!this.highlightOverlay || !this.editor`, `this.lineNumberContent`. The concrete calls in this body are `translateY()`.

## Potential weak points

Scroll synchronization is one-way from editor to overlays; independent overlay scrolling is overwritten on the next sync.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
