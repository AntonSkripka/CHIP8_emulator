# `step`

## Essence
Asks the Wasm core to execute one instruction step.

## Contract
- **Input:** None.
- **Output:** None.
- **Side effects:** Calls `module._step()`, which advances the emulated machine.

## Internals
Directly forwards to the module export; fault inspection is performed separately.

## Potential weak points
If `_step` is missing or throws, the exception propagates; this wrapper does not read the execution-fault code after the instruction.

## Glossary
- **Instruction step:** one execution action performed by the emulator.
