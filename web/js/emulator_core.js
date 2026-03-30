import { asmToBin } from './asm.js';

export class Chip8Core {
    constructor(module) {
        this.module = module;
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

    loadBin(code) {
        const segments = asmToBin(code);
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
}
