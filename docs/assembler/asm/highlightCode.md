# highlightCode

**Summary:** Highlight assembly text.

**Source:** `web/src/assembler/asm.js` (line 343)

## Contract

- **Input:** `text`: input text to escape, highlight, or emit
- **Output:** HTML string with escaped source and keyword/register spans.
- **Side effects:** Returns HTML text; does not mutate the supplied string.

## Implementation

Escapes the source and wraps recognized opcode and register words in CSS spans; preserves a trailing newline with a space. The source is escaped before a case-insensitive word-boundary regex runs, preventing literal `<`/`>` from becoming markup. Matched words are categorized against fixed keyword and register lists.

**Possible weak points:** Only the listed mnemonics/registers are highlighted, and a trailing newline is represented by an extra space; it does not parse assembly syntax.

## Terms

A **statement** is one source line after comment removal, with tokens and address. A **label** names an address; an **opcode** is the encoded 16-bit instruction. A **segment** is a contiguous run of `{val, size}` byte items.
