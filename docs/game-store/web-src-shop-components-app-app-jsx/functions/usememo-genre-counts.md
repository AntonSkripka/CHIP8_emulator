# `useMemo-genre-counts`

**Source:** `web/src/shop/components/App/App.jsx` · **Declaration:** `useMemo(() => countByGenre(games), [games])`

## Essence

Counts the number of derived games in each genre.

## Contract

- **Input:** The memoized `games` array.
- **Output:** An object mapping each genre to its count.
- **Side effects:** Caches a derived value for the listed dependencies; its calculation does not mutate application state.

## Deep explanation

A reducer increments `counts[game.genre]`; the result is computed from all games, not the filtered subset.

## Potential weak points

Genre values are counted exactly as normalized by the game mapping; case or whitespace differences remain separate categories.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
