# `resolve_frame_address`

**Function essence:** Translates a signed frame offset to a stack index.

Signature: `static int resolve_frame_address(int8_t offset)`

## Input / Output / Side-effects

- **Input:** A signed 8-bit offset relative to the current frame pointer.
- **Output:** Returns a stack index on success; returns -1 and records a stack fault when frame/offset checks fail.
- **Side-effects:** Code path and state changes: Rejects absent/invalid frame state and offsets -2 through 0, then checks the computed index against zero, current depth, and capacity; returns -1 on failure.

## Detailed explanation

Rejects absent/invalid frame state and offsets -2 through 0, then checks the computed index against zero, current depth, and capacity; returns -1 on failure.

## Terminology

- **Depth:** The number of occupied bytes in the separate data stack.
- **Frame pointer:** The index used as the base for a stack frame.
- **Stack fault:** A stored overflow, underflow, or frame error code.

## Potential weak points

Offsets address stack bytes relative to the frame pointer; reserved header slots are intentionally inaccessible.
