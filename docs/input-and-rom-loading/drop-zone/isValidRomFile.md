# `isValidRomFile`

## Essence
Checks whether a filename ends in `.ch8`, without regard to letter case.

## Contract
- **Input:** `filename`, expected to be a string.
- **Output:** Boolean from a lower-case suffix check.
- **Side effects:** None.

## Internals
Calls `filename.toLowerCase().endsWith('.ch8')`.

## Potential weak points
It checks only the case-insensitive `.ch8` suffix; any file contents pass this helper when the filename matches, so it is only a filename-format check.

## Glossary
- **Suffix:** ending portion of a filename.
