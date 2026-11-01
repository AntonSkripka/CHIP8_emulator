# CodeEmitter — label

**Summary:** Add a symbolic label.

**Source:** `web/src/compiler/compiler.js` (line 133)

## Contract

- **Input:** `name`: identifier or symbol name looked up in the current module or scope
- **Output:** No value; appends a label record.
- **Side effects:** Appends to `this.records`.

## Implementation

Appends a label record in assembler syntax.

**Possible weak points:** The label name is recorded verbatim; duplicate-name detection is left to layout or the assembler.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
