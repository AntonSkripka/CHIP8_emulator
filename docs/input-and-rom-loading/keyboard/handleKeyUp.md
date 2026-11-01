# `handleKeyUp`

## Essence
Reports a mapped CHIP-8 key as released.

## Contract
- **Input:** Keyboard event with `code`.
- **Output:** None.
- **Side effects:** Calls `setKey(index, 0)` when the code is mapped.

## Internals
Looks up `event.code` in `KEY_MAP`; unknown values are ignored.

## Potential weak points
If `setKey` is not callable, a mapped key causes a throw; for unmapped codes the callback is not called. The handler does not prevent the browser's default action.

## Glossary
- **Released:** no longer held down.
