# `selectThemeOption`

**Source:** `web/src/ui/terminal_shell.js` · **Declaration:** `selectThemeOption(index)`

## Essence

Accepts only an in-range theme index, updates the pending choice and focuses the matching option.

## Contract

- **Input:** `index` from the source declaration.
- **Output:** Returns the value described by the source branches.
- **Side effects:** Mutates DOM nodes or focus/selection state. Mutates the instance or shell's retained state.

## Deep explanation

Accepts only an in-range theme index, updates the pending choice and focuses the matching option. Control is gated by `index < 0 || index >= THEMES.length`. The concrete calls in this body are `updateThemeOptions()`, `focus()`.

## Potential weak points

Out-of-range indexes are silently ignored; keyboard shortcuts assume the options list and `THEMES` remain aligned.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
