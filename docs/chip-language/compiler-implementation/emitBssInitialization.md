# emitBssInitialization

**Summary:** Generate BSS zeroing.

**Source:** `web/src/compiler/compiler.js` (line 257)

## Contract

- **Input:** `size`: number of bytes reserved or checked; `emitter`: code emitter that receives deferred instructions, data, and labels
- **Output:** No value; appends instructions that zero the requested byte range.
- **Side effects:** Appends generated instructions, labels, or data records to the supplied `CodeEmitter`.

## Implementation

Emits a zero-fill loop for the requested BSS byte count, splitting work into chunks of at most 255. The loop sets `I` to `__BSS_START`, keeps zero in `V0`, and processes at most `0xFF` bytes per counter. It stores through `[I]`, decrements `V1` by adding `0xFF`, and repeats until zero.

**Possible weak points:** The loop emits chunks of at most `255` bytes; a negative size is not validated here and would skip initialization.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
