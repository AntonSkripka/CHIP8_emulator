#include <stdint.h>
#include <string.h>
#include <emscripten.h>
#include "stack.h"

static uint8_t stack[DATA_STACK_CAPACITY];
static int spd = 0;
static int frame_pointer = 0;
static uint8_t* remote_v_regs = NULL;
static StackFault stack_fault = STACK_FAULT_NONE;

EMSCRIPTEN_KEEPALIVE
void init_stack_interface(uint8_t* ptr)
{
    remote_v_regs = ptr;
    spd = 0;
    frame_pointer = 0;
    stack_fault = STACK_FAULT_NONE;
    for (int i = 0; i < DATA_STACK_CAPACITY; ++i) stack[i] = 0;
}

EMSCRIPTEN_KEEPALIVE
void stack_push(uint8_t reg_index)
{
    if (!remote_v_regs || reg_index >= 16u) {
        return;
    }
    if (spd < DATA_STACK_CAPACITY) {
        stack[spd++] = remote_v_regs[reg_index];
    } else {
        stack_fault = STACK_FAULT_OVERFLOW;
    }
}

EMSCRIPTEN_KEEPALIVE
void stack_pop(uint8_t reg_index)
{
    if (!remote_v_regs || reg_index >= 16u) {
        return;
    }
    if (spd > 0) {
        remote_v_regs[reg_index] = stack[--spd];
    } else {
        stack_fault = STACK_FAULT_UNDERFLOW;
    }
}

EMSCRIPTEN_KEEPALIVE
void stack_pusha() {
    if (!remote_v_regs) {
        return;
    }
    if (spd <= DATA_STACK_CAPACITY - 16) {
        for (int i = 0; i < 16; i++) {
            stack[spd++] = remote_v_regs[i];
        }
    } else {
        stack_fault = STACK_FAULT_OVERFLOW;
    }
}

EMSCRIPTEN_KEEPALIVE
void stack_popa()
{
    if (!remote_v_regs) {
        return;
    }
    if (spd >= 16) {
        for (int i = 16; i > 0; i--) {
            remote_v_regs[i - 1] = stack[--spd];
        }
    } else {
        stack_fault = STACK_FAULT_UNDERFLOW;
    }
}

EMSCRIPTEN_KEEPALIVE
void stack_peak(uint8_t reg_index)
{
    if (!remote_v_regs || reg_index >= 16u) {
        return;
    }
    if (spd > 0) {
        remote_v_regs[reg_index] = stack[spd - 1];
    } else {
        stack_fault = STACK_FAULT_UNDERFLOW;
    }
}

EMSCRIPTEN_KEEPALIVE
void stack_size(uint8_t reg_index) {
    if (!remote_v_regs || reg_index >= 16u) {
        return;
    }
    remote_v_regs[reg_index] = spd;
}

EMSCRIPTEN_KEEPALIVE
void stack_clear() {
    if (!remote_v_regs) {
        return;
    }
    for (int i = 0; i < DATA_STACK_CAPACITY; ++i) stack[i] = 0;
    spd = 0;
    frame_pointer = 0;
}

EMSCRIPTEN_KEEPALIVE
int get_spd(void)
{
    return spd;
}

EMSCRIPTEN_KEEPALIVE
int get_fp(void)
{
    return frame_pointer;
}

EMSCRIPTEN_KEEPALIVE
uint8_t get_stack_value(int index)
{
    if (index < 0 || index >= spd) {
        return 0;
    }
    return stack[index];
}

EMSCRIPTEN_KEEPALIVE
int get_stack_fault(void)
{
    return stack_fault;
}

EMSCRIPTEN_KEEPALIVE
void stack_enter(void)
{
    if (spd < 0 || spd + 3 > DATA_STACK_CAPACITY) {
        stack_fault = STACK_FAULT_OVERFLOW;
        return;
    }

    stack[spd] = (uint8_t)((frame_pointer >> 8) & 0xFF);
    stack[spd + 1] = (uint8_t)(frame_pointer & 0xFF);
    spd += 2;
    frame_pointer = spd;
    stack[spd] = 0;
    spd++;
}

EMSCRIPTEN_KEEPALIVE
void stack_leave(void)
{
    if (frame_pointer < 2 || frame_pointer >= DATA_STACK_CAPACITY) {
        stack_fault = STACK_FAULT_INVALID_FRAME;
        return;
    }
    if (spd < frame_pointer + 1) {
        stack_fault = STACK_FAULT_FRAME_UNDERFLOW;
        return;
    }

    const int previous_frame =
        ((int)stack[frame_pointer - 2] << 8) | stack[frame_pointer - 1];
    if (previous_frame > frame_pointer - 2) {
        stack_fault = STACK_FAULT_INVALID_FRAME;
        return;
    }

    spd = frame_pointer - 2;
    frame_pointer = previous_frame;
}

EMSCRIPTEN_KEEPALIVE
void stack_adjust(uint8_t amount)
{
    if (frame_pointer < 2 || spd < frame_pointer + 1) {
        stack_fault = STACK_FAULT_INVALID_FRAME;
        return;
    }
    if (amount > DATA_STACK_CAPACITY - spd) {
        stack_fault = STACK_FAULT_OVERFLOW;
        return;
    }

    memset(stack + spd, 0, amount);
    spd += amount;
}

EMSCRIPTEN_KEEPALIVE
void stack_drop(uint8_t amount)
{
    if (frame_pointer < 2 || spd < frame_pointer + 1) {
        stack_fault = STACK_FAULT_INVALID_FRAME;
        return;
    }
    if (amount > spd - (frame_pointer + 1)) {
        stack_fault = STACK_FAULT_FRAME_UNDERFLOW;
        return;
    }

    spd -= amount;
    memset(stack + spd, 0, amount);
}

static int resolve_frame_address(int8_t offset)
{
    if (frame_pointer < 2 || spd < frame_pointer + 1 ||
        (offset >= -2 && offset <= 0)) {
        stack_fault = STACK_FAULT_INVALID_FRAME;
        return -1;
    }

    const int address = frame_pointer + offset;
    if (address < 0) {
        stack_fault = STACK_FAULT_FRAME_UNDERFLOW;
        return -1;
    }
    if (address >= spd || address >= DATA_STACK_CAPACITY) {
        stack_fault = STACK_FAULT_INVALID_FRAME;
        return -1;
    }
    return address;
}

EMSCRIPTEN_KEEPALIVE
void stack_load_frame(int8_t offset)
{
    if (!remote_v_regs) {
        stack_fault = STACK_FAULT_INVALID_FRAME;
        return;
    }
    const int address = resolve_frame_address(offset);
    if (address >= 0) remote_v_regs[0] = stack[address];
}

EMSCRIPTEN_KEEPALIVE
uint16_t stack_load_frame_u16(int8_t offset)
{
    const int address = resolve_frame_address(offset);
    if (address < 0) return 0;
    if (address + 1 >= spd || address + 1 >= DATA_STACK_CAPACITY) {
        stack_fault = STACK_FAULT_INVALID_FRAME;
        return 0;
    }
    return (uint16_t)(((uint16_t)stack[address] << 8) | stack[address + 1]);
}

EMSCRIPTEN_KEEPALIVE
void stack_store_frame(int8_t offset)
{
    if (!remote_v_regs) {
        stack_fault = STACK_FAULT_INVALID_FRAME;
        return;
    }
    const int address = resolve_frame_address(offset);
    if (address >= 0) stack[address] = remote_v_regs[0];
}
