export class Chip8Display {
    constructor({ canvas, core }) {
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

        const pixels = this.core.getDisplayPixels(this.width * this.height * 4);
        if (!pixels) return;

        this.imageData.data.set(pixels);
        this.ctx.putImageData(this.imageData, 0, 0);
        this.core.clearDrawFlag();
    }

    clear() {
        this.imageData.data.fill(0);
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
