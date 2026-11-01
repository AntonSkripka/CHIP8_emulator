import test from 'node:test';
import assert from 'node:assert/strict';
import createChip8 from '../web/public/wasm/chip8.js';
import { asmToBin } from '../web/src/assembler/asm.js';
import { compile } from '../web/src/compiler/index.js';

const machine = await createChip8();
machine._vfs_init();

const encode = (text) => new TextEncoder().encode(text);

function writeMachineMemory(address, bytes) {
    bytes.forEach((byte, index) => machine._load_data_at(address + index, byte));
}

function writeVfsFile(filename, bytes) {
    const nameBytes = encode(filename);
    const namePointer = machine._malloc(nameBytes.length + 1);
    const dataPointer = machine._malloc(bytes.length);
    try {
        machine.HEAPU8.set(nameBytes, namePointer);
        machine.HEAPU8[namePointer + nameBytes.length] = 0;
        machine.HEAPU8.set(bytes, dataPointer);
        return machine._vfs_write(namePointer, dataPointer, bytes.length);
    } finally {
        machine._free(namePointer);
        machine._free(dataPointer);
    }
}

function readVfsFile(filename) {
    const nameBytes = encode(filename);
    const namePointer = machine._malloc(nameBytes.length + 1);
    let dataPointer = 0;
    try {
        machine.HEAPU8.set(nameBytes, namePointer);
        machine.HEAPU8[namePointer + nameBytes.length] = 0;
        const size = machine._vfs_get_file_size(namePointer);
        if (size === 0) return null;
        dataPointer = machine._malloc(size);
        if (machine._vfs_read(namePointer, dataPointer, size) !== 0) return null;
        return machine.HEAPU8.slice(dataPointer, dataPointer + size);
    } finally {
        machine._free(namePointer);
        if (dataPointer !== 0) machine._free(dataPointer);
    }
}

function getVfsFileSize(filename) {
    const nameBytes = encode(filename);
    const namePointer = machine._malloc(nameBytes.length + 1);
    try {
        machine.HEAPU8.set(nameBytes, namePointer);
        machine.HEAPU8[namePointer + nameBytes.length] = 0;
        return machine._vfs_get_file_size(namePointer);
    } finally {
        machine._free(namePointer);
    }
}

function executeVfsSyscall(operation, {
    requestAddress = 0x300,
    filename = 'syscall-test.bin',
    filenameBytes = encode(filename),
    filenameAddress = 0x320,
    bufferAddress = 0x340,
    bufferLength = 0,
    bufferBytes = new Uint8Array(),
    readonlyRange = null
} = {}) {
    machine._init();
    machine._init_stack_interface(machine._get_v_regs_ptr());
    machine._set_chip8_dev_mode(true);
    machine._set_memory_readonly_range(
        readonlyRange?.start ?? 0,
        readonlyRange?.size ?? 0
    );

    const segments = asmToBin(`
        LD I, ${requestAddress}
        SYS ${operation}
        JP 0x206
    `);
    for (const segment of segments) {
        let address = segment.start;
        for (const { val, size } of segment.bytes) {
            if (size === 1) {
                machine._load_data_at(address, val);
                address++;
            } else {
                machine._load_data_at(address, val >> 8);
                machine._load_data_at(address + 1, val & 0xFF);
                address += 2;
            }
        }
    }

    if (requestAddress >= 0x200 && requestAddress + 11 <= 0x1000) {
        writeMachineMemory(requestAddress, Uint8Array.from([
            filenameAddress >> 8,
            filenameAddress & 0xFF,
            filenameBytes.length,
            bufferAddress >> 8,
            bufferAddress & 0xFF,
            bufferLength >> 8,
            bufferLength & 0xFF,
            0, 0, 0, 0
        ]));
        writeMachineMemory(filenameAddress, filenameBytes);
        writeMachineMemory(bufferAddress, bufferBytes);
    }

    machine._step();
    machine._step();
    const memory = new Uint8Array(
        machine.HEAPU8.buffer,
        machine._get_mem_ptr(),
        0x1000
    ).slice();
    return {
        fault: machine._get_execution_fault(),
        status: new Uint8Array(machine.HEAPU8.buffer, machine._get_v_regs_ptr(), 16)[0],
        resultSize: (
            (memory[requestAddress + 7] * 0x1000000) +
            (memory[requestAddress + 8] << 16) +
            (memory[requestAddress + 9] << 8) +
            memory[requestAddress + 10]
        ) >>> 0,
        memory
    };
}

function execute(source, maximumSteps = 100000, prepareMemory = null) {
    const program = compile(source);
    return executeProgram(program, maximumSteps, prepareMemory);
}

function executeProgram(program, maximumSteps, prepareMemory = null) {
    machine._init();
    machine._init_stack_interface(machine._get_v_regs_ptr());
    machine._set_chip8_dev_mode(true);
    program.rom.forEach((byte, index) => {
        machine._load_data_at(program.baseAddress + index, byte);
    });
    const readonly = program.sections?.rodata;
    machine._set_memory_readonly_range(readonly?.start ?? 0, readonly?.size ?? 0);
    prepareMemory?.(program, (address, value) => machine._load_data_at(address, value));

    let steps = 0;
    while ((!program.symbols || machine._get_pc() !== program.symbols.__exit) &&
        machine._get_execution_fault() === 0 && steps < maximumSteps) {
        machine._step();
        steps++;
    }

    return {
        program,
        steps,
        pc: machine._get_pc(),
        fault: machine._get_execution_fault(),
        exitCode: new Uint8Array(
            machine.HEAPU8.buffer,
            machine._get_v_regs_ptr(),
            16
        )[0],
        dataStackPointer: machine._get_spd(),
        callStackPointer: machine._get_call_stack_ptr(),
        memory: new Uint8Array(
            machine.HEAPU8.buffer,
            machine._get_mem_ptr(),
            0x1000
        ).slice()
    };
}

test('executes function calls, arguments, locals, loops, and returns', () => {
    const result = execute(`
        fn u8 add(u8Value: u8, amount: u8) {
            u8 sum = u8Value + amount;
            return sum;
        }

        fn u8 main() {
            u8 count = 0;
            while (count < 4) {
                count = add(count, 1);
            }
            if (count == 4) {
                return add(count, 38);
            } else {
                return 0;
            }
        }
    `);

    assert.equal(result.fault, 0);
    assert.equal(result.pc, result.program.symbols.__exit);
    assert.equal(result.exitCode, 42);
    assert.equal(result.dataStackPointer, 0);
    assert.equal(result.callStackPointer, 0);
});

test('links nested modules resolved from the virtual disk and executes their functions', () => {
    writeVfsFile('linked_math.chip', encode(`
        import linkedutil.increment;
        pub fn u8 add_one(value: u8) {
            return linkedutil.increment(value);
        }
    `));
    writeVfsFile('linkedutil.chip', encode(`
        pub fn u8 increment(value: u8) {
            return value + 1;
        }
    `));

    const program = compile(`
        import linked_math.add_one;
        fn u8 main() {
            return linked_math.add_one(41);
        }
    `, { resolveModule: readVfsFile });
    const result = executeProgram(program, 10000);

    assert.equal(result.fault, 0);
    assert.equal(result.exitCode, 42);
    assert.ok(program.sourceMap.some(({ fileName }) => fileName === 'linkedutil.chip'));
});

test('links and reads exported module read-only data', () => {
    writeVfsFile('constants.chip', encode(`
        pub rodata u8 answer[2] = [40, 2];
    `));
    const program = compile(`
        import constants.answer;
        fn u8 main() {
            return constants.answer[0] + constants.answer[1];
        }
    `, { resolveModule: readVfsFile });
    const result = executeProgram(program, 10000);

    assert.equal(result.fault, 0);
    assert.equal(result.exitCode, 42);
});

test('short-circuits boolean expressions without evaluating division by zero', () => {
    const result = execute(`
        fn u8 main() {
            if (true || (1 / 0 == 0)) {
                return 7;
            } else {
                return 0;
            }
        }
    `);

    assert.equal(result.fault, 0);
    assert.equal(result.exitCode, 7);
});

test('executes byte character literals as u8 values', () => {
    const result = execute(`
        fn u8 main() {
            return '\\x2A';
        }
    `);

    assert.equal(result.fault, 0);
    assert.equal(result.exitCode, 42);
});

test('reports division-by-zero as a runtime fault and halts', () => {
    const result = execute(`
        fn u8 main() {
            return 12 / 0;
        }
    `);

    assert.equal(result.fault, 5);
    assert.notEqual(result.pc, result.program.symbols.__exit);
});

test('zero-initializes BSS objects before main, including sizes above one byte', () => {
    const result = execute(`
        bss u8 scratch[260];
        fn u8 main() {
            return 3;
        }
    `, 100000, (program, writeByte) => {
        for (let index = 0; index < program.bss.size; index++) {
            writeByte(program.bss.start + index, 0xA5);
        }
    });

    assert.equal(result.fault, 0);
    assert.equal(result.exitCode, 3);
    assert.ok(result.steps > 260);
    assert.deepEqual(
        [...result.memory.slice(result.program.bss.start, result.program.bss.start + result.program.bss.size)],
        new Array(result.program.bss.size).fill(0)
    );
});

test('reads indexed data and writes indexed mutable data', () => {
    const result = execute(`
        data u8 values[3] = [4, 5, 6];
        rodata u8 constants[2] = [10, 20];
        bss u8 scratch[1];

        fn u8 main() {
            u8 index = 1;
            values[index] = constants[index];
            scratch[0] = values[index] + 7;
            return scratch[0];
        }
    `);

    assert.equal(result.fault, 0);
    assert.equal(result.exitCode, 27);
});

test('passes arrays by reference through functions and enforces mutability', () => {
    const result = execute(`
        data u8 values[3] = [4, 5, 6];
        fn u8 third(items: u8[]) {
            return items[2];
        }
        fn u8 forward(items: u8[]) {
            return third(items);
        }
        fn update(mut buffer: u8[]) {
            buffer[1] = 42;
            return;
        }
        fn u8 main() {
            update(values);
            return forward(values);
        }
    `);

    assert.equal(result.fault, 0);
    assert.equal(result.exitCode, 6);
});

test('bounds-checks array parameters using their runtime extent', () => {
    const result = execute(`
        bss u8 values[1];
        fn u8 read(items: u8[]) {
            return items[1];
        }
        fn u8 main() {
            return read(values);
        }
    `);

    assert.equal(result.fault, 9);
});

test('allows u8 indexes into arrays larger than 255 bytes', () => {
    const result = execute(`
        bss u8 values[260];
        fn u8 read(items: u8[]) {
            return items[255];
        }
        fn u8 main() {
            values[255] = 77;
            return read(values);
        }
    `);

    assert.equal(result.fault, 0);
    assert.equal(result.exitCode, 77);
});

test('traps dynamic out-of-bounds array access', () => {
    const result = execute(`
        bss u8 values[3];
        fn u8 main() {
            u8 index = 3;
            return values[index];
        }
    `);

    assert.equal(result.fault, 9);
});

test('traps runtime writes into read-only data', () => {
    const result = execute(`
        rodata u8 constants[1] = [4];
        fn u8 main() {
            constants[0] = 9;
            return 0;
        }
    `);

    assert.equal(result.fault, 10);
    assert.equal(result.memory[result.program.symbols.constants], 4);
});

test('rejects CHIP-8 store instructions that cross the end of RAM', () => {
    const segments = asmToBin(`
        LD I, 0xFFF
        LD V1, 1
        LD [I], V1
    `);
    const program = {
        baseAddress: segments[0].start,
        symbols: null,
        rom: Uint8Array.from(segments.flatMap(({ bytes }) => bytes.flatMap(({ val }) =>
            [val >> 8, val & 0xFF])))
    };
    const result = executeProgram(program, 20);

    assert.equal(result.fault, 9);
    assert.equal(result.memory[0xFFF], 0);
});

test('rejects CHIP-8 loads that cross the end of RAM without partial register updates', () => {
    const segments = asmToBin(`
        LD V0, 42
        LD I, 0xFFF
        LD V1, [I]
    `);
    const program = {
        baseAddress: segments[0].start,
        symbols: null,
        rom: Uint8Array.from(segments.flatMap(({ bytes }) => bytes.flatMap(({ val }) =>
            [val >> 8, val & 0xFF])))
    };
    const result = executeProgram(program, 20);

    assert.equal(result.fault, 9);
    assert.equal(result.exitCode, 42);
});

test('reports data-stack overflow without corrupting the call stack', () => {
    const segments = asmToBin(`
        ENTER
        ADJSP 255
        ADJSP 255
        ADJSP 255
        ADJSP 255
        ADJSP 2
    `);
    const program = {
        baseAddress: segments[0].start,
        symbols: null,
        rom: Uint8Array.from(segments.flatMap(({ bytes }) => bytes.flatMap(({ val, size }) =>
            size === 2 ? [val >> 8, val & 0xFF] : [val])))
    };
    const result = executeProgram(program, 20);

    assert.equal(result.fault, 1);
    assert.ok(result.steps < 20);
    assert.equal(result.callStackPointer, 0);
});

test('executes VFS size, read, write, and delete syscalls through bounded requests', () => {
    const filename = 'syscall-caf\u00e9.bin';
    const fileBytes = Uint8Array.from([0x10, 0x20, 0xFF]);
    assert.equal(writeVfsFile(filename, fileBytes), 0);

    const getSize = executeVfsSyscall(1, { filename });
    assert.equal(getSize.fault, 0);
    assert.equal(getSize.status, 0);
    assert.equal(getSize.resultSize, fileBytes.length);

    const read = executeVfsSyscall(2, {
        filename,
        bufferLength: fileBytes.length
    });
    assert.equal(read.fault, 0);
    assert.equal(read.status, 0);
    assert.equal(read.resultSize, fileBytes.length);
    assert.deepEqual([...read.memory.slice(0x340, 0x340 + fileBytes.length)], [...fileBytes]);

    const written = executeVfsSyscall(3, {
        filename: 'out.bin',
        bufferLength: fileBytes.length,
        bufferBytes: fileBytes
    });
    assert.equal(written.fault, 0);
    assert.equal(written.status, 0);
    assert.equal(written.resultSize, fileBytes.length);
    assert.deepEqual(readVfsFile('out.bin'), fileBytes);

    const deleted = executeVfsSyscall(4, { filename });
    assert.equal(deleted.fault, 0);
    assert.equal(deleted.status, 0);
    assert.equal(deleted.resultSize, 0);
    assert.equal(getVfsFileSize(filename), 0);
});

test('returns VFS errors without partially modifying read buffers', () => {
    const filename = 'small.bin';
    assert.equal(writeVfsFile(filename, Uint8Array.from([1, 2, 3])), 0);
    const tooSmall = executeVfsSyscall(2, {
        filename,
        bufferLength: 2,
        bufferBytes: Uint8Array.from([0xAA, 0xBB])
    });

    assert.equal(tooSmall.fault, 0);
    assert.equal(tooSmall.status, 3);
    assert.equal(tooSmall.resultSize, 3);
    assert.deepEqual([...tooSmall.memory.slice(0x340, 0x342)], [0xAA, 0xBB]);

    const invalidUtf8 = executeVfsSyscall(1, {
        filenameBytes: Uint8Array.from([0xC0, 0xAF])
    });
    assert.equal(invalidUtf8.fault, 0);
    assert.equal(invalidUtf8.status, 2);
});

test('turns invalid syscall RAM ranges into fatal faults before VFS access', () => {
    const filename = 'bounds.bin';
    assert.equal(writeVfsFile(filename, Uint8Array.from([7, 8])), 0);

    const outOfBoundsRead = executeVfsSyscall(2, {
        filename,
        bufferAddress: 0xFFF,
        bufferLength: 2
    });
    assert.equal(outOfBoundsRead.fault, 9);
    assert.deepEqual(readVfsFile(filename), Uint8Array.from([7, 8]));

    const protectedRead = executeVfsSyscall(2, {
        filename,
        bufferLength: 2,
        readonlyRange: { start: 0x340, size: 2 }
    });
    assert.equal(protectedRead.fault, 10);
    assert.deepEqual([...protectedRead.memory.slice(0x340, 0x342)], [0, 0]);

    const invalidRequest = executeVfsSyscall(1, { requestAddress: 0xFFF });
    assert.equal(invalidRequest.fault, 9);

    const unsupported = executeVfsSyscall(99);
    assert.equal(unsupported.fault, 0);
    assert.equal(unsupported.status, 7);
});

test('executes CHIP Language VFS wrappers with 32-bit size outputs', () => {
    const filename = 'api.bin';
    const fileBytes = Uint8Array.from([10, 20, 30]);
    assert.equal(writeVfsFile(filename, fileBytes), 0);

    const result = execute(`
        import disk;
        rodata u8 filename[7] = ['a', 'p', 'i', '.', 'b', 'i', 'n'];
        rodata u8 replacement[2] = [4, 5];
        bss u8 output[3];
        bss u8 size[4];

        fn u8 main() {
            if (disk.file_size(filename, size) != 0) { return 1; }
            if (disk.read_file(filename, output, size) != 0) { return 2; }
            if (output[0] == 10 && size[3] == 3) {
                if (disk.write_file(filename, replacement) != 0) { return 3; }
                return disk.delete_file(filename);
            }
            return 4;
        }
    `);

    assert.equal(result.fault, 0);
    assert.deepEqual([...result.memory.slice(
        result.program.symbols.output,
        result.program.symbols.output + fileBytes.length
    )], [...fileBytes]);
    assert.deepEqual([...result.memory.slice(
        result.program.symbols.size,
        result.program.symbols.size + 4
    )], [0, 0, 0, fileBytes.length]);
    assert.equal(result.exitCode, 0);
    assert.equal(getVfsFileSize(filename), 0);
});

test('rejects invalid VFS wrapper lengths and aliased size outputs safely', () => {
    const shortOutput = execute(`
        import disk;
        rodata u8 filename[7] = ['a', 'p', 'i', '.', 'b', 'i', 'n'];
        bss u8 output[3];
        fn u8 get_size(name: u8[], mut size: u8[]) {
            return disk.file_size(name, size);
        }
        fn u8 main() {
            return get_size(filename, output);
        }
    `);
    assert.equal(shortOutput.fault, 0);
    assert.equal(shortOutput.exitCode, 2);

    const longFilename = execute(`
        import disk;
        data u8 filename[18] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        bss u8 size[4];
        fn u8 get_size(name: u8[]) {
            return disk.file_size(name, size);
        }
        fn u8 main() {
            return get_size(filename);
        }
    `);
    assert.equal(longFilename.fault, 0);
    assert.equal(longFilename.exitCode, 2);

    const aliasedOutput = execute(`
        import disk;
        data u8 filename[7] = ['a', 'p', 'i', '.', 'b', 'i', 'n'];
        fn u8 main() {
            return disk.file_size(filename, filename);
        }
    `);
    assert.equal(aliasedOutput.fault, 0);
    assert.equal(aliasedOutput.exitCode, 2);

    const aliasedReadOutput = execute(`
        import disk;
        rodata u8 filename[7] = ['a', 'p', 'i', '.', 'b', 'i', 'n'];
        data u8 buffer[4] = [1, 2, 3, 4];
        bss u8 size[4];
        fn u8 main() {
            return disk.read_file(filename, buffer, buffer);
        }
    `);
    assert.equal(aliasedReadOutput.fault, 0);
    assert.equal(aliasedReadOutput.exitCode, 2);
    assert.deepEqual([...aliasedReadOutput.memory.slice(
        aliasedReadOutput.program.symbols.buffer,
        aliasedReadOutput.program.symbols.buffer + 4
    )], [1, 2, 3, 4]);
});

test('preserves big-endian 32-bit file sizes above 255 bytes', () => {
    const filename = 'big.bin';
    const fileBytes = Uint8Array.from({ length: 300 }, (_, index) => index & 0xFF);
    assert.equal(writeVfsFile(filename, fileBytes), 0);

    const result = execute(`
        import disk;
        rodata u8 filename[7] = ['b', 'i', 'g', '.', 'b', 'i', 'n'];
        bss u8 output[300];
        bss u8 size[4];
        fn u8 main() {
            if (disk.file_size(filename, size) != 0) { return 1; }
            if (size[2] != 1 || size[3] != 44) { return 2; }
            if (disk.read_file(filename, output, size) != 0) { return 3; }
            if (output[255] != 255) { return 4; }
            return 0;
        }
    `);

    assert.equal(result.fault, 0);
    assert.equal(result.exitCode, 0);
    assert.deepEqual([...result.memory.slice(
        result.program.symbols.size,
        result.program.symbols.size + 4
    )], [0, 0, 1, 44]);
});

test('exposes required read size when the source-level buffer is too small', () => {
    const filename = 'small.bin';
    assert.equal(writeVfsFile(filename, Uint8Array.from([1, 2, 3])), 0);

    const result = execute(`
        import disk;
        rodata u8 filename[9] = ['s', 'm', 'a', 'l', 'l', '.', 'b', 'i', 'n'];
        bss u8 output[2];
        bss u8 bytes_read[4];
        fn u8 main() {
            return disk.read_file(filename, output, bytes_read);
        }
    `);

    assert.equal(result.fault, 0);
    assert.equal(result.exitCode, 3);
    assert.deepEqual([...result.memory.slice(
        result.program.symbols.bytes_read,
        result.program.symbols.bytes_read + 4
    )], [0, 0, 0, 3]);
    assert.deepEqual([...result.memory.slice(
        result.program.symbols.output,
        result.program.symbols.output + 2
    )], [0, 0]);
});
