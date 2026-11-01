# emitArrayReferenceArgument

**Summary:** Push array reference.

**Source:** `web/src/compiler/compiler.js` (line 479)

## Contract

- **Input:** `binding`: semantic binding for a variable or array, including its storage metadata; `span`: source-coordinate object attached to the diagnostic; `emitter`: code emitter that receives deferred instructions, data, and labels
- **Output:** No value; pushes an array address and its two-byte length representation.
- **Side effects:** Appends generated instructions, labels, or data records to the supplied `CodeEmitter`.

## Implementation

Pushes the address and two-byte length representation for an array argument according to its binding.

**Possible weak points**: The ABI representation is a 16-bit address plus 16-bit length; actual stack safety is enforced by runtime frame instructions.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
