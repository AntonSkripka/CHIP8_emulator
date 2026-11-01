# `detach`

## Essence
Stops listening for keyboard state changes.

## Contract
- **Input:** None.
- **Output:** None.
- **Side effects:** Removes the bound keydown and keyup handlers from `eventTarget`.

## Internals
Passes the same function references created in the constructor to `removeEventListener`.

## Potential weak points
`detach` removes listeners only from the instance's current `eventTarget`; it does not clear a pressed-key state by calling `setKey` for mapped keys.

## Glossary
- **Remove listener:** unregister a previously added event handler.
