# `reset`

## Essence
Returns the core, emulator bookkeeping, monitor, and display to their reset state.

## Contract
- **Input:** None.
- **Output:** None.
- **Side effects:** Calls `core.init()`, clears stop/compiled-program state, restores tick rate 20, and resets the monitor and display.

## Internals
Initializes the core first, then resets the coordinator's flags and tick rate, followed by `monitor.reset()` and `display.clear()`.

## Potential weak points
The calls are sequential and not caught: if `core.init()` throws, the flags, monitor, and display are not reset; if `monitor.reset()` throws, `display.clear()` is skipped. `reset` does not reload a ROM after initializing the core.

## Glossary
- **Initialize:** place a component into its initial operating state.
