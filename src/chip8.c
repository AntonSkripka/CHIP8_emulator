#include "chip8.h"
#include "stack.h"
#include "math_core.h"
#include "vfs.h"
#include <emscripten.h>
#include <stdlib.h>
#include <string.h>

Chip8 instance;
static uint16_t readonly_start;
static uint16_t readonly_end;
static bool readonly_range_enabled;

#define USER_MEMORY_START 0x200
#define VFS_FILENAME_MAX 17

static int8_t decode_signed_offset(uint16_t extension)
{
    const uint8_t raw = (uint8_t)extension;
    return raw < 0x80 ? (int8_t)raw : (int8_t)((int16_t)raw - 0x100);
}

static bool can_write_memory(uint32_t address, uint32_t length)
{
    const uint32_t end = address + length;
    if (address >= MEMORY_SIZE || end > MEMORY_SIZE) {
        instance.execution_fault = CHIP8_FAULT_MEMORY_BOUNDS;
        return false;
    }

    if (instance.chip8_dev_mode && readonly_range_enabled &&
        address < readonly_end && end > readonly_start) {
        instance.execution_fault = CHIP8_FAULT_WRITE_PROTECTED;
        return false;
    }
    return true;
}

static bool can_read_memory(uint32_t address, uint32_t length)
{
    if (length > 0 && (address >= MEMORY_SIZE || length > MEMORY_SIZE - address)) {
        instance.execution_fault = CHIP8_FAULT_MEMORY_BOUNDS;
        return false;
    }
    return true;
}

static bool is_user_memory_range(uint32_t address, uint32_t length)
{
    if (address < USER_MEMORY_START || address >= MEMORY_SIZE ||
        length == 0 || length > MEMORY_SIZE - address) {
        instance.execution_fault = CHIP8_FAULT_MEMORY_BOUNDS;
        return false;
    }
    return true;
}

static bool ranges_overlap(uint32_t first_address, uint32_t first_length,
    uint32_t second_address, uint32_t second_length)
{
    return first_address < second_address + second_length &&
        second_address < first_address + first_length;
}

static uint16_t read_be_u16(const uint8_t* bytes)
{
    return ((uint16_t)bytes[0] << 8) | bytes[1];
}

static void write_be_u32(uint8_t* bytes, uint32_t value)
{
    bytes[0] = (uint8_t)(value >> 24);
    bytes[1] = (uint8_t)(value >> 16);
    bytes[2] = (uint8_t)(value >> 8);
    bytes[3] = (uint8_t)value;
}

static bool is_valid_utf8_filename(const uint8_t* bytes, uint8_t length)
{
    uint8_t index = 0;
    while (index < length) {
        const uint8_t first = bytes[index++];
        if (first == 0) return false;
        if (first <= 0x7F) continue;

        uint8_t continuation_count;
        uint8_t second_min = 0x80;
        uint8_t second_max = 0xBF;
        if (first >= 0xC2 && first <= 0xDF) {
            continuation_count = 1;
        } else if (first >= 0xE0 && first <= 0xEF) {
            continuation_count = 2;
            if (first == 0xE0) second_min = 0xA0;
            if (first == 0xED) second_max = 0x9F;
        } else if (first >= 0xF0 && first <= 0xF4) {
            continuation_count = 3;
            if (first == 0xF0) second_min = 0x90;
            if (first == 0xF4) second_max = 0x8F;
        } else {
            return false;
        }

        if (continuation_count > length - index) return false;
        const uint8_t second = bytes[index];
        if (second < second_min || second > second_max) return false;
        index++;
        for (uint8_t remaining = 1; remaining < continuation_count; remaining++) {
            if (bytes[index] < 0x80 || bytes[index] > 0xBF) return false;
            index++;
        }
    }
    return true;
}

static void set_vfs_status(Chip8VfsStatus status, uint8_t* request, uint32_t result_size)
{
    write_be_u32(&request[7], result_size);
    instance.V[0] = (uint8_t)status;
}

static void handle_vfs_syscall(uint8_t operation)
{
    const uint32_t request_address = instance.I;
    if (!is_user_memory_range(request_address, CHIP8_VFS_REQUEST_SIZE) ||
        !can_write_memory(request_address, CHIP8_VFS_REQUEST_SIZE)) {
        return;
    }

    uint8_t* request = &instance.memory[request_address];
    if (operation < CHIP8_VFS_OP_GET_SIZE || operation > CHIP8_VFS_OP_DELETE) {
        set_vfs_status(CHIP8_VFS_STATUS_UNSUPPORTED_OPERATION, request, 0);
        return;
    }

    const uint16_t filename_address = read_be_u16(&request[0]);
    const uint8_t filename_length = request[2];
    if (filename_length == 0 || filename_length > VFS_FILENAME_MAX) {
        set_vfs_status(CHIP8_VFS_STATUS_INVALID_ARGUMENT, request, 0);
        return;
    }
    if (!is_user_memory_range(filename_address, filename_length)) return;
    if (!can_read_memory(filename_address, filename_length)) return;
    if (ranges_overlap(request_address, CHIP8_VFS_REQUEST_SIZE,
        filename_address, filename_length)) {
        set_vfs_status(CHIP8_VFS_STATUS_INVALID_ARGUMENT, request, 0);
        return;
    }

    char filename[VFS_FILENAME_MAX + 1];
    const uint8_t* filename_bytes = &instance.memory[filename_address];
    if (!is_valid_utf8_filename(filename_bytes, filename_length)) {
        set_vfs_status(CHIP8_VFS_STATUS_INVALID_ARGUMENT, request, 0);
        return;
    }
    memcpy(filename, filename_bytes, filename_length);
    filename[filename_length] = '\0';

    uint16_t buffer_address = 0;
    uint16_t buffer_length = 0;
    if (operation == CHIP8_VFS_OP_READ || operation == CHIP8_VFS_OP_WRITE) {
        buffer_address = read_be_u16(&request[3]);
        buffer_length = read_be_u16(&request[5]);
        if (buffer_length == 0) {
            set_vfs_status(CHIP8_VFS_STATUS_INVALID_ARGUMENT, request, 0);
            return;
        }
        if (!is_user_memory_range(buffer_address, buffer_length)) return;
        if (ranges_overlap(request_address, CHIP8_VFS_REQUEST_SIZE,
            buffer_address, buffer_length)) {
            set_vfs_status(CHIP8_VFS_STATUS_INVALID_ARGUMENT, request, 0);
            return;
        }
        if (operation == CHIP8_VFS_OP_READ) {
            if (!can_write_memory(buffer_address, buffer_length)) return;
        } else if (!can_read_memory(buffer_address, buffer_length)) {
            return;
        }
    }

    if (operation == CHIP8_VFS_OP_GET_SIZE) {
        const uint32_t file_size = vfs_get_file_size(filename);
        set_vfs_status(file_size == 0 ? CHIP8_VFS_STATUS_NOT_FOUND : CHIP8_VFS_STATUS_OK,
            request, file_size);
        return;
    }

    if (operation == CHIP8_VFS_OP_READ) {
        const uint32_t file_size = vfs_get_file_size(filename);
        if (file_size == 0) {
            set_vfs_status(CHIP8_VFS_STATUS_NOT_FOUND, request, 0);
            return;
        }
        if (file_size > buffer_length) {
            set_vfs_status(CHIP8_VFS_STATUS_BUFFER_TOO_SMALL, request, file_size);
            return;
        }

        uint8_t* temporary = malloc(file_size);
        if (temporary == NULL) {
            set_vfs_status(CHIP8_VFS_STATUS_IO_ERROR, request, 0);
            return;
        }
        const int read_result = vfs_read(filename, temporary, file_size);
        if (read_result == 0) {
            memcpy(&instance.memory[buffer_address], temporary, file_size);
        }
        free(temporary);
        set_vfs_status(read_result == 0 ? CHIP8_VFS_STATUS_OK : CHIP8_VFS_STATUS_IO_ERROR,
            request, read_result == 0 ? file_size : 0);
        return;
    }

    if (operation == CHIP8_VFS_OP_WRITE) {
        uint8_t* temporary = malloc(buffer_length);
        if (temporary == NULL) {
            set_vfs_status(CHIP8_VFS_STATUS_IO_ERROR, request, 0);
            return;
        }
        memcpy(temporary, &instance.memory[buffer_address], buffer_length);
        const int write_result = vfs_write(filename, temporary, buffer_length);
        free(temporary);

        Chip8VfsStatus status = CHIP8_VFS_STATUS_OK;
        if (write_result == -1) status = CHIP8_VFS_STATUS_NO_SPACE;
        else if (write_result == -2) status = CHIP8_VFS_STATUS_TOO_MANY_FILES;
        else if (write_result != 0) status = CHIP8_VFS_STATUS_IO_ERROR;
        set_vfs_status(status, request, write_result == 0 ? buffer_length : 0);
        return;
    }

    const int delete_result = vfs_delete(filename);
    set_vfs_status(delete_result == 0 ? CHIP8_VFS_STATUS_OK : CHIP8_VFS_STATUS_NOT_FOUND,
        request, 0);
}

void render_sprite(Chip8 *cpu, uint8_t x, uint8_t y, uint8_t n)
{
    if (n > 0 && !can_read_memory(cpu->I, n)) return;

    uint8_t x_pos = cpu->V[x] % DISPLAY_WIDTH;
    uint8_t y_pos = cpu->V[y] % DISPLAY_HEIGHT;
    cpu->V[0xF] = 0;

    for (int row = 0; row < n; row++)
    {
        uint8_t sprite_byte = cpu->memory[cpu->I + row];
        for (int col = 0; col < 8; col++)
        {
            uint8_t sprite_pixel = sprite_byte & (0x80 >> col);
            if (sprite_pixel)
            {
                int current_x = (x_pos + col) % DISPLAY_WIDTH;
                int current_y = (y_pos + row) % DISPLAY_HEIGHT;
                int index = current_y * DISPLAY_WIDTH + current_x;

                if (cpu->display[index] == 0xFFFFFFFF)
                {
                    cpu->V[0xF] = 1;
                }
                cpu->display[index] ^= 0xFFFFFFFF; 
            }
        }
    }
    cpu->draw_flag = true;
}


EMSCRIPTEN_KEEPALIVE
void init()
{
    memset(&instance, 0, sizeof(Chip8));
    readonly_start = 0;
    readonly_end = 0;
    readonly_range_enabled = false;
    instance.pc = 0x200;

    uint8_t fontset[80] = {
        0xF0, 0x90, 0x90, 0x90, 0xF0, 0x20, 0x60, 0x20, 0x20, 0x70,
        0xF0, 0x10, 0xF0, 0x80, 0xF0, 0xF0, 0x10, 0xF0, 0x10, 0xF0,
        0x90, 0x90, 0xF0, 0x10, 0x10, 0xF0, 0x80, 0xF0, 0x10, 0xF0,
        0xF0, 0x80, 0xF0, 0x90, 0xF0, 0xF0, 0x10, 0x20, 0x40, 0x40,
        0xF0, 0x90, 0xF0, 0x90, 0xF0, 0xF0, 0x90, 0xF0, 0x10, 0xF0,
        0xF0, 0x90, 0xF0, 0x90, 0x90, 0xE0, 0x90, 0xE0, 0x90, 0xE0,
        0xF0, 0x80, 0x80, 0x80, 0xF0, 0xE0, 0x90, 0x90, 0x90, 0xE0,
        0xF0, 0x80, 0xF0, 0x80, 0xF0, 0xF0, 0x80, 0xF0, 0x80, 0x80};
    memcpy(instance.memory, fontset, 80);
}

EMSCRIPTEN_KEEPALIVE
void set_key(int key, bool is_pressed)
{
    if (key >= 0 && key < 16)
        instance.keypad[key] = is_pressed;
}

EMSCRIPTEN_KEEPALIVE
void set_quirks(
    bool shift_quirks,
    bool load_store_quirks,
    bool sub_equality_quirk,
    bool add_i_preserve_vf_quirk)
{
    instance.shift_quirks = shift_quirks;
    instance.load_store_quirks = load_store_quirks;
    instance.sub_equality_quirk = sub_equality_quirk;
    instance.add_i_preserve_vf_quirk = add_i_preserve_vf_quirk;
}

EMSCRIPTEN_KEEPALIVE
void set_chip8_dev_mode(bool enabled)
{
    instance.chip8_dev_mode = enabled;
    if (!enabled) readonly_range_enabled = false;
}

EMSCRIPTEN_KEEPALIVE
int set_memory_readonly_range(uint16_t start, uint16_t size)
{
    if (size == 0) {
        readonly_range_enabled = false;
        readonly_start = 0;
        readonly_end = 0;
        return 1;
    }
    if (start >= MEMORY_SIZE || size > MEMORY_SIZE - start) return 0;

    readonly_start = start;
    readonly_end = start + size;
    readonly_range_enabled = true;
    return 1;
}

EMSCRIPTEN_KEEPALIVE
void update_timers()
{
    if (instance.delay_timer > 0)
        instance.delay_timer--;
    if (instance.sound_timer > 0)
        instance.sound_timer--;
}

EMSCRIPTEN_KEEPALIVE
void step()
{
    if (get_execution_fault() != CHIP8_FAULT_NONE) return;

    if (instance.pc >= MEMORY_SIZE - 1) {
        instance.execution_fault = CHIP8_FAULT_INVALID_INSTRUCTION;
        return;
    }

    uint16_t opcode = (instance.memory[instance.pc] << 8) | instance.memory[instance.pc + 1];
    uint16_t nnn = opcode & 0x0FFF;
    uint8_t x = (opcode & 0x0F00) >> 8;
    uint8_t y = (opcode & 0x00F0) >> 4;
    uint8_t kk = opcode & 0x00FF;

    instance.pc += 2;

    if (opcode == 0x5001 && instance.chip8_dev_mode) {
        if (instance.pc >= MEMORY_SIZE - 1) {
            instance.execution_fault = CHIP8_FAULT_INVALID_INSTRUCTION;
            return;
        }

        const uint16_t extension =
            ((uint16_t)instance.memory[instance.pc] << 8) |
            instance.memory[instance.pc + 1];
        instance.pc += 2;

        switch (extension & 0xFF00) {
            case 0x0000:
                if (extension == 0x0000) stack_enter();
                else instance.execution_fault = CHIP8_FAULT_INVALID_INSTRUCTION;
                break;
            case 0x0100:
                if (extension == 0x0100) stack_leave();
                else instance.execution_fault = CHIP8_FAULT_INVALID_INSTRUCTION;
                break;
            case 0x0200: stack_adjust((uint8_t)extension); break;
            case 0x0300: stack_drop((uint8_t)extension); break;
            case 0x0400: stack_load_frame(decode_signed_offset(extension)); break;
            case 0x0500: stack_store_frame(decode_signed_offset(extension)); break;
            case 0x0600:
                if ((uint8_t)extension == CHIP8_FAULT_MEMORY_BOUNDS ||
                    (uint8_t)extension == CHIP8_FAULT_WRITE_PROTECTED) {
                    instance.execution_fault = (Chip8Fault)(uint8_t)extension;
                } else {
                    instance.execution_fault = CHIP8_FAULT_INVALID_INSTRUCTION;
                }
                break;
            case 0x0700: instance.I = stack_load_frame_u16(decode_signed_offset(extension)); break;
            case 0x0800: handle_vfs_syscall((uint8_t)extension); break;
            default: instance.execution_fault = CHIP8_FAULT_INVALID_INSTRUCTION; break;
        }
        return;
    }

    switch (opcode & 0xF000)
    {
    case 0x0000:
        if (opcode == 0x00E0) {
            memset(instance.display, 0, sizeof(instance.display));
            instance.draw_flag = true;
        } 
        else if (opcode == 0x00EE) { 
            if (instance.sp > 0) {
                instance.sp--;
                instance.pc = instance.stack[instance.sp];
            } else {
                instance.execution_fault = CHIP8_FAULT_CALL_STACK_UNDERFLOW;
            }
        }
        break;

    case 0x1000: instance.pc = nnn; break;
    case 0x2000: 
        if (instance.sp < STACK_SIZE) {
            instance.stack[instance.sp] = instance.pc;
            instance.sp++;
            instance.pc = nnn;
        } else {
            instance.execution_fault = CHIP8_FAULT_CALL_STACK_OVERFLOW;
        }
        break;

    case 0x3000: if (instance.V[x] == kk) instance.pc += 2; break;
    case 0x4000: if (instance.V[x] != kk) instance.pc += 2; break;
    case 0x5000:
        if ((opcode & 0x000F) == 0 && instance.V[x] == instance.V[y]) {
            instance.pc += 2;
        }
        break;
    case 0x6000: instance.V[x] = kk; break;
    case 0x7000: instance.V[x] += kk; break;

    case 0x8000: 
        switch (opcode & 0x000F) {
            case 0x0: instance.V[x] = instance.V[y]; break; 
            case 0x1: instance.V[x] |= instance.V[y]; break; 
            case 0x2: instance.V[x] &= instance.V[y]; break; 
            case 0x3: instance.V[x] ^= instance.V[y]; break; 
            case 0x4: { 
                uint16_t sum = (uint16_t)instance.V[x] + (uint16_t)instance.V[y];
                instance.V[x] = (uint8_t)sum;
                instance.V[0xF] = (sum > 0xFF) ? 1 : 0;
                break; 
            }
            case 0x5: {
                uint8_t vx = instance.V[x];
                uint8_t vy = instance.V[y];
                instance.V[x] = vx - vy;
                instance.V[0xF] = (vx > vy || (instance.sub_equality_quirk && vx == vy)) ? 1 : 0;
                break;
            }
            case 0x6: {
                uint8_t value = instance.V[instance.shift_quirks ? x : y];
                instance.V[x] = value >> 1;
                instance.V[0xF] = value & 0x1;
                break;
            }
            case 0x7: {
                uint8_t vx = instance.V[x];
                uint8_t vy = instance.V[y];
                instance.V[x] = vy - vx;
                instance.V[0xF] = (vy > vx) ? 1 : 0;
                break;
            }
            case 0xE: {
                uint8_t value = instance.V[instance.shift_quirks ? x : y];
                instance.V[x] = value << 1;
                instance.V[0xF] = (value >> 7) & 0x1;
                break;
            }
        }
        break;

    case 0x9000:
        if ((opcode & 0x000F) == 0 && instance.V[x] != instance.V[y]) {
            instance.pc += 2;
        }
        break;
    case 0xA000: instance.I = nnn; break;
    case 0xB000: instance.pc = nnn + instance.V[0]; break;
    case 0xC000: instance.V[x] = (rand() % 256) & kk; break;
    case 0xD000: render_sprite(&instance, x, y, opcode & 0x000F); break;

    case 0xE000:
        if (kk == 0x9E && instance.V[x] < 16) {
            if (instance.keypad[instance.V[x]]) instance.pc += 2;
        } else if (kk == 0xA1 && instance.V[x] < 16) {
            if (!instance.keypad[instance.V[x]]) instance.pc += 2;
        }
        break;

    case 0xF000:
        switch (kk) {
            case 0x07: instance.V[x] = instance.delay_timer; break;
            case 0x15: instance.delay_timer = instance.V[x]; break; 
            case 0x0A: {
                bool key_pressed = false;
                for (uint8_t key = 0; key < 16; key++) {
                    if (instance.keypad[key]) {
                        instance.V[x] = key;
                        key_pressed = true;
                        break;
                    }
                }
                if (!key_pressed) instance.pc -= 2;
                break;
            }
            case 0x1E: {
                uint32_t sum = (uint32_t)instance.I + instance.V[x];
                instance.I = (uint16_t)sum;
                if (!instance.add_i_preserve_vf_quirk) {
                    instance.V[0xF] = (sum > 0x0FFF) ? 1 : 0;
                }
                break;
            }
            case 0x29: instance.I = instance.V[x] * 5; break; 
            case 0x33:
                if (can_write_memory(instance.I, 3)) {
                    instance.memory[instance.I] = instance.V[x] / 100;
                    instance.memory[instance.I + 1] = (instance.V[x] / 10) % 10;
                    instance.memory[instance.I + 2] = instance.V[x] % 10;
                }
                break;
            case 0x55:
                if (can_write_memory(instance.I, (uint32_t)x + 1)) {
                    for (int i = 0; i <= x; i++) instance.memory[instance.I + i] = instance.V[i];
                    if (!instance.load_store_quirks) instance.I += x + 1;
                }
                break;
            case 0x65:
                if (can_read_memory(instance.I, (uint32_t)x + 1)) {
                    for (int i = 0; i <= x; i++) instance.V[i] = instance.memory[instance.I + i];
                    if (!instance.load_store_quirks) instance.I += x + 1;
                }
                break;
        }
        break;
    }

    if ((opcode & 0xF0FF) == 0xF0F1) stack_push(x);
    else if ((opcode & 0xF0FF) == 0xF0F2) stack_pop(x);
    else if ((opcode & 0xF0FF) == 0xF0F3) stack_pusha();
    else if ((opcode & 0xF0FF) == 0xF0F4) stack_popa();
    else if ((opcode & 0xF0FF) == 0xF0F5) stack_peak(x);
    else if ((opcode & 0xF0FF) == 0xF0F6) stack_size(x);
    else if ((opcode & 0xF0FF) == 0xF0F7) stack_clear();
    else if ((opcode & 0xF00F) == 0xF00C) math_mul(x, y);
    else if ((opcode & 0xF00F) == 0xF00D) math_div(x, y);
    else if ((opcode & 0xF00F) == 0xF00F) math_rem(x, y);
}

EMSCRIPTEN_KEEPALIVE
void load_opcode_at(uint16_t addr, uint16_t opcode) {
    if (addr < MEMORY_SIZE - 1) {
        instance.memory[addr] = (opcode >> 8) & 0xFF;
        instance.memory[addr + 1] = opcode & 0xFF;
    }
}

EMSCRIPTEN_KEEPALIVE
void load_data_at(uint16_t addr, uint8_t data) {
    if (addr < MEMORY_SIZE) {
        instance.memory[addr] = data;
    }
}

EMSCRIPTEN_KEEPALIVE void *get_display_ptr() { return instance.display; }
EMSCRIPTEN_KEEPALIVE void *get_v_regs_ptr() { return instance.V; }
EMSCRIPTEN_KEEPALIVE uint16_t get_pc() { return instance.pc; }
EMSCRIPTEN_KEEPALIVE bool get_draw_flag() { return instance.draw_flag; }
EMSCRIPTEN_KEEPALIVE void clear_draw_flag() { instance.draw_flag = false; }
EMSCRIPTEN_KEEPALIVE void* get_mem_ptr() { return instance.memory; }
EMSCRIPTEN_KEEPALIVE uint16_t get_i() { return instance.I; }
EMSCRIPTEN_KEEPALIVE uint8_t get_call_stack_ptr() { return instance.sp; }
EMSCRIPTEN_KEEPALIVE int get_execution_fault()
{
    const int data_stack_fault = get_stack_fault();
    return data_stack_fault != STACK_FAULT_NONE ? data_stack_fault : instance.execution_fault;
}