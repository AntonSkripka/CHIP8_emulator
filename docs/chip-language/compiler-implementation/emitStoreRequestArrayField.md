# emitStoreRequestArrayField

**Summary:** Store VFS request field.

**Source:** `web/src/compiler/compiler.js` (line 612)

## Contract

- **Input:** `offset`: current byte/code-unit offset or frame offset, depending on the helper; `binding`: semantic binding for a variable or array, including its storage metadata; `field`: VFS request-block field selector to write; `span`: source-coordinate object attached to the diagnostic; `emitter`: code emitter that receives deferred instructions, data, and labels
- **Output:** No value; appends code that writes one selected address/length field to the VFS request block.
- **Side effects:** Appends generated instructions, labels, or data records to the supplied `CodeEmitter`.

## Implementation

Stores an array address or size field at a specified offset within `__VFS_REQUEST`.

**Possible weak points:** The field selector must be one handled by the helper; an unknown selector does not produce a valid VFS request field.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
