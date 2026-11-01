# `tests/source-files.test.js`

## Purpose

Saving and loading CHIP Language source files via virtual-disk UI callbacks.

## Detailed flow

This focused integration suite injects minimal disk/editor/status collaborators into `saveAssembly` and `DiskUiManager`. It verifies saving CHIP Language text retains the `.chip` extension, writes UTF-8 source, refreshes the disk and displays success. A second case reads `.chip` bytes from the virtual disk and checks they are decoded into the editor callback rather than sent to the ROM runner.

## Function/component pages

- [`saves CHIP Language files with the .chip extension`](./functions/saves-chip-language-files-with-the-chip-extension.md)
- [`loads .chip files from the virtual disk as source text`](./functions/loads-chip-files-from-the-virtual-disk-as-source-text.md)

## Dependencies and exact paths

- **File:** `tests/source-files.test.js`
- **Chapter:** [Tests](../README.md)
- **Direct dependencies/data:** The imports and input paths listed in this file's source; callers provide browser/runtime collaborators.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
