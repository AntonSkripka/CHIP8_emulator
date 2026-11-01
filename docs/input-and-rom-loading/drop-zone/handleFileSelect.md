# `handleFileSelect`

## Essence
Processes the first selected file and clears the file input so that it can be selected again.

## Contract
- **Input:** Change event with `target.files`.
- **Output:** None; starts asynchronous processing if there is a file.
- **Side effects:** May call `processFile`; always sets `fileInput.value` to an empty string after the selection check.

## Internals
Reads only `event.target.files[0]`, processes it when present, then clears the input value.

## Potential weak points
Only `event.target.files[0]` is processed, and the handler does not return the `processFile` Promise. It clears `fileInput.value` immediately after starting processing, before that asynchronous operation finishes.

## Glossary
- **File input:** browser form control for choosing local files.
