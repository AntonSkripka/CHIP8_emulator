#include "chip8.h"
#include "stack.h"
#include "math_core.h"
#include <emscripten.h>
#include <stdlib.h>
#include <string.h>

Chip8 instance;

void render_sprite(Chip8 *cpu, uint8_t x, uint8_t y, uint8_t n)
{
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
    uint16_t opcode = (instance.memory[instance.pc] << 8) | instance.memory[instance.pc + 1];
    uint16_t nnn = opcode & 0x0FFF;
    uint8_t x = (opcode & 0x0F00) >> 8;
    uint8_t y = (opcode & 0x00F0) >> 4;
    uint8_t kk = opcode & 0x00FF;

    instance.pc += 2;

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
            }
        }
        break;

    case 0x1000: instance.pc = nnn; break;
    case 0x2000: 
        if (instance.sp < STACK_SIZE) {
            instance.stack[instance.sp] = instance.pc;
            instance.sp++;
            instance.pc = nnn;
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
                instance.memory[instance.I] = instance.V[x] / 100;
                instance.memory[instance.I + 1] = (instance.V[x] / 10) % 10;
                instance.memory[instance.I + 2] = instance.V[x] % 10;
                break;
            case 0x55: 
                for (int i = 0; i <= x; i++) instance.memory[instance.I + i] = instance.V[i];
                if (!instance.load_store_quirks) instance.I += x + 1;
                break;
            case 0x65: 
                for (int i = 0; i <= x; i++) instance.V[i] = instance.memory[instance.I + i];
                if (!instance.load_store_quirks) instance.I += x + 1;
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