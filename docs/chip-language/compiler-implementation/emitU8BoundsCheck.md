# emitU8BoundsCheck

**Summary:** Check byte index.

**Source:** `web/src/compiler/compiler.js` (line 458)

## Contract

- **Input:** `index`: array-index expression AST node; `size`: number of bytes reserved or checked; `emitter`: code emitter that receives deferred instructions, data, and labels
- **Output:** No value; appends a check for an 8-bit index against a fixed array size.
- **Side effects:** Appends generated instructions, labels, or data records to the supplied `CodeEmitter`.

## Implementation

Emits a comparison and `TRAP` path when an 8-bit index is outside the supplied array size.

**Possible weak points**: The index is one byte, so this check cannot address elements above index 255 even when an array is larger.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
