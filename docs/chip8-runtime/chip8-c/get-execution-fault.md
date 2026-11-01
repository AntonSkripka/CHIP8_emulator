# `get_execution_fault`

**Function essence:** Returns the active stack or runtime fault.

Signature: `EMSCRIPTEN_KEEPALIVE int get_execution_fault()`

## Input / Output / Side-effects

- **Input:** No parameters; reads the stack module's fault and then the runtime fault.
- **Output:** Returns the data-stack fault when nonzero; otherwise returns the runtime Chip8Fault value.
- **Side-effects:** Code path and state changes: Queries the data-stack fault first and returns it when nonzero; otherwise returns the instance execution fault.

## Detailed explanation

Queries the data-stack fault first and returns it when nonzero; otherwise returns the instance execution fault.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

A persistent stack fault takes precedence and is not cleared here.
