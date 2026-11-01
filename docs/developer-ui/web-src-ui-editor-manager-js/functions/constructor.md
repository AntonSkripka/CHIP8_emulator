# `constructor`

**Source:** `web/src/ui/editor_manager.js` · **Declaration:** `constructor({ editor, highlightOverlay, lineNumbers, highlightCode })`

## Essence

Stores editor/overlay/line-number/highlighter references and binds input/scroll handlers so later detach removes the same function identities.

## Contract

- **Input:** `{ editor, highlightOverlay, lineNumbers, highlightCode }` from the source declaration.
- **Output:** No explicit value; `new` creates the initialized instance.
- **Side effects:** No external mutation; it computes a value from the supplied arguments.

## Deep explanation

Stores editor/overlay/line-number/highlighter references and binds input/scroll handlers so later detach removes the same function identities. The concrete calls in this body are `bind()`.

## Potential weak points

The manager relies on `highlightCode` returning safe markup for `innerHTML`; it also does not cancel external work when detached.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
