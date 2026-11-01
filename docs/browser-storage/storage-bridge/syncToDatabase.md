# `syncToDatabase`

## Essence
Saves a full copy of the Wasm disk to the database when Wasm reports changed contents.

## Contract
- **Input:** None.
- **Output:** Promise resolving after the check and any save attempt.
- **Side effects:** Reads dirty state; when dirty, clears it, copies disk bytes, and writes `disk_image`; on write failure logs and re-marks dirty.

## Internals
Reads `_get_is_dirty()`. If false, returns without a database call. If true, logs, sets dirty false, creates a view of `DISK_SIZE` bytes at `diskPtr`, copies it with `slice().buffer`, and awaits `db.put`. Success is logged. A rejected write is caught, logged, and followed by `_set_is_dirty(true)`.

## Potential weak points
The dirty flag is cleared before the asynchronous write completes; only a rejected `db.put` restores it. A failure while creating/copying the memory view occurs after the flag was cleared but before the `try` block, so it propagates with the dirty flag still false. If Wasm marks the disk dirty while `db.put` is pending, a successful save does not clear that newer flag and the next sync writes again.

## Glossary
- **Snapshot:** independent copy of the current disk bytes.
- **Dirty:** marked as changed and needing persistence.
