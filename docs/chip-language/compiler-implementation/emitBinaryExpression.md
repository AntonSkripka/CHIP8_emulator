# emitBinaryExpression

**Summary:** Emit binary operation.

**Source:** `web/src/compiler/compiler.js` (line 651)

## Contract

- **Input:** `expression`: expression AST node being checked or compiled; `fn`: current function record, including parameters, return type, and local metadata; `emitter`: code emitter that receives deferred instructions, data, and labels; `functionLabels`: map from function symbols to generated assembly labels
- **Output:** No value; appends code implementing the operator and leaving its result in `V0`.
- **Side effects:** Appends generated instructions, labels, or data records to the supplied `CodeEmitter`.

## Implementation

Implements short-circuit boolean operators first, then emits both operands and maps arithmetic/comparison operators to instructions. `&&` and `||` emit conditional jumps so the right operand is skipped when the left value decides the result. Other operators evaluate left, push it, evaluate right, pop the left value into `V1`, then emit the operator-specific arithmetic/flag sequence.

**Possible weak points:** Only operators handled by the switch produce code; semantic analysis must reject unsupported operators/types before this stage.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
