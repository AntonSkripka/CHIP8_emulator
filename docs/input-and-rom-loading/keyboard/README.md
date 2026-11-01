# `KeyboardInput`

**Source:** `web/src/input/keyboard.js`

## Purpose

Translates browser keyboard events into CHIP-8 key state updates.

## Operation

`KEY_MAP` maps the 16 keyboard `event.code` values to hexadecimal CHIP-8 key indices. The class stores a `setKey` callback and an event target (defaulting to `window`), attaches/removes keydown and keyup listeners, and reports mapped keys as pressed (`1`) or released (`0`). Unmapped codes are ignored.

| Physical key codes | CHIP-8 keys |
| --- | --- |
| `Digit1`, `Digit2`, `Digit3`, `Digit4` | `1`, `2`, `3`, `C` |
| `KeyQ`, `KeyW`, `KeyE`, `KeyR` | `4`, `5`, `6`, `D` |
| `KeyA`, `KeyS`, `KeyD`, `KeyF` | `7`, `8`, `9`, `E` |
| `KeyZ`, `KeyX`, `KeyC`, `KeyV` | `A`, `0`, `B`, `F` |

## Method pages

Each class method has an individual page in this directory.

## Terms

- **Key code:** browser identifier such as `KeyQ` or `Digit1`.
- **Key state:** `1` for down and `0` for up, as sent by this component.
