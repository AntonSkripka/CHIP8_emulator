# `applySelectedTheme`

**Source:** `web/src/ui/terminal_shell.js` · **Declaration:** `applySelectedTheme()`

## Essence

Commits the pending theme through ThemeManager and refreshes the option states.

## Contract

- **Input:** No arguments.
- **Output:** No explicit return value (`undefined`).
- **Side effects:** Changes disk, emulator or theme state. Mutates the instance or shell's retained state.

## Deep explanation

Commits the pending theme through ThemeManager and refreshes the option states. The concrete calls in this body are `setTheme()`, `updateThemeOptions()`.

## Potential weak points

The selected index is trusted to remain valid between selection and apply; the theme manager will throw if the resolved theme name is invalid.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
