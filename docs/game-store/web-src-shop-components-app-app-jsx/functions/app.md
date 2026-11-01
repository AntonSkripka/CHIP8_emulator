# `App`

**Source:** `web/src/shop/components/App/App.jsx` · **Declaration:** `App({ bridge })`

## Essence

Loads catalogue state, derives sorted/filterable game data, manages details-dialog lifecycle, and dispatches save/run actions through the bridge.

## Contract

- **Input:** Props `{ bridge }`.
- **Output:** A React element tree for the store toolbar, genre controls, loading/error state, game grid and optional selected-game dialog.
- **Side effects:** Registers/removes DOM or window listeners. Updates React state. Performs asynchronous fetch/data loading. Changes page scroll or root overflow. Logs an error or warning through the supplied logger/console.

## Deep explanation

`App` receives `bridge`. It owns six states (catalog, selected slug, closing, error, busy, genre) and memoizes sorted games, genre counts, sorted genres and filtered games. Its effects load the catalogue, lock scroll and listen for Escape; JSX conditionally renders the dialog only when a selected game resolves.

## Potential weak points

The catalogue endpoint is only shallowly validated by the bridge, so records with missing title/genre/options can still reach sorting, filtering or detail rendering.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
