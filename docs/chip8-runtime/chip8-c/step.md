# `step`

**Function essence:** Fetches, decodes, and executes one instruction.

Signature: `EMSCRIPTEN_KEEPALIVE void step()`

## Input / Output / Side-effects

- **Input:** No parameters; instruction bytes and CPU state are read from the global instance.
- **Output:** Returns no value; instruction execution changes machine state or records a fault, depending on the opcode and current state.
- **Side-effects:** Code path and state changes: Stops immediately if a fault is already present; otherwise reads a two-byte opcode, advances PC, handles development extensions and standard CHIP-8 cases, then routes project stack/math opcodes to their modules.

## Detailed explanation

Stops immediately if a fault is already present; otherwise reads a two-byte opcode, advances PC, handles development extensions and standard CHIP-8 cases, then routes project stack/math opcodes to their modules.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

Unknown standard opcodes generally fall through without a fault; load/store and I-related behavior follows configured quirk flags.
