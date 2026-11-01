# emitCopyVfsResult

**Summary:** Copy VFS result.

**Source:** `web/src/compiler/compiler.js` (line 633)

## Contract

- **Input:** `binding`: semantic binding for a variable or array, including its storage metadata; `span`: source-coordinate object attached to the diagnostic; `emitter`: code emitter that receives deferred instructions, data, and labels
- **Output:** No value; appends code copying the four-byte VFS result into the destination array and restores status in `V0`.
- **Side effects:** Appends generated instructions, labels, or data records to the supplied `CodeEmitter`.

## Implementation

Reads four result bytes from the request block into the destination array while preserving the status in V0.

**Possible weak points**: Copies exactly four result bytes; callers must provide an output array that semantic analysis/runtime guards have established is large enough.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
