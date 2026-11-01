# `preventDragDefaults`

## Essence
Stops the browser's default action and propagation for a drag event.

## Contract
- **Input:** Event object with `preventDefault` and `stopPropagation`.
- **Output:** None.
- **Side effects:** Calls both event methods.

## Internals
Calls `event.preventDefault()` and then `event.stopPropagation()`.

## Potential weak points
Both methods are invoked unconditionally; passing an object other than a browser drag event that implements them causes a throw.

## Glossary
- **Propagation:** an event continuing through parent elements.
