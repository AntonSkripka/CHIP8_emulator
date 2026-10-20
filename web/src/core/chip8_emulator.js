import { DEFAULT_PONG_ROM } from './default_rom.js';

export class Chip8Emulator {
    constructor({ core, display, monitor, memoryMap, scheduler, logger = console }) {
        this.core = core;
        this.display = display;
        this.monitor = monitor;
        this.memoryMap = memoryMap;
        this.scheduler = scheduler;
        this.logger = logger;
        this.tickrate = 20;

        this.loadDefaultPong();
        this.monitor.updateStackUI();
    }

    start() {
        let lastTimerUpdate = this.scheduler.now();
        let lastInstructionTime = this.scheduler.now();
        const timerInterval = 1000 / 60;

        const frame = (timestamp) => {
            const instructionInterval = 1000 / (this.tickrate * 60);
            if (timestamp - lastInstructionTime > 100) {
                lastInstructionTime = timestamp - instructionInterval;
            }

            while (timestamp - lastInstructionTime + 0.000001 >= instructionInterval) {
                this.core.step();
                this.monitor.updateStackUI();
                lastInstructionTime += instructionInterval;
            }

            while (timestamp - lastTimerUpdate + 0.000001 >= timerInterval) {
                this.core.updateTimers();
                lastTimerUpdate += timerInterval;
            }

            this.display.render();
            this.monitor.updateDebug();
            this.memoryMap.draw();
            this.scheduler.requestFrame(frame);
        };

        this.scheduler.requestFrame(frame);
    }

    loadBin(source) {
        this.core.loadBin(source);
    }

    loadRom(rom, options = {}) {
        this.core.setQuirks(options);
        const tickrate = Number(options.tickrate);
        this.tickrate = Number.isFinite(tickrate) && tickrate > 0
            ? Math.max(1, Math.min(Math.floor(tickrate), 10000))
            : 20;
        rom.forEach((byte, index) => this.core.loadDataAt(0x200 + index, byte));
    }

    loadDefaultPong() {
        this.loadRom(DEFAULT_PONG_ROM);
    }

    reset() {
        this.core.init();
        this.tickrate = 20;
        this.monitor.reset();
        this.display.clear();
    }

    runAsm(source) {
        try {
            this.reset();
            this.loadBin(source);
            this.logger.log('Code loaded successfully!');
        } catch (error) {
            this.logger.error('Assembler error:', error);
        }
    }
}
