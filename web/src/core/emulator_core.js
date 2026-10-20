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

    loadBin(code) {
        const segments = this.assemble(code);
        if (!segments) return;

        for (const seg of segments) {
            let currentAddr = parseInt(seg.start, 10);
            for (const item of seg.bytes) {
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
