# `constructor`

## Essence
Sets up the emulator coordinator and immediately prepares the default Pong display state.

## Contract
- **Input:** An object containing `core`, `display`, `monitor`, `memoryMap`, `scheduler`; optional `logger`, `moduleResolver`, `onRuntimeFault`, and `onProgramExit`.
- **Output:** A `Chip8Emulator` instance.
- **Side effects:** Calls `loadDefaultPong()` and `monitor.updateStackUI()`.

## Internals
Stores the collaborators and callbacks, sets `tickrate` to 20, marks execution as not stopped, and clears compiled-program tracking. Then it loads the default ROM and asks the monitor to refresh its stack UI.

## Potential weak points
Construction immediately calls `core.setQuirks`/`core.loadDataAt` through `loadDefaultPong`, then calls `monitor.updateStackUI`. Missing methods on those two collaborators therefore throw during construction; `display`, `memoryMap`, and `scheduler` are first used later.

## Glossary
- **Collaborator:** another object supplied to perform a related task.
- **Tick rate:** instruction pacing value used by `start`.
