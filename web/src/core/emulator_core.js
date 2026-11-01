export class Chip8Core {
    constructor(module, assemble) {
        this.module = module;
        this.assemble = assemble;
        this.vRegsPtr = null;
        this.displayPtr = null;
        this.memoryPtr = null;
    }

    init() {
        this.module._init();
        this.vRegsPtr = this.module._get_v_regs_ptr();
        this.displayPtr = this.module._get_display_ptr();
        this.memoryPtr = this.module._get_mem_ptr();

        if (typeof this.module._init_stack_interface === 'function') {
            this.module._init_stack_interface(this.vRegsPtr);
        }
    }

    step() {
        this.module._step();
    }

    updateTimers() {
        this.module._update_timers();
    }

    setQuirks({
        shiftQuirks = false,
        loadStoreQuirks = false,
        subEqualityQuirk = false,
        addIPreserveVFQuirk = false
    } = {}) {
        const enabled = (value) => value === true || value === 1 || value === '1';
        this.module._set_quirks(
            enabled(shiftQuirks),
            enabled(loadStoreQuirks),
            enabled(subEqualityQuirk),
            enabled(addIPreserveVFQuirk)
        );
    }

    setChip8DevMode(enabled = false) {
        if (typeof this.module._set_chip8_dev_mode === 'function') {
            this.module._set_chip8_dev_mode(enabled === true);
        }
    }

    setMemoryReadonlyRange(start, size) {
        if (typeof this.module._set_memory_readonly_range !== 'function') {
            throw new Error('The WebAssembly module does not support read-only memory ranges.');
        }
        if (!Number.isInteger(start) || !Number.isInteger(size) || start < 0 || size < 0) {
            throw new TypeError('Read-only memory range must use non-negative integer addresses and sizes.');
        }
        if (this.module._set_memory_readonly_range(start, size) !== 1) {
            throw new RangeError(`Invalid read-only memory range at 0x${start.toString(16)} (${size} bytes).`);
        }
    }

    loadBin(code) {
        const segments = this.assemble(code);
        this.loadSegments(segments);
    }

    loadSegments(segments) {
        this.validateSegments(segments);

        for (const segment of segments) {
            let currentAddr = segment.start;
            for (const item of segment.bytes) {
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

    validateSegments(segments) {
        if (!Array.isArray(segments)) {
            throw new TypeError('Assembler output must be an array of memory segments.');
        }

        for (const segment of segments) {
            if (!Number.isInteger(segment.start) || segment.start < 0 || segment.start >= 4096 ||
                !Array.isArray(segment.bytes)) {
                throw new Error('Assembler produced an invalid memory segment.');
            }

            let currentAddr = segment.start;
            for (const item of segment.bytes) {
                if (!Number.isInteger(item.val) || (item.size !== 1 && item.size !== 2) ||
                    item.val < 0 || item.val > (item.size === 1 ? 0xFF : 0xFFFF) ||
                    currentAddr + item.size > 4096) {
                    throw new Error(`Assembler produced invalid data at address 0x${currentAddr.toString(16)}.`);
                }
                currentAddr += item.size;
            }
        }
    }

    loadDataAt(addr, data) {
        this.module._load_data_at(addr, data);
    }

    getDisplayPtr() {
        return this.displayPtr;
    }

    getDisplayPixels(length = 64 * 32 * 4) {
        if (this.displayPtr === null) return null;
        return new Uint8ClampedArray(this.module.HEAPU8.buffer, this.displayPtr, length);
    }

    getMemoryPtr() {
        return this.memoryPtr;
    }

    getVRegsPtr() {
        return this.vRegsPtr;
    }

    getVRegistersView() {
        if (this.vRegsPtr === null) return null;
        return new Uint8Array(this.module.HEAPU8.buffer, this.vRegsPtr, 16);
    }

    getMemoryView() {
        if (this.memoryPtr === null) return null;
        return new Uint8Array(this.module.HEAPU8.buffer, this.memoryPtr, 4096);
    }

    getDrawFlag() {
        return this.module._get_draw_flag();
    }

    clearDrawFlag() {
        this.module._clear_draw_flag();
    }

    getPC() {
        return this.module._get_pc();
    }

    getI() {
        return this.module._get_i();
    }

    getSpd() {
        return this.module._get_spd();
    }

    getFp() {
        return typeof this.module._get_fp === 'function' ? this.module._get_fp() : 0;
    }

    getStackFault() {
        return typeof this.module._get_stack_fault === 'function'
            ? this.module._get_stack_fault()
            : 0;
    }

    getExecutionFault() {
        return typeof this.module._get_execution_fault === 'function'
            ? this.module._get_execution_fault()
            : this.getStackFault();
    }

    getStackValue(index) {
        return this.module._get_stack_value(index);
    }

    getCallStackPtr() {
        return this.module._get_call_stack_ptr();
    }

    hasStackSupport() {
        return typeof this.module._get_spd === 'function';
    }
}
