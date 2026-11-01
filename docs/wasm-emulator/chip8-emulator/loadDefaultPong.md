# `loadDefaultPong`

## Essence
Loads the built-in Pong ROM using the ordinary ROM-loading rules.

## Contract
- **Input:** None.
- **Output:** `undefined`; the method does not return the result of `loadRom`.
- **Side effects:** Resets the relevant ROM-loading state and writes the built-in ROM through `loadRom`.

## Internals
Calls `loadRom(DEFAULT_PONG_ROM)`. That call clears compiled-program tracking, un-stops execution, disables dev mode, applies the default quirks/tick rate, and writes the built-in bytes starting at `0x200`.

## Potential weak points
The method does not reset or clear core memory before writing; its state changes are exactly those performed by `loadRom`.

## Glossary
- **Built-in:** shipped directly with the application.
