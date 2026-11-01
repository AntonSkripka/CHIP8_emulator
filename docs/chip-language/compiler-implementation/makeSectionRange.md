# makeSectionRange

**Summary:** Measure section range.

**Source:** `web/src/compiler/compiler.js` (line 250)

## Contract

- **Input:** `range`: section range containing its start and end addresses
- **Output:** `{ start, size }`; an absent range has `start: null` and `size: 0`.
- **Side effects:** Reads the section bounds and returns a new range object; it changes no shared state.

## Implementation

Converts nullable start/end addresses to `{start, size}`; an absent range has size zero.

**Possible weak points:** An absent section is represented only by `start: null, size: 0`; a non-null start requires a valid end address.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
