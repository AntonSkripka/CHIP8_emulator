# emitExpression

**Summary:** Emit one expression.

**Source:** `web/src/compiler/compiler.js` (line 342)

## Contract

- **Input:** `expression`: analyzed expression node; `fn`: containing function metadata; `emitter`: output record sink; `functionLabels`: resolved user-function labels.
- **Output:** No value; appends assembly that leaves the expression result in `V0`, or throws `LANG009`.
- **Side effects:** Appends generated instructions, labels, or data records to the supplied `CodeEmitter`.

## Implementation

Emits literals, local loads, array access, assignments, calls, unary operations, and binary operations according to expression kind. Literal values load into `V0`; local identifiers use `LDX`; array reads calculate/check an address through `I`; assignments store to locals or array elements. User calls push arguments, call the assigned label, and pop argument bytes; built-ins use `emitVfsCall`.

**Possible weak points:** Each expression kind must carry the semantic fields it uses (`binding`, `function`, or array metadata); unknown kinds throw `LANG009`.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
