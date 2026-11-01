import { DEFAULT_PONG_ROM } from './default_rom.js';
import { compile } from '../compiler/compiler.js';

export class Chip8Emulator {
    constructor({
        core,
        display,
        monitor,
        memoryMap,
        scheduler,
        logger = console,
        moduleResolver = null,
        onRuntimeFault = null,
        onProgramExit = null
    }) {
        this.core = core;
        this.display = display;
        this.monitor = monitor;
        this.memoryMap = memoryMap;
        this.scheduler = scheduler;
        this.logger = logger;
        this.moduleResolver = moduleResolver;
        this.onRuntimeFault = onRuntimeFault;
        this.onProgramExit = onProgramExit;
        this.tickrate = 20;
        this.executionStopped = false;
        this.lastCompiledProgram = null;

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

            while (!this.executionStopped &&
                timestamp - lastInstructionTime + 0.000001 >= instructionInterval) {
                const instructionPc = this.core.getPC();
                this.core.step();
                const executionFault = this.core.getExecutionFault();
                if (executionFault !== 0) {
                    const messages = {
                        1: 'Stack overflow; execution has been halted.',
                        2: 'Stack underflow; execution has been halted.',
                        3: 'Stack overflow; execution has been halted.',
                        4: 'Call stack underflow; execution has been halted.',
                        5: 'Division by zero; execution has been halted.',
                        6: 'Stack Underflow; execution has been halted.',
                        7: 'Invalid Stack Frame; execution has been halted.',
                        8: 'Invalid instruction; execution has been halted.',
                        9: 'Memory bounds violation; execution has been halted.',
                        10: 'Write to read-only memory; execution has been halted.'
                    };
                    const message = messages[executionFault] ??
                        `Unknown execution fault ${executionFault}; execution has been halted.`;
                    const source = this.findSourceLocation(instructionPc);
                    const sourceSuffix = source ? ` at ${source.line}:${source.column}` : '';
                    this.logger.error(`Runtime Error: ${message} at PC=0x${instructionPc
                        .toString(16).toUpperCase().padStart(3, '0')}${sourceSuffix}`);
                    this.onRuntimeFault?.({ fault: executionFault, pc: instructionPc, source });
                    this.executionStopped = true;
                } else if (this.lastCompiledProgram &&
                    this.core.getPC() === this.lastCompiledProgram.symbols.__exit) {
                    this.executionStopped = true;
                    const registers = this.core.getVRegistersView();
                    this.onProgramExit?.({ exitCode: registers?.[0] ?? null });
                }
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
        this.lastCompiledProgram = null;
        this.executionStopped = false;
        this.core.setChip8DevMode(false);
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
        this.executionStopped = false;
        this.lastCompiledProgram = null;
        this.tickrate = 20;
        this.monitor.reset();
        this.display.clear();
    }

    runAsm(source, { profile = 'chip8' } = {}) {
        try {
            const segments = this.core.assemble(source);
            this.core.validateSegments(segments);
            this.reset();
            this.core.setChip8DevMode(profile === 'chip8-dev');
            this.core.loadSegments(segments);
            this.logger.log('Code loaded successfully!');
            return null;
        } catch (error) {
            this.logger.error('Assembler error:', error);
            return error;
        }
    }

    runLanguage(source, { sourceName } = {}) {
        try {
            const program = compile(source, {
                resolveModule: this.moduleResolver,
                sourceName
            });
            console.log(program);
            this.reset();
            this.core.setQuirks();
            this.core.setChip8DevMode(true);
            program.rom.forEach((byte, index) => {
                this.core.loadDataAt(program.baseAddress + index, byte);
            });
            this.core.setMemoryReadonlyRange(
                program.sections.rodata.start ?? 0,
                program.sections.rodata.size
            );
            this.lastCompiledProgram = program;
            this.logger.log('CHIP Language program compiled and loaded successfully.');
            return null;
        } catch (error) {
            this.logger.error('CHIP Language compilation error:', error);
            return error;
        }
    }

    findSourceLocation(pc) {
        const mapping = this.lastCompiledProgram?.sourceMap.find(({ address, endAddress }) =>
            pc >= address && pc < endAddress);
        return mapping && !mapping.synthetic
            ? {
                line: mapping.line,
                column: mapping.column,
                ...(mapping.fileName ? { fileName: mapping.fileName } : {})
            }
            : null;
    }
}
