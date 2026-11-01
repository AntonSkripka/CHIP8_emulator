# `useMemo-sorted-games`

**Source:** `web/src/shop/components/App/App.jsx` · **Declaration:** `useMemo(() => sort(Object.entries(catalog.programs)), [catalog])`

## Essence

Derives a title-sorted list from program records and supplies the slug and default genre.

## Contract

- **Input:** `catalog` (or null before load).
- **Output:** Title-sorted records with slug and default genre `Other`.
- **Side effects:** Caches a derived value for the listed dependencies; its calculation does not mutate application state.

## Deep explanation

It iterates `Object.entries(catalog.programs)`, attaches each slug and defaults absent genre to `Other`, then sorts by `title.localeCompare`.

## Potential weak points

It assumes each catalogue record has a string `title`; `localeCompare` will fail if a record omits or corrupts that field.

## Glossary

- **DOM:** The browser's in-memory representation of HTML.
- **Callback:** A function supplied for another part of the program to invoke.
- **State:** Values retained between calls or renders.
