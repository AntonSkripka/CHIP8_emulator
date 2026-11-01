# WebAssembly emulator

## Purpose

Documents the browser-side CHIP-8 execution core, display, and WebAssembly module loader. This chapter covers only `web/src/core/*`.

## Operation

The loader adds the configured script to the page and obtains the module from its `createChip8` factory. `Chip8Core` wraps that module's exports, exposing machine initialization and stepping, timers, program loading and validation, memory/register/display access, and stack/fault information. `Chip8Emulator` coordinates the core with scheduling and UI collaborators, handles assembly or language compilation, and checks runtime faults/program exit. `Chip8Display` renders the core's 64×32 pixel buffer onto a canvas when drawing is pending. A built-in Pong ROM is available as initial content.

## Source files

- [`chip8-emulator/`](chip8-emulator/README.md) — `web/src/core/chip8_emulator.js`, the orchestration layer for loading and running programs.
- [`default-rom/`](default-rom/README.md) — `web/src/core/default_rom.js`, the built-in Pong byte sequence.
- [`display/`](display/README.md) — `web/src/core/display.js`, the canvas display adapter.
- [`emulator-core/`](emulator-core/README.md) — `web/src/core/emulator_core.js`, the JavaScript wrapper around the WebAssembly emulator API.
- [`load-wasm-module/`](load-wasm-module/README.md) — `web/src/core/load_wasm_module.js`, the script loader for the WebAssembly factory.

## Terms

- **Core:** the Wasm-backed CHIP-8 machine.
- **Export:** a function or value exposed by the Wasm module.
- **Frame:** one scheduled browser rendering callback.
- **ROM:** bytes containing a program.
