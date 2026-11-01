# CHIP Language: working specification

This document is a working specification for evolving the assembler, emulator,
and future high-level language. Decision status is marked explicitly as
**Implemented**, **Agreed for MVP**, or **Open question**. An agreed decision
is not necessarily implemented yet.

## 1. Project goal and scope

Grow the browser CHIP-8 environment from an assembler IDE into a compiler for
a small low-level language that preserves control over the virtual machine's
limited resources.

The target feature set includes:

- scalar types and expressions;
- local variables and scopes;
- conditional branches and loops;
- functions, arguments, and return values;
- explicit register control and a convention for preserving register values;
- bounded arrays and pointers, if the memory model permits them;
- a standard library and controlled system calls, including virtual-disk
  access.

The language must compile to virtual-machine code rather than execute directly
in JavaScript. The compiler must not depend on the DOM, UI, or IndexedDB.

## 2. Architecture and component status

### Already implemented

- CHIP-8 is interpreted in C and compiled to WebAssembly:
  `src/chip8.c`, `src/chip8.h`.
- Machine memory is 4096 bytes; programs usually begin at `0x200`; code and
  data share the same memory.
- The machine has sixteen 8-bit registers `V0`–`VF`, address register `I`,
  program counter `PC`, timers, a 64×32 display, and a keyboard.
- The CHIP-8 call stack holds 16 return addresses.
- The separate project data stack in `src/stack.c` holds 1024 bytes. It is
  currently separate from addressable CHIP-8 memory.
- The `chip8-dev` profile is enabled explicitly for assembly programs. Its
  `0x5001` prefix implements `ENTER`, `LEAVE`, `ADJSP`, `DROP`, `LDX`, `STX`,
  `LDI`, and `TRAP`. Ordinary ROMs load with the profile disabled.
- `SP`/`FP` frame operations check data-stack bounds. Division and remainder
  by zero are fatal in `chip8-dev`.
- The assembler is `web/src/assembler/asm.js`; `asmToBin(source)` returns
  `{ start, bytes }` segments, with each `bytes` element shaped as
  `{ val, size }`.
- The UI loads assembly text into the emulator through
  `web/src/core/emulator_core.js`.
- The C runtime provides a virtual file system (VFS); `chip8-dev` exposes a
  checked `SYS` instruction, and CHIP Language invokes file operations through
  compiler-lowered built-ins.

### Current implementation limitations

- `SPD` is not a CHIP-8 register and is not available as a program operand.
  User-stack depth is readable through the C/WASM API `get_spd()`. The
  `SIZESTACK Vx` instruction places the depth in an 8-bit `Vx`, so it exposes
  only the low eight bits.
- `PUSH`, `POP`, `PUSHA`, `POPA`, `PEAK`, `SIZESTACK`, `CLEARSTACK`, `MUL`,
  `DIV`, and `REM` are non-standard project extensions, not base CHIP-8
  instructions.
- `PEAK` is the established mnemonic spelling; do not silently rename it and
  break existing source.
- Frame access is limited to signed 8-bit offsets from `FP`; arbitrary
  indexed access to the data stack is unavailable.
- Language checking limits indexes to the declared array size; a dynamic
  out-of-bounds index causes a runtime fault. In `chip8-dev`, writes through
  instructions `F033`/`F055` are also checked against RAM bounds and overlap
  with protected `.rodata`.
- `.rodata` protection is a runtime contract only for `chip8-dev`; ordinary
  ROMs and assembler mode do not receive a read-only range.
- The VFS syscall boundary checks addresses and user-RAM ranges, UTF-8 names,
  `.rodata` protection, and overlap with the request block. The ABI and status
  specification is in section 8.

## 3. Target profile and opcode registry

### MVP profile

**Agreed for MVP:** the first compiler version targets `chip8-dev`, the base
CHIP-8 machine plus the explicitly listed project extensions. SCHIP and
XO-CHIP are not part of the first implementation. Codes described in the
published SCHIP 1.1 and XO-CHIP 1.0/1.1 specifications must not be assigned to
custom instructions without a separate decision.

The registry below is based on [the SCHIP 1.1 description](http://devernay.free.fr/hacks/chip8/schip.txt)
by Bruce Bryntse and the provided XO-CHIP/Octo description. It shows
assignments in those specific profiles; it does not guarantee availability
against every future extension.

| Opcode / pattern | CHIP-8 meaning | SCHIP 1.1 | XO-CHIP 1.0/1.1 | Project status |
|---|---|---|---|---|
| `0NNN` | Historical `SYS NNN`; behavior depends on implementation | Do not assign to a custom instruction | Not assigned in the cited specification | Reserve; do not use for the ABI |
| `00E0`, `00EE` | `CLS`, `RET` | Retained | Retained | Occupied |
| `00Cn`, `00FB`, `00FC`, `00FD`, `00FE`, `00FF` | Not base instructions | Scroll down, scroll right/left, exit, low/high resolution | Retained as part of the SCHIP-compatible base | Reserved for SCHIP |
| `00DN` | Not a base instruction | Not assigned | Scroll up by N pixels | Reserve for XO-CHIP |
| `1NNN`, `2NNN`, `3XNN`, `4XNN`, `5XY0`, `6XNN`, `7XNN` | Jump, call, skips, load, add | Compatible | Compatible | Occupied |
| `5001` (exact match) | Not defined by base CHIP-8 | Not defined | Not defined in the described XO-CHIP | Reserved as the `chip8-dev` escape prefix; use only in this profile |
| `5XY2`, `5XY3` | Not base instructions | Not assigned | Save/load a register range through `I`, without post-increment | Reserved for XO-CHIP |
| `8XY0`–`8XY7`, `8XYE` | Copy, logic, arithmetic, shifts | Retained, but shift interpretation depends on a quirk | Retained | Occupied; do not use for custom instructions |
| `8XY8`–`8XYD`, `8XYF` | Not defined by the base set | Not assigned | Not assigned in the cited specification | Possible `chip8-dev` slots, but first check the complete implementation/other-extension tables |
| `9XY0`, `ANNN`, `BNNN`, `CXNN`, `DXYN` | Skip, `I`, jump-with-V0, random, draw | Compatible; `DXY0` has SCHIP meaning | Compatible | Occupied |
| `DXY0` | Sprite height is zero in base mode | 16×16 sprite | Retains the SCHIP-compatible meaning | Reserve for SCHIP/XO-CHIP |
| `EX9E`, `EXA1` | Key skips | Retained | Retained | Occupied |
| `FX07`, `FX0A`, `FX15`, `FX18`, `FX1E`, `FX29`, `FX33`, `FX55`, `FX65` | Timers, key, `I`, font, BCD, memory transfer | Retained | Retained | Occupied; transfer semantics also depend on quirks |
| `F000` + next 16-bit word | Not a base instruction | Not assigned | Long 16-bit `I` load; two-word instruction | Reserve for XO-CHIP |
| `FX30` | Not a base instruction | Large hex font | Retained in XO profile | Reserve for SCHIP/XO-CHIP |
| `FN01`, `F002`, `FX3A` | Not base instructions | Not assigned | Plane, audio pattern, pitch | Reserve for XO-CHIP |
| `FX75`, `FX85` | Not base instructions | Save/load flags; SCHIP limits the supported range | Save/load flags, generalized through `VF` | Reserve for SCHIP/XO-CHIP |
| `F0F1`–`F0F7` with mask `F0FF` | Not base instructions | Not assigned | Not assigned in the cited specification | Already occupied by the project stack extension |
| `F00C`, `F00D`, `F00F` with mask `F00F` | Not base instructions | Not assigned | Not assigned in the cited specification | Already occupied by project `MUL`, `DIV`, `REM` |
| `F0F8`–`F0FF` with exact low byte | Not assigned by the base set | Not assigned in SCHIP 1.1 | Not assigned in the cited XO-CHIP specification | Candidate free space in known profiles, but unassigned; decoder checks and a reservation decision are required |
| Other `F...` | Meaning depends on the low byte | Includes SCHIP/XO assignments above | Includes XO assignments above | Do not treat as free merely because the current interpreter ignores them |

The `0x5001` escape prefix introduces exactly one following 16-bit extension
word. The entire prefix is fixed (it is not a `5XY1` pattern); the extension
word is not a separate ordinary CHIP-8 instruction in `chip8-dev`.

#### Semantic quirks are not separate opcodes

An opcode can be standard while its behavior varies:

- `8XY6` / `8XYE`: the historical behavior shifts `VY` into `VX`; the
  alternative quirk shifts `VX`.
- `FX55` / `FX65`: in the current emulator, `load_store_quirks = false`
  increments `I` by `X + 1`; when the quirk is enabled, `I` is preserved.
- In the current emulator these behaviors are selected at ROM load time via
  quirk flags; they are not encoded in the opcode.

`chip8-dev` must use a fixed quirk profile rather than depending on accidental
settings from a previously loaded ROM. **Agreed:** all quirks are off for
compiled programs. Ordinary games use values from `programs.json`, or defaults
(all `false`) if no entry exists.

#### Rules for assigning custom instructions

1. Add an opcode only after checking the complete profile registry, decode
   mask, and instruction length.
2. Treat SCHIP/XO-CHIP codes as reserved even before those profiles are
   implemented.
3. Do not promise compatibility with undocumented future extensions; reserve
   available space explicitly for a `chip8-dev` version.
4. A custom opcode must be recognized only in `chip8-dev`. The same code in
   base mode must not unexpectedly change existing ROM behavior.
5. Prefix `0x5001` and its following word form a two-word instruction. The
   compiler must not place a classic `SE`/`SNE` skip immediately before an
   extension: a standard skip skips one word, whereas an extension is not a
   target of the classic conditional skip.
6. `0x5001` was selected as the escape prefix. It is free in the CHIP-8,
   SCHIP 1.1, and XO-CHIP 1.0/1.1 sets considered here, but this is not a
   guarantee about unknown future extensions.

## 4. Current assembler

### Syntax and placement

- A comment starts with `;` and continues to the end of the line.
- Mnemonics, registers, and labels are case-insensitive.
- A label has the form `name:`. ASCII letters, digits, and `_` are allowed;
  the first character must be a letter or `_`. A label can precede an
  instruction on the same line.
- `ORG address` sets the address for the next definition; values range from
  `0` to `0xFFF`.
- `DB byte[, byte ...]` places one or more bytes. Decimal and `0x...`
  hexadecimal numbers are accepted. Byte values range from `-128` through
  `255`; negative values are encoded modulo 256.
- Other instructions occupy two bytes. Their placement and `DB` must remain
  within RAM `0x000..0xFFF`.
- Contiguous addresses are returned as one segment; `ORG` can create multiple
  segments.
- Duplicate label definitions and overlapping placements are forbidden.
- Commas between arguments are optional, but leading, trailing, and repeated
  commas are errors.
- Decimal and `0x` literals are supported. Expressions, strings, macros,
  include directives, and local labels are not currently supported.

### Supported mnemonics

The actual operand forms are defined by `encodeInstruction()` and
`encodeLoad()` in `web/src/assembler/asm.js`.

| Group | Mnemonics |
|---|---|
| Control and skip | `CLS`, `RET`, `JP address`, `JP V0, address`, `CALL address`, `SE`, `SNE` |
| Load and arithmetic | `LD`, `ADD`, `OR`, `AND`, `XOR`, `SUB`, `SUBN`, `MUL`, `DIV`, `REM` |
| Shift and graphics | `SHR`, `SHL`, `RND`, `DRW`, `SKP`, `SKNP` |
| Data-stack extension | `PUSH`, `POP`, `PUSHA`, `POPA`, `PEAK`, `SIZESTACK`, `CLEARSTACK` |
| `chip8-dev` extension | `ENTER`, `LEAVE`, `ADJSP`, `DROP`, `LDX`, `STX`, `LDI`, `TRAP` |
| Directives | `ORG`, `DB` |

Examples of supported forms:

```asm
ORG 0x200
start: LD V0, 5
       ADD V0, 1
       SE V0, 6
       JP start
       LD I, sprites
       DRW V1, V2, 5
       CALL routine
       JP V0, table
routine:
       RET
sprites: DB 0xF0, 0x90, 0xF0
table:   DB 0, 2, 4
```

This is a short syntax example, not a guarantee that a particular program's
execution logic is correct.

### Current assembler errors

`AssemblerError` from `asm.js` contains:

- `name === "AssemblerError"`;
- `line`: the line number, starting at 1;
- `sourceLine`: the source line without its comment or surrounding whitespace;
- `message`: text in the form `Line N: <description>`.

Errors **do not yet have stable machine-readable codes**. The classification
below reflects actual conditions and current implementation messages; do not
treat the text as a stable API. Messages and ranges may change as the compiler
evolves.

| Condition | Current message |
|---|---|
| Label name does not match the permitted format | `Invalid label "<label>".` |
| Label is defined more than once | `Duplicate label "<label>".` |
| Leading, trailing, or repeated comma | `Malformed argument separators.` |
| Incorrect argument count | `"<instruction>" expects N argument(s), got M.`; `argument` is used for one argument and `arguments` for other counts |
| Unknown instruction or directive | `Unknown instruction or directive "<name>".` |
| Invalid register | `Invalid register "<token>"; expected V0 through VF.` |
| Value is not a number or is out of range | `Invalid <description> "<token>"; expected a value from <min> to <max>.` |
| Label is missing or address is out of range | `Unknown label or invalid address "<token>".` |
| Invalid indexed `JP` form | `The indexed JP form is JP V0, address.` |
| Empty `DB` directive | `DB expects at least one byte value.` |
| Code/data exceeds address space | `The statement exceeds the 4 KiB CHIP-8 address space.` |
| Byte overlaps an already placed byte | `Address 0x<HEX> is defined more than once.` |
| Non-string source passed | `TypeError: Assembly source must be a string.`; this is not an `AssemblerError` and has no line number |

`<description>` includes `origin`, `byte value`, `8-bit value`, and
`sprite height`. The exact range is included in the diagnostic text.

Unknown mnemonics, operand errors, invalid numbers, registers, and addresses
are no longer encoded as a zero opcode. Add a test in
`web/src/assembler/asm.test.js` for every added diagnostic.

### CHIP Language compiler error codes — agreed for MVP

| Code | Category | When issued |
|---|---|---|
| `LANG001` | Syntax error | Grammar error or unexpected/expected token |
| `LANG002` | Type mismatch | Incompatible types or invalid expression type, including arguments |
| `LANG003` | Undefined symbol | Variable or function was not found |
| `LANG004` | Recursion not allowed | A direct or indirect call cycle was found |
| `LANG005` | Missing main | Required `fn u8 main()` is absent |
| `LANG006` | Duplicate definition | Identifier was declared more than once |
| `LANG007` | Invalid argument count | Incorrect number of arguments |
| `LANG008` | Missing return | Not every path through a value-returning function returns a value |
| `LANG009` | Unsupported feature | Construct is not supported by the MVP |
| `LANG010` | Memory layout / overlap | Section placement error or memory overlap |
| `LANG011` | Module not found | Imported `<module>.chip` file is missing or no resolver was supplied |
| `LANG012` | Cyclic module import | Cyclic module dependency |
| `LANG013` | Invalid module encoding | Module source is not valid UTF-8 |
| `LANG014` | Module filename too long | `<module>.chip` exceeds the VFS filename limit |

### Emulator runtime errors

These are not compiler errors or `AssemblerError`s. `get_execution_fault()`
returns a sticky code; execution stops until the machine is reset.

| Code | C name | Meaning |
|---:|---|---|
| `0` | `CHIP8_FAULT_NONE` | No error |
| `1` | `CHIP8_FAULT_DATA_STACK_OVERFLOW` | Data-stack overflow |
| `2` | `CHIP8_FAULT_DATA_STACK_UNDERFLOW` | Data-stack underflow |
| `3` | `CHIP8_FAULT_CALL_STACK_OVERFLOW` | Call-stack overflow on `CALL` |
| `4` | `CHIP8_FAULT_CALL_STACK_UNDERFLOW` | `RET` with an empty call stack |
| `5` | `CHIP8_FAULT_DIVISION_BY_ZERO` | Division or remainder by zero in `chip8-dev` |
| `6` | `STACK_FAULT_FRAME_UNDERFLOW` | Frame access below the data-stack lower bound |
| `7` | `STACK_FAULT_INVALID_FRAME` | Invalid frame, `FP`, or unallocated address |
| `8` | `CHIP8_FAULT_INVALID_INSTRUCTION` | Invalid extension word or impossible opcode fetch |
| `9` | `CHIP8_FAULT_MEMORY_BOUNDS` | Read/write outside RAM or generated trap for an array-bounds violation |
| `10` | `CHIP8_FAULT_WRITE_PROTECTED` | CHIP-8 instruction wrote into `.rodata` |

Codes `0..4` were already used by the emulator; `5..10` were added for
`chip8-dev`. `STACK_FAULT_*` in `src/stack.h` returns `0`, `1`, `2`, `6`, or
`7`; `get_execution_fault()` combines data-stack faults with machine errors.

For overflow the UI displays `Runtime Error: Stack overflow`; for `0x05` it
displays `Runtime Error: Division by zero`. Fault `0x06` is displayed as
`Runtime Error: Stack Underflow`, `0x07` as `Runtime Error: Invalid Stack
Frame`, `0x09` as `Runtime Error: Memory bounds violation`, and `0x0A` as
`Runtime Error: Write to read-only memory`. Codes `0x03/0x04` remain call-stack
overflow/underflow; code `0x02` remains data-stack underflow.

Runtime faults stop execution and are logged with the PC and, for CHIP
Language, the source line/column. The IDE highlights the faulting line. When
`main` returns, the idle loop stops and the IDE status displays the exit code
from `V0`.

## 5. Compiler architecture, language syntax, and features

### CHIP Language syntax and MVP features

This section describes CHIP Language, not CHIP-8 Assembly. In the IDE, the
button selects the mode: **COMPILE CHIP LANGUAGE** parses the language, while
**COMPILE & RUN** assembles source. The filename extension does not switch
modes; save language source as `.chip`.

#### File structure

At file scope, imports, static arrays, and functions are allowed. A static
array declaration cannot be placed inside a function.

```chip
import math.increment;

rodata u8 start[2] = [40, 2];

fn u8 main() {
    return math.increment(start[0] + start[1]);
}
```

A function with a numeric result is written `fn u8 name(...)`; a procedure
without a result is `fn name(...)`. In the MVP a function can return only one
`u8` value or return no value. `u8[]` is permitted as a parameter type, not a
return type.

#### Functions, parameters, and local variables

```chip
fn u8 add(left: u8, right: u8) {
    u8 sum = left + right;
    return sum;
}

fn increment_in_place(mut value: u8[]) {
    value[0] = value[0] + 1;
    return;
}

fn u8 main() {
    u8 answer = add(20, 22);
    return answer;
}
```

Local variables are scalar `u8` or `bool` only; both type and initializer are
required. Arrays are passed to functions by reference as `name: u8[]`;
`mut name: u8[]` permits modification of the passed array. A procedure uses
`return;`, and a `u8` function uses `return expression;`. An array cannot be
returned or used as a standalone expression: index it as `array[index]` or
pass it as an argument to another array parameter.

#### Branches, loops, and expressions

```chip
fn u8 main() {
    u8 count = 0;
    while (count < 4) {
        count = count + 1;
    }

    bool ready = count == 4 && true;
    if (ready) {
        return count;
    } else {
        return 0;
    }
}
```

`if`/`while` conditions must have type `bool`. Logical `&&` and `||` are
lazy (short-circuit). Numbers are decimal or `0x` hexadecimal byte literals
(`0..255`); `u8` arithmetic wraps modulo 256. Supported operators are `!`,
unary `-`, `*`, `/`, `%`, `+`, `-`, comparisons `<`, `>`, `<=`, `>=`, `==`,
`!=`, `&&`, `||`, and assignment `=`.

#### Arrays and modules

Static `data`, `rodata`, and `bss` arrays are declared at file scope. Example
of a function that changes an array passed to it:

```chip
data u8 initArr[8] = [5, 5, 5, 5, 2, 8, 8, 8];

fn u8 main() {
    rle(initArr);
    return initArr[0];
}

fn rle(mut arr: u8[]) {
    arr[0] = arr[0] + 1;
    return;
}
```

Functions may be declared before or after their call site. To call a function
from another file, save the module as `rle.chip`, declare `pub fn ...`, write
`import rle.rle;` in the program, and call `rle.rle(initArr);`. Module
functions are private without `pub`; an importable array is declared
`pub rodata u8 table[N] = [...];`. Public `.data` and `.bss` are unsupported.
VFS functions use the built-in `disk` module, for example `import disk;` and
`disk.read_file(...)`.

Every statement ends in `;` except a block's closing `}`. Comments are
`// ...` and `/* ... */`. Names are case-sensitive.

#### Why the example in the screenshot produces an error

The screenshot contains:

```chip
fn u8 main() {
    data u8 initArr[8] = [5, 5, 5, 5, 2, 8, 8, 8];
    rle(initArr);
    return 1;
}

pub fn u8[] rle(arr: u8[]) {
    return arr;
}
```

Two unsupported constructs appear here:

1. `data` is a file-scope static-array declaration, not a local statement.
   The parser therefore treats `data` as the start of an expression and
   reports `Expected ";"` at `u8` (position `2:6` in the screenshot). Move the
   `data ...` declaration before the functions.
2. A function cannot return `u8[]`. The MVP return type is only `u8` or
   omitted; an array can be passed as a parameter, optionally `mut`, and
   modified in place. Remove `u8[]` after `fn` and do not write
   `return arr;`.

The corrected form is shown above: the array is declared before `main`,
`rle` accepts `mut arr: u8[]`, and it uses `return;`. For a function in a
separate module, add `pub` to the declaration.

```chip
pub fn u8 increment(value: u8) {
    return value + 1;
}
```

This is an example of a `math.chip` file; `pub` makes the function available
to importing modules.

The compiler currently implements a lexer, parser, type/name checking,
required-return and recursion checks, compile-time module loading/linking,
`chip8-dev` instruction generation, and ROM construction. Compiled code is
loaded from the IDE and run by the emulator. Runtime tests cover calls, local
variables, loops, short-circuit evaluation, division by zero, `main`'s exit
code, BSS initialization, array indexing, RAM bounds, and `.rodata`
protection.

Top-level byte arrays are supported:
`data u8 name[N] = [...];`, `rodata u8 name[N] = [...];`, and
`bss u8 name[N];`. Size is explicit; `.data`/`.rodata` initializer counts must
match it. In an imported module, `pub rodata u8 name[N] = [...];` exposes
`module.name[index]`; public `.data` and `.bss` are unsupported. Placement is
automatic after `.text`, then `.data`, `.rodata`, `.bss`; names are included
in the symbol table. Startup code zeroes BSS before calling `main`, including
objects larger than 255 bytes.

For file API calls, a filename array is specified as bytes, for example
`rodata u8 filename[8] = ['P', 'O', 'N', 'G', '.', 'c', 'h', '8'];`. A
trailing NUL is not required; the array length is passed to the built-in
`disk` function implicitly through the ABI.

Elements are accessed using `name[index]`. Index and element type are `u8`.
A constant index known to be outside the object is rejected at compile time
(`LANG002`); dynamic indexes receive a generated check and `TRAP 9`. Arrays
larger than 255 bytes are safe to index, but the 8-bit index can reach only
elements `0..255`. `.data` and `.bss` can be read and written; `.rodata` can
be read, and a write stops `chip8-dev` with fault `10`, including writes not
generated by the language compiler. Protection is configured for one
contiguous `.rodata` section when a compiled program starts and is reset when
an ordinary ROM is loaded or the emulator is reset.

#### Brief grammar reference

- The required entry point is `fn u8 main() { ... }`; it returns a `u8` exit
  code.
- Local declarations look like `u8 count = 0;` or `bool ready = true;`.
  Local arrays and `data` declarations inside a function are unsupported.
- Function arguments are comma-separated and have the form `name: u8`,
  `name: u8[]`, or `mut name: u8[]`. A function result is only `u8`; omission
  of a result type means a procedure.
- Calls to functions with a result can appear in expressions. Procedures
  without a result can only be called as a statement: `draw();`.
- Every local declaration, assignment, call used as a statement, and `return`
  statement ends in `;`. An empty statement `;` is allowed. Do not put a
  semicolon after `}`.
- Conditions require `bool`; implicit conversion from `u8` is not allowed.
  `u8` arithmetic wraps modulo 256 and comparisons are unsigned.
- Literals: decimal and hexadecimal `u8` (`42`, `0x2A`), `true`/`false`; the
  character literal `'A'` or byte escape `'\x2A'` is also `u8`. Supported
  escapes are `\n`, `\r`, `\t`, `\0`, `\\`, `\'`, and `\xNN`.
- Operator precedence, high to low: call/grouping; unary `!` and `-`;
  `* / %`; `+ -`; `< > <= >=`; `== !=`; `&&`; `||`; `=`. Binary operators
  associate left-to-right; assignment associates right-to-left. `&&` and
  `||` short-circuit.
- Comments: `//` and `/* ... */`. Names are case-sensitive. A local
  variable's scope ends with its block; shadowing in a nested block is
  allowed.
- Every path through a `u8` function must end with `return expression;`;
  procedures use `return;`. Direct and indirect recursion are prohibited.

Global scalar variables, local arrays, string literals, pointers, `for` loops,
`break`/`continue`, and language-level `ORG` are not currently supported.
Static arrays are declared at file scope and placed automatically; the
combined code/data/BSS size is checked against CHIP-8 memory.

### Plan

Recommended compilation flow:

```text
CHIP Language source
    -> tokens with source locations
    -> AST
    -> recursive loading and linking of .chip modules
    -> name and scope resolution
    -> type and semantic checking
    -> intermediate representation (IR)
    -> lowering to target profile/assembly
    -> placement checking and segments
    -> load into emulator
```

The compiler should be independent of the DOM, retain spans (file/line/column)
for diagnostics, and provide structured results to the UI. The current
`asmToBin()` can remain the first-version backend, but textual assembly should
not have to remain the permanent internal IR.

The first version targets `chip8-dev`. Base CHIP-8, SCHIP, and XO-CHIP are not
compiler targets yet. SCHIP/XO-CHIP could later become separate profiles after
their instructions are implemented and tested. **Agreed:** all quirk flags
are `false` for compiled code. Ordinary games use quirks from `programs.json`,
and defaults (all flags `false`) when no settings are present.
`runAsm(source, { profile: 'chip8-dev' })` explicitly enables the profile;
ordinary ROM loading disables it.

### Frontend implementation and limitations

The implemented JavaScript pipeline is lexer → parser → import loading/linking
→ symbol resolution and type checking → recursion checking → code generation
→ layout through the assembler. `compile(source, { resolveModule, sourceName
})` returns `Uint8Array rom`, `baseAddress`, symbol addresses, source map,
segments, and assembler text. The source map links machine-code ranges to
file/line/column and is used by the IDE for runtime diagnostics. An empty
statement `;` compiles to `7000`.

Static arrays and array parameters by reference, `if/else`, `while`, the VFS
API, and multi-module linking are implemented for the MVP. Pointers, dynamic
memory, local arrays, `for` loops, `break`/`continue`, symbol re-exports, and
SCHIP/XO-CHIP are deferred. `VF` is reserved for flags and is not an ordinary
language register.

## 6. ABI and stack

### Agreed for MVP

- The first language version supports `u8`, `bool`, expressions, local
  variables, static arrays, `u8[]` parameters, `if/else`, `while`, functions,
  and compile-time imports without cycles. Pointers, dynamic memory, and
  SCHIP/XO-CHIP are deferred.
- Syntax is C-like. The required entry point is `main()` with no parameters;
  it returns a `u8` exit code in `V0`.
- `u8` uses wrap-around arithmetic; `bool` uses values `0`/`1`; implicit
  conversions are prohibited; `VF` is not used as an ordinary register.
- The data stack remains isolated from CHIP-8 RAM and has a capacity of
  1024 bytes. `SP` and `FP` are hidden VM state, not program registers.
- The stack grows upward. The caller passes arguments left-to-right. A
  function result is in `V0`; `V0`–`VE` are caller-saved, and the callee
  returns its result in `V0`.
- Multi-byte values are agreed to be stored big-endian in consecutive stack
  cells. MVP user types remain one byte; hidden array-reference address and
  size values are passed as two big-endian 16-bit values.
- A stack error is fatal for the current run: the emulator records a runtime
  fault, stops execution, and reports the cause. Check an operation before
  changing `SP`.
- Sections are ordered `.text`, `.data`, `.rodata`, `.bss`; users will be
  able to set an explicit address through a section/`ORG` combination.
- `.bss` occupies a RAM range but no ROM bytes; generated language startup
  code zeroes `.bss`. This startup code is not used when loading ordinary ROMs.
- Compiler output includes loadable segments, a symbol map, and a source map
  to source lines.

### Frame ABI — agreed for MVP

- The caller pushes arguments left-to-right onto a separate data stack; `SP`
  points to the next free cell. CHIP-8 `CALL` stores its return address on the
  hardware call stack and does not occupy data-stack bytes.
- `ENTER` writes the old 16-bit `FP` big-endian at `[SP]`, `[SP+1]`, advances
  `SP` by two, and sets `FP = SP`.
- To give the first local the required offset `[FP+1]`, `ENTER` reserves an
  unused byte `[FP]`; after entering the frame, `SP = FP+1`. Locals occupy
  `[FP+1]..[FP+local_count]`.
- Let `B` be the total argument size in bytes: a scalar `u8` is one byte and
  `u8[]` is four bytes (big-endian `u16` address followed by big-endian `u16`
  length). Arguments and their bytes are pushed left-to-right. The first
  argument byte is at `[FP - 2 - B]`; byte `i` is at
  `[FP - 2 - B + i]`.
- `ADJSP n` reserves `n` local bytes and moves `SP` upward; `DROP n` frees
  `n` bytes. `LEAVE` drops locals, sets `SP = FP+1`, reads the old `FP` from
  `[FP-2..FP-1]`, then restores `SP = FP-2` and the previous `FP`. The caller
  removes its arguments after the return.
- `LDX i8` reads `[FP + signed_offset]` into `V0`; `STX i8` writes `V0` to
  the same address. `LDI i8` reads a big-endian `u16` from
  `[FP + signed_offset]` into `I`. The offset is signed `i8` (`-128..127`);
  zero addresses the reserved frame byte, not a local or argument.
- For a `u8[]` parameter, the first two bytes are the address and the next
  two are the length. Indexing checks the index against the passed length;
  `mut name: u8[]` permits writes, while an ordinary array parameter is
  read-only. The caller frees all argument bytes after return.
- Every operation checks bounds before changing `SP` or accessing memory. An
  invalid frame range causes a runtime fault; the exact distinction between
  underflow and invalid frame is recorded in the runtime-fault table.

### `chip8-dev` extension encoding

The selected escape prefix is exactly `0x5001`, followed by one 16-bit word.
In that word the high byte is the sub-opcode and the low byte is the immediate
operand. All extensions occupy 4 bytes.

| Word after `0x5001` | Instruction | Semantics |
|---|---|---|
| `0x0000` | `ENTER` | Save old `FP` and create a frame |
| `0x0100` | `LEAVE` | Free the frame and restore `FP` and `SP` |
| `0x02NN` | `ADJSP NN` | Reserve `NN` local bytes |
| `0x03NN` | `DROP NN` | Free `NN` local bytes |
| `0x04ii` | `LDX ii` | Load `[FP + i8(ii)]` into `V0` |
| `0x05ii` | `STX ii` | Write `V0` to `[FP + i8(ii)]` |
| `0x06NN` | `TRAP NN` | Immediately stop with the specified runtime-fault code |
| `0x07ii` | `LDI ii` | Load big-endian `u16` from `[FP + i8(ii)]` into `I` |
| `0x08NN` | `SYS NN` | Execute VFS syscall `NN` with the request block at `I` |

`0x5001` is decoded only in `chip8-dev`. Extensions are not targets of
classical `SE`/`SNE` or key-skip instructions. The compiler must arrange
conditional branches so a classical skip cannot skip only the prefix and land
on the operand word. The prefix is free in the CHIP-8, SCHIP 1.1, and XO-CHIP
1.0/1.1 sets considered here, but is not guaranteed free in unknown future
extensions.

## 7. Sections, startup, and linking

### Agreed for MVP

- CHIP-8 memory spans `0x000..0xFFF`; `0x000..0x1FF` is reserved and a
  loadable program starts at `0x200`. The available range `0x200..0xFFF`
  contains **3584 bytes** (`0xE00`), not 4192.
- Automatic section order: `.text` → `.data` → `.rodata` → `.bss`.
- A section's location may be set explicitly using `ORG`.
- `.bss` occupies RAM, not ROM bytes, and is zeroed by generated language
  startup code.
- Ordinary ROMs do not get CRT and must not change behavior because of BSS
  initialization.
- The compiler combines imported source modules into one ROM; separate object
  files and an external linker stage are outside the MVP.
- Section alignment is byte-aligned (1 byte).
- Explicit `ORG` moves the location counter; overlap with an already occupied
  address is an error.
- Address `0xFFF` is valid for the final byte; writing beyond memory is
  forbidden.
- `.bss` occupies a virtual RAM range without ROM bytes; language startup
  code zeroes it.

Explicit `ORG` that lands on a cell already occupied by an automatic section
is an error; addresses below `0x200` are reserved and unavailable to the
program. The data stack is a separate 1024-byte VM buffer and does not consume
CHIP-8 RAM addresses. `SP` points to the next free cell: `SP == 1024` is a
valid full-stack state, but an operation needing another cell must produce a
runtime fault before changing `SP`.

Agreed startup contract: synthetic code at `0x200` initializes `SP` and `FP`,
zeroes `.bss`, and unconditionally jumps (`JP`) to `main`. Returning from
`main` preserves the exit code in `V0` and jumps to an idle loop. Because
startup uses `JP`, the compiler emits a special exit sequence for `main`
instead of ordinary `RET`. Startup applies only to language programs, not
ordinary ROMs.

## 8. System calls and standard library

Global language variables are forbidden in the MVP. `.data` can contain byte
constants through data directives (for example `DB`); `.rodata` is intended
for library string literals and constant tables. The syntax for placing
directives in sections and the form of string literals remain to be agreed;
string literals themselves are not in the base MVP expression set.

The existing host VFS provides file read, write, size, and delete operations.
It uses a separate 1 MiB virtual disk, up to 64 directory entries, and
filenames of at most 17 UTF-8 bytes. Today its C API accepts WASM pointers and
is available to browser code, but not to CHIP-8 instructions.

**Implemented:** VFS is invoked through the generic `SYS op` instruction only
in `chip8-dev`. It is encoded as `0x5001`, then `0x08NN`; `I` points to the
request block. Operations are `1` for file size, `2` for read, `3` for write,
and `4` for delete. An unknown ID returns status `7`. This extensible
interface does not call host APIs directly from the compiler.

The request block is 11 bytes and byte-aligned:

| Offset | Size | Field |
|---|---:|---|
| `+0` | 2 | Filename address, big-endian `u16` |
| `+2` | 1 | Filename length in bytes |
| `+3` | 2 | Data-buffer address, big-endian `u16` |
| `+5` | 2 | Buffer length/capacity, big-endian `u16` |
| `+7` | 4 | Size/number of bytes processed, big-endian `u32`; output field |

`SYS 1` returns the file size in the output field; `SYS 2` reads a file into
the buffer and, if capacity is insufficient, reports the required size
without modifying the buffer; `SYS 3` writes the specified range; `SYS 4`
deletes the file. Every operation returns status in `V0`: `0` success, `1`
not found, `2` invalid argument, `3` buffer too small, `4` insufficient
space, `5` file limit, `6` VFS error, `7` unknown operation. The result field
is zeroed on errors except `BUFFER_TOO_SMALL`, where it contains the required
size.

**Implemented:** Source code calls VFS built-ins like ordinary functions; the
compiler generates the request block and `SYS`. The API accepts typed arrays
by reference with a length known to the compiler; raw addresses need not be
passed manually. Compiler lowering checks known constraints, and the syscall
boundary independently checks ranges and arguments. No error may cause an
out-of-memory read/write, partial RAM corruption, or host crash.

The request-block, filename, and buffer addresses must lie entirely in
available RAM `0x200..0xFFF`; overlap between the buffer or filename and the
request block is rejected. An invalid CHIP-8 RAM range or a write to protected
`.rodata` causes a fatal runtime fault before VFS is called. Reads first use a
temporary buffer so a VFS error does not leave partially changed RAM.
Filenames (1–17 bytes), UTF-8 validity, lengths, and buffer validity are
checked at the syscall boundary; WASM addresses do not enter the program ABI.
Ordinary filesystem errors are returned as statuses and do not stop the VM.

**Agreed:** a filename is passed as a byte array plus an explicit length.
Before calling the C VFS, a bounded wrapper checks length (no more than 17
UTF-8 bytes), data validity, and array address/size; it copies the name into
a bounded temporary NUL-terminated buffer and only then calls the filesystem.
Checks at the library/syscall boundary are mandatory even when compile-time
checks exist.

**Implemented:** array parameters by reference are written `name: u8[]`; the
actual size is known to the compiler at each call and passed implicitly.
Parameters are immutable by default; `mut buffer: u8[]` explicitly permits
modification of the passed array. This form is supported by ordinary
functions; runtime indexing is checked against the passed length.

Byte character literals are used to place filename bytes in an array. A name
remains an array of UTF-8 bytes with an explicit length, and the syscall
boundary independently validates UTF-8 before accessing the VFS.

Requirements for the syscall/runtime implemented by the current ABI:

- pass CHIP-8 RAM addresses and buffers, not WebAssembly pointers;
- check bounds, write permissions, UTF-8, and lengths before RAM/VFS access;
- copy data through bounded temporary buffers;
- test status errors and fatal invalid ranges.

File size and bytes processed are returned through four big-endian bytes in a
`u8[]`; no numeric `u32` type is added to the language. Import the built-in
namespace as `import disk;`. Calls have these forms:
`disk.file_size(filename, size_out)`,
`disk.read_file(filename, buffer, bytes_read)`,
`disk.write_file(filename, data)`, and
`disk.delete_file(filename)`.

These are compiler-lowered built-ins, not user declarations: their bodies are
generated by the compiler and execute `SYS`. All functions return the VFS
status as `u8`; output arrays `size_out` and `bytes_read` must be at least
four bytes long and cannot alias input arrays. Static-array lengths are
checked at compile time; array-parameter lengths are checked at runtime before
the syscall. For `BUFFER_TOO_SMALL`, `bytes_read` contains the required size;
for other VFS results it contains zero. If compiler-side validation rejects
the call before the syscall, the output array is unchanged.

**Resolved for MVP:** `read_file` and `write_file` operate on a whole file.
The supplied buffer must hold the whole file; otherwise a read returns
`BUFFER_TOO_SMALL` without modifying the buffer. A single call can use only
an array that fits in CHIP-8 RAM; chunked I/O with an offset is deferred.

## 9. Implementation plan and completion criteria

1. **Assembler — implemented.** Strict parsing of supported instructions,
   labels, ranges, structured errors, extensions, and tests.
2. **`chip8-dev` profile — implemented.** Custom instructions are isolated
   from ordinary ROMs; the profile is selected explicitly.
3. **Execution contract — implemented for current instructions.** Stack/frame,
   division-by-zero, RAM write bounds, indexing, `.rodata` protection, and VFS
   syscall checks are implemented. WASM runtime tests cover statuses, UTF-8,
   bounds, and absence of partial RAM writes.
4. **Frame ABI/opcodes — implemented.** `ENTER`, `LEAVE`, `ADJSP`, `DROP`,
   `LDX`, `STX`, `LDI`, `TRAP`, and `SYS` are encoded; scalar and
   array-reference arguments have assembler/runtime tests.
5. **Sections, startup, and arrays — implemented for the MVP.** Typed static
   arrays, automatic placement, BSS reservation/zero-init, indexed access,
   passing arrays between functions, bounds checks, and runtime read-only
   `.rodata` are supported. Language `ORG` and explicit section addresses are
   not supported.
6. **Frontend and code generation — basic MVP implemented** in
   `web/src/compiler/`; test coverage is being expanded as constructs are
   added.
7. **Minimal language integration — implemented for the MVP.** The IDE
   displays source-mapped runtime faults and highlights the line; after
   `main` returns it displays the exit code and stops the idle loop.
8. **VFS ABI and compiler-lowered standard library — implemented.** Raw
   addresses remain details of compiler lowering; reading/writing is still
   whole-file without offsets.
9. **SCHIP/XO-CHIP — deferred** until separately needed; add a profile only
   after its instructions are implemented and tested.

Keep tests for both valid programs and invalid inputs at every phase.
Assembler regression tests and the WASM build must pass before adding the next
abstraction layer.

## 10. Next decisions and phases

Frontend, code generation, runtime integration, and source-map feedback in
the IDE are implemented for the MVP. Checks run with `npm test` and
`npm run test:runtime`; the latter rebuilds WASM through Emscripten first.

**MVP decision:** array indexes remain `u8`; arrays larger than 256 bytes are
allowed, but this version can access only elements `0..255`. Wider addressing
will be added alongside future types `u4`, `i4`, `i8`, `u16`, and `i16`.
Pointers and the VFS syscall ABI should be designed with future types in mind,
but the MVP type system should not be expanded for them.

**Agreed and implemented at VM level:** the syscall operation code is in the
immediate of the extended instruction, `I` points to the 11-byte request
block, and `V0` carries the status. Fields and statuses are specified in
section 8. Array parameters use `name: u8[]`, are immutable by default, and
`mut buffer: u8[]` permits writes; the frame ABI already passes address and
actual length implicitly.

The `u8` character literal is implemented as one printable ASCII byte or an
escape `\xNN`/another supported escape. Array parameters are implemented for
all functions through the frame ABI; `LDI` loads an address from the frame,
and indexing checks against the hidden length. Chunked I/O with an offset is
deferred. Module visibility/cycle rules, export of `.rodata` only, prohibition
of aliases, and the `disk.*` namespace have been selected. **Resolved:**
dependency re-exports are deferred; standard libraries other than
compiler-built-ins are supplied as ordinary `.chip` source files on the VFS.
The next architectural phase is to define the API and contents of the first
standard source module.

## 11. Specification stability

- **Implemented** means behavior exists in code and must be covered by tests.
- **Plan** means a proposal, not existing behavior.
- Codes `LANG001..LANG010` and `LANG011..LANG014` are fixed by this document:
  the latter identify an unavailable module, import cycle, invalid UTF-8
  module source, and an overlong module filename. Current `AssemblerError`s
  do not yet have stable identifiers; assign these separately, test codes
  independently of localizable text, and do not reuse numbers.
- Before changing the ABI, runtime fault codes, syntax, or segment format,
  update this document and related tests.

For implementation-level detail, see the
[CHIP Language compiler chapter](chip-language/README.md) and its per-file
and per-function pages. The original Russian working specification remains
unchanged at [`docs-locale/CHIP-LANGUAGE.md`](../docs-locale/CHIP-LANGUAGE.md).
