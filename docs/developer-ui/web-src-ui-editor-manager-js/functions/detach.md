# `detach`

**Source:** `web/src/ui/editor_manager.js` · **Declaration:** `detach()`

## Essence

Removes the input and scroll listeners previously attached to the editor.

## Contract

- **Input:** No arguments.
- **Output:** Returns the value described by the source branches.
- **Side effects:** Registers/removes DOM or window listeners.

## Deep explanation

Removes the input and scroll listeners previously attached to the editor. Control is gated by `!this.editor`. The concrete calls in this body are `removeEventListener()`.

## Potential weak points

The manager relies on `highlightCode` returning safe markup for `innerHTML`; it also does not cancel external work when detached.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
