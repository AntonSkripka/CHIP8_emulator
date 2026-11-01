# `processFile`

## Essence
Checks a candidate ROM, saves its bytes, loads it, and reports success or failure.

## Contract
- **Input:** Browser `File`-like object with `name`, `size`, and `arrayBuffer()`.
- **Output:** Promise resolving with no value; validation failures return early.
- **Side effects:** Updates status; on success calls `onSaveRom`, `onLoadRom`, and `onDiskUpdated`; logs thrown failures.

## Internals
Rejects an invalid `.ch8` name, files above `maxRomSize`, and zero-byte files, each with a specific error status. It then displays loading status and awaits `file.arrayBuffer()`, wrapping bytes in `Uint8Array`. If `onSaveRom(name, rom)` is false, it reports a VFS write failure and stops. Otherwise it loads the ROM, reports success, and notifies disk update. Exceptions from this sequence are logged and converted to a generic load-failed status.

## Potential weak points
It does not verify that `onSaveRom` or other callbacks exist. A callback throwing after save may leave the file saved but not loaded/notified. It checks the declared `file.size` before reading but does not compare the returned buffer length.

## Glossary
- **VFS:** virtual file system used by the application.
- **Uint8Array:** array of unsigned byte values.
