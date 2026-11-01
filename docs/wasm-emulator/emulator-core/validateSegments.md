# `validateSegments`

## Essence
Rejects malformed assembler segments, item values, and addresses outside the 4 KiB memory space.

## Contract
- **Input:** `segments`, expected to be an array of `{ start, bytes }`.
- **Output:** None if valid.
- **Side effects:** None.
- **Errors:** `TypeError` when the top-level value is not an array; `Error` for invalid segments or items.

## Internals
Each segment must have an integer start in `[0, 4095]` and an array of bytes. Each item must have integer `val`, size exactly 1 or 2, and a value fitting that size (`0..255` or `0..65535`). The accumulated item end must not exceed 4096.

## Potential weak points
Overlapping segments are accepted; if passed to `loadSegments`, later segments in the array can write to addresses already written by earlier segments.

## Glossary
- **4 KiB:** 4096 addressable bytes.
- **Bounds:** allowed minimum and maximum address.
