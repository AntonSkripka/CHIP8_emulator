# `findSourceLocation`

## Essence
Maps a generated program address back to its original source position when compiler metadata allows it.

## Contract
- **Input:** Program counter/address `pc`.
- **Output:** `{ line, column, fileName? }` for a matching non-synthetic mapping, or `null`.
- **Side effects:** None.

## Internals
Searches `lastCompiledProgram.sourceMap` for an entry whose half-open range contains `pc` (`address <= pc < endAddress`). It returns line and column and includes `fileName` only when present. Synthetic entries and missing matches produce `null`.

## Potential weak points
Without a compiled program/source map it returns `null`. If malformed mappings overlap, the first matching entry in `sourceMap` wins because the search uses `find`.

## Glossary
- **Generated address:** location in compiled machine code.
- **Synthetic mapping:** compiler-generated code without a direct source position.
- **Half-open range:** includes its start but excludes its end.
