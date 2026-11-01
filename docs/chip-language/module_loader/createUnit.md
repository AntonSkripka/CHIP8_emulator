# createUnit

**Summary:** Parse one source unit.

**Source:** `web/src/compiler/module_loader.js` (line 33)

## Contract

- **Input:** `source`: CHIP Language source text to tokenize or compile; `moduleName`: module identifier used to qualify imported symbols; `fileName`: optional filename copied into token source spans
- **Output:** Unit record containing parsed Program, module/file names, and an empty imports map.
- **Side effects:** Creates a parsed unit object with a fresh imports map; it does not change module state.

## Implementation

Tokenizes and parses one source file and packages its program with module/file identity and an empty import map.

**Possible weak points:** External module access depends on the resolver callback and the 17-byte virtual-disk filename limit; loading fails rather than recovering from missing, cyclic, or invalid UTF-8 modules.

## Terms

A **unit** is one parsed module source and its import map. A **resolver** maps a virtual-disk filename to source bytes/text. An **active import chain** detects cycles during depth-first loading.
