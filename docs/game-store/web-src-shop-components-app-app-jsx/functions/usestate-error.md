# `useState` — error

**Source:** `web/src/shop/components/App/App.jsx` · **Declaration:** `useState('')` → `[error, setError]`

## Essence

Stores the current catalogue or game-action error message.

## Contract

- **Input:** An empty string until a load/action fails. React also returns the matching setter.
- **Output:** Current value and setter; setter schedules a component render.
- **Side effects:** Registers this state slot; later calls to its setter schedule a React render.

## Deep explanation

The catalogue effect and `performAction` set the message; selection/close clears stale errors. The JSX places it in an alert role.

## Potential weak points

The state stores one message string, so simultaneous catalogue and action errors cannot be represented separately.

## Glossary

- **Fallback:** A replacement value used when a more specific value is absent.
- **Alert:** An accessible message announced as an error.
