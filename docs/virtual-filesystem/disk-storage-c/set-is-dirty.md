# `set_is_dirty`

**Function essence:** Sets or clears the disk-change marker.

Signature: `EMSCRIPTEN_KEEPALIVE void set_is_dirty(bool dirty)`

## Input / Output / Side-effects

- **Input:** The boolean value to assign to the disk dirty marker.
- **Output:** Returns no value; assigns the supplied boolean directly to the disk dirty flag.
- **Side-effects:** Code path and state changes: Stores the supplied boolean directly.

## Detailed explanation

Stores the supplied boolean directly.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

Setting the flag to false does not check whether disk changes have been persisted; the marker can therefore be cleared while unsaved changes remain.
