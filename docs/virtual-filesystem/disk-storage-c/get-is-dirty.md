# `get_is_dirty`

**Function essence:** Reads the disk-change marker.

Signature: `EMSCRIPTEN_KEEPALIVE bool get_is_dirty()`

## Input / Output / Side-effects

- **Input:** No parameters.
- **Output:** Returns the current disk dirty flag.
- **Side-effects:** Code path and state changes: Returns the current dirty boolean.

## Detailed explanation

Returns the current dirty boolean.

## Terminology

- **Disk image:** The byte array containing all filesystem regions.
- **Cluster:** A 512-byte block used for file contents.
- **Directory entry:** Metadata containing a filename, size, and starting cluster.

## Potential weak points

Repeated reads keep returning true until `set_is_dirty(false)` is called; the getter has no consume-and-clear behavior.
