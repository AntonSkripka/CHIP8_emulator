import { asmToBin } from './asm.js';

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
        this.imageData = this.ctx.createImageData(this.width, this.height);

        this.init();
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
}

createChip8().then(Module => {
    const canvas = document.getElementById('display');
    const emu = new Chip8Emulator(canvas, Module);
    emu.start();

    const status = document.getElementById('status');
    if (status) status.parentElement.remove();
});