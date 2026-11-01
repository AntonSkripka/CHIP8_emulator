# `handleBeforeUnload`

## Essence
Requests synchronization when the browser is about to leave the page.

## Contract
- **Input:** None; this is a callback property.
- **Output:** The result of `syncToDatabase()` is not returned because the arrow body does not return it.
- **Side effects:** Starts an asynchronous database sync.

## Internals
The constructor assigns an arrow function that invokes `this.syncToDatabase()`, preserving the instance as `this`.

## Potential weak points
The caller does not await the returned sync Promise, and the callback does not return it; page shutdown may happen before the save completes.

## Glossary
- **Unload:** browser lifecycle event for leaving a page.
