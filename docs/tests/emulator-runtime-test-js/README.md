# `tests/emulator-runtime.test.js`

## Purpose

Integration of compiler output/source maps/runtime faults with emulator orchestration.

## Detailed flow

`createHarness` builds a fake core and scheduler, allowing the suite to observe configuration calls and invoke one emulator frame deterministically. Integration cases verify that virtual-disk module resolution reaches compilation, source-map locations survive imports, language programs configure read-only RAM, ROM loading disables CHIP-8-dev mode, runtime faults highlight source instructions, and main return codes are reported before the idle loop stops.

## Function/component pages

- [`createHarness`](./functions/createharness.md)
- [`runFrame`](./functions/runframe.md)
- [`passes the virtual-disk resolver through compilation and keeps imported source locations`](./functions/passes-the-virtual-disk-resolver-through-compilation-and-keeps-imported-source-locations.md)
- [`configures language read-only memory and disables dev mode for ROMs`](./functions/configures-language-read-only-memory-and-disables-dev-mode-for-roms.md)
- [`maps runtime faults to the source instruction`](./functions/maps-runtime-faults-to-the-source-instruction.md)
- [`reports main return code and stops executing the idle loop`](./functions/reports-main-return-code-and-stops-executing-the-idle-loop.md)

## Dependencies and exact paths

- **File:** `tests/emulator-runtime.test.js`
- **Chapter:** [Tests](../README.md)
- **Direct dependencies/data:** The imports and input paths listed in this file's source; callers provide browser/runtime collaborators.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
