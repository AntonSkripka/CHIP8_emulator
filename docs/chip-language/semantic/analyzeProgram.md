# analyzeProgram

**Summary:** Analyze complete program.

**Source:** `web/src/compiler/semantic.js` (line 9)

## Contract

- **Input:** `program`: combined module AST with root unit and module/import maps.
- **Output:** Object containing validated `main` and the exported symbol map.
- **Side effects:** Annotates declarations/functions with module, symbol, binding, offset, call-site, and type metadata; semantic violations throw.

## Implementation

Builds symbol/export maps, checks program-wide constraints and each function, rejects recursion, and returns main/export information. It first creates per-module function/data maps, detects duplicates/reserved identifiers, validates data sizes/initializers and exports, then checks imports and root `main`. For each function it resolves visible symbols, assigns parameter offsets and metadata, analyzes the body, checks return coverage, and finally rejects call-graph cycles.

**Possible weak points**: Requires root `fn u8 main()` with no parameters, rejects recursion, and caps function argument storage at 126 stack bytes.

## Terms

A **binding** connects an identifier use to its declaration. A **scope** is the set of names visible in a block. **Type annotation** records the verified value type on an AST node.
