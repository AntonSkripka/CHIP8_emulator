# `setupEventListeners`

## Essence
Connects browser drag/drop and file-input events to this manager's handlers.

## Contract
- **Input:** None.
- **Output:** None.
- **Side effects:** Registers listeners on `dropZone`, `eventTarget`, and `fileInput`.

## Internals
For `dragenter`, `dragover`, `dragleave`, and `drop`, registers `preventDragDefaults` on both the drop zone and event target. The zone highlights on enter/over, removes highlight on leave, processes drops, and opens the file picker on click. File-input `change` invokes `handleFileSelect`.

## Potential weak points
There is no matching teardown method, so the registered listeners stay attached for the lifetime of these DOM elements. Calling this method again also creates fresh inline arrow callbacks for the zone events.

## Glossary
- **Event listener:** function called by the browser for a named event.
