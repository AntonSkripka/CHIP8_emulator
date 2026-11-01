# loadImports

**Summary:** Resolve imports recursively.

**Source:** `web/src/compiler/module_loader.js` (line 43)

## Contract

- **Input:** `unit`: parsed module and imports; `activeModules`: current recursion path; `modules`: shared module cache; `resolveModule`: callback for imported source.
- **Output:** No value; fills unit/module maps or throws a module-related `LanguageError`.
- **Side effects:** Mutates unit import/module maps and recursively loads dependencies; may throw.

## Implementation

Merges import clauses, skips built-ins, detects active recursion, resolves module source, and recursively loads dependencies. Repeated import clauses are merged per module into either `all` or a set of names. Built-ins bypass file resolution; other modules resolve as `<module>.chip`, are strictly decoded, parsed, cached, and recursively traversed while the active-module chain detects cycles.

**Possible weak points**: Module filenames are limited to 17 UTF-8 bytes and imported data/functions must be exported; cycles and missing resolver results are fatal.

## Terms

A **unit** is one parsed module source and its import map. A **resolver** maps a virtual-disk filename to source bytes/text. An **active import chain** detects cycles during depth-first loading.
