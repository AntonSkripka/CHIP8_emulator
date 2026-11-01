# `getTheme`

**Source:** `web/src/themes/theme_manager.js` · **Declaration:** `getTheme()`

## Essence

Returns the manager's current theme name.

## Contract

- **Input:** No arguments.
- **Output:** Returns the source expression(s) `this.currentTheme`; the branches determine which one is selected.
- **Side effects:** No external mutation; it computes a value from the supplied arguments.

## Deep explanation

Returns the manager's current theme name. Return paths include `this.currentTheme`.

## Potential weak points

Storage exceptions are caught and logged, so a theme can apply for the current page but fail to persist across reloads.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
