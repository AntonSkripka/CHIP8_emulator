# `start`

## Essence
Starts a recurring frame loop that advances the emulator and refreshes its visible/debug state.

## Contract
- **Input:** None.
- **Output:** None; schedules callbacks through the injected scheduler.
- **Side effects:** Executes core instructions and timers, may report faults or program exit, updates monitor/display/memory map, and continuously requests frames.

## Internals
Reads scheduler time for instruction and timer clocks. Each frame derives an instruction interval from `tickrate`; if the instruction clock is over 100 ms behind, it is reset close to the current timestamp. A loop steps the core while elapsed time covers an interval and execution is not stopped. It checks the fault code after each step, logs a mapped message (or an unknown-fault message), finds a source position, invokes the optional fault callback, and stops on a fault. Otherwise, when the new PC equals the compiled program's `__exit` symbol, it stops and calls the optional exit callback with V0 or `null`. It refreshes stack UI after each instruction. A separate loop updates timers at 60 Hz. Finally it renders, updates debug UI, draws the memory map, and schedules the next frame.

## Potential weak points
Every call schedules an independent frame loop; `start` has no already-running guard. Exceptions from `core.step`, UI collaborators, or the optional callbacks are not caught and can prevent scheduling the next frame. In the runtime-fault branch the callback runs before `executionStopped` is set, so a throwing callback also skips that assignment. The timer loop still runs in later frames after execution is stopped.

## Glossary
- **Frame:** one scheduled browser rendering callback.
- **PC:** program counter, the address of the next instruction.
- **V0:** the first CHIP-8 general-purpose register.
- **60 Hz:** sixty updates per second.
