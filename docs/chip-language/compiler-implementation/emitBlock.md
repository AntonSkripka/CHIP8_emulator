# emitBlock

**Summary:** Emit block statements.

**Source:** `web/src/compiler/compiler.js` (line 275)

## Contract

- **Input:** `block`: block AST node whose statements are analyzed or emitted; `fn`: current function record, including parameters, return type, and local metadata; `emitter`: code emitter that receives deferred instructions, data, and labels; `functionLabels`: map from function symbols to generated assembly labels
- **Output:** No value; appends code for the block’s statements in source order.
- **Side effects:** Appends generated instructions, labels, or data records to the supplied `CodeEmitter`.

## Implementation

Emits statements in a block sequentially by delegating each one to `emitStatement`.

**Possible weak points:** The block must contain a `statements` array and each member must be a supported statement node.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
