# `startSyncLoop`

## Essence
Schedules disk synchronization every three seconds.

## Contract
- **Input:** None.
- **Output:** None; stores the interval handle as `intervalId`.
- **Side effects:** Calls the injected interval function with a 3,000 ms period; each callback invokes `syncToDatabase()`.

## Internals
Passes a callback and delay `3000` to `setInterval`.

## Potential weak points
The returned Promise from `syncToDatabase` is not awaited by the interval callback, so overlapping saves are possible if a save takes longer than the interval.

## Glossary
- **Interval:** recurring timer with a fixed delay between callbacks.
