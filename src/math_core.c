#include <stdint.h>
#include <emscripten.h>

#include "math_core.h"

extern Chip8 instance;

void math_mul(uint8_t x, uint8_t y) {
    uint16_t result = (uint16_t)instance.V[x] * (uint16_t)instance.V[y];
    
    instance.V[0xF] = (result > 0xFF) ? 1 : 0;
    instance.V[x] = result & 0xFF;
}

void math_div(uint8_t x, uint8_t y) {
    if (instance.V[y] == 0) {
        instance.V[0xF] = 1;
        instance.V[x] = 0;
        return;
    }
    
    instance.V[0xF] = 0;
    instance.V[x] = instance.V[x] / instance.V[y];
}

void math_rem(uint8_t x, uint8_t y) {
    if (instance.V[y] == 0) {
        instance.V[0xF] = 1; 
        instance.V[x] = 0;
        return;
    }
    
    instance.V[0xF] = 0;
    instance.V[x] = instance.V[x] % instance.V[y];
}
