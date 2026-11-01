# `constructor`

**Source:** `web/src/themes/theme_manager.js` · **Declaration:** `constructor({ documentRef, storage, logger = console })`

## Essence

Stores document/storage/logger, loads a validated saved theme (green fallback), then applies it immediately to the root element.

## Contract

- **Input:** `{ documentRef, storage, logger = console }` from the source declaration.
- **Output:** No explicit value; `new` creates the initialized instance.
- **Side effects:** Mutates the instance or shell's retained state.

## Deep explanation

Stores document/storage/logger, loads a validated saved theme (green fallback), then applies it immediately to the root element. The concrete calls in this body are `readSavedTheme()`, `apply()`.

## Potential weak points

Storage exceptions are caught and logged, so a theme can apply for the current page but fail to persist across reloads.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
