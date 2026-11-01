# `loadWasmModule`

## Essence
Loads the WebAssembly loader script and asks its global factory for a module.

## Contract
- **Input:** `{ documentRef, globalObject, scriptUrl }`.
- **Output:** A Promise that resolves to the result of `globalObject.createChip8()` or rejects with a load/factory error.
- **Side effects:** Creates a script element, sets its `src`, attaches load/error handlers, and appends it to `documentRef.head`.

## Internals
On script load, verifies that `createChip8` is a function. If absent, rejects with a descriptive error. Otherwise invokes the factory in a Promise chain so synchronous throws become rejections, and forwards its resolution/rejection. A script error rejects with an error naming the URL.

## Potential weak points
The script element is not removed after success or failure. Each invocation appends another script element and invokes `createChip8` for that load; the function does not cache an existing module promise.

## Glossary
- **Global object:** object where the loaded script exposes its factory.
- **Reject:** mark a Promise as failed.
