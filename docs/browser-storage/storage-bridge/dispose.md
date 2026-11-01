# `dispose`

## Essence
Stops periodic synchronization and removes page-lifecycle listeners.

## Contract
- **Input:** None.
- **Output:** None.
- **Side effects:** Calls injected `clearInterval(intervalId)` and removes both registered listeners.

## Internals
Uses the stored interval handle and the exact callback references established in the constructor.

## Potential weak points
It does not call `syncToDatabase` before stopping the periodic loop; if the disk is dirty and no later lifecycle sync runs, this call alone does not save those changes.

## Glossary
- **Dispose:** release ongoing resources and event registrations.
