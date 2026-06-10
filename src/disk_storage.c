#include <stdint.h>
#include <stdbool.h>
#include <emscripten.h>
#include "disk_storage.h"

EMSCRIPTEN_KEEPALIVE
uint8_t* get_disk_memory_ptr() {
    return disk_memory;
}

EMSCRIPTEN_KEEPALIVE
bool get_is_dirty() {
    return is_dirty;
}

EMSCRIPTEN_KEEPALIVE
void set_is_dirty(bool dirty) {
    is_dirty = dirty;
}


void mark_disk_as_dirty() {
    is_dirty = true;
}

void clear_disk_memory() {
    for (int i = 0; i < DISK_SIZE; i++) {
        disk_memory[i] = 0;
    }
    mark_disk_as_dirty();
}