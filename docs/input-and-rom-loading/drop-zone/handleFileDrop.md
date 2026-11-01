# `handleFileDrop`

## Essence
Clears the highlight and sends the first dropped file for processing.

## Contract
- **Input:** Drop event, optionally containing `dataTransfer.files`.
- **Output:** None; processing is started when a file exists.
- **Side effects:** Removes the `dragover` class and may call `processFile`.

## Internals
Removes the highlight, safely reads the first file from `event.dataTransfer?.files`, and calls `processFile(file)` only when one is present.

## Potential weak points
Only `dataTransfer.files[0]` is processed, and this synchronous DOM handler does not return the `processFile` Promise; callers cannot await completion through `handleFileDrop`.

## Glossary
- **Optional chaining:** access a property only if the preceding value exists.
