# `web/src/compiler/semantic.js`

## Purpose

Checks declarations, imports, types, scopes, array use, function calls, return paths, and recursion while annotating AST nodes.

## Workflow

Analysis builds per-module function/data maps, checks exports and the required `fn u8 main()`, then resolves callable symbols and imports. Each function receives parameter offsets, local/call-site metadata, and data symbols. Recursive walkers establish nested scopes, bind identifiers, enforce types and array rules, and check return coverage. A final call-graph walk rejects recursion, after which the analyzer returns the main function and export metadata.

## Function and method pages

- [alwaysReturns](./alwaysReturns.md)
- [analyzeArrayArgument](./analyzeArrayArgument.md)
- [analyzeBlock](./analyzeBlock.md)
- [analyzeExpression](./analyzeExpression.md)
- [analyzeProgram](./analyzeProgram.md)
- [analyzeStatement](./analyzeStatement.md)
- [constantU8Value](./constantU8Value.md)
- [rejectRecursion](./rejectRecursion.md)
- [rejectRecursion — visit](./rejectRecursion-visit.md)
- [requireType](./requireType.md)
- [resolveVariable](./resolveVariable.md)
- [validateConstantIndex](./validateConstantIndex.md)

## Terms

- **Token:** A classified unit of source text.
- **AST:** The tree produced by parsing source code.
- **Span:** A source coordinate carried through diagnostics and code generation.
