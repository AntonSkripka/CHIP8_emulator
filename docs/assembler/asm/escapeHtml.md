# escapeHtml

**Summary:** Escape HTML characters.

**Source:** `web/src/assembler/asm.js` (line 339)

## Contract

- **Input:** `text`: input text to escape, highlight, or emit
- **Output:** String with `&`, `<`, and `>` replaced by HTML entities.
- **Side effects:** Returns a transformed copy; does not alter the input string.

## Implementation

Replaces ampersands and angle brackets with HTML entities before source is inserted into markup.

**Possible weak points:** It escapes `&`, `<`, and `>` only; quotes are not escaped because the result is inserted as highlighted text rather than an attribute.

## Terms

A **statement** is one source line after comment removal, with tokens and address. A **label** names an address; an **opcode** is the encoded 16-bit instruction. A **segment** is a contiguous run of `{val, size}` byte items.
