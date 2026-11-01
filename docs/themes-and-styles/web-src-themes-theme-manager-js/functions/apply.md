# `apply`

**Source:** `web/src/themes/theme_manager.js` · **Declaration:** `apply(this.currentTheme)`

## Essence

Sets the root `data-theme` attribute and emits the `themechange` event carrying the chosen theme.

## Contract

- **Input:** `theme` from the source declaration.
- **Output:** No explicit return value (`undefined`).
- **Side effects:** Writes `document.documentElement.dataset.theme` and dispatches a `themechange` CustomEvent containing the theme.

## Deep explanation

Sets the root `data-theme` attribute and emits the `themechange` event carrying the chosen theme. The concrete calls in this body are `dispatchEvent()`, `CustomEvent()`.

## Potential weak points

The event uses the ambient `CustomEvent` constructor and is dispatched on the injected document; embedding across unusual realms may require a matching constructor.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
