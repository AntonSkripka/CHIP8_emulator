# getSegmentSize

**Summary:** Count segment bytes.

**Source:** `web/src/assembler/asm.js` (line 335)

## Contract

- **Input:** `seg`: segment whose byte items carry `size` widths
- **Output:** Total occupied bytes in the segment.
- **Side effects:** Reads segment items only.

## Implementation

Sums byte widths in a segment to determine its occupied span.

**Possible weak points:** Each `size` is trusted and summed as-is; malformed or negative widths are not rejected here.

## Terms

A **statement** is one source line after comment removal, with tokens and address. A **label** names an address; an **opcode** is the encoded 16-bit instruction. A **segment** is a contiguous run of `{val, size}` byte items.
