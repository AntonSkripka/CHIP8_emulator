# `getDisplayPtr`

## Essence
Returns the cached address of the display buffer.

## Contract
- **Input:** None.
- **Output:** `displayPtr`, set by `init` (or `null` before initialization).
- **Side effects:** None.

## Internals
Returns the stored pointer without re-querying the module.

## Potential weak points
Before the first `init` call this accessor returns `null`; it does not initialize the core or obtain a pointer itself.

## Glossary
- **Display buffer:** memory containing the emulator's screen pixels.
