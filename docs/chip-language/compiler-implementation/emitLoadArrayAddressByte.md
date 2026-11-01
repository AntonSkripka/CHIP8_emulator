# emitLoadArrayAddressByte

**Summary:** Load address byte.

**Source:** `web/src/compiler/compiler.js` (line 601)

## Contract

- **Input:** `binding`: semantic binding for a variable or array, including its storage metadata; `part`: requested `high` or `low` byte of an address; `register`: register number or register token being checked; `span`: source-coordinate object attached to the diagnostic; `emitter`: code emitter that receives deferred instructions, data, and labels
- **Output:** No value; appends code/relocation that loads the selected high or low address byte into a register.
- **Side effects:** Appends generated instructions, labels, or data records to the supplied `CodeEmitter`.

## Implementation

Loads a high or low address byte from a parameter slot, or emits an address-byte relocation for static data.

**Possible weak points:** Address-byte selection uses the supported `high`/`low` cases; bindings must already contain the static label or parameter offset.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
