# `Makefile`

## Purpose

Emscripten compilation, site build, development, preview and cleanup targets.

## Detailed flow

`wasm` creates the output directory and invokes `emcc` on the six C sources, exporting the emulator/VFS API and writing `web/public/wasm/chip8.js` (plus its `.wasm` companion). `build` depends on `wasm` and then runs `npm run build:site`; `deploy` aliases that build. `dev` also builds WASM before starting Vite. `preview` delegates to the npm preview script. `clean` removes generated WASM and `dist/`; it does not delete source files.

## Function/component pages

- No functions are defined in this file.

## Dependencies and exact paths

- **File:** `Makefile`
- **Chapter:** [Project build and delivery](../README.md)
- **Direct dependencies/data:** C sources under `src/`, Emscripten (`emcc`), npm scripts and `web/public/wasm/chip8.js`.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
