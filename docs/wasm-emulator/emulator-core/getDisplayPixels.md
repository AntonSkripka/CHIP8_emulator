# `getDisplayPixels`

## Essence
Creates a clamped-byte view of the display buffer.

## Contract
- **Input:** `length`, default `64 * 32 * 4`.
- **Output:** `Uint8ClampedArray` over module memory, or `null` if no display pointer is cached.
- **Side effects:** None beyond creating a view.

## Internals
Uses the current `HEAPU8.buffer`, cached display pointer, and requested length.

## Potential weak points
Does not validate length or pointer bounds; the typed-array constructor throws for an invalid range.

## Glossary
- **Clamped byte:** byte value constrained to the range 0–255.
