# `updateTimers`

## Essence
Advances the CHIP-8 timers through the Wasm core.

## Contract
- **Input:** None.
- **Output:** None.
- **Side effects:** Calls `module._update_timers()`.

## Internals
Calls the module's `_update_timers()` export once per invocation.

## Potential weak points
The method neither checks that `_update_timers` exists nor catches an exception from it.

## Glossary
- **Timer:** a machine value updated over time, commonly used for CHIP-8 delays.
