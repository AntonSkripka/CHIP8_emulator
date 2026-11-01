# emitVfsCall

**Summary:** Build VFS request.

**Source:** `web/src/compiler/compiler.js` (line 498)

## Contract

- **Input:** `expression`: semantically resolved builtin call with its function and argument bindings; `emitter`: target for generated request/call instructions.
- **Output:** No value; appends request validation, request-block writes, the `SYS` operation, and result handling.
- **Side effects:** Appends generated instructions, labels, or data records to the supplied `CodeEmitter`.

## Implementation

Builds a VFS request block, validates lengths and incompatible aliases, performs `SYS`, and copies optional result bytes back. The builtin operation and its parameter bindings determine generated validation and request fields. The emitter checks required array lengths and forbidden aliasing, writes filename/buffer addresses and capacities, sets `I` to `__VFS_REQUEST`, emits `SYS`, and copies output bytes when that builtin declares a result parameter.

**Possible weak points**: The request ABI has an 11-byte block and built-in-specific argument layouts; runtime syscall validation remains necessary even after generated checks.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
