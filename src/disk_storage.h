#ifndef DISK_STORAGE_H
#define DISK_STORAGE_H

#include <stdint.h>
#include <stdbool.h>

#define DISK_SIZE (1024 * 1024)

static uint8_t disk_memory[DISK_SIZE];
static bool is_dirty = false;

uint8_t* get_disk_memory_ptr();
bool get_is_dirty();
void set_is_dirty(bool dirty);
void mark_disk_as_dirty();
void clear_disk_memory();

#endif