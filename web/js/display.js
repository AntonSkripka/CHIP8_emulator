export class CHIP8Display {
    constructor(canvas, core) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.core = core;
        this.width = 64;
        this.height = 32;
        this.imageData = this.ctx.createImageData(this.width, this.height);
    }

    render() {
        if (!this.core.getDrawFlag()) {
            return;
        }

        const displayPtr = this.core.getDisplayPtr();
        const pixels = new Uint8ClampedArray(
            this.core.module.HEAPU8.buffer,
            displayPtr,
            this.width * this.height * 4
        );

        this.imageData.data.set(pixels);
        this.ctx.putImageData(this.imageData, 0, 0);
        this.core.clearDrawFlag();
    }

    clear() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
