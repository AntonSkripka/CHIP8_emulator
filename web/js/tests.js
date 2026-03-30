import { asmToBin } from './asm.js';
import { Chip8Emulator } from './index.js';

const results = document.getElementById('results');

function appendResult(message, success) {
    const resultNode = document.createElement('div');
    resultNode.textContent = message;
    resultNode.style.color = success ? '#8f8' : '#f88';
    results.appendChild(resultNode);
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

function loadBinary(Module, code) {
    const segments = asmToBin(code);
    for (const seg of segments) {
        let addr = seg.start;
        for (const item of seg.bytes) {
            if (item.size === 2) {
                Module._load_opcode_at(addr, item.val);
                addr += 2;
            } else {
                Module._load_data_at(addr, item.val);
                addr += 1;
            }
        }
    }
}

async function runTests() {
    try {
        const Module = await createChip8();
        const display = document.getElementById('display');
        const emu = new Chip8Emulator(display, Module);

        const vPtr = Module._get_v_regs_ptr();
        const vView = new Uint8Array(Module.HEAPU8.buffer, vPtr, 16);

        // Test 0: assembler codes for PUSH/POP
        const pushCode = asmToBin('PUSH V1');
        const popCode = asmToBin('POP V1');
        assert(pushCode.length === 1 && pushCode[0].bytes[0].val === 0x5101, 'ASM PUSH did not compile to 0x5101');
        assert(popCode.length === 1 && popCode[0].bytes[0].val === 0x5102, 'ASM POP did not compile to 0x5102');
        appendResult('ASM encoder PUSH/POP produced correct opcodes', true);

        // Test 1: single register PUSH/POP identity
        Module._init();
        Module._init_stack_interface(vPtr);
        vView[1] = 0xAA;
        loadBinary(Module, 'ORG 0x200\nPUSH V1\nLD V1, 0x00\nPOP V1');
        Module._step();
        Module._step();
        Module._step();
        assert(vView[1] === 0xAA, 'PUSH/POP did not preserve register value for V1');
        appendResult('Single register PUSH/POP identity passed', true);

        // Test 2: multiple registers LIFO behavior
        Module._init();
        Module._init_stack_interface(vPtr);
        vView[1] = 0x11;
        vView[2] = 0x22;
        vView[3] = 0x33;
        loadBinary(Module, 'ORG 0x200\nPUSH V1\nPUSH V2\nPUSH V3\nLD V1, 0x00\nLD V2, 0x00\nLD V3, 0x00\nPOP V3\nPOP V2\nPOP V1');
        for (let i = 0; i < 9; i++) Module._step();
        assert(vView[3] === 0x33, 'LIFO failed at first POP for V3');
        assert(vView[2] === 0x22, 'LIFO failed at second POP for V2');
        assert(vView[1] === 0x11, 'LIFO failed at third POP for V1');
        appendResult('Multiple registers LIFO PUSH/POP passed', true);

        // Test 3: SPD Stack visualization updates for PUSH/POP counts
        Module._init();
        Module._init_stack_interface(vPtr);
        emu.reset();
        vView[4] = 0xCA;
        vView[5] = 0xDE;
        loadBinary(Module, 'ORG 0x200\nPUSH V4\nPUSH V5');
        Module._step();
        Module._step();
        emu.updateStackUI();

        const stackContainer = emu.stackContainer;
        assert(stackContainer.children.length === 2, 'SPD UI did not render two stack cells after two PUSH commands');
        assert(stackContainer.firstElementChild.textContent.includes('0xDE'), 'Newest pushed value is not shown at the bottom of the stack UI');
        assert(stackContainer.children[1].textContent.includes('0xCA'), 'Older stack value is not shown above the newest block');
        appendResult('SPD Stack visualization count after PUSH passed', true);

        // Test 4: SPD Stack visualization updates after POP
        loadBinary(Module, 'ORG 0x200\nPUSH V4\nPUSH V5\nPOP V3');
        Module._step();
        Module._step();
        Module._step();
        emu.updateStackUI();
        assert(stackContainer.children.length === 1, 'SPD UI did not remove one stack cell after POP command');
        assert(stackContainer.firstElementChild.textContent.includes('0xCA'), 'SPD UI did not show the remaining stack value after POP');
        appendResult('SPD Stack visualization count after POP passed', true);

        // Test 5: Compile & Run resets SPD stack and UI
        Module._init();
        Module._init_stack_interface(vPtr);
        emu.reset();
        vView[6] = 0x77;
        loadBinary(Module, 'ORG 0x200\nPUSH V6');
        Module._step();
        emu.updateStackUI();
        assert(Module._get_spd() === 1, 'SPD spd should be 1 after PUSH before compile');
        assert(emu.stackContainer.children.length === 1, 'SPD UI should show one block before compile');
        emu.runAsm('ORG 0x200\nLD V0, 0x00');
        assert(Module._get_spd() === 0, 'SPD spd should be reset after Compile & Run');
        assert(emu.stackContainer.children.length === 0, 'SPD UI should clear blocks after Compile & Run');
        appendResult('Compile & Run resets SPD stack and UI passed', true);

        appendResult('All PUSH/POP SPD tests passed.', true);
    } catch (error) {
        appendResult(`Test failed: ${error.message}`, false);
    }
}

runTests();
