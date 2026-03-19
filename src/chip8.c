#include "chip8.h"
#include <emscripten.h>
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
    case 0x5000: if (instance.V[x] == instance.V[y]) instance.pc += 2; break;
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
                instance.V[0xF] = (sum > 255) ? 1 : 0;
                instance.V[x] = sum & 0xFF;
                break; 
            }
            case 0x5: 
                instance.V[0xF] = (instance.V[x] >= instance.V[y]) ? 1 : 0;
                instance.V[x] -= instance.V[y];
                break;
            case 0x6: 
                instance.V[0xF] = instance.V[x] & 0x1;
                instance.V[x] >>= 1;
                break;
            case 0x7: 
                instance.V[0xF] = (instance.V[y] >= instance.V[x]) ? 1 : 0;
                instance.V[x] = instance.V[y] - instance.V[x];
                break;
            case 0xE: 
                instance.V[0xF] = (instance.V[x] >> 7) & 0x1;
                instance.V[x] <<= 1;
                break;
        }
        break;

    case 0x9000: if (instance.V[x] != instance.V[y]) instance.pc += 2; break;
    case 0xA000: instance.I = nnn; break;
    case 0xC000: instance.V[x] = (rand() % 256) & kk; break;
    case 0xD000: render_sprite(&instance, x, y, opcode & 0x000F); break;

    case 0xE000:
        if (kk == 0x9E) { if (instance.keypad[instance.V[x]]) instance.pc += 2; }
        else if (kk == 0xA1) { if (!instance.keypad[instance.V[x]]) instance.pc += 2; }
        break;

    case 0xF000:
        switch (kk) {
            case 0x07: instance.V[x] = instance.delay_timer; break;
            case 0x15: instance.delay_timer = instance.V[x]; break; 
            case 0x18: instance.sound_timer = instance.V[x]; break; 
            case 0x1E: instance.I += instance.V[x]; break; 
            case 0x29: instance.I = instance.V[x] * 5; break; 
            case 0x33: 
                instance.memory[instance.I] = instance.V[x] / 100;
                instance.memory[instance.I + 1] = (instance.V[x] / 10) % 10;
                instance.memory[instance.I + 2] = instance.V[x] % 10;
                break;
            case 0x55: 
                for (int i = 0; i <= x; i++) instance.memory[instance.I + i] = instance.V[i];
                break;
            case 0x65: 
                for (int i = 0; i <= x; i++) instance.V[i] = instance.memory[instance.I + i];
                break;
        }
        break;
    }
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