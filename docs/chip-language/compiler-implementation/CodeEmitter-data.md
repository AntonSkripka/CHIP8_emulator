# CodeEmitter — data

**Summary:** Record initialized data.

**Source:** `web/src/compiler/compiler.js` (line 121)

## Contract

- **Input:** `label`: assembly label whose address is referenced; `values`: initializer values to store in the data record; `declaration`: data declaration and its section, size, and source span
- **Output:** No value; appends initialized-data values with their section and declaration.
- **Side effects:** Appends to `this.records`.

## Implementation

Appends an initialized-data record carrying its label, values, section, and declaration span.

**Possible weak points:** The declaration must provide a valid section and `values` entries with numeric `value` fields; this method stores them without checking.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
