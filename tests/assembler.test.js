import test from 'node:test';
import assert from 'node:assert/strict';
import { AssemblerError, asmToBin } from '../web/src/assembler/asm.js';
import { Chip8Core } from '../web/src/core/emulator_core.js';

function encoded(source) {
    return asmToBin(source).flatMap(({ bytes }) => bytes.map(({ val }) => val));
}

test('assembles common instructions and case-insensitive labels', () => {
    assert.deepEqual(encoded(`
        start: LD V0, 5
        ADD V0, 1
        JP Start
    `), [0x6005, 0x7001, 0x1200]);
});

test('encodes register and immediate instruction forms', () => {
    assert.deepEqual(encoded(`
        LD VA, VF
        SE V1, V2
        SNE V3, 0x10
        ADD I, V4
        DRW V5, V6, 0xF
    `), [0x8AF0, 0x5120, 0x4310, 0xF41E, 0xD56F]);
});

test('encodes every supported instruction instead of silently emitting zero', () => {
    const instructions = [
        'CLS', 'RET', 'JP target', 'JP V0, target', 'CALL target',
        'SE V0, V1', 'SE V0, 1', 'SNE V0, V1', 'SNE V0, 1',
        'LD I, target', 'LD DT, V0', 'LD ST, V0', 'LD F, V0', 'LD B, V0',
        'LD [I], V0', 'LD V0, DT', 'LD V0, K', 'LD V0, [I]', 'LD V0, V1', 'LD V0, 1',
        'ADD I, V0', 'ADD V0, V1', 'ADD V0, 1',
        'OR V0, V1', 'AND V0, V1', 'XOR V0, V1', 'SUB V0, V1', 'SUBN V0, V1',
        'SHR V0', 'SHL V0', 'RND V0, 1', 'DRW V0, V1, 1',
        'PUSH V0', 'POP V0', 'PUSHA', 'POPA', 'PEAK V0', 'SIZESTACK V0', 'CLEARSTACK',
        'MUL V0, V1', 'DIV V0, V1', 'REM V0, V1', 'SKP V0', 'SKNP V0'
    ];
    const source = `${instructions.join('\n')}\ntarget: RET`;

    assert.equal(encoded(source).length, instructions.length + 1);
    assert.ok(encoded(source).every((opcode) => opcode !== 0));
});

test('encodes chip8-dev frame instructions as two-word extensions', () => {
    assert.deepEqual(encoded(`
        ENTER
        LEAVE
        ADJSP 255
        DROP 1
        LDX -128
        STX 127
        LDI -4
        SYS 3
    `), [
        0x5001, 0x0000,
        0x5001, 0x0100,
        0x5001, 0x02FF,
        0x5001, 0x0301,
        0x5001, 0x0480,
        0x5001, 0x057F,
        0x5001, 0x07FC,
        0x5001, 0x0803
    ]);

    assert.deepEqual(encoded('TRAP 9'), [0x5001, 0x0609]);
    assert.throws(() => asmToBin('LDX -129'), AssemblerError);
    assert.throws(() => asmToBin('STX 128'), AssemblerError);
    assert.throws(() => asmToBin('ADJSP -1'), AssemblerError);
    assert.throws(() => asmToBin('TRAP 256'), AssemblerError);
    assert.throws(() => asmToBin('SYS 256'), AssemblerError);
});

test('rejects classic skip instructions immediately before chip8-dev extensions', () => {
    for (const skip of ['SE V0, 0', 'SNE V0, V1', 'SKP V0', 'SKNP V0']) {
        assert.throws(() => asmToBin(`${skip}\nENTER`), /cannot target a chip8-dev extended instruction/);
    }

    assert.deepEqual(encoded('SE V0, 0\nJP target\nENTER\ntarget: RET'), [
        0x3000, 0x1208, 0x5001, 0x0000, 0x00EE
    ]);
});

test('supports inline labels, ORG, DB and discontiguous segments', () => {
    const segments = asmToBin(`
        ORG 0x200
        LD I, data
        JP 0x200
        ORG 0x300
        data: DB 1, 0xFF
    `);

    assert.deepEqual(segments, [
        { start: 0x200, bytes: [{ val: 0xA300, size: 2 }, { val: 0x1200, size: 2 }] },
        { start: 0x300, bytes: [{ val: 1, size: 1 }, { val: 0xFF, size: 1 }] }
    ]);
});

test('reports unknown instructions with source line information', () => {
    assert.throws(() => asmToBin('\n  INVALID V0'), (error) =>
        error instanceof AssemblerError && error.line === 2 && /Unknown instruction/.test(error.message));
});

test('rejects invalid operand counts, registers, numbers and malformed commas', () => {
    for (const source of ['CLS V0', 'LD V10, 1', 'LD V0, 256', 'DB nope', 'LD V0,,1']) {
        assert.throws(() => asmToBin(source), AssemblerError, source);
    }
});

test('rejects duplicate labels, duplicate memory and invalid addresses', () => {
    for (const source of [
        'loop: CLS\nLOOP: RET',
        'ORG 0x200\nCLS\nORG 0x200\nRET',
        'JP nowhere',
        'ORG 0xFFF\nCLS'
    ]) {
        assert.throws(() => asmToBin(source), AssemblerError, source);
    }
});

test('rejects non-string source', () => {
    assert.throws(() => asmToBin(null), TypeError);
});

test('validates every segment before writing any bytes to emulator memory', () => {
    const writes = [];
    const module = {
        _load_data_at: (...args) => writes.push(args),
        _load_opcode_at: (...args) => writes.push(args)
    };
    const core = new Chip8Core(module, () => []);

    assert.throws(() => core.loadSegments([
        { start: 0x200, bytes: [{ val: 0x6001, size: 2 }] },
        { start: 0xFFF, bytes: [{ val: 0x6002, size: 2 }] }
    ]), /invalid data/);
    assert.deepEqual(writes, []);
});

test('enables chip8-dev mode only for an explicit profile selection', () => {
    const modes = [];
    const core = new Chip8Core({
        _set_chip8_dev_mode: (enabled) => modes.push(enabled)
    }, () => []);

    core.setChip8DevMode(true);
    core.setChip8DevMode(1);
    assert.deepEqual(modes, [true, false]);
});
