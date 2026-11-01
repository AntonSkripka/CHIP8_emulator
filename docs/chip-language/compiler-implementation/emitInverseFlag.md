# emitInverseFlag

**Summary:** Invert condition flag.

**Source:** `web/src/compiler/compiler.js` (line 730)

## Contract

- **Input:** `expression`: expression AST node being checked or compiled; `emitter`: code emitter that receives deferred instructions, data, and labels
- **Output:** No value; appends instructions that invert the `VF` comparison result into `V0`.
- **Side effects:** Appends generated instructions, labels, or data records to the supplied `CodeEmitter`.

## Implementation

Converts the emulator carry/borrow flag in `VF` into its logical inverse in `V0`.

**Possible weak points:** The emitted sequence assumes the comparison flag is already in `VF` and normalizes the inverse result into `V0`.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
