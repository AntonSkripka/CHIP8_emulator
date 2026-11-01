# emitArrayAssignment

**Summary:** Store array element.

**Source:** `web/src/compiler/compiler.js` (line 412)

## Contract

- **Input:** `expression`: expression AST node being checked or compiled; `fn`: current function record, including parameters, return type, and local metadata; `emitter`: code emitter that receives deferred instructions, data, and labels; `functionLabels`: map from function symbols to generated assembly labels
- **Output:** No value; appends code to store the right-hand byte into the indexed array element.
- **Side effects:** Appends generated instructions, labels, or data records to the supplied `CodeEmitter`.

## Implementation

Preserves the index and assigned value on the stack, checks the index, computes the base-plus-index address, and stores the value.

**Possible weak points:** The left side must be an indexed array expression with a resolved binding; scalar assignments use a different path.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
