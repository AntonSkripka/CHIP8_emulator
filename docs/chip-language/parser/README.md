# `web/src/compiler/parser.js`

## Purpose

Consumes lexer tokens and builds program, declaration, statement, and expression nodes.

## Workflow

`Parser` is a cursor over the token array. Its `expect` helpers turn mismatches into `LANG001` errors. Top-level parsing accepts imports, data sections, public functions, and read-only public data. Function/block/statement routines create typed AST node shapes; the precedence table drives recursive expression parsing, with assignment made right-associative.

## Function and method pages

- [Parser — at](./Parser-at.md)
- [Parser — constructor](./Parser-constructor.md)
- [Parser — consume](./Parser-consume.md)
- [Parser — current](./Parser-current.md)
- [Parser — expect](./Parser-expect.md)
- [Parser — expectIdentifier](./Parser-expectIdentifier.md)
- [Parser — parseBlock](./Parser-parseBlock.md)
- [Parser — parseDataDeclaration](./Parser-parseDataDeclaration.md)
- [Parser — parseExpression](./Parser-parseExpression.md)
- [Parser — parseFunction](./Parser-parseFunction.md)
- [Parser — parseImportDeclaration](./Parser-parseImportDeclaration.md)
- [Parser — parsePrimary](./Parser-parsePrimary.md)
- [Parser — parseProgram](./Parser-parseProgram.md)
- [Parser — parseStatement](./Parser-parseStatement.md)
- [Parser — parseUnary](./Parser-parseUnary.md)

## Terms

- **Token:** A classified unit of source text.
- **AST:** The tree produced by parsing source code.
- **Span:** A source coordinate carried through diagnostics and code generation.
