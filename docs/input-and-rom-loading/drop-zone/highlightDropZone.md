# `highlightDropZone`

## Essence
Adds the CSS class used to show that a file is being dragged over the zone.

## Contract
- **Input:** None.
- **Output:** None.
- **Side effects:** Adds `dragover` to `dropZone.classList`.

## Internals
Uses `classList.add`, which does not duplicate an existing class.

## Potential weak points
If `dropZone` has no `classList` or its `add` method is unavailable, this call throws instead of showing an error status.

## Glossary
- **CSS class:** a name used by page styles to select and format an element.
