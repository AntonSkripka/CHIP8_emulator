# `is_valid_utf8_filename`

**Function essence:** Validates a bounded UTF-8 byte sequence for a filename.

Signature: `static bool is_valid_utf8_filename(const uint8_t* bytes, uint8_t length)`

## Input / Output / Side-effects

- **Input:** A byte sequence and its explicit byte length.
- **Output:** Returns true for a valid non-NUL UTF-8 byte sequence of the supplied length.
- **Side-effects:** Code path and state changes: Rejects NUL, invalid leading bytes, missing or malformed continuation bytes, overlong encodings, surrogates, and code points above U+10FFFF.

## Detailed explanation

Rejects NUL, invalid leading bytes, missing or malformed continuation bytes, overlong encodings, surrogates, and code points above U+10FFFF.

## Terminology

- **Guest memory:** The 4096-byte memory array seen by the emulated program.
- **PC:** The address of the next instruction.
- **Runtime fault:** An error value that prevents subsequent steps.

## Potential weak points

It validates encoding only; filename policy is otherwise limited by the caller's length cap.
