# `setupEmergencySync`

## Essence
Requests a disk sync before page unload and when the document becomes hidden.

## Contract
- **Input:** None.
- **Output:** None.
- **Side effects:** Registers `handleBeforeUnload` on `window` and `handleVisibilityChange` on `document`.

## Internals
Uses the prebuilt callback properties created by the constructor.

## Potential weak points
The event listeners do not await the returned synchronization Promise; browser shutdown/visibility transition may occur before persistence finishes.

## Glossary
- **Unload:** browser event indicating that a page is being left.
- **Hidden:** document visibility state indicating it is not currently visible.
