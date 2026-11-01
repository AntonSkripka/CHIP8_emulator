# `useState` — catalogue

**Source:** `web/src/shop/components/App/App.jsx` · **Declaration:** `useState(null)` → `[catalog, setCatalog]`

## Essence

Holds the fetched catalogue data, starting as `null` while loading.

## Contract

- **Input:** `null` before catalogue load. React also returns the matching setter.
- **Output:** Current value and setter; setter schedules a component render.
- **Side effects:** Registers this state slot; later calls to its setter schedule a React render.

## Deep explanation

`catalog` begins as null; the loader effect sets it only while active, and derived game/genre lists are memoized from it.

## Potential weak points

Until metadata resolves, `catalog` remains null and the component must keep its loading branch.

## Glossary

- **State:** A value React retains between renders.
- **Setter:** The function returned by `useState` that schedules state replacement.
