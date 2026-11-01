# `getDiskSpaceInfo`

## Essence
Reports total, free, and derived used disk capacity.

## Contract
- **Input:** None.
- **Output:** `{ total, free, used }`, in bytes.
- **Side effects:** Calls `_fat_get_free_space_bytes()`.

## Internals
Sets total to 1,048,576 bytes, reads free bytes from Wasm, and computes `used = total - free`.

## Potential weak points
The returned free value is not range-checked; used can be negative or greater than total if the Wasm export returns an out-of-range value.

## Glossary
- **Free space:** capacity reported as not currently used.
- **Used space:** total capacity minus free capacity.
