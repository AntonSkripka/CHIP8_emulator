# `handleDragLeave`

## Essence
Removes drag highlighting only when the pointer leaves the drop-zone element itself.

## Contract
- **Input:** Event whose `target` is compared with `dropZone`.
- **Output:** None.
- **Side effects:** May remove the `dragover` class.

## Internals
Compares `event.target === this.dropZone`; only an exact match removes the class.

## Potential weak points
Nested elements can produce a different event target, so leaving a child may not remove the highlight.

## Glossary
- **Target:** element on which the event originated.
