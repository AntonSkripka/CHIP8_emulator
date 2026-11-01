# `tests/runtime.test.js`

## Purpose

Execution semantics, memory safety, stacks, modules and VFS syscall behavior.

## Detailed flow

The suite creates one WebAssembly machine, initializes its VFS and provides helpers to compile/execute language programs, write machine memory, and read/write files. It checks calls/locals/loops, modules, short-circuiting, characters, BSS and arrays; runtime faults for division, bounds and read-only writes; CHIP-8 RAM boundary atomicity; and data-stack isolation. VFS syscall cases verify success/error statuses, bounded request memory, wrapper size encoding, invalid ranges, alias safety, large-file sizes and required-size reporting for short buffers.

## Function/component pages

- [`encode`](./functions/encode.md)
- [`writeMachineMemory`](./functions/writemachinememory.md)
- [`writeVfsFile`](./functions/writevfsfile.md)
- [`readVfsFile`](./functions/readvfsfile.md)
- [`getVfsFileSize`](./functions/getvfsfilesize.md)
- [`executeVfsSyscall`](./functions/executevfssyscall.md)
- [`execute`](./functions/execute.md)
- [`executeProgram`](./functions/executeprogram.md)
- [`executes function calls, arguments, locals, loops, and returns`](./functions/executes-function-calls-arguments-locals-loops-and-returns.md)
- [`links nested modules resolved from the virtual disk and executes their functions`](./functions/links-nested-modules-resolved-from-the-virtual-disk-and-executes-their-functions.md)
- [`links and reads exported module read-only data`](./functions/links-and-reads-exported-module-read-only-data.md)
- [`short-circuits boolean expressions without evaluating division by zero`](./functions/short-circuits-boolean-expressions-without-evaluating-division-by-zero.md)
- [`executes byte character literals as u8 values`](./functions/executes-byte-character-literals-as-u8-values.md)
- [`reports division-by-zero as a runtime fault and halts`](./functions/reports-division-by-zero-as-a-runtime-fault-and-halts.md)
- [`zero-initializes BSS objects before main, including sizes above one byte`](./functions/zero-initializes-bss-objects-before-main-including-sizes-above-one-byte.md)
- [`reads indexed data and writes indexed mutable data`](./functions/reads-indexed-data-and-writes-indexed-mutable-data.md)
- [`passes arrays by reference through functions and enforces mutability`](./functions/passes-arrays-by-reference-through-functions-and-enforces-mutability.md)
- [`bounds-checks array parameters using their runtime extent`](./functions/bounds-checks-array-parameters-using-their-runtime-extent.md)
- [`allows u8 indexes into arrays larger than 255 bytes`](./functions/allows-u8-indexes-into-arrays-larger-than-255-bytes.md)
- [`traps dynamic out-of-bounds array access`](./functions/traps-dynamic-out-of-bounds-array-access.md)
- [`traps runtime writes into read-only data`](./functions/traps-runtime-writes-into-read-only-data.md)
- [`rejects CHIP-8 store instructions that cross the end of RAM`](./functions/rejects-chip-8-store-instructions-that-cross-the-end-of-ram.md)
- [`rejects CHIP-8 loads that cross the end of RAM without partial register updates`](./functions/rejects-chip-8-loads-that-cross-the-end-of-ram-without-partial-register-updates.md)
- [`reports data-stack overflow without corrupting the call stack`](./functions/reports-data-stack-overflow-without-corrupting-the-call-stack.md)
- [`executes VFS size, read, write, and delete syscalls through bounded requests`](./functions/executes-vfs-size-read-write-and-delete-syscalls-through-bounded-requests.md)
- [`returns VFS errors without partially modifying read buffers`](./functions/returns-vfs-errors-without-partially-modifying-read-buffers.md)
- [`turns invalid syscall RAM ranges into fatal faults before VFS access`](./functions/turns-invalid-syscall-ram-ranges-into-fatal-faults-before-vfs-access.md)
- [`executes CHIP Language VFS wrappers with 32-bit size outputs`](./functions/executes-chip-language-vfs-wrappers-with-32-bit-size-outputs.md)
- [`rejects invalid VFS wrapper lengths and aliased size outputs safely`](./functions/rejects-invalid-vfs-wrapper-lengths-and-aliased-size-outputs-safely.md)
- [`preserves big-endian 32-bit file sizes above 255 bytes`](./functions/preserves-big-endian-32-bit-file-sizes-above-255-bytes.md)
- [`exposes required read size when the source-level buffer is too small`](./functions/exposes-required-read-size-when-the-source-level-buffer-is-too-small.md)

## Dependencies and exact paths

- **File:** `tests/runtime.test.js`
- **Chapter:** [Tests](../README.md)
- **Direct dependencies/data:** The imports and input paths listed in this file's source; callers provide browser/runtime collaborators.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
