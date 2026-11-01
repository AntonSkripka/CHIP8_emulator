import test from 'node:test';
import assert from 'node:assert/strict';
import { compile, LanguageError } from '../web/src/compiler/index.js';

test('compiles functions, local variables, calls, and conditional returns', () => {
    const result = compile(`
        fn u8 add(a: u8, b: u8) {
            u8 sum = a + b;
            return sum;
        }

        fn u8 main() {
            u8 value = add(40, 2);
            if (value == 42) {
                return value;
            } else {
                return 0;
            }
        }
    `);

    assert.equal(result.profile, 'chip8-dev');
    assert.equal(result.baseAddress, 0x200);
    assert.ok(result.rom instanceof Uint8Array);
    assert.ok(result.rom.length > 0);
    assert.equal(result.symbols.main > 0x200, true);
    assert.equal(result.rom[0], 0x10 | (result.symbols.__start >> 8));
    assert.equal(result.rom[1], result.symbols.__start & 0xFF);
    assert.match(result.assembly, /ENTER/);
    assert.match(result.assembly, /LDX -4/);
    assert.match(result.assembly, /CALL __FN_0/);
    assert.ok(result.sourceMap.some(({ synthetic }) => synthetic));
    assert.ok(result.sourceMap.some(({ line, column }) => line > 0 && column > 0));
    assert.ok(result.sourceMap
        .filter(({ synthetic }) => !synthetic)
        .every(({ line, column }) => Number.isInteger(line) && Number.isInteger(column)));
});

test('supports loop code generation and lexical variable shadowing', () => {
    const result = compile(`
        fn u8 main() {
            u8 count = 0;
            while (count < 3) {
                u8 count = 2;
                count = count + 1;
                count = 3;
            }
            if (count == 0) {
                return 0;
            } else {
                return count;
            }
        }
    `);

    assert.match(result.assembly, /__L_/);
    assert.match(result.assembly, /JP __L_/);
    assert.match(result.assembly, /STX 1/);
    assert.match(result.assembly, /STX 2/);
});

test('reports stable diagnostics for missing main, undefined symbols, and type errors', () => {
    const cases = [
        ['fn u8 other() { return 0; }', 'LANG005'],
        ['fn u8 main() { return missing; }', 'LANG003'],
        ['fn u8 main() { if (1) { return 0; } else { return 1; } }', 'LANG002'],
        ['fn u8 main() { return 256; }', 'LANG002']
    ];

    for (const [source, code] of cases) {
        assert.throws(() => compile(source), (error) =>
            error instanceof LanguageError && error.code === code &&
            Number.isInteger(error.line) && Number.isInteger(error.column));
    }
});

test('loads selected module exports from .chip files and preserves module source maps', () => {
    const moduleSource = `
        fn u8 increment(value: u8) { return value + 1; }
        pub fn u8 add_one(value: u8) { return increment(value); }
        fn u8 unused() { return 0; }
    `;
    const loadedFiles = [];
    const result = compile(`
        import math.add_one;
        fn u8 main() { return math.add_one(41); }
    `, {
        resolveModule(filename) {
            loadedFiles.push(filename);
            return new TextEncoder().encode(moduleSource);
        }
    });

    assert.deepEqual(loadedFiles, ['math.chip']);
    assert.match(result.assembly, /CALL __FN_1/);
    assert.match(result.assembly, /CALL __FN_2/);
    assert.equal(typeof result.symbols['math.add_one'], 'number');
    assert.ok(result.sourceMap.some(({ fileName }) => fileName === 'math.chip'));
});

test('supports importing every module export and rejects unselected or missing exports', () => {
    const resolver = () => new TextEncoder().encode(`
        pub fn u8 selected() { return 1; }
        pub fn u8 unselected() { return 2; }
        fn u8 private_helper() { return 3; }
    `);

    assert.doesNotThrow(() => compile(`
        import library;
        fn u8 main() { return library.unselected(); }
    `, { resolveModule: resolver }));
    assert.doesNotThrow(() => compile(`
        import library.selected, library.unselected;
        fn u8 main() { return library.selected() + library.unselected(); }
    `, { resolveModule: resolver }));

    assert.throws(() => compile(`
        import library.selected;
        fn u8 main() { return library.unselected(); }
    `, { resolveModule: resolver }), (error) =>
        error instanceof LanguageError && error.code === 'LANG003');
    assert.throws(() => compile(`
        import library.unknown;
        fn u8 main() { return 0; }
    `, { resolveModule: resolver }), (error) =>
        error instanceof LanguageError && error.code === 'LANG003');
    assert.throws(() => compile(`
        import library;
        fn u8 main() { return library.private_helper(); }
    `, { resolveModule: resolver }), (error) =>
        error instanceof LanguageError && error.code === 'LANG003');
});

test('reports unavailable, cyclic, oversized, and invalid-UTF-8 modules', () => {
    assert.throws(() => compile('import absent; fn u8 main() { return 0; }', {
        resolveModule: () => null
    }), (error) => error.code === 'LANG011');

    const cycle = {
        'first.chip': new TextEncoder().encode('import second; pub fn u8 first() { return second.second(); }'),
        'second.chip': new TextEncoder().encode('import first; fn u8 second() { return 0; }')
    };
    assert.throws(() => compile('import first; fn u8 main() { return first.first(); }', {
        resolveModule: (filename) => cycle[filename]
    }), (error) => error.code === 'LANG012');

    assert.throws(() => compile('import module_name_too_long; fn u8 main() { return 0; }', {
        resolveModule: () => new Uint8Array()
    }), (error) => error.code === 'LANG014');
    assert.throws(() => compile('import invalid; fn u8 main() { return 0; }', {
        resolveModule: () => new Uint8Array([0xFF])
    }), (error) => error.code === 'LANG013');
});

test('exports read-only arrays as qualified module data', () => {
    const resolveModule = () => new TextEncoder().encode(`
        pub rodata u8 values[2] = [40, 2];
        rodata u8 private_values[1] = [9];
    `);
    const result = compile(`
        import constants.values;
        fn u8 main() { return constants.values[1]; }
    `, { resolveModule });

    assert.equal(result.rom[result.symbols['constants.values'] - result.baseAddress], 40);
    assert.throws(() => compile(`
        import constants;
        fn u8 main() { return constants.private_values[0]; }
    `, { resolveModule }), (error) => error.code === 'LANG003');
    assert.throws(() => compile(`
        pub data u8 values[1] = [1];
        fn u8 main() { return 0; }
    `), (error) => error.code === 'LANG009');
});

test('rejects direct and indirect recursion and missing return paths', () => {
    const recursive = `
        fn u8 loop() { return loop(); }
        fn u8 main() { return loop(); }
    `;
    const mutuallyRecursive = `
        fn u8 first() { return second(); }
        fn u8 second() { return first(); }
        fn u8 main() { return 0; }
    `;

    assert.throws(() => compile(recursive), (error) => error.code === 'LANG004');
    assert.throws(() => compile(mutuallyRecursive), (error) => error.code === 'LANG004');
    assert.throws(() => compile('fn u8 main() { if (true) { return 1; } }'),
        (error) => error.code === 'LANG008');
});

test('supports short-circuit boolean expressions and procedure calls', () => {
    const result = compile(`
        fn set() { return; }
        fn u8 main() {
            bool ready = false;
            set();
            if (ready || true && !false) {
                return -1;
            } else {
                return 0;
            }
        }
    `);

    assert.match(result.assembly, /CALL __FN_0/);
    assert.match(result.assembly, /SE V0, 0/);
    assert.ok(result.rom.length > 0);
});

test('compiles numeric formats, unary operators, arithmetic, and comparisons', () => {
    const result = compile(`
        fn u8 main() {
            u8 value = 0x10 + 3 * 2 - -1;
            bool comparison = value >= 1 && value != 0;
            bool equal = value == 16;
            if (comparison || value <= 255) {
                return value / 2 % 3;
            } else {
                return 0;
            }
        }
    `);

    for (const instruction of ['MUL V0, V1', 'SUB V1, V0', 'DIV V1, V0', 'REM V1, V0',
        'SUBN V1, V0', 'SE V1, V0', 'SNE V1, V0']) {
        assert.ok(result.assembly.includes(instruction), `expected generated instruction: ${instruction}`);
    }
    assert.ok(result.rom.length > 0);
});

test('compiles one-byte character literals in expressions and static data', () => {
    const result = compile(`
        rodata u8 filename[3] = ['C', '\\xC3', '\\xA9'];
        fn u8 main() {
            u8 letter = 'A';
            return letter + filename[0];
        }
    `);

    assert.match(result.assembly, /LD V0, 65/);
    assert.deepEqual(
        [...result.rom.slice(result.symbols.filename - result.baseAddress,
            result.symbols.filename - result.baseAddress + 3)],
        [0x43, 0xC3, 0xA9]
    );
});

test('rejects invalid and non-ASCII direct character literals', () => {
    const sources = [
        `fn u8 main() { return 'é'; }`,
        `fn u8 main() { return 'AB'; }`,
        `fn u8 main() { return '\\x0'; }`,
        `fn u8 main() { return '\\q'; }`
    ];

    for (const source of sources) {
        assert.throws(() => compile(source), (error) =>
            error instanceof LanguageError && error.code === 'LANG001');
    }
});

test('compiles array references as hidden address and length arguments', () => {
    const result = compile(`
        data u8 values[3] = [4, 5, 6];
        fn u8 read_second(items: u8[]) {
            return items[1];
        }
        fn u8 main() {
            return read_second(values);
        }
    `);

    assert.match(result.assembly, /LDI -6/);
    assert.match(result.assembly, /LD V0, 3/);
    assert.ok(result.assembly.includes('CALL __FN_0'));
});

test('supports standard one-byte character escapes', () => {
    const result = compile(String.raw`
        rodata u8 bytes[6] = ['\n', '\r', '\t', '\0', '\\', '\''];
        fn u8 main() { return bytes[0]; }
    `);

    assert.deepEqual(
        [...result.rom.slice(result.symbols.bytes - result.baseAddress,
            result.symbols.bytes - result.baseAddress + 6)],
        [0x0A, 0x0D, 0x09, 0x00, 0x5C, 0x27]
    );
});

test('supports comments, empty statements, nested scopes, and forward function calls', () => {
    const result = compile(`
        // A declaration can call a function defined later.
        fn u8 main() {
            u8 value = twice(20);
            ; /* empty statement */
            {
                u8 value = 2;
                value = value + 1;
            }
            return value;
        }

        fn u8 twice(value: u8) {
            return value + value;
        }
    `);

    assert.match(result.assembly, /ADD V0, 0/);
    assert.match(result.assembly, /CALL __FN_1/);
    assert.ok(result.sourceMap.some(({ synthetic }) => synthetic));
    assert.ok(result.sourceMap.some(({ line, column, synthetic }) =>
        !synthetic && line === 3 && column === 9));
});

test('reports syntax, duplicate-definition, argument-count, and return-type diagnostics', () => {
    const cases = [
        ['fn u8 main() { return 1 }', 'LANG001'],
        ['fn u8 main() { u8 value = 1; u8 value = 2; return value; }', 'LANG006'],
        ['fn u8 helper(value: u8) { return value; } fn u8 main() { return helper(); }', 'LANG007'],
        ['fn u8 main() { bool value = true; return value; }', 'LANG002'],
        ['fn action() { return 1; } fn u8 main() { action(); return 0; }', 'LANG002']
    ];

    for (const [source, code] of cases) {
        assert.throws(() => compile(source), (error) =>
            error instanceof LanguageError && error.code === code &&
            Number.isInteger(error.line) && Number.isInteger(error.column));
    }
});

test('lays out typed data sections and keeps BSS out of ROM bytes', () => {
    const result = compile(`
        rodata u8 sprite[3] = [0xF0, 0x90, 0xF0];
        bss u8 scratch[4];
        data u8 state[2] = [7, 9];

        fn u8 main() {
            return 0;
        }
    `);

    assert.ok(result.symbols.state < result.symbols.sprite);
    assert.ok(result.symbols.sprite < result.symbols.scratch);
    assert.equal(result.bss.start, result.symbols.scratch);
    assert.equal(result.bss.size, 4);
    assert.equal(result.rom.length, result.bss.start - result.baseAddress);
    assert.deepEqual(
        [...result.rom.slice(result.symbols.state - result.baseAddress,
            result.symbols.state - result.baseAddress + 2)],
        [7, 9]
    );
    assert.deepEqual(
        [...result.rom.slice(result.symbols.sprite - result.baseAddress,
            result.symbols.sprite - result.baseAddress + 3)],
        [0xF0, 0x90, 0xF0]
    );
    assert.match(result.assembly, /LD I, __BSS_START/);
});

test('validates static data sizes, initializers, and duplicate symbols', () => {
    const cases = [
        ['data u8 bytes[2] = [1]; fn u8 main() { return 0; }', 'LANG002'],
        ['bss u8 bytes[2] = [0, 0]; fn u8 main() { return 0; }', 'LANG002'],
        ['data u8 bytes[1] = [256]; fn u8 main() { return 0; }', 'LANG002'],
        ['data u8 main[1] = [0]; fn u8 main() { return 0; }', 'LANG006'],
        ['rodata u8 __exit[1] = [0]; fn u8 main() { return 0; }', 'LANG001'],
        ['bss u8 bytes[0]; fn u8 main() { return 0; }', 'LANG010'],
        ['bss u8 bytes[3584]; fn u8 main() { return 0; }', 'LANG010'],
        ['rodata u8 glyph[1] = [0]; fn u8 main() { return glyph; }', 'LANG009'],
        ['rodata u8 glyph[1] = [0]; fn u8 main() { return glyph[1]; }', 'LANG002'],
        ['rodata u8 glyph[1] = [0]; fn u8 main() { return glyph[0 + 1]; }', 'LANG002'],
        ['rodata u8 glyph[1] = [0]; fn u8 main() { return glyph[true]; }', 'LANG002'],
        ['rodata u8 glyph[1] = [0]; fn u8 read(mut bytes: u8[]) { return 0; } fn u8 main() { read(glyph); return 0; }', 'LANG002'],
        ['fn u8 read(bytes: u8[]) { bytes[0] = 1; return 0; } fn u8 main() { return 0; }', 'LANG002'],
        ['fn u8 read(bytes: u8[]) { return bytes[0]; } fn u8 main() { u8 value = 0; return read(value); }', 'LANG002']
    ];

    for (const [source, code] of cases) {
        assert.throws(() => compile(source), (error) =>
            error instanceof LanguageError && error.code === code);
    }
});

test('lowers checked VFS library calls and reserves a private request block', () => {
    const result = compile(`
        import disk;
        data u8 filename[8] = ['t', 'e', 's', 't', '.', 'b', 'i', 'n'];
        rodata u8 contents[2] = [4, 5];
        bss u8 output[2];
        bss u8 size[4];

        fn u8 main() {
            u8 status = disk.file_size(filename, size);
            status = disk.read_file(filename, output, size);
            status = disk.write_file(filename, contents);
            status = disk.delete_file(filename);
            return status;
        }
    `);

    for (const operation of [1, 2, 3, 4]) {
        assert.match(result.assembly, new RegExp(`SYS ${operation}\\b`));
    }
    assert.match(result.assembly, /__VFS_REQUEST:/);
    assert.equal(result.bss.size, 2 + 4 + 11);
});

test('validates VFS array lengths and requires the built-in disk namespace', () => {
    const cases = [
        ['import disk; rodata u8 filename[3] = [1, 2, 3]; bss u8 size[3]; fn u8 main() { return disk.file_size(filename, size); }', 'LANG002'],
        ['import disk; rodata u8 filename[18] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; bss u8 size[4]; fn u8 main() { return disk.file_size(filename, size); }', 'LANG002'],
        ['fn u8 main() { return file_size(); }', 'LANG003']
    ];

    for (const [source, code] of cases) {
        assert.throws(() => compile(source), (error) =>
            error instanceof LanguageError && error.code === code);
    }

    assert.doesNotThrow(() => compile(
        'fn u8 file_size() { return 0; } fn u8 main() { return file_size(); }'
    ));
});
