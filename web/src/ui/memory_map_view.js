const MIN_SCALE = 0.1;
const MAX_SCALE = 0.75;

export class MemoryMapView {
    constructor({ core, canvas, infoElement, windowRef }) {
        this.core = core;
        this.canvas = canvas;
        this.infoElement = infoElement;
        this.window = windowRef;
        this.context = canvas?.getContext('2d') ?? null;
        this.imageData = this.context?.createImageData(64, 64) ?? null;
        this.state = {
            scale: 0.2,
            panning: false,
            pointX: 50,
            pointY: 50,
            startX: 0,
            startY: 0,
            gridSize: 16,
            cols: 64,
            rows: 64,
            selectedAddress: -1
        };
        this.centerMap();
        this.clampPan();
        this.attachInteractions();
    }

    draw() {
        if (!this.context || !this.imageData) return;

        const context = this.context;
        const state = this.state;
        const memory = this.core.getMemoryView();
        if (!memory) return;

        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.fillStyle = '#111';
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        context.restore();
        context.save();
        context.translate(state.pointX, state.pointY);
        context.scale(state.scale, state.scale);

        const pc = this.core.getPC();
        const indexRegister = this.core.getI();
        const cellSize = state.gridSize;

        for (let row = 0; row < state.rows; row++) {
            for (let column = 0; column < state.cols; column++) {
                const address = row * state.cols + column;
                const value = memory[address];
                const x = column * cellSize;
                const y = row * cellSize;

                context.fillStyle = this.getCellColor(address, value);
                context.fillRect(x, y, cellSize - 1, cellSize - 1);
                this.drawAddressMarker(context, address, pc, indexRegister, state.selectedAddress, x, y, cellSize);
            }
        }

        context.restore();
    }

    getCellColor(address, value) {
        if (address < 0x200) {
            return value === 0 ? 'rgba(20, 30, 50, 0.5)' : `rgb(0, 100, ${50 + value * 0.5})`;
        }
        if (value === 0) return 'rgba(30, 30, 30, 0.5)';
        return `rgb(0, ${Math.min(255, 50 + value * 0.8)}, 50)`;
    }

    drawAddressMarker(context, address, pc, indexRegister, selectedAddress, x, y, cellSize) {
        if (address === pc || address === pc + 1) {
            this.strokeCell(context, '#f00', x, y, cellSize, 2);
        }
        if (address === indexRegister) {
            this.strokeCell(context, '#ff0', x, y, cellSize, 2);
        }
        if (address === selectedAddress) {
            this.strokeCell(context, '#fff', x, y, cellSize, 3, false);
        }
    }

    strokeCell(context, color, x, y, cellSize, lineWidth, inset = true) {
        context.lineWidth = lineWidth;
        context.strokeStyle = color;
        const offset = inset ? 1 : 0;
        const size = inset ? cellSize - 3 : cellSize - 1;
        context.strokeRect(x + offset, y + offset, size, size);
    }

    attachInteractions() {
        if (!this.canvas) return;

        this.canvas.addEventListener('wheel', (event) => this.zoom(event), { passive: false });
        this.canvas.addEventListener('mousedown', (event) => this.beginPan(event));
        this.window.addEventListener('mousemove', (event) => this.movePointer(event));
        this.window.addEventListener('mouseup', () => this.endPan());
    }

    zoom(event) {
        event.preventDefault();
        const position = this.getCanvasPosition(event.clientX, event.clientY);
        const state = this.state;
        const worldX = (position.x - state.pointX) / state.scale;
        const worldY = (position.y - state.pointY) / state.scale;
        const scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, state.scale * (event.deltaY < 0 ? 1.1 : 0.9)));

        state.pointX = position.x - worldX * scale;
        state.pointY = position.y - worldY * scale;
        state.scale = scale;
        this.clampPan();
    }

    beginPan(event) {
        const position = this.getCanvasPosition(event.clientX, event.clientY);
        this.state.panning = true;
        this.state.startX = position.x - this.state.pointX;
        this.state.startY = position.y - this.state.pointY;
        this.canvas.classList.add('panning');
    }

    movePointer(event) {
        if (this.state.panning) {
            const position = this.getCanvasPosition(event.clientX, event.clientY);
            this.state.pointX = position.x - this.state.startX;
            this.state.pointY = position.y - this.state.startY;
            this.clampPan();
            return;
        }
        this.updateSelectedAddress(event.clientX, event.clientY);
    }

    endPan() {
        this.state.panning = false;
        this.canvas?.classList.remove('panning');
    }

    getCanvasPosition(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (clientX - rect.left) * (this.canvas.width / rect.width),
            y: (clientY - rect.top) * (this.canvas.height / rect.height)
        };
    }

    clampPan() {
        this.state.pointX = this.clampAxis(
            this.state.pointX,
            this.state.cols * this.state.gridSize * this.state.scale,
            this.canvas.width
        );
        this.state.pointY = this.clampAxis(
            this.state.pointY,
            this.state.rows * this.state.gridSize * this.state.scale,
            this.canvas.height
        );
    }

    centerMap() {
        const contentWidth = this.state.cols * this.state.gridSize * this.state.scale;
        const contentHeight = this.state.rows * this.state.gridSize * this.state.scale;
        this.state.pointX = (this.canvas.width - contentWidth) / 2;
        this.state.pointY = (this.canvas.height - contentHeight) / 2;
    }

    clampAxis(offset, contentSize, viewportSize) {
        const minOffset = Math.min(0, viewportSize - contentSize);
        const maxOffset = Math.max(0, viewportSize - contentSize);
        return Math.max(minOffset, Math.min(maxOffset, offset));
    }

    updateSelectedAddress(clientX, clientY) {
        if (!this.infoElement) return;
        const position = this.getCanvasPosition(clientX, clientY);
        const column = Math.floor((position.x - this.state.pointX) / this.state.scale / this.state.gridSize);
        const row = Math.floor((position.y - this.state.pointY) / this.state.scale / this.state.gridSize);
        const address = row * this.state.cols + column;

        if (column >= 0 && column < this.state.cols && row >= 0 && row < this.state.rows && address < 4096) {
            const memory = this.core.getMemoryView();
            if (!memory) return;
            this.state.selectedAddress = address;
            const value = memory[address];
            const hexAddress = address.toString(16).toUpperCase().padStart(3, '0');
            const hexValue = value.toString(16).toUpperCase().padStart(2, '0');
            this.infoElement.textContent = `Addr: 0x${hexAddress} | Val: 0x${hexValue} (${value})`;
            return;
        }

        this.state.selectedAddress = -1;
        this.infoElement.textContent = 'Addr: --- | Val: --';
    }
}
