# CHIP Language compiler

## Purpose

Parses CHIP Language modules, validates their meaning, emits CHIP-8 development-profile assembly, and assembles the final ROM image.

## Workflow

The public entry point `compile` loads the root source and imports, tokenizes and parses each compilation unit, then runs semantic checks across module exports, symbols, types, arrays, call sites, and recursion. It assigns labels and emits startup code, function bodies, data and BSS records; the emitter resolves addresses and sections with source-map entries and memory checks. The generated assembly is passed to `asmToBin`, and bytes are copied into a ROM array. The result also carries segments, symbol addresses, section ranges, BSS metadata, source mapping, and assembly text. `index.js` re-exports `compile`, `LanguageError`, and `tokenize` as the package surface.

## Related references

- [CHIP Language specification](../CHIP-LANGUAGE.md) and [function reference](../FUNCTIONS.md).
- The Russian originals are mirrored without edits in `docs-locale/CHIP-LANGUAGE.md` and `docs-locale/FUNCTIONS.md`.

## Source-file subchapters

- [`web/src/compiler/compiler.js`](./compiler-implementation/README.md)
- [`web/src/compiler/errors.js`](./errors/README.md)
- [`web/src/compiler/index.js`](./index/README.md)
- [`web/src/compiler/lexer.js`](./lexer/README.md)
- [`web/src/compiler/module_loader.js`](./module_loader/README.md)
- [`web/src/compiler/parser.js`](./parser/README.md)
- [`web/src/compiler/semantic.js`](./semantic/README.md)
- [`web/src/compiler/stdlib.js`](./stdlib/README.md)

## Terms

- **Assembler:** Converts mnemonic instructions and directives into machine bytes.
- **Compiler:** Translates a higher-level source program into the target image.
- **Segment:** A contiguous run of bytes with a start address.
- **Source map:** A relation between generated addresses and original source locations.
