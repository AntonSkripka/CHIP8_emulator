# `loadBin`

## Essence
Assembles input code and loads the resulting segments.

## Contract
- **Input:** Assembly source `code`, consumed by the constructor-supplied `assemble` function.
- **Output:** `undefined`; the method does not return `loadSegments`' result.
- **Side effects:** Calls the assembler and then writes assembled content through `loadSegments`.

## Internals
Calls `this.assemble(code)` and passes the resulting segment array to `loadSegments`. That method validates every segment before writing its size-1 items as data and size-2 items as opcodes.

## Potential weak points
The method does not catch assembler or validation errors. It also does not initialize or clear machine memory before loading the assembled segments.

## Glossary
- **Assembler:** converter from assembly text to encoded memory items.
