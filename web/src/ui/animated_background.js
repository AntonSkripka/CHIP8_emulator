export class AnimatedBackground {
    constructor({ container, documentRef, windowRef }) {
        this.document = documentRef;
        this.window = windowRef;
        this.canvas = documentRef.createElement('canvas');
        this.canvas.className = 'animated-background-canvas';
        this.context = this.canvas.getContext('2d', { alpha: false });
        if (!this.context) {
            throw new Error('Could not initialize the animated background canvas.');
        }

        this.sprite = documentRef.createElement('canvas');
        this.spriteContext = this.sprite.getContext('2d');
        if (!this.spriteContext) {
            throw new Error('Could not initialize the animated background glow sprite.');
        }

        this.bloomSprite = documentRef.createElement('canvas');
        this.bloomContext = this.bloomSprite.getContext('2d');
        if (!this.bloomContext) {
            throw new Error('Could not initialize the animated background bloom sprite.');
        }

        this.tileSize = 42;
        this.frameInterval = 80;
        this.frameId = null;
        this.frameTimeoutId = null;
        this.startTime = null;
        this.width = 0;
        this.height = 0;
        this.columns = 0;
        this.rows = 0;
        this.dpr = 1;
        this.motionQuery = windowRef.matchMedia('(prefers-reduced-motion: reduce)');
        this.reducedMotion = this.motionQuery.matches;

        container.appendChild(this.canvas);
        this.resize = this.resize.bind(this);
        this.draw = this.draw.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.handleThemeChange = this.handleThemeChange.bind(this);
        this.handleMotionPreferenceChange = this.handleMotionPreferenceChange.bind(this);
        windowRef.addEventListener('resize', this.resize);
        documentRef.addEventListener('visibilitychange', this.handleVisibilityChange);
        documentRef.addEventListener('themechange', this.handleThemeChange);
        this.motionQuery.addEventListener('change', this.handleMotionPreferenceChange);

        this.resize();
        this.refreshTheme();
        this.requestFrame();
    }

    resize() {
        this.width = this.window.innerWidth;
        this.height = this.window.innerHeight;
        this.columns = Math.max(1, Math.floor(this.width / this.tileSize));
        this.rows = Math.max(1, Math.floor(this.height / this.tileSize));
        this.dpr = Math.min(this.window.devicePixelRatio || 1, 2);
        this.canvas.width = Math.round(this.width * this.dpr);
        this.canvas.height = Math.round(this.height * this.dpr);
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        this.createGlowSprite();
        this.requestFrame();
    }

    refreshTheme() {
        const styles = this.window.getComputedStyle(this.document.documentElement);
        this.backgroundColor = styles.getPropertyValue('--background-color').trim();
        this.accentColor = styles.getPropertyValue('--accent-color').trim();
        this.isBlueTheme = this.document.documentElement.dataset.theme === 'blue';
        this.createGlowSprite();
        this.requestFrame();
    }

    createGlowSprite() {
        if (!this.accentColor || !this.width) return;

        const bloomSize = this.tileSize * 4;
        const bloomPixels = Math.round(bloomSize * this.dpr);
        this.bloomSprite.width = bloomPixels;
        this.bloomSprite.height = bloomPixels;
        this.bloomContext.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        const bloomCenter = bloomSize / 2;
        const gradient = this.bloomContext.createRadialGradient(
            bloomCenter, bloomCenter, this.tileSize * 0.22,
            bloomCenter, bloomCenter, bloomCenter
        );
        gradient.addColorStop(0, this.accentColor);
        gradient.addColorStop(0.38, this.accentColor);
        gradient.addColorStop(1, 'transparent');
        this.bloomContext.clearRect(0, 0, bloomSize, bloomSize);
        this.bloomContext.fillStyle = gradient;
        this.bloomContext.fillRect(0, 0, bloomSize, bloomSize);
        this.bloomSize = bloomSize;

        const size = this.tileSize + 12;
        const pixelSize = Math.round(size * this.dpr);
        this.sprite.width = pixelSize;
        this.sprite.height = pixelSize;
        this.spriteContext.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

        this.spriteContext.clearRect(0, 0, size, size);
        this.spriteContext.strokeStyle = this.accentColor;
        this.spriteContext.lineWidth = 1;
        this.spriteContext.globalAlpha = 0.3;
        this.spriteContext.strokeRect(2.5, 2.5, size - 5, size - 5);
        this.spriteContext.globalAlpha = 0.52;
        this.spriteContext.strokeRect(4, 4, size - 8, size - 8);
        this.spriteContext.globalAlpha = 1;
        this.spriteContext.fillStyle = this.accentColor;
        this.spriteContext.globalAlpha = 0.25;
        this.spriteContext.fillRect(6, 6, this.tileSize, this.tileSize);
        this.spriteContext.globalAlpha = 0.62;
        this.spriteContext.fillRect(10, 10, this.tileSize - 8, this.tileSize - 8);
        this.spriteContext.globalAlpha = 0.85;
        this.spriteContext.fillRect(15, 15, this.tileSize - 18, this.tileSize - 18);

        this.spriteContext.fillStyle = this.backgroundColor;
        for (let y = 6; y < size - 6; y += 2) {
            for (let x = 6; x < size - 6; x += 2) {
                this.spriteContext.globalAlpha = 0.025 + hash(x + y * size, 0) * 0.09;
                this.spriteContext.fillRect(x, y, 1, 1);
            }
        }
        this.spriteContext.globalAlpha = 1;
        this.spriteSize = size;
    }

    requestFrame() {
        if (this.frameId !== null || this.frameTimeoutId !== null || this.document.hidden) return;
        if (this.reducedMotion || this.startTime === null) {
            this.frameId = this.window.requestAnimationFrame(this.draw);
            return;
        }

        this.frameTimeoutId = this.window.setTimeout(() => {
            this.frameTimeoutId = null;
            if (!this.document.hidden) {
                this.frameId = this.window.requestAnimationFrame(this.draw);
            }
        }, this.frameInterval);
    }

    handleVisibilityChange() {
        if (this.document.hidden) {
            if (this.frameId !== null) this.window.cancelAnimationFrame(this.frameId);
            if (this.frameTimeoutId !== null) this.window.clearTimeout(this.frameTimeoutId);
            this.frameId = null;
            this.frameTimeoutId = null;
        } else {
            this.startTime = null;
            this.requestFrame();
        }
    }

    handleThemeChange() {
        this.refreshTheme();
    }

    handleMotionPreferenceChange(event) {
        this.reducedMotion = event.matches;
        if (this.reducedMotion) {
            if (this.frameId !== null) this.window.cancelAnimationFrame(this.frameId);
            if (this.frameTimeoutId !== null) this.window.clearTimeout(this.frameTimeoutId);
            this.frameId = null;
            this.frameTimeoutId = null;
            this.draw(0);
        } else {
            this.startTime = null;
            this.requestFrame();
        }
    }

    draw(timestamp) {
        this.frameId = null;
        if (this.document.hidden || !this.width || !this.height) return;
        if (this.startTime === null) this.startTime = timestamp;

        const elapsed = this.reducedMotion ? 0 : (timestamp - this.startTime) / 1000;
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0, 0, this.width, this.height);

        const bloomRadius = this.bloomSize / 2;
        const offsetX = (this.width - this.columns * this.tileSize) / 2;
        const offsetY = (this.height - this.rows * this.tileSize) / 2;
        const noiseTime = elapsed * 1.2;
        const noiseStep = Math.floor(noiseTime);
        const noiseProgress = noiseTime - noiseStep;
        const smoothProgress = noiseProgress * noiseProgress * (3 - 2 * noiseProgress);
        for (let row = 0; row < this.rows; row += 1) {
            for (let column = 0; column < this.columns; column += 1) {
                const x = offsetX + column * this.tileSize + this.tileSize / 2;
                const y = offsetY + row * this.tileSize + this.tileSize / 2;
                const cellSeed = column + row * this.columns;
                const noiseStart = hash(cellSeed, noiseStep);
                const noiseEnd = hash(cellSeed, noiseStep + 1);
                const noise = noiseStart + (noiseEnd - noiseStart) * smoothProgress;
                const brightness = this.isBlueTheme
                    ? 0.12 + noise * 0.14
                    : 0.045 + noise * 0.07;

                this.context.globalAlpha = this.isBlueTheme
                    ? 0.008 + noise * 0.012
                    : 0.003 + noise * 0.006;
                this.context.drawImage(
                    this.bloomSprite,
                    x - bloomRadius,
                    y - bloomRadius,
                    this.bloomSize,
                    this.bloomSize
                );
                this.context.globalAlpha = brightness;
                this.context.drawImage(
                    this.sprite,
                    x - this.spriteSize / 2,
                    y - this.spriteSize / 2,
                    this.spriteSize,
                    this.spriteSize
                );
            }
        }
        this.context.globalAlpha = 1;

        if (!this.reducedMotion) this.requestFrame();
    }
}

function hash(seed, step) {
    let value = Math.imul(Math.floor(seed * 1000) ^ step, 0x45d9f3b);
    value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
    value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
    value = (value ^ (value >>> 16)) >>> 0;
    return value / 0xffffffff;
}
