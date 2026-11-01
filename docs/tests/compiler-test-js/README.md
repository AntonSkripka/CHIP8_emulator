# `tests/compiler.test.js`

## Purpose

Compiler syntax, types, modules, static data, code generation and VFS lowering.

## Detailed flow

The suite drives `compile` with paired source/expected-result cases and injected module resolvers. It covers language diagnostics and code generation for functions, locals, types, control flow, lexical scopes, literals/escapes, arrays and static sections. Module cases exercise export selection, source maps, read-only module data, missing/cyclic/oversized/invalid-UTF-8 sources, and recursion rules. The final cases validate checked VFS wrapper lowering, request-block reservation, array lengths and the built-in disk namespace.

## Function/component pages

- [`resolver`](./functions/resolver.md)
- [`resolveModule`](./functions/resolvemodule.md)
- [`compiles functions, local variables, calls, and conditional returns`](./functions/compiles-functions-local-variables-calls-and-conditional-returns.md)
- [`supports loop code generation and lexical variable shadowing`](./functions/supports-loop-code-generation-and-lexical-variable-shadowing.md)
- [`reports stable diagnostics for missing main, undefined symbols, and type errors`](./functions/reports-stable-diagnostics-for-missing-main-undefined-symbols-and-type-errors.md)
- [`loads selected module exports from .chip files and preserves module source maps`](./functions/loads-selected-module-exports-from-chip-files-and-preserves-module-source-maps.md)
- [`supports importing every module export and rejects unselected or missing exports`](./functions/supports-importing-every-module-export-and-rejects-unselected-or-missing-exports.md)
- [`reports unavailable, cyclic, oversized, and invalid-UTF-8 modules`](./functions/reports-unavailable-cyclic-oversized-and-invalid-utf-8-modules.md)
- [`exports read-only arrays as qualified module data`](./functions/exports-read-only-arrays-as-qualified-module-data.md)
- [`rejects direct and indirect recursion and missing return paths`](./functions/rejects-direct-and-indirect-recursion-and-missing-return-paths.md)
- [`supports short-circuit boolean expressions and procedure calls`](./functions/supports-short-circuit-boolean-expressions-and-procedure-calls.md)
- [`compiles numeric formats, unary operators, arithmetic, and comparisons`](./functions/compiles-numeric-formats-unary-operators-arithmetic-and-comparisons.md)
- [`compiles one-byte character literals in expressions and static data`](./functions/compiles-one-byte-character-literals-in-expressions-and-static-data.md)
- [`rejects invalid and non-ASCII direct character literals`](./functions/rejects-invalid-and-non-ascii-direct-character-literals.md)
- [`compiles array references as hidden address and length arguments`](./functions/compiles-array-references-as-hidden-address-and-length-arguments.md)
- [`supports standard one-byte character escapes`](./functions/supports-standard-one-byte-character-escapes.md)
- [`supports comments, empty statements, nested scopes, and forward function calls`](./functions/supports-comments-empty-statements-nested-scopes-and-forward-function-calls.md)
- [`reports syntax, duplicate-definition, argument-count, and return-type diagnostics`](./functions/reports-syntax-duplicate-definition-argument-count-and-return-type-diagnostics.md)
- [`lays out typed data sections and keeps BSS out of ROM bytes`](./functions/lays-out-typed-data-sections-and-keeps-bss-out-of-rom-bytes.md)
- [`validates static data sizes, initializers, and duplicate symbols`](./functions/validates-static-data-sizes-initializers-and-duplicate-symbols.md)
- [`lowers checked VFS library calls and reserves a private request block`](./functions/lowers-checked-vfs-library-calls-and-reserves-a-private-request-block.md)
- [`validates VFS array lengths and requires the built-in disk namespace`](./functions/validates-vfs-array-lengths-and-requires-the-built-in-disk-namespace.md)

## Dependencies and exact paths

- **File:** `tests/compiler.test.js`
- **Chapter:** [Tests](../README.md)
- **Direct dependencies/data:** The imports and input paths listed in this file's source; callers provide browser/runtime collaborators.

## Glossary

- **Entry point:** A module/file that starts or mounts a subsystem.
- **Adapter:** A wrapper that connects two APIs without changing their ownership.
- **State:** Data retained by an object or component between operations.
