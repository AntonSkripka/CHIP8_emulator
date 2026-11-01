# `loadWasmModule`

**Source:** `web/src/core/load_wasm_module.js`

## Purpose and operation

Adds a script element for the supplied loader URL and resolves with the WebAssembly module created by the loader's global `createChip8` factory. It rejects if the script fails to load, the factory is missing, or factory creation rejects. This file declares one function and no classes.

## Terms

- **Factory:** a function that creates and returns an instance.
- **Promise:** an object representing a result that may become available later.
