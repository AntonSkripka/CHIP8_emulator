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
    const canvas = document.getElementById('display');
    const emu = new Chip8Emulator(canvas, Module);
    emu.start();

    const status = document.getElementById('status');
    if (status) status.parentElement.remove();
});