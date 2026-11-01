# `useMemo-sorted-genres`

**Source:** `web/src/shop/components/App/App.jsx` · **Declaration:** `useMemo(() => sort(Object.entries(genreCounts)), [genreCounts])`

## Essence

Sorts genre/count pairs for stable filter-button rendering.

## Contract

- **Input:** The memoized `genreCounts` object.
- **Output:** Locale-sorted `[genre, count]` entries.
- **Side effects:** Caches a derived value for the listed dependencies; its calculation does not mutate application state.

## Deep explanation

It converts genre counts to entries and locale-sorts by the genre key before mapping filter buttons.

## Potential weak points

Locale ordering can vary with runtime locale; it changes presentation order, not catalogue identity.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
