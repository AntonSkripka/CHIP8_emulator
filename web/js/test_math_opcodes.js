/**
 * Test suite for custom CHIP-8 math opcodes (MUL, DIV, REM) and direct load instruction
 */
import { asmToBin } from './asm.js';

const results = document.getElementById('results') || (() => {
    const div = document.createElement('div');
    div.id = 'results';
    document.body.appendChild(div);
    return div;
})();

function appendResult(message, success) {
    const resultNode = document.createElement('div');
    resultNode.textContent = message;
    resultNode.style.color = success ? '#8f8' : '#f88';
    resultNode.style.padding = '4px 8px';
    resultNode.style.fontFamily = 'monospace';
    resultNode.style.marginBottom = '2px';
    results.appendChild(resultNode);
    console.log(`[${success ? 'PASS' : 'FAIL'}] ${message}`);
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

function testOpcodeCompilation(asmCode, expectedOpcode, testName) {
    try {
        const segments = asmToBin(asmCode);
        assert(segments.length > 0, `No segments generated for ${testName}`);
        const actualOpcode = segments[0].bytes[0].val;
        assert(actualOpcode === expectedOpcode, 
            `${testName}: Expected 0x${expectedOpcode.toString(16).toUpperCase().padStart(4, '0')}, got 0x${actualOpcode.toString(16).toUpperCase().padStart(4, '0')}`);
        appendResult(`✓ ${testName}`, true);
    } catch (error) {
        appendResult(`✗ ${testName}: ${error.message}`, false);
        throw error;
    }
}

export function runMathOpcodeTests() {
    try {
        appendResult('=== CHIP-8 Math Opcode Tests ===', true);
        
        // ===== MUL Tests =====
        appendResult('--- MUL V0, V1 Tests ---', true);
        
        // Test 1: Basic MUL encoding
        testOpcodeCompilation('MUL V0, V1', 0x8019, 'MUL V0, V1 -> 0x8019');
        testOpcodeCompilation('MUL V2, V3', 0x8239, 'MUL V2, V3 -> 0x8239');
        testOpcodeCompilation('MUL VA, VF', 0x8AF9, 'MUL VA, VF -> 0x8AF9');
        
        // ===== DIV Tests =====
        appendResult('--- DIV Vx, Vy Tests ---', true);
        
        testOpcodeCompilation('DIV V0, V1', 0x801A, 'DIV V0, V1 -> 0x801A');
        testOpcodeCompilation('DIV V2, V3', 0x823A, 'DIV V2, V3 -> 0x823A');
        testOpcodeCompilation('DIV VA, VF', 0x8AFA, 'DIV VA, VF -> 0x8AFA');
        
        // ===== REM Tests =====
        appendResult('--- REM Vx, Vy Tests ---', true);
        
        testOpcodeCompilation('REM V0, V1', 0x801B, 'REM V0, V1 -> 0x801B');
        testOpcodeCompilation('REM V2, V3', 0x823B, 'REM V2, V3 -> 0x823B');
        testOpcodeCompilation('REM VA, VF', 0x8AFB, 'REM VA, VF -> 0x8AFB');
        
        // ===== LD Vx, [address] Tests =====
        appendResult('--- LD Vx, [address] Tests ---', true);
        
        testOpcodeCompilation('LD V0, [0x200]', 0xB200, 'LD V0, [0x200] -> 0xB200');
        testOpcodeCompilation('LD V5, [0x123]', 0xB123, 'LD V5, [0x123] -> 0xB123');
        testOpcodeCompilation('LD VF, [0xFFF]', 0xBFFF, 'LD VF, [0xFFF] -> 0xBFFF');
        testOpcodeCompilation('LD V7, [0x000]', 0xB000, 'LD V7, [0x000] -> 0xB000');
        
        // ===== LD Vx, [label] Tests (Label Resolution) =====
        appendResult('--- LD Vx, [label] - Label Resolution Tests ---', true);
        
        const labelTestCode = `
            ORG 0x200
            labelData: DB 0xAA
            LD V5, [labelData]
        `;
        
        try {
            const segments = asmToBin(labelTestCode);
            // First segment is the DB at 0x200
            // Second segment should be the LD instruction at 0x201
            assert(segments.length >= 2, 'Should have at least 2 segments for label test');
            
            // The DB takes 1 byte, so LD is at 0x201
            const ldSegment = segments[1];
            const ldOpcode = ldSegment.bytes[0].val;
            
            // Expected: 0xB200 (load from address 0x200 where the label is)
            const expectedOpcode = 0xB200;
            assert(ldOpcode === expectedOpcode,
                `LD V5, [labelData]: Expected 0x${expectedOpcode.toString(16).toUpperCase().padStart(4, '0')}, got 0x${ldOpcode.toString(16).toUpperCase().padStart(4, '0')}`);
            
            appendResult('✓ LD V5, [labelData] correctly resolves label to 0x200', true);
        } catch (error) {
            appendResult(`✗ Label resolution test: ${error.message}`, false);
            throw error;
        }
        
        // ===== Integration Tests (Sequences) =====
        appendResult('--- Integration Tests (Instruction Sequences) ---', true);
        
        try {
            // Test: LD V0, 0x02, LD V1, 0x02, MUL V0, V1
            const mulSeq = `LD V0, 0x02
                           LD V1, 0x02
                           MUL V0, V1`;
            const mulSegments = asmToBin(mulSeq);
            assert(mulSegments.length === 1, 'MUL sequence should be in one segment');
            assert(mulSegments[0].bytes.length === 3, 'MUL sequence should have 3 instructions');
            
            const ld0Opcode = mulSegments[0].bytes[0].val;
            const ld1Opcode = mulSegments[0].bytes[1].val;
            const mulOpcode = mulSegments[0].bytes[2].val;
            
            // LD V0, 0x02 -> 0x6002
            assert(ld0Opcode === 0x6002, `First LD V0, 0x02 failed: got 0x${ld0Opcode.toString(16).toUpperCase().padStart(4, '0')}`);
            // LD V1, 0x02 -> 0x6102
            assert(ld1Opcode === 0x6102, `Second LD V1, 0x02 failed: got 0x${ld1Opcode.toString(16).toUpperCase().padStart(4, '0')}`);
            // MUL V0, V1 -> 0x8019
            assert(mulOpcode === 0x8019, `MUL V0, V1 failed: got 0x${mulOpcode.toString(16).toUpperCase().padStart(4, '0')}`);
            
            appendResult('✓ MUL test sequence: LD V0, 0x02; LD V1, 0x02; MUL V0, V1', true);
        } catch (error) {
            appendResult(`✗ MUL sequence test: ${error.message}`, false);
            throw error;
        }
        
        try {
            // Test: LD V0, 0xFF, LD V1, 0xFF, DIV V0, V1
            const divSeq = `LD V0, 0xFF
                           LD V1, 0xFF
                           DIV V0, V1`;
            const divSegments = asmToBin(divSeq);
            assert(divSegments.length === 1, 'DIV sequence should be in one segment');
            assert(divSegments[0].bytes.length === 3, 'DIV sequence should have 3 instructions');
            
            const divMulOpcode = divSegments[0].bytes[2].val;
            // DIV V0, V1 -> 0x801A
            assert(divMulOpcode === 0x801A, `DIV V0, V1 failed: got 0x${divMulOpcode.toString(16).toUpperCase().padStart(4, '0')}`);
            
            appendResult('✓ DIV test sequence: LD V0, 0xFF; LD V1, 0xFF; DIV V0, V1', true);
        } catch (error) {
            appendResult(`✗ DIV sequence test: ${error.message}`, false);
            throw error;
        }
        
        try {
            // Test: LD V0, 0x03, LD V1, 0x02, REM V0, V1
            const remSeq = `LD V0, 0x03
                           LD V1, 0x02
                           REM V0, V1`;
            const remSegments = asmToBin(remSeq);
            assert(remSegments.length === 1, 'REM sequence should be in one segment');
            assert(remSegments[0].bytes.length === 3, 'REM sequence should have 3 instructions');
            
            const remOpcode = remSegments[0].bytes[2].val;
            // REM V0, V1 -> 0x801B
            assert(remOpcode === 0x801B, `REM V0, V1 failed: got 0x${remOpcode.toString(16).toUpperCase().padStart(4, '0')}`);
            
            appendResult('✓ REM test sequence: LD V0, 0x03; LD V1, 0x02; REM V0, V1', true);
        } catch (error) {
            appendResult(`✗ REM sequence test: ${error.message}`, false);
            throw error;
        }
        
        try {
            // Test: label with DB and LD Vx, [label]
            const complexCode = `ORG 0x300
                                myData: DB 0xAA, 0xBB, 0xCC
                                LD V5, [myData]`;
            const complexSegments = asmToBin(complexCode);
            assert(complexSegments.length >= 2, 'Complex code should have at least 2 segments');
            
            // Find the LD instruction segment
            const ldSeg = complexSegments[1];
            const ldOpcode = ldSeg.bytes[0].val;
            const expectedLdOpcode = 0xB300; // Load from 0x300 where myData starts
            
            assert(ldOpcode === expectedLdOpcode,
                `LD V5, [myData] failed: Expected 0x${expectedLdOpcode.toString(16).toUpperCase().padStart(4, '0')}, got 0x${ldOpcode.toString(16).toUpperCase().padStart(4, '0')}`);
            
            appendResult('✓ Complex label test: myData at 0x300, LD V5, [myData] -> 0xB300', true);
        } catch (error) {
            appendResult(`✗ Complex label test: ${error.message}`, false);
            throw error;
        }
        
        // ===== Edge Cases =====
        appendResult('--- Edge Case Tests ---', true);
        
        try {
            // All registers with MUL
            for (let i = 0; i < 16; i++) {
                const regName = i < 10 ? `V${i}` : `V${i.toString(16).toUpperCase()}`;
                const code = `MUL ${regName}, V0`;
                const seg = asmToBin(code);
                const opcode = seg[0].bytes[0].val;
                const expected = 0x8000 | (i << 8) | 0x09;
                assert(opcode === expected, `MUL ${regName}, V0 failed`);
            }
            appendResult('✓ MUL works with all 16 registers', true);
        } catch (error) {
            appendResult(`✗ Register coverage test failed: ${error.message}`, false);
            throw error;
        }
        
        try {
            // Boundary addresses for LD Vx, [address]
            testOpcodeCompilation('LD V0, [0x000]', 0xB000, 'LD V0, [0x000] - minimum address');
            testOpcodeCompilation('LD V0, [0xFFF]', 0xBFFF, 'LD V0, [0xFFF] - maximum address');
        } catch (error) {
            appendResult(`✗ Boundary address test failed: ${error.message}`, false);
            throw error;
        }
        
        appendResult('=== All Math Opcode Tests Passed! ===', true);
        return true;
    } catch (error) {
        appendResult(`=== Test Suite Failed: ${error.message} ===`, false);
        return false;
    }
}

// Export for use in HTML test page
if (typeof window !== 'undefined') {
    window.runMathOpcodeTests = runMathOpcodeTests;
}
