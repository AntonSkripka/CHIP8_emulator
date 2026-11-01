# `loadSegments`

## Essence
Validates assembled memory segments and writes their bytes/opcodes into Wasm memory.

## Contract
- **Input:** Array of segments `{ start, bytes }`; each byte item has `{ size, val }`.
- **Output:** None.
- **Side effects:** Calls `validateSegments`; then writes each item using `_load_opcode_at` for size 2 or `_load_data_at` for size 1.

## Internals
Validation completes before the first write. Each segment starts at its declared address; the local address advances by the item's encoded size.

## Potential weak points
The wrapper trusts the Wasm loading exports after validation; a Wasm-side failure can occur during the write pass.

## Glossary
- **Opcode:** encoded instruction.
- **Memory segment:** contiguous content with a start address.
