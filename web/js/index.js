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

        this.module._load_opcode_at(0x200, 0xA000);
        this.module._load_opcode_at(0x202, 0xD005);
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
}

createChip8().then(Module => {
    let codeTest = `
; --- Секція коду ---
ORG 0x200
LD V0, 0x02       ; 6002
LD V1, 0x02       ; 6102
LD I, 0x500       ; A500 
DRW V0, V1, 0x5     ; D015 

LOOP:
JP LOOP          ; 1208 

; --- Секція даних ---
ORG 0x500
DB 0x3C           ; 00111100
DB 0x42           ; 01000010
DB 0x81           ; 10000001
DB 0x42           ; 01000010
DB 0x3C           ; 00111100
`;
    asmToBin(codeTest);
    const canvas = document.getElementById('display');
    const emu = new Chip8Emulator(canvas, Module);
    emu.start();

    const status = document.getElementById('status');
    if (status) status.parentElement.remove();
});