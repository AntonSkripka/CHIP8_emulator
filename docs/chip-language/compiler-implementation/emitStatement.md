# emitStatement

**Summary:** Emit one statement.

**Source:** `web/src/compiler/compiler.js` (line 281)

## Contract

- **Input:** `statement`: analyzed statement node; `fn`: containing function; `emitter`: output sink; `functionLabels`: user-function label map.
- **Output:** No value; appends assembly for the supported statement node, or throws `LANG009`.
- **Side effects:** Appends generated instructions, labels, or data records to the supplied `CodeEmitter`.

## Implementation

Lowers each supported AST statement to instructions and labels; unsupported node kinds raise `LANG009`. Variable declarations evaluate then store at their assigned frame offset; `if` and `while` create generated labels and jumps; returns call `emitReturn`. Empty statements emit `ADD V0, 0`.

**Possible weak points:** Only the statement kinds present in the switch are supported; an unrecognized kind throws `LANG009`.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
