# CodeEmitter — newLabel

**Summary:** Create unique label.

**Source:** `web/src/compiler/compiler.js` (line 137)

## Contract

- **Input:** None; increments the instance counter to make a unique generated label.
- **Output:** Unique label string in the form `__L_n`.
- **Side effects:** Increments `this.labelCounter`.

## Implementation

Returns a unique `__L_n` label and increments the counter.

**Possible weak points:** Generated names use a monotonic counter but are not checked against user-supplied symbol names.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
