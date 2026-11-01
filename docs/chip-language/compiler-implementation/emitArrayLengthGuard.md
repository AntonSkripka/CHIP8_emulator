# emitArrayLengthGuard

**Summary:** Check array length.

**Source:** `web/src/compiler/compiler.js` (line 557)

## Contract

- **Input:** `binding`: semantic binding for a variable or array, including its storage metadata; `parameter`: built-in parameter descriptor with array and length constraints; `invalidLabel`: generated label for the invalid-input branch; `emitter`: code emitter that receives deferred instructions, data, and labels; `span`: source-coordinate object attached to the diagnostic
- **Output:** No value; appends a runtime min/max length check when the binding is an array parameter.
- **Side effects:** Appends generated instructions, labels, or data records to the supplied `CodeEmitter`.

## Implementation

Emits runtime checks against a built-in array parameter’s maximum or minimum length.

**Possible weak points:** The runtime check is emitted only for `arrayParameter` bindings; static arrays are not checked by this helper.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
