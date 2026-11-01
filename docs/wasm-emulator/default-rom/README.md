# Built-in Pong ROM

**Source:** `web/src/core/default_rom.js`

## Purpose and operation

Exports `DEFAULT_PONG_ROM`, a JavaScript array of byte values. `Chip8Emulator.loadDefaultPong` passes this array to the ordinary ROM loader, which writes it at address `0x200`. The file contains data only; it declares no functions or classes.

## Terms

- **Byte:** an 8-bit value from 0 to 255.
- **ROM:** program bytes loaded into the emulated machine.
