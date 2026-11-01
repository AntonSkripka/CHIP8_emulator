# `web/src/assembler/asm.js`

## Purpose

Validates assembly statements and encodes core and extended instructions; highlights assembly text safely.

## Workflow

The assembler uses small validators (`parseNumber`, `parseRegister`, `requireNumber`, and related helpers) so instruction encoders share the same range and diagnostic rules. `asmToBin` performs address assignment before encoding, which lets forward label references resolve. Core opcodes and the `chip8-dev` extension are handled by separate encoders. The highlighter first escapes `&`, `<`, and `>` to keep source text from becoming markup.

## Function and method pages

- [AssemblerError — constructor](./AssemblerError-constructor.md)
- [asmToBin](./asmToBin.md)
- [encodeExtendedInstruction](./encodeExtendedInstruction.md)
- [encodeExtendedInstruction — immediate](./encodeExtendedInstruction-immediate.md)
- [encodeInstruction](./encodeInstruction.md)
- [encodeInstruction — byte](./encodeInstruction-byte.md)
- [encodeInstruction — pair](./encodeInstruction-pair.md)
- [encodeInstruction — reg](./encodeInstruction-reg.md)
- [encodeLoad](./encodeLoad.md)
- [escapeHtml](./escapeHtml.md)
- [expectArgumentCount](./expectArgumentCount.md)
- [fail](./fail.md)
- [getSegmentSize](./getSegmentSize.md)
- [highlightCode](./highlightCode.md)
- [parseNumber](./parseNumber.md)
- [parseRegister](./parseRegister.md)
- [requireNumber](./requireNumber.md)
- [requireRegister](./requireRegister.md)
- [resolveAddress](./resolveAddress.md)
- [tokenize](./tokenize.md)

## Terms

- **Token:** A classified unit of source text.
- **AST:** The tree produced by parsing source code.
- **Span:** A source coordinate carried through diagnostics and code generation.
