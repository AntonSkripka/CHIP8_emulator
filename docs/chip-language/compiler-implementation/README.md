# `web/src/compiler/compiler.js`

## Purpose

Coordinates the compiler pipeline and contains the code emitter, layout resolver, and instruction-generation helpers.

## Workflow

`compile` composes front end, semantic analysis, code generation, layout, and assembly. `CodeEmitter` stores ordered records instead of immediately assigning addresses. `resolveLayout` walks those records, accounts for two-byte base instructions, four-byte extended instructions, data, and BSS, and builds symbol, section, and source-map information. Emission helpers lower each AST form to assembly and use synthetic labels for branches and checks. Array and VFS helpers encode safety checks and the request block.

## Function and method pages

- [CodeEmitter — addressByte](./CodeEmitter-addressByte.md)
- [CodeEmitter — constructor](./CodeEmitter-constructor.md)
- [CodeEmitter — data](./CodeEmitter-data.md)
- [CodeEmitter — instruction](./CodeEmitter-instruction.md)
- [CodeEmitter — label](./CodeEmitter-label.md)
- [CodeEmitter — newLabel](./CodeEmitter-newLabel.md)
- [CodeEmitter — reserve](./CodeEmitter-reserve.md)
- [CodeEmitter — resolveLayout](./CodeEmitter-resolveLayout.md)
- [CodeEmitter — toAssembly](./CodeEmitter-toAssembly.md)
- [compile](./compile.md)
- [emitArrayAssignment](./emitArrayAssignment.md)
- [emitArrayBase](./emitArrayBase.md)
- [emitArrayBoundsCheck](./emitArrayBoundsCheck.md)
- [emitArrayLengthGuard](./emitArrayLengthGuard.md)
- [emitArrayReferenceArgument](./emitArrayReferenceArgument.md)
- [emitBinaryExpression](./emitBinaryExpression.md)
- [emitBlock](./emitBlock.md)
- [emitBssInitialization](./emitBssInitialization.md)
- [emitCopyVfsResult](./emitCopyVfsResult.md)
- [emitEquality](./emitEquality.md)
- [emitExpression](./emitExpression.md)
- [emitInverseFlag](./emitInverseFlag.md)
- [emitLoadArrayAddressByte](./emitLoadArrayAddressByte.md)
- [emitRejectAliasedArray](./emitRejectAliasedArray.md)
- [emitReturn](./emitReturn.md)
- [emitStatement](./emitStatement.md)
- [emitStoreRequestArrayField](./emitStoreRequestArrayField.md)
- [emitU8BoundsCheck](./emitU8BoundsCheck.md)
- [emitVfsCall](./emitVfsCall.md)
- [makeSectionRange](./makeSectionRange.md)

## Terms

- **Token:** A classified unit of source text.
- **AST:** The tree produced by parsing source code.
- **Span:** A source coordinate carried through diagnostics and code generation.
