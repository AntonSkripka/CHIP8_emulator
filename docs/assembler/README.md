# Assembler

## Purpose

Turns CHIP-8 assembly text into addressable byte segments and provides HTML-safe syntax highlighting.

## Workflow

`asmToBin` first validates the source type, strips comments, records labels and statement addresses in a first pass, and resolves `ORG`, data sizes, instruction sizes, and memory bounds. It then rejects CHIP-8 skip instructions immediately before a four-byte `chip8-dev` instruction, encodes statements after labels are known, detects overlapping addresses, and groups contiguous bytes into segments. `highlightCode` escapes HTML before wrapping recognized opcodes and registers in spans.

## Related references

- [CHIP Language specification](../CHIP-LANGUAGE.md) and [function reference](../FUNCTIONS.md).
- The Russian originals are mirrored without edits in `docs-locale/CHIP-LANGUAGE.md` and `docs-locale/FUNCTIONS.md`.

## Source-file subchapters

- [`web/src/assembler/asm.js`](./asm/README.md)

## Terms

- **Assembler:** Converts mnemonic instructions and directives into machine bytes.
- **Compiler:** Translates a higher-level source program into the target image.
- **Segment:** A contiguous run of bytes with a start address.
- **Source map:** A relation between generated addresses and original source locations.
