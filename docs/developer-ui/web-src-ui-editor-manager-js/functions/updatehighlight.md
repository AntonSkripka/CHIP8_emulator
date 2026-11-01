# `updateHighlight`

**Source:** `web/src/ui/editor_manager.js` · **Declaration:** `updateHighlight()`

## Essence

Uses the injected highlighter to replace overlay markup, then aligns its scroll position.

## Contract

- **Input:** No arguments.
- **Output:** Returns the value described by the source branches.
- **Side effects:** Mutates DOM nodes or focus/selection state.

## Deep explanation

Uses the injected highlighter to replace overlay markup, then aligns its scroll position. Control is gated by `!this.highlightOverlay || !this.editor`. The concrete calls in this body are `highlightCode()`, `syncHighlightScroll()`.

## Potential weak points

The manager relies on `highlightCode` returning safe markup for `innerHTML`; it also does not cancel external work when detached.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
