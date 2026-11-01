# `init`

## Essence
Initializes the Wasm machine and refreshes the JavaScript pointers to its memory regions.

## Contract
- **Input:** None.
- **Output:** None.
- **Side effects:** Calls `_init`, reads register/display/memory pointers, and calls the optional stack-interface initializer when present.

## Internals
Calls module `_init`, fetches pointers through `_get_v_regs_ptr`, `_get_display_ptr`, and `_get_mem_ptr`, then conditionally calls `_init_stack_interface(vRegsPtr)` if that export is a function.

## Potential weak points
The method calls `_init` and all three pointer exports without checking for their presence; a module missing any of them throws before initialization completes. Only `_init_stack_interface` is optional and guarded.

## Glossary
- **Cached pointer:** saved numeric address used later to access module memory.
