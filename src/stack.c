#include <stdint.h>
#include <emscripten.h>

static uint8_t stack[1024];
static int spd = 0;
static uint8_t* remote_v_regs = NULL;

EMSCRIPTEN_KEEPALIVE
void init_stack_interface(uint8_t* ptr)
{
    remote_v_regs = ptr;
    spd = 0;
    for (int i = 0; i < 1024; ++i) {
        stack[i] = 0;
    }
}

EMSCRIPTEN_KEEPALIVE
void stack_push(uint8_t reg_index)
{
    if (!remote_v_regs || reg_index >= 16u) {
        return;
    }
    if (spd < 1024) {
        stack[spd++] = remote_v_regs[reg_index];
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
    }
}

EMSCRIPTEN_KEEPALIVE
void stack_pusha() {
    if (!remote_v_regs) {
        return;
    }
    if (spd < 1024-16) {
        for (int i = 0; i < 16; i++) {
            stack[spd++] = remote_v_regs[i];
        }
    }
}

EMSCRIPTEN_KEEPALIVE
void stack_popa()
{
    if (!remote_v_regs) {
        return;
    }
    if (spd > 15) {
        for (int i = 16; i > 0; i--) {
            remote_v_regs[i] = stack[--spd];
        }
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
    for (int i = 0; i < 1024; ++i) {
        stack[i] = 0;
    }
    spd = 0;
}

EMSCRIPTEN_KEEPALIVE
int get_spd(void)
{
    return spd;
}

EMSCRIPTEN_KEEPALIVE
uint8_t get_stack_value(int index)
{
    if (index < 0 || index >= spd) {
        return 0;
    }
    return stack[index];
}
