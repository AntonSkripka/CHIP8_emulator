# `set_memory_readonly_range`

**Function essence:** Configures or clears a read-only memory interval.

Signature: `EMSCRIPTEN_KEEPALIVE int set_memory_readonly_range(uint16_t start, uint16_t size)`

## Input / Output / Side-effects

- **Input:** A start address and byte count; a zero count requests clearing the configured range.
- **Output:** Returns 1 when clearing or setting succeeds; returns 0 for an invalid nonempty range.
- **Side-effects:** Code path and state changes: Size zero clears the interval. Otherwise it accepts a range wholly within memory and enables it; this helper does not itself require development mode.

## Detailed explanation

Size zero clears the interval. Otherwise it accepts a range wholly within memory and enables it; this helper does not itself require development mode.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

An invalid range returns failure without replacing the previous valid range.
