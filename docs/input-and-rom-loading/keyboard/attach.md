# `attach`

## Essence
Begins listening for key-down and key-up events.

## Contract
- **Input:** None.
- **Output:** None.
- **Side effects:** Registers the bound handlers on `eventTarget`.

## Internals
Adds `keydown` and `keyup` listeners.

## Potential weak points
The handlers receive every matching event delivered to `eventTarget`, including key events while focus is in another control when the default `window` target is used.

## Glossary
- **Key-down/up:** browser events for pressing and releasing a key.
