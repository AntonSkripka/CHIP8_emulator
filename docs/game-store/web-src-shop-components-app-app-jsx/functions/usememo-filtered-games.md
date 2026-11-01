# `useMemo-filtered-games`

**Source:** `web/src/shop/components/App/App.jsx` · **Declaration:** `useMemo(() => filterByGenre(games, filterGenre), [games, filterGenre])`

## Essence

Returns all games for the all-filter or only games matching the selected genre.

## Contract

- **Input:** `games` and selected `filterGenre`.
- **Output:** All records for `all`, otherwise only exact genre matches.
- **Side effects:** Caches a derived value for the listed dependencies; its calculation does not mutate application state.

## Deep explanation

The `all` branch returns the original games array; otherwise a strict equality filter matches `game.genre` to `filterGenre`.

## Potential weak points

Filtering uses strict genre equality and does not normalize case or whitespace beyond the default `Other` value.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
