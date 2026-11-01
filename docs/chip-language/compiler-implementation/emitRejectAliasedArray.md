# emitRejectAliasedArray

**Summary:** Reject aliased arrays.

**Source:** `web/src/compiler/compiler.js` (line 584)

## Contract

- **Input:** `first`: first array binding in an address comparison; `second`: second array binding in an address comparison; `invalidLabel`: generated label for the invalid-input branch; `emitter`: code emitter that receives deferred instructions, data, and labels; `span`: source-coordinate object attached to the diagnostic
- **Output:** No value; appends address comparisons and a branch to the invalid path for equal array addresses.
- **Side effects:** Appends generated instructions, labels, or data records to the supplied `CodeEmitter`.

## Implementation

Compares two array base addresses and branches to the invalid path if both bytes match.

**Possible weak points:** The generated comparison checks equality of the two start addresses, not arbitrary overlap between array ranges.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
