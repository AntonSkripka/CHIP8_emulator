# `getFp`

## Essence
Reads the frame-pointer value when supported, otherwise returns zero.

## Contract
- **Input:** None.
- **Output:** `_get_fp()` result, or `0` when the export is not a function.
- **Side effects:** May call the optional module export.

## Internals
Checks the export's type before calling it.

## Potential weak points
Using zero as the unsupported fallback does not distinguish “unsupported” from a real zero frame pointer.

## Glossary
- **Frame pointer:** pointer-like value associated with a stack frame.
