# CodeEmitter — addressByte

**Summary:** Record address relocation.

**Source:** `web/src/compiler/compiler.js` (line 125)

## Contract

- **Input:** `label`: assembly label whose address is referenced; `part`: requested `high` or `low` byte of an address; `span`: source-coordinate object attached to the diagnostic
- **Output:** No value; appends a high/low address-byte relocation record.
- **Side effects:** Appends to `this.records`.

## Implementation

Appends a record requesting one byte of a label address, tagged by high/low part.

**Possible weak points:** `toAssembly` expects the label to exist in the resolved symbol map and treats every part other than `high` as `low`.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
