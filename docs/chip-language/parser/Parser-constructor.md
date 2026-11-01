# Parser — constructor

**Summary:** Initialize parser cursor.

**Source:** `web/src/compiler/parser.js` (line 14)

## Contract

- **Input:** `tokens`: token array consumed by the parser, including its EOF sentinel
- **Output:** No value; stores tokens and sets cursor position to zero.
- **Side effects:** Sets `tokens` and `position = 0` on the instance.

## Implementation

Stores the token array and initializes the cursor to its first element.

**Possible weak points:** The constructor stores the supplied token array without validating token shape or requiring an EOF sentinel.

## Terms

A **token cursor** identifies the next token to parse. An **AST node** represents a language construct. **Precedence climbing** groups operators according to their binding priority.
