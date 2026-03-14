import { asmToBin } from './asm.js';

const KEY_MAP = {
    '1': 0x1, '2': 0x2, '3': 0x3, '4': 0xC,
    'q': 0x4, 'w': 0x5, 'e': 0x6, 'r': 0xD,
    'a': 0x7, 's': 0x8, 'd': 0x9, 'f': 0xE,
    'z': 0xA, 'x': 0x0, 'c': 0xB, 'v': 0xF
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
            console.log("Pressed:", e.key);
            const keyIndex = KEY_MAP[e.key.toLowerCase()];
            if (keyIndex !== undefined) {
                this.module._set_key(keyIndex, 1);
            }
        });

        window.addEventListener('keyup', (e) => {
            const keyIndex = KEY_MAP[e.key.toLowerCase()];
            if (keyIndex !== undefined) {
                this.module._set_key(keyIndex, 0);
            }
        });

        let codeTest = `
ORG 0x200
    LD V0, 0x10      ; X
    LD V1, 0x10      ; Y
    LD V2, 0x01
    LD I, 0x500

MAIN:
    DRW V0, V1, 0x5

WAIT_FRAME:
    LD V3, 0x01
    LD DT, V3
;SYNC:
;    LD V3, DT
;    SE V3, 0x00
;    JP SYNC

    DRW V0, V1, 0x5

    LD V5, 0x05      ; W
    SKNP V5
    SUB V1, V2

    LD V5, 0x08      ; S
    SKNP V5
    ADD V1, V2

    LD V5, 0x07      ; A
    SKNP V5
    SUB V0, V2

    LD V5, 0x09      ; D
    SKNP V5
    ADD V0, V2

    JP MAIN

ORG 0x500
    DB 0x20 
    DB 0x70 
    DB 0xF8 
    DB 0x70 
    DB 0x20
`;

        // this.module._load_opcode_at(0x200, 0xA000);
        // this.module._load_opcode_at(0x202, 0xD005);
        this.loadBin(codeTest);
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
        const loop = () => {
            for (let i = 0; i < 10; i++) {
                this.module._step();
            }

            this.module._update_timers();

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
}

createChip8().then(Module => {
    const canvas = document.getElementById('display');
    const emu = new Chip8Emulator(canvas, Module);
    emu.start();

    const status = document.getElementById('status');
    if (status) status.parentElement.remove();
});