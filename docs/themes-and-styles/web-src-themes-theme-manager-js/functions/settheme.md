# `setTheme`

**Source:** `web/src/themes/theme_manager.js` · **Declaration:** `setTheme(theme)`

## Essence

Rejects unknown theme names, updates active state and DOM, then attempts persistence without undoing the applied theme on storage failure.

## Contract

- **Input:** `theme` from the source declaration.
- **Output:** No explicit return value (`undefined`).
- **Side effects:** Validates the theme, updates internal/root theme state and dispatches the theme event, then attempts to persist the name; persistence errors are logged.

## Deep explanation

Rejects unknown theme names, updates active state and DOM, then attempts persistence without undoing the applied theme on storage failure. Control is gated by `!THEMES.includes(theme)`. The concrete calls in this body are `includes()`, `RangeError()`, `apply()`, `setItem()`, `error()`.

## Potential weak points

Storage exceptions are caught and logged, so a theme can apply for the current page but fail to persist across reloads.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
