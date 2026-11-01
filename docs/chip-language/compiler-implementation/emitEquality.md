# emitEquality

**Summary:** Emit equality check.

**Source:** `web/src/compiler/compiler.js` (line 736)

## Contract

- **Input:** `operator`: binary or unary operator spelling to parse or emit; `expression`: expression AST node being checked or compiled; `emitter`: code emitter that receives deferred instructions, data, and labels
- **Output:** No value; appends equality/inequality comparison code and a normalized boolean in `V0`.
- **Side effects:** Appends generated instructions, labels, or data records to the supplied `CodeEmitter`.

## Implementation

Emits an equality or inequality comparison and normalizes its result to a boolean value.

**Possible weak points:** The helper emits comparisons for the supported equality operators and assumes operand values are already in the expected registers.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
