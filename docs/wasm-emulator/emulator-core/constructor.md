# `constructor`

## Essence
Stores the WebAssembly module and assembler and initializes cached memory pointers as unavailable.

## Contract
- **Input:** `module`, the Wasm module wrapper; `assemble`, an assembler function.
- **Output:** A `Chip8Core` instance.
- **Side effects:** None.

## Internals
Assigns both inputs and sets `vRegsPtr`, `displayPtr`, and `memoryPtr` to `null`; `init` later fills them.

## Potential weak points
The constructor accepts a module without checking exports; `init` then calls `_init` and three pointer exports, while `loadBin` calls the supplied `assemble` function. Missing members fail only when those methods run.

## Glossary
- **Export:** function or value made available by a module.
