# `handleKeyDown`

## Essence
Reports a mapped CHIP-8 key as pressed.

## Contract
- **Input:** Keyboard event with `code`.
- **Output:** None.
- **Side effects:** Calls `setKey(index, 1)` when `event.code` exists in `KEY_MAP`.

## Internals
Looks up the physical browser code; uses `!== undefined` so mapped key index 0 is handled correctly. Unknown codes do nothing.

## Potential weak points
Does not prevent browser defaults or suppress repeated keydown events.

## Glossary
- **Mapped key:** physical key represented in `KEY_MAP`.
