# encodeLoad

**Summary:** Encode load instruction.

**Source:** `web/src/assembler/asm.js` (line 210)

## Contract

- **Input:** `statement`: assembler statement for diagnostics; `args`: the two `LD` operands; `labels`: address map for `LD I, label`.
- **Output:** One 16-bit `LD` opcode for the selected load form.
- **Side effects:** No shared state is changed; it reads operands and returns the encoded/converted value, or throws an assembler error.

## Implementation

Distinguishes I, timer, key, memory, register, and immediate load forms and assembles the corresponding opcode. The destination/source pair is uppercased for form matching. Special destinations `I`, `DT`, `ST`, `F`, `B`, and `[I]` are handled before register destinations; remaining source forms distinguish timer, key, memory, register, and byte immediate.

**Possible weak points:** Only the explicit `LD` operand shapes in its switch are supported; any other destination/source combination raises an assembler error.

## Terms

A **statement** is one source line after comment removal, with tokens and address. A **label** names an address; an **opcode** is the encoded 16-bit instruction. A **segment** is a contiguous run of `{val, size}` byte items.
