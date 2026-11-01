# CodeEmitter — constructor

**Summary:** Initialize code emitter.

**Source:** `web/src/compiler/compiler.js` (line 112)

## Contract

- **Input:** None; initializes an empty record list and a zero label counter.
- **Output:** No value; initializes an empty record list and a zeroed generated-label counter.
- **Side effects:** Initializes `records` and `labelCounter` on the instance.

## Implementation

Initializes an empty ordered record list and starts generated labels at zero.

**Possible weak points:** The emitter always begins with an empty record list and a zero label counter; the base address is fixed by the module constant.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
