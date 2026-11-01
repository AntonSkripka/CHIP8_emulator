# `useState` — genre filter

**Source:** `web/src/shop/components/App/App.jsx` · **Declaration:** `useState('all')` → `[filterGenre, setFilterGenre]`

## Essence

Stores the selected genre filter; `all` means no genre restriction.

## Contract

- **Input:** `'all'` before a genre button is selected. React also returns the matching setter.
- **Output:** Current value and setter; setter schedules a component render.
- **Side effects:** Registers this state slot; later calls to its setter schedule a React render.

## Deep explanation

Genre buttons store the exact genre label; the memoized filtered list compares that label against each game's normalized `genre`.

## Potential weak points

The selected genre must exactly match a catalogue genre string; no case/whitespace normalization is applied.

## Glossary

- **Filter:** A predicate limiting which records are displayed.
- **Derived data:** A value calculated from source state rather than stored separately.
