# `readSavedTheme`

**Source:** `web/src/themes/theme_manager.js` · **Declaration:** `readSavedTheme()`

## Essence

Reads the persisted theme, accepts only the supported names, and falls back to green when absent, invalid or inaccessible.

## Contract

- **Input:** No arguments.
- **Output:** Returns the source expression(s) `THEMES.includes(savedTheme) ? savedTheme : DEFAULT_THEME`; `DEFAULT_THEME`; the branches determine which one is selected.
- **Side effects:** Reads/writes browser storage. Logs an error or warning through the supplied logger/console.

## Deep explanation

Reads the persisted theme, accepts only the supported names, and falls back to green when absent, invalid or inaccessible. The concrete calls in this body are `getItem()`, `includes()`, `warn()`. Return paths include `THEMES.includes(savedTheme) ? savedTheme : DEFAULT_THEME`, `DEFAULT_THEME`.

## Potential weak points

A storage read failure silently selects the default for this session; it does not repair or remove the inaccessible stored value.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
