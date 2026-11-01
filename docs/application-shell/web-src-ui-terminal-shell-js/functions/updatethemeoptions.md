# `updateThemeOptions`

**Source:** `web/src/ui/terminal_shell.js` · **Declaration:** `updateThemeOptions()`

## Essence

Synchronizes theme radio semantics, selected/active classes and terminal cursor glyphs with shell state.

## Contract

- **Input:** No arguments.
- **Output:** No explicit return value (`undefined`).
- **Side effects:** Mutates DOM nodes or focus/selection state.

## Deep explanation

Synchronizes theme radio semantics, selected/active classes and terminal cursor glyphs with shell state. The concrete calls in this body are `forEach()`, `setAttribute()`, `String()`, `toggle()`, `querySelector()`.

## Potential weak points

The function assumes each option contains `.theme-cursor` and that the option count matches the theme array.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
