# emitArrayBase

**Summary:** Load array address.

**Source:** `web/src/compiler/compiler.js` (line 471)

## Contract

- **Input:** `binding`: semantic binding for a variable or array, including its storage metadata; `span`: source-coordinate object attached to the diagnostic; `emitter`: code emitter that receives deferred instructions, data, and labels
- **Output:** No value; appends code loading the array base address into `I`.
- **Side effects:** Appends generated instructions, labels, or data records to the supplied `CodeEmitter`.

## Implementation

Loads the base address of a static array or the address stored in an array parameter.

**Possible weak points:** The binding must be a resolved array parameter or static object; all other kinds fall through to its `label` field.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
