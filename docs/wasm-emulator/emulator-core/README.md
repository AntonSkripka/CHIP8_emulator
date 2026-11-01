# `Chip8Core`

**Source:** `web/src/core/emulator_core.js`

## Purpose

Provides the browser application with a JavaScript API for the WebAssembly CHIP-8 machine.

## Operation

The wrapper keeps the module and assembler reference and caches pointers to WebAssembly memory regions after initialization. Most methods forward to exported `_...` functions. It also normalizes quirk flags, conditionally handles optional module exports, validates memory segments and read-only ranges, and creates typed-array views over the module's shared heap for registers, memory, and display pixels.

## Method pages

Every method, including the constructor and API accessors, has an individual page in this directory.

## Terms

- **WebAssembly (Wasm):** a compact instruction format executed by a browser runtime.
- **Heap:** module-managed memory exposed to JavaScript as a typed array.
- **Pointer:** a numeric position in that memory.
- **Typed-array view:** a JavaScript window onto a section of a binary buffer.
