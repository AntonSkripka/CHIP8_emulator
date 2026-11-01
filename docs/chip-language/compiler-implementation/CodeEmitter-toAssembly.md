# CodeEmitter — toAssembly

**Summary:** Render assembly text.

**Source:** `web/src/compiler/compiler.js` (line 232)

## Contract

- **Input:** `symbols`: resolved symbol-to-address map produced by layout
- **Output:** Assembly source string; symbolic address-byte records use the supplied symbol map.
- **Side effects:** Reads emitter records and the symbol map; does not modify either.

## Implementation

Serializes records as assembly text, substituting symbolic addresses supplied in the symbol map. Instruction and label records are rendered as lines; data becomes `DB`, BSS becomes address movement/reservation output, and address-byte records are emitted using the resolved symbol address split into high/low bytes.

**Possible weak points**: The symbol map must contain every referenced label; this serializer does not perform undefined-symbol recovery.

## Terms

An **emitter record** is a deferred instruction/data/label/reservation. **Layout** assigns addresses to those records. A **relocation** is a reference whose final address is resolved later.
