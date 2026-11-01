# compile

**Summary:** Compile source into ROM.

**Source:** `web/src/compiler/compiler.js` (line 10)

## Contract

- **Input:** `source`: CHIP Language text; `options`: optional module resolver and source filename passed to module loading.
- **Output:** Result object containing ROM, segments, symbols, BSS/section ranges, source map, and generated assembly.
- **Side effects:** Annotates program declarations with generated labels, appends backend records, and returns a new ROM/result object.

## Implementation

Coordinates parsing, semantic analysis, code emission, layout, assembly, ROM construction, and symbol/source metadata. The pipeline parses modules and analyzes the program before assigning function/data labels. It emits startup, function bodies, section records, and BSS zeroing, resolves addresses, serializes to assembly, invokes `asmToBin`, and copies segment bytes into a ROM based at `0x200`.

**Possible weak points**: The backend is the text assembler and the memory ceiling is `0x1000`; unsupported AST forms or layout overflow abort compilation with diagnostics.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
