# `updateLineNumbers`

**Source:** `web/src/ui/editor_manager.js` · **Declaration:** `updateLineNumbers()`

## Essence

Rebuilds the line-number overlay from newline-separated editor text and synchronizes scroll position.

## Contract

- **Input:** No arguments.
- **Output:** Returns the value described by the source branches.
- **Side effects:** Mutates DOM nodes or focus/selection state.

## Deep explanation

Rebuilds the line-number overlay from newline-separated editor text and synchronizes scroll position. Control is gated by `!this.lineNumbers || !this.editor`. The concrete calls in this body are `split()`, `from()`, `join()`, `syncHighlightScroll()`.

## Potential weak points

Line count is derived by splitting the full editor value and rebuilds all number markup on every input; very large documents incur repeated whole-text work.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
