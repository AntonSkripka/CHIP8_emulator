# encodeInstruction

**Summary:** Encode CHIP-8 instruction.

**Source:** `web/src/assembler/asm.js` (line 100)

## Contract

- **Input:** `statement`: parsed assembler statement; `labels`: uppercase label-to-address map used for branch/call targets.
- **Output:** One 16-bit CHIP-8 opcode; unknown mnemonic or invalid operands throw.
- **Side effects:** No shared state is changed; it reads operands and returns the encoded/converted value, or throws an assembler error.

## Implementation

Dispatches by mnemonic, validates operands, and returns a 16-bit CHIP-8 opcode or delegates `LD` to `encodeLoad`. Mnemonic dispatch handles control flow, arithmetic, shifts, graphics, key tests, and stack extensions. Operand count is checked per case; register/immediate/address helpers validate fields before bitwise packing. `LD` is delegated to `encodeLoad`.

**Possible weak points**: Operand interpretation is mnemonic-specific; skip/extension adjacency is checked by `asmToBin`, not by this encoder alone.

## Terms

A **statement** is one source line after comment removal, with tokens and address. A **label** names an address; an **opcode** is the encoded 16-bit instruction. A **segment** is a contiguous run of `{val, size}` byte items.
