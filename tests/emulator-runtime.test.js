import test from 'node:test';
import assert from 'node:assert/strict';
import { Chip8Emulator } from '../web/src/core/chip8_emulator.js';

function createHarness({ moduleResolver = null } = {}) {
    let frame;
    const readonlyRanges = [];
    const devModes = [];
    const core = {
        pc: 0x200,
        fault: 0,
        registers: new Uint8Array(16),
        init() {
            this.pc = 0x200;
            this.fault = 0;
            this.registers.fill(0);
        },
        getPC() { return this.pc; },
        getExecutionFault() { return this.fault; },
        getVRegistersView() { return this.registers; },
        setChip8DevMode(enabled) { devModes.push(enabled); },
        setMemoryReadonlyRange(start, size) { readonlyRanges.push({ start, size }); },
        setQuirks() {},
        loadDataAt() {},
        step() {},
        updateTimers() {}
    };
    const emulator = new Chip8Emulator({
        core,
        display: { clear() {}, render() {} },
        monitor: { updateStackUI() {}, updateDebug() {}, reset() {} },
        memoryMap: { draw() {} },
        scheduler: {
            now: () => 0,
            requestFrame: (callback) => { frame = callback; }
        },
        logger: { log() {}, error() {} },
        moduleResolver
    });
    return {
        core,
        emulator,
        readonlyRanges,
        devModes,
        runFrame() {
            emulator.start();
            frame(1);
        }
    };
}

test('passes the virtual-disk resolver through compilation and keeps imported source locations', () => {
    const loadedModules = [];
    const { emulator } = createHarness({
        moduleResolver(filename) {
            loadedModules.push(filename);
            return new TextEncoder().encode('pub fn u8 answer() { return 42; }');
        }
    });

    assert.equal(emulator.runLanguage(`
        import values.answer;
        fn u8 main() { return values.answer(); }
    `, { sourceName: 'project.chip' }), null);

    assert.deepEqual(loadedModules, ['values.chip']);
    const importedInstruction = emulator.lastCompiledProgram.sourceMap.find(({ fileName }) =>
        fileName === 'values.chip');
    assert.deepEqual(emulator.findSourceLocation(importedInstruction.address), {
        line: importedInstruction.line,
        column: importedInstruction.column,
        fileName: 'values.chip'
    });
});

test('configures language read-only memory and disables dev mode for ROMs', () => {
    const { emulator, readonlyRanges, devModes } = createHarness();
    assert.equal(emulator.runLanguage(`
        rodata u8 constants[2] = [4, 5];
        fn u8 main() { return constants[0]; }
    `), null);

    assert.deepEqual(readonlyRanges, [{
        start: emulator.lastCompiledProgram.sections.rodata.start,
        size: 2
    }]);
    assert.deepEqual(devModes, [false, true]);

    emulator.loadRom(new Uint8Array([0x00, 0xEE]));
    assert.equal(devModes.at(-1), false);
});

test('maps runtime faults to the source instruction', () => {
    let runtimeFault;
    const { core, emulator, runFrame } = createHarness();
    emulator.onRuntimeFault = (fault) => { runtimeFault = fault; };
    assert.equal(emulator.runLanguage(`
        fn u8 main() {
            return 1 / 0;
        }
    `), null);

    const sourceInstruction = emulator.lastCompiledProgram.sourceMap.find(({ line, column }) =>
        line === 3 && column === 22);
    core.pc = sourceInstruction.address;
    core.step = () => { core.fault = 5; };
    runFrame();

    assert.deepEqual(runtimeFault, {
        fault: 5,
        pc: sourceInstruction.address,
        source: { line: 3, column: 22 }
    });
    assert.equal(emulator.executionStopped, true);
});

test('reports main return code and stops executing the idle loop', () => {
    let programExit;
    const { core, emulator, runFrame } = createHarness();
    emulator.onProgramExit = (exit) => { programExit = exit; };
    assert.equal(emulator.runLanguage('fn u8 main() { return 12; }'), null);
    core.step = () => {
        core.registers[0] = 12;
        core.pc = emulator.lastCompiledProgram.symbols.__exit;
    };

    runFrame();

    assert.deepEqual(programExit, { exitCode: 12 });
    assert.equal(emulator.executionStopped, true);
});
