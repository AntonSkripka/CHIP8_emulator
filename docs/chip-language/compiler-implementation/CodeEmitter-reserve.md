# CodeEmitter — reserve

**Summary:** Reserve BSS storage.

**Source:** `web/src/compiler/compiler.js` (line 129)

## Contract

- **Input:** `label`: assembly label whose address is referenced; `size`: number of bytes reserved or checked; `declaration`: data declaration and its section, size, and source span
- **Output:** No value; appends a BSS reservation with its size and declaration.
- **Side effects:** Appends to `this.records`.

## Implementation

Appends a BSS reservation record with label, size, and declaration metadata.

**Possible weak points:** The reservation size is stored without validation; `resolveLayout` enforces the CHIP-8 memory ceiling later.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
