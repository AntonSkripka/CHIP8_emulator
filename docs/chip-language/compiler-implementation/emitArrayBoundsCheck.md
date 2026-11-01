# emitArrayBoundsCheck

**Summary:** Check array index.

**Source:** `web/src/compiler/compiler.js` (line 427)

## Contract

- **Input:** `index`: array-index expression AST node; `target`: array binding whose bounds or address are used by the generated check; `emitter`: code emitter that receives deferred instructions, data, and labels
- **Output:** No value; appends any required static/runtime check and `TRAP` path.
- **Side effects:** Appends generated instructions, labels, or data records to the supplied `CodeEmitter`.

## Implementation

Uses the static object size or runtime parameter length to emit a bounds check; large static arrays and literal indices skip the dynamic check.

**Possible weak points**: Static arrays larger than `0xFF` and literal indexes skip the emitted dynamic check; constant invalid indexes must already have been rejected by semantic analysis.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
