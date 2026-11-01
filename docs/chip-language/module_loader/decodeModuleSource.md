# decodeModuleSource

**Summary:** Decode module as UTF-8.

**Source:** `web/src/compiler/module_loader.js` (line 95)

## Contract

- **Input:** `bytes`: module source bytes returned by the resolver; `filename`: virtual-disk filename used to resolve module source; `span`: source-coordinate object attached to the diagnostic
- **Output:** Decoded source string; invalid byte types or invalid UTF-8 throw.
- **Side effects:** Returns a string unchanged or decodes UTF-8 bytes; the input buffer is not modified.

## Implementation

Returns string input directly or strictly decodes `Uint8Array` as UTF-8; invalid result types or bytes fail.

**Possible weak points**: Byte input must be `Uint8Array` and valid UTF-8; arbitrary typed arrays and replacement decoding are not accepted.

## Terms

A **unit** is one parsed module source and its import map. A **resolver** maps a virtual-disk filename to source bytes/text. An **active import chain** detects cycles during depth-first loading.
