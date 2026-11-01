# `useState` — busy

**Source:** `web/src/shop/components/App/App.jsx` · **Declaration:** `useState(false)` → `[busy, setBusy]`

## Essence

Indicates that a save or run action is currently in progress.

## Contract

- **Input:** `false` until an async action is pending. React also returns the matching setter.
- **Output:** Current value and setter; setter schedules a component render.
- **Side effects:** Registers this state slot; later calls to its setter schedule a React render.

## Deep explanation

`performAction` sets true before awaiting and resets in `finally`; `GameDetails` consumes it to disable both action buttons.

## Potential weak points

One boolean serializes every action; it cannot represent independent concurrent save/load operations.

## Glossary

- **Promise:** A JavaScript object representing asynchronous completion.
- **Finally:** A block that runs after either fulfillment or rejection.
