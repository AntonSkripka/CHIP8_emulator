# `isValidFilename`

## Essence
Checks that a filename is a nonempty string fitting the disk's 17-byte UTF-8 name limit and containing no NUL.

## Contract
- **Input:** `filename`.
- **Output:** Boolean.
- **Side effects:** Creates a `TextEncoder` and encodes the name.

## Internals
Requires a string, length greater than zero and at most 17 JavaScript code units, no `\0`, and encoded UTF-8 length at most 17 bytes.

## Potential weak points
The method constructs a new `TextEncoder` for each check; in an environment without that browser API, filename validation throws instead of returning `false`.

## Glossary
- **Code unit:** JavaScript's basic string storage unit.
- **NUL:** zero-valued character used as a terminator in C-style strings.
