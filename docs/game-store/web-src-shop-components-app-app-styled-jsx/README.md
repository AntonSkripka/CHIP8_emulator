# `web/src/shop/components/App/App.styled.jsx`

## Purpose

Styled layout, toolbar, genre controls, grid and status message components.

## Detailed flow

Exports Emotion components for the store root, toolbar, filter group/buttons, text labels, responsive game grid and status message. `genreButtonStyles` parameterizes active versus inactive appearance; `$active` and `$error` are transient style props. Visual values come from the provider theme, not hard-coded palette definitions.

## Function/component pages

- [`genreButtonStyles`](./functions/genrebuttonstyles.md)
- [`StoreRoot`](./functions/storeroot.md)
- [`StoreToolbar`](./functions/storetoolbar.md)
- [`GenreFilters`](./functions/genrefilters.md)
- [`GenreButton`](./functions/genrebutton.md)
- [`ResetButton`](./functions/resetbutton.md)
- [`StoreKicker`](./functions/storekicker.md)
- [`StoreDescription`](./functions/storedescription.md)
- [`GameGrid`](./functions/gamegrid.md)
- [`StoreMessage`](./functions/storemessage.md)

## Dependencies and exact paths

- **File:** `web/src/shop/components/App/App.styled.jsx`
- **Chapter:** [Game store](../README.md)
- **Direct dependencies/data:** Emotion `styled` and theme values from `ThemeProvider`.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
