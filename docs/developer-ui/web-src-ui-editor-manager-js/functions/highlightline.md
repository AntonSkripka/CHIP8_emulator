# `highlightLine`

**Source:** `web/src/ui/editor_manager.js` · **Declaration:** `highlightLine(line)`

## Essence

Selects the exact source line in the editor and reports whether the requested line exists.

## Contract

- **Input:** `line` from the source declaration.
- **Output:** `true` after selecting a valid one-based line; `false` for a missing editor, non-integer/less-than-one line, or line beyond the source.
- **Side effects:** Mutates DOM nodes or focus/selection state.

## Deep explanation

Selects the exact source line in the editor and reports whether the requested line exists. Control is gated by `!this.editor || !Number.isInteger(line) || line < 1`, `line > lines.length`. The concrete calls in this body are `isInteger()`, `split()`, `slice()`, `reduce()`, `focus()`. Return paths include `false`, `false`, `true`.

## Potential weak points

Selection uses textarea text offsets and line breaks as stored in `.value`; it does not account for visual wrapping or normalize CRLF separately.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
