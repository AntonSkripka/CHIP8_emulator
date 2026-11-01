# `useState` — selected slug

**Source:** `web/src/shop/components/App/App.jsx` · **Declaration:** `useState(null)` → `[selectedSlug, setSelectedSlug]`

## Essence

Tracks the slug of the game whose details are open, or `null` when no game is selected.

## Contract

- **Input:** `null` until a game is selected. React also returns the matching setter.
- **Output:** Current value and setter; setter schedules a component render.
- **Side effects:** Registers this state slot; later calls to its setter schedule a React render.

## Deep explanation

The selected slug indexes `catalog.programs`; it remains set during the exit animation and is cleared by `finishClosingDetails`.

## Potential weak points

The slug is not independently validated; it is assumed to remain a key in the currently loaded catalogue.

## Glossary

- **Slug:** Stable key identifying a catalogue record.
- **Mounted:** Present in React's rendered tree.
