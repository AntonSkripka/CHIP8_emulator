# `handleVisibilityChange`

## Essence
Requests disk synchronization when the document becomes hidden.

## Contract
- **Input:** None; this is a callback property.
- **Output:** No value is returned.
- **Side effects:** Calls `syncToDatabase()` only when `document.visibilityState === 'hidden'`.

## Internals
The constructor-created arrow function checks the injected document's visibility state and starts a sync for the hidden state; other states do nothing.

## Potential weak points
The asynchronous sync is not awaited. A transition to another visibility state does not request synchronization.

## Glossary
- **Visibility state:** browser-reported state describing whether the document is visible.
