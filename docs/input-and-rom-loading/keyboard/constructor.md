# `constructor`

## Essence
Stores the key-state callback and prepares bound keyboard event handlers.

## Contract
- **Input:** `{ setKey, eventTarget = window }`.
- **Output:** A `KeyboardInput` instance.
- **Side effects:** Binds `handleKeyDown` and `handleKeyUp` to the instance.

## Internals
Stores the callback and event target; bound function references are retained for listener registration/removal.

## Potential weak points
The default `window` reference requires a browser environment. If `setKey` is not callable, the error occurs only when a mapped key event is handled.

## Glossary
- **Event target:** object that receives keyboard events.
