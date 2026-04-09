# CHIP-8 WebAssembly Emulator

A high-performance CHIP-8 emulator core written in **C** and compiled to **WebAssembly (WASM)** using Emscripten. The frontend is built with modern JavaScript and HTML5 Canvas.

## Legal Disclaimer
This project is developed for educational and research purposes only.

ROMs: The "Pong" game included in this repository is a classic 1970s implementation provided as a built-in demo to verify the emulator's functionality.

Copyright: All rights to the original game logic and assets belong to their respective creators.

Removal: If you are the copyright holder of any code included here and wish for it to be removed, please open an Issue or contact me, and I will delete it immediately.

## Features
- **WASM Core:** Efficient CPU emulation written in C.
- **Fast Rendering:** Direct memory access between WASM and JS via `Uint8ClampedArray`.
- **Responsive:** Optimized for 60FPS execution.
- **Clean Architecture:** Modular code with a dedicated `Chip8Emulator` JS class.

---

## Project Structure
* `src/`: C source code (`chip8.c`, `chip8.h`).
* `web/`: Web interface (HTML, CSS, JS).
    * `web/js/chip8.wasm`: Compiled emulator core.
    * `web/js/index.js`: Frontend logic and rendering.

---

## Build Instructions

To compile the C core to WebAssembly, you need [Emscripten](https://emscripten.org/) installed.

### Using Makefile
If you have `make` installed, simply run:
```bash
make
```

---

## Roadmap & Future Development

This project is evolving from a simple WASM core to a full-featured development environment for CHIP-8.

### Phase 1: Interaction & Input
- [x] **Keyboard Mapping:** Implement a 4x4 hex keypad mapping (Standard CHIP-8 layout: 1-4, Q-R, A-F, Z-V).

### Phase 2: Integrated Development Environment (IDE)
- [x] **CHIP-8 Assembler:** Build a web-based assembler to write mnemonics (e.g., `LD V0, 0xFF`) and compile them to bytecode directly in the browser.
- [x] **Memory Monitor:** Real-time visualization of the 4KB RAM and V-registers.

### Phase 3: Game Engine & Compatibility
- [x] **ROM Loader:** Drag-and-drop support for `.ch8` files.
- [ ] **Compatibility Layer:** Support for SCHIP (Super-CHIP) and XO-CHIP extensions for high-res graphics.

### Phase 4: CHIP-OS
- [ ] **Mini-OS:** Develop a lightweight "operating system" written in CHIP-8 Assembly.
- [ ] **File System:** A simple menu-driven interface to browse, load, and manage multiple games stored in the browser's LocalStorage.