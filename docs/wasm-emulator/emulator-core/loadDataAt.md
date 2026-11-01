# `loadDataAt`

## Essence
Writes one data value at a given core address.

## Contract
- **Input:** `addr`, destination address; `data`, value.
- **Output:** `undefined`; the wrapper does not return the export's result.
- **Side effects:** Calls `module._load_data_at(addr, data)`.

## Internals
Calls `_load_data_at(addr, data)` once. No JavaScript type, byte-range, or memory-address check precedes the call.

## Potential weak points
Values outside the data byte or memory-address range are still passed to `_load_data_at`; any rejection or handling is determined by the Wasm implementation.

## Glossary
- **Address:** numbered location in machine memory.
