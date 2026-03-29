import { asmToBin, highlightCode } from './asm.js';

const KEY_MAP = {
    'Digit1': 0x1, 'Digit2': 0x2, 'Digit3': 0x3, 'Digit4': 0xC,
    'KeyQ': 0x4, 'KeyW': 0x5, 'KeyE': 0x6, 'KeyR': 0xD,
    'KeyA': 0x7, 'KeyS': 0x8, 'KeyD': 0x9, 'KeyF': 0xE,
    'KeyZ': 0xA, 'KeyX': 0x0, 'KeyC': 0xB, 'KeyV': 0xF
};

class Chip8Emulator {
    constructor(canvas, module) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.module = module;
        this.width = 64;
        this.height = 32;
        this.displayPtr = this.module._get_display_ptr();
        this.vRegsPtr = this.module._get_v_regs_ptr();
        this.vRegisters = new Uint8Array(this.module.HEAPU8.buffer, this.vRegsPtr, 16);
        this.imageData = this.ctx.createImageData(this.width, this.height);
        this.regElements = [];
        this.createDebugUI();
        this.init();
        this.memCanvas = document.getElementById('memory-map-canvas');
        this.memCtx = this.memCanvas.getContext('2d');
        this.memoryPtr = this.module._get_mem_ptr();
        this.memoryView = new Uint8Array(this.module.HEAPU8.buffer, this.memoryPtr, 4096);
        this.memImageData = this.memCtx.createImageData(64, 64);
        this.memState = {
            scale: 0.2,
            panning: false,
            pointX: 50,
            pointY: 50,
            startX: 0,
            startY: 0,
            gridSize: 16,
            cols: 64,
            rows: 64,
            selectedAddr: -1
        };
        this.memInfoElement = document.getElementById('mem-info');

        this.initMemoryInteraction();
    }

    init() {
        this.module._init();

        window.addEventListener('keydown', (e) => {
            const keyIndex = KEY_MAP[e.code];
            if (keyIndex !== undefined) {
                this.module._set_key(keyIndex, 1);
            }
        });

        window.addEventListener('keyup', (e) => {
            const keyIndex = KEY_MAP[e.code];
            if (keyIndex !== undefined) {
                this.module._set_key(keyIndex, 0);
            }
        });

        let codeTest = `
ORG 0x200
    LD V0, 0x10      
    LD V1, 0x10      
    LD V2, 0x01
    LD V3, 0xFF
    LD I, 0x500     

    DRW V0, V1, 0x5

MAIN:
    DRW V0, V1, 0x5

    LD V5, 0x05
    SKNP V5
    ADD V1, V3  

    LD V5, 0x08
    SKNP V5
    ADD V1, V2

    LD V5, 0x07
    SKNP V5
    ADD V0, V3

    LD V5, 0x09
    SKNP V5
    ADD V0, V2

    DRW V0, V1, 0x5

    LD V4, 0x01
    LD DT, V4
SYNC:
    LD V4, DT
    SE V4, 0x0
    JP SYNC

    JP MAIN

ORG 0x500
    DB 0x20 
    DB 0x70 
    DB 0xF8 
    DB 0x70 
    DB 0x20
`;

        let ch = [
            0x6A, 0x02, 0x6B, 0x0C, 0x6C, 0x3F, 0x6D, 0x0C, 0xA2, 0xEA, 0xDA, 0xB6, 0xDC, 0xD6, 0x6E, 0x00,
            0x22, 0xD4, 0x66, 0x03, 0x68, 0x02, 0x60, 0x60, 0xF0, 0x15, 0xF0, 0x07, 0x30, 0x00, 0x12, 0x1A,
            0xC7, 0x17, 0x77, 0x08, 0x69, 0xFF, 0xA2, 0xF0, 0xD6, 0x71, 0xA2, 0xEA, 0xDA, 0xB6, 0xDC, 0xD6,
            0x60, 0x01, 0xE0, 0xA1, 0x7B, 0xFE, 0x60, 0x04, 0xE0, 0xA1, 0x7B, 0x02, 0x60, 0x1F, 0x8B, 0x02,
            0xDA, 0xB6, 0x8D, 0x70, 0xC0, 0x0A, 0x7D, 0xFE, 0x40, 0x00, 0x7D, 0x02, 0x60, 0x00, 0x60, 0x1F,
            0x8D, 0x02, 0xDC, 0xD6, 0xA2, 0xF0, 0xD6, 0x71, 0x86, 0x84, 0x87, 0x94, 0x60, 0x3F, 0x86, 0x02,
            0x61, 0x1F, 0x87, 0x12, 0x46, 0x02, 0x12, 0x78, 0x46, 0x3F, 0x12, 0x82, 0x47, 0x1F, 0x69, 0xFF,
            0x47, 0x00, 0x69, 0x01, 0xD6, 0x71, 0x12, 0x2A, 0x68, 0x02, 0x63, 0x01, 0x80, 0x70, 0x80, 0xB5,
            0x12, 0x8A, 0x68, 0xFE, 0x63, 0x0A, 0x80, 0x70, 0x80, 0xD5, 0x3F, 0x01, 0x12, 0xA2, 0x61, 0x02,
            0x80, 0x15, 0x3F, 0x01, 0x12, 0xBA, 0x80, 0x15, 0x3F, 0x01, 0x12, 0xC8, 0x80, 0x15, 0x3F, 0x01,
            0x12, 0xC2, 0x60, 0x20, 0xF0, 0x18, 0x22, 0xD4, 0x8E, 0x34, 0x22, 0xD4, 0x66, 0x3E, 0x33, 0x01,
            0x66, 0x03, 0x68, 0xFE, 0x33, 0x01, 0x68, 0x02, 0x12, 0x16, 0x79, 0xFF, 0x49, 0xFE, 0x69, 0xFF,
            0x12, 0xC8, 0x79, 0x01, 0x49, 0x02, 0x69, 0x01, 0x60, 0x04, 0xF0, 0x18, 0x76, 0x01, 0x46, 0x40,
            0x76, 0xFE, 0x12, 0x6C, 0xA2, 0xF2, 0xFE, 0x33, 0xF2, 0x65, 0xF1, 0x29, 0x64, 0x14, 0x65, 0x00,
            0xD4, 0x55, 0x74, 0x15, 0xF2, 0x29, 0xD4, 0x55, 0x00, 0xEE, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80,
            0x80, 0x00, 0x00, 0x00, 0x00, 0x00
        ]

        // this.module._load_opcode_at(0x200, 0xA000);
        // this.module._load_opcode_at(0x202, 0xD005);
        // this.loadBin(codeTest);
        this.loadch(ch);
    }

    render() {
        if (this.module._get_draw_flag()) {
            const pixels = new Uint8ClampedArray(
                this.module.HEAPU8.buffer,
                this.displayPtr,
                this.width * this.height * 4
            );

            this.imageData.data.set(pixels);
            this.ctx.putImageData(this.imageData, 0, 0);
            this.module._clear_draw_flag();
        }
    }

    start() {
        let lastTimerUpdate = performance.now();
        let lastInstructionTime = performance.now();

        const timerInterval = 1000 / 120;
        const instructionInterval = 1000 / 1000;

        const loop = (timestamp) => {
            if (timestamp - lastInstructionTime > 100) {
                lastInstructionTime = timestamp - instructionInterval;
            }

            while (timestamp - lastInstructionTime >= instructionInterval) {
                this.module._step();
                lastInstructionTime += instructionInterval;
            }

            while (timestamp - lastTimerUpdate >= timerInterval) {
                this.module._update_timers();
                lastTimerUpdate += timerInterval;
            }

            this.render();
            this.updateDebug();
            this.drawInteractiveMemory();

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }

    loadBin(code) {
        let segments = asmToBin(code);
        if (!segments) return;

        for (let seg of segments) {
            let currentAddr = parseInt(seg.start);

            for (let item of seg.bytes) {
                if (item.size === 2) {
                    this.module._load_opcode_at(currentAddr, item.val);
                    currentAddr += 2;
                } else {
                    this.module._load_data_at(currentAddr, item.val);
                    currentAddr += 1;
                }
            }
        }
    }

    loadch(code) {
        let currentAddr = 0x200;
        for (let i = 0; i < code.length; i++) {
            this.module._load_data_at(currentAddr, code[i]);
            currentAddr += 1;
        }
    }

    updateDebug() {
        for (let i = 0; i < 16; i++) {
            const val = this.vRegisters[i].toString(16).toUpperCase().padStart(2, '0');
            if (this.regElements[i].textContent !== val) {
                this.regElements[i].textContent = val;
            }
        }
        const pc = this.module._get_pc().toString(16).toUpperCase().padStart(3, '0');
        this.pcElement.textContent = `0x${pc}`;
    }

    createDebugUI() {
        const container = document.createElement('div');
        container.classList.add('debug-container');

        for (let i = 0; i < 16; i++) {
            const regDiv = document.createElement('div');
            regDiv.innerHTML = `V${i.toString(16).toUpperCase()}: <span id="vreg-${i}">00</span>`;
            container.appendChild(regDiv);
            this.regElements[i] = regDiv.querySelector('span');
        }

        const pcDiv = document.createElement('div');
        pcDiv.classList.add('pc-row');
        pcDiv.innerHTML = `PC: <span id="pc-reg">0x000</span>`;
        container.appendChild(pcDiv);
        this.pcElement = pcDiv.querySelector('#pc-reg');

        const debugPanel = document.getElementById('debug-panel');
        if (debugPanel) {
            debugPanel.appendChild(container);
        } else {
            document.body.appendChild(container);
        }
    }

    drawMemoryMap() {
        const data = this.memImageData.data;
        const pc = this.module._get_pc();
        const indexI = this.module._get_i();

        for (let i = 0; i < 4096; i++) {
            const val = this.memoryView[i];
            const dIdx = i * 4;

            data[dIdx] = 0;
            data[dIdx + 1] = val;
            data[dIdx + 2] = 0;
            data[dIdx + 3] = 255;

            if (i === pc || i === pc + 1) {
                data[dIdx] = 255;
                data[dIdx + 1] = 0;
            }

            if (i === indexI) {
                data[dIdx + 2] = 255;
                data[dIdx + 1] = 100;
            }
        }
        this.memCtx.putImageData(this.memImageData, 0, 0);
    }

    updateSelectedAddress(mouseX, mouseY) {
        const rect = this.memCanvas.getBoundingClientRect();
        const canvasX = (mouseX - rect.left) * (this.memCanvas.width / rect.width);
        const canvasY = (mouseY - rect.top) * (this.memCanvas.height / rect.height);
        const worldX = (canvasX - this.memState.pointX) / this.memState.scale;
        const worldY = (canvasY - this.memState.pointY) / this.memState.scale;

        const col = Math.floor(worldX / this.memState.gridSize);
        const row = Math.floor(worldY / this.memState.gridSize);

        if (col >= 0 && col < this.memState.cols && row >= 0 && row < this.memState.rows) {
            const addr = row * this.memState.cols + col;
            if (addr < 4096) {
                this.memState.selectedAddr = addr;
                this.updateMemInfoDOM(addr);
                return;
            }
        }

        this.memState.selectedAddr = -1;
        if (this.memInfoElement) this.memInfoElement.textContent = "Addr: --- | Val: --";
    }

    initMemoryInteraction() {
        const clampBounds = () => {
            const limitX = this.memCanvas.width;
            const limitY = this.memCanvas.height;
            this.memState.pointX = Math.max(-limitX, Math.min(limitX, this.memState.pointX));
            this.memState.pointY = Math.max(-limitY, Math.min(limitY, this.memState.pointY));
        };

        this.memCanvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = this.memCanvas.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left) * (this.memCanvas.width / rect.width);
            const mouseY = (e.clientY - rect.top) * (this.memCanvas.height / rect.height);

            const xs = (mouseX - this.memState.pointX) / this.memState.scale;
            const ys = (mouseY - this.memState.pointY) / this.memState.scale;

            const delta = -e.deltaY;
            const factor = delta > 0 ? 1.1 : 0.9;
            const newScale = Math.max(0.05, Math.min(15, this.memState.scale * factor));

            this.memState.pointX = mouseX - xs * newScale;
            this.memState.pointY = mouseY - ys * newScale;
            this.memState.scale = newScale;

            clampBounds();
        });

        this.memCanvas.addEventListener('mousedown', (e) => {
            this.memState.panning = true;
            const rect = this.memCanvas.getBoundingClientRect();
            const canvasX = (e.clientX - rect.left) * (this.memCanvas.width / rect.width);
            const canvasY = (e.clientY - rect.top) * (this.memCanvas.height / rect.height);

            this.memState.startX = canvasX - this.memState.pointX;
            this.memState.startY = canvasY - this.memState.pointY;
            this.memCanvas.classList.add('panning');
        });

        window.addEventListener('mousemove', (e) => {
            const rect = this.memCanvas.getBoundingClientRect();

            if (this.memState.panning) {
                const canvasX = (e.clientX - rect.left) * (this.memCanvas.width / rect.width);
                const canvasY = (e.clientY - rect.top) * (this.memCanvas.height / rect.height);

                this.memState.pointX = canvasX - this.memState.startX;
                this.memState.pointY = canvasY - this.memState.startY;

                clampBounds();
            } else {
                this.updateSelectedAddress(e.clientX, e.clientY);
            }
        });

        window.addEventListener('mouseup', () => {
            this.memState.panning = false;
            if (this.memCanvas) this.memCanvas.classList.remove('panning');
        });
    }

    updateMemInfoDOM(addr) {
        if (!this.memInfoElement) return;
        const val = this.memoryView[addr];
        const hexAddr = addr.toString(16).toUpperCase().padStart(3, '0');
        const hexVal = val.toString(16).toUpperCase().padStart(2, '0');
        this.memInfoElement.textContent = `Addr: 0x${hexAddr} | Val: 0x${hexVal} (${val})`;
    }

    drawInteractiveMemory() {
        if (!this.memCtx) return;

        const ctx = this.memCtx;
        const s = this.memState;

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, this.memCanvas.width, this.memCanvas.height);
        ctx.restore();

        ctx.save();
        ctx.translate(s.pointX, s.pointY);
        ctx.scale(s.scale, s.scale);

        const pc = this.module._get_pc();
        const regI = this.module._get_i();
        const gs = s.gridSize;

        for (let row = 0; row < s.rows; row++) {
            for (let col = 0; col < s.cols; col++) {
                const addr = row * s.cols + col;
                if (addr >= 4096) break;

                const val = this.memoryView[addr];
                const x = col * gs;
                const y = row * gs;

                if (val === 0) {
                    ctx.fillStyle = 'rgba(30, 30, 30, 0.5)';
                } else {
                    const brightness = Math.min(255, 50 + val * 0.8);
                    ctx.fillStyle = `rgb(0, ${brightness}, 50)`;
                }
                if (addr < 0x200) {
                    ctx.fillStyle = val === 0 ? 'rgba(20, 30, 50, 0.5)' : `rgb(0, 100, ${50 + val * 0.5})`;
                }

                ctx.fillRect(x, y, gs - 1, gs - 1);
                if (addr === pc || addr === pc + 1) {
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = '#f00';
                    ctx.strokeRect(x + 1, y + 1, gs - 3, gs - 3);
                }
                if (addr === regI) {
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = '#ff0';
                    ctx.strokeRect(x + 1, y + 1, gs - 3, gs - 3);
                }
                if (addr === s.selectedAddr) {
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = '#fff';
                    ctx.strokeRect(x, y, gs - 1, gs - 1);
                }
            }
        }
        ctx.restore();
    }

    reset() {
        this.module._init();
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    runAsm(code) {
        try {
            this.reset();
            this.loadBin(code);
            console.log("Code loaded successfully!");
        } catch (e) {
            console.error("Assembler Error:", e);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    createChip8().then(Module => {
        const canvas = document.getElementById('display');
        const emu = new Chip8Emulator(canvas, Module);
        
        const editor = document.getElementById('asm-editor');
        const highlightOverlay = document.getElementById('asm-highlight');
        const lineNumbers = document.getElementById('line-numbers');
        const runButton = document.getElementById('run-button');

        const updateLineNumbers = () => {
            if (!lineNumbers || !editor) return;
            const lines = editor.value.split('\n').length;
            lineNumbers.innerHTML = Array.from({ length: lines }, (_, index) => index + 1).join('<br>');
        };

        editor.addEventListener('input', () => {
            updateLineNumbers();
            updateHighlight();
        });

        const syncHighlightScroll = () => {
            if (lineNumbers) lineNumbers.scrollTop = editor.scrollTop;
            if (highlightOverlay) {
                highlightOverlay.scrollTop = editor.scrollTop;
                highlightOverlay.scrollLeft = editor.scrollLeft;
            }
        };

        editor.addEventListener('scroll', syncHighlightScroll);

        const updateHighlight = () => {
            if (!highlightOverlay || !editor) return;
            highlightOverlay.innerHTML = highlightCode(editor.value);
            syncHighlightScroll();
        };

        updateLineNumbers();
        updateHighlight();

        function debugSyncTest() {
            const totalLines = 100;
            const markerLine = 50;
            const content = Array.from({ length: totalLines }, (_, i) => `LD V0, ${i + 1}`).join('\n');

            editor.value = content;
            updateLineNumbers();
            updateHighlight();

            const textScrollHeight = editor.scrollHeight;
            const highlightScrollHeight = highlightOverlay.scrollHeight;
            const lineNumbersScrollHeight = lineNumbers.scrollHeight;

            if (Math.abs(textScrollHeight - highlightScrollHeight) >= 1) {
                console.error('ScrollHeight mismatch: textarea=', textScrollHeight, 'highlight=', highlightScrollHeight);
            }
            if (Math.abs(textScrollHeight - lineNumbersScrollHeight) >= 1) {
                console.error('ScrollHeight mismatch: textarea=', textScrollHeight, 'lineNumbers=', lineNumbersScrollHeight);
            }
            if (Math.abs(highlightScrollHeight - lineNumbersScrollHeight) >= 1) {
                console.error('ScrollHeight mismatch: highlight=', highlightScrollHeight, 'lineNumbers=', lineNumbersScrollHeight);
            }

            editor.scrollTop = editor.scrollHeight;
            syncHighlightScroll();

            if (highlightOverlay.scrollTop !== editor.scrollTop) {
                console.error('ScrollTop mismatch: highlightOverlay=', highlightOverlay.scrollTop, 'textarea=', editor.scrollTop);
            }
            if (lineNumbers.scrollTop !== editor.scrollTop) {
                console.error('ScrollTop mismatch: lineNumbers=', lineNumbers.scrollTop, 'textarea=', editor.scrollTop);
            }

            editor.value = Array.from({ length: totalLines }, (_, i) => {
                const line = `LD V0, ${i + 1}`;
                return (i + 1) === markerLine ? `${line} X` : line;
            }).join('\n');
            updateLineNumbers();
            updateHighlight();

            highlightOverlay.innerHTML = highlightOverlay.innerHTML.replace(' X', ' <span class="debug-marker">X</span>');

            const marker = highlightOverlay.querySelector('.debug-marker');
            if (!marker) {
                console.error('Debug marker not found in highlight overlay');
                return;
            }

            const editorRect = editor.getBoundingClientRect();
            const markerRect = marker.getBoundingClientRect();
            const expectedTop = editorRect.top + 10 + (markerLine - 1) * 20 - editor.scrollTop;
            if (Math.abs(markerRect.top - expectedTop) >= 2) {
                console.error('Marker alignment mismatch:', markerRect.top, expectedTop);
            } else {
                console.log('debugSyncTest passed');
            }
        }

        window.debugSyncTest = debugSyncTest;

//         const defaultCode = `
// ORG 0x200
//     LD V0, 0x10      
//     LD V1, 0x10      
//     LD V2, 0x01
//     LD V3, 0xFF
//     LD I, 0x500     

//     DRW V0, V1, 0x5

// MAIN:
//     DRW V0, V1, 0x5

//     LD V5, 0x05
//     SKNP V5
//     ADD V1, V3  

//     LD V5, 0x08
//     SKNP V5
//     ADD V1, V2

//     LD V5, 0x07
//     SKNP V5
//     ADD V0, V3

//     LD V5, 0x09
//     SKNP V5
//     ADD V0, V2

//     DRW V0, V1, 0x5

//     LD V4, 0x01
//     LD DT, V4
// SYNC:
//     LD V4, DT
//     SE V4, 0x0
//     JP SYNC

//     JP MAIN

// ORG 0x500
//     DB 0x20 
//     DB 0x70 
//     DB 0xF8 
//     DB 0x70 
//     DB 0x20
// `;

//         editor.value = defaultCode;

        runButton.addEventListener('click', () => {
            const code = editor.value;
            emu.runAsm(code);
        });

        emu.start();
    });
});