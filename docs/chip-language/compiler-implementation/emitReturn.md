# emitReturn

**Summary:** Emit function return.

**Source:** `web/src/compiler/compiler.js` (line 332)

## Contract

- **Input:** `fn`: current function record, including parameters, return type, and local metadata; `emitter`: code emitter that receives deferred instructions, data, and labels
- **Output:** No value; appends the function-exit sequence.
- **Side effects:** Appends generated instructions, labels, or data records to the supplied `CodeEmitter`.

## Implementation

Emits `LEAVE`, then jumps from `main` to `__EXIT` or returns from another function.

**Possible weak points:** The special exit sequence is selected only when `fn.name === 'main'`; all other names receive `LEAVE` followed by `RET`.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
