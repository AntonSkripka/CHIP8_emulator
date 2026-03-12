import { asmToBin } from './asm.js';

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

        const firstPixel = new Uint32Array(this.module.HEAPU8.buffer, this.displayPtr, 1)[0];
        console.log(firstPixel);
        let codeTest = `
; --- Секція коду ---
ORG 0x200
LD V0, 0x00       ; X = 0
LD V1, 0x00       ; Y = 0
LD V2, 0x01    
LD V4, 0x01

MAIN_LOOP:
LD I, 0x500
DRW V0, V1, 0x5

LD V3, 0xFF
DELAY:
SUB V3, V4
SE V3, 0x00
JP DELAY

DRW V0, V1, 0x5

ADD V0, V2     ; X = X + 1
ADD V1, V2     ; Y = Y + 1
AND V0, 0x3F   ; (V0 % 64)
AND V1, 0x1F   ; (V1 % 32)

JP MAIN_LOOP

; --- Секція даних ---
ORG 0x500
DB 0x3C
DB 0x42
DB 0x81
DB 0x42
DB 0x3C
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

            this.render();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    loadBin(code) {
        let result = asmToBin(code);
        for (let i = 0; i < result.length; i++) {
            if (result[i].mode === 1) {
                for (let j = 0; j < result[i].binCode.length; j++) {
                    result[i].start = parseInt(result[i].start);
                    this.module._load_opcode_at(result[i].start, result[i].binCode[j]);
                    result[i].start = parseInt(result[i].start) + 0x002;
                }
            } else {
                for (let j = 0; j < result[i].binData.length; j++) {
                    result[i].start = parseInt(result[i].start);
                    this.module._load_data_at(result[i].start, result[i].binData[j]);
                    result[i].start = parseInt(result[i].start) + 0x001;
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