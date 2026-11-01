# `handleInput`

**Source:** `web/src/ui/editor_manager.js` · **Declaration:** `handleInput()`

## Essence

Refreshes line numbers and syntax highlighting after editor text changes.

## Contract

- **Input:** No arguments.
- **Output:** No explicit return value (`undefined`).
- **Side effects:** No external mutation; it computes a value from the supplied arguments.

## Deep explanation

Refreshes line numbers and syntax highlighting after editor text changes. The concrete calls in this body are `updateLineNumbers()`, `updateHighlight()`.

## Potential weak points

The manager relies on `highlightCode` returning safe markup for `innerHTML`; it also does not cancel external work when detached.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
