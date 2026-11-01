# CodeEmitter — instruction

**Summary:** Record instruction text.

**Source:** `web/src/compiler/compiler.js` (line 117)

## Contract

- **Input:** `text`: input text to escape, highlight, or emit; `span`: source-coordinate object attached to the diagnostic
- **Output:** No value; appends an instruction record.
- **Side effects:** Appends to `this.records`.

## Implementation

Appends an instruction record with its text and source span.

**Possible weak points:** Instruction text and source span are stored without validation; syntax and size are checked by later layout/assembly steps.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
