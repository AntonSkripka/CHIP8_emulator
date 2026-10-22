#include "fat.h"
#include <string.h>
#include <stdbool.h>
#include <stddef.h>
#include <emscripten.h>

static void safe_copy_filename(char* dest, const char* src) {
    size_t length = strlen(src);
    memcpy(dest, src, length);
    memset(dest + length, 0, 18 - length);
}

static size_t filename_length(const char* name) {
    size_t length = 0;
    while (length <= 17 && name[length] != '\0') length++;
    return length;
}

static bool match_filename(const char* entry_name, const char* search_name) {
    return strncmp(entry_name, search_name, 18) == 0;
}

static FAT_DirEntry* find_directory_entry(const char* name) {
    if (name == NULL || name[0] == '\0' || filename_length(name) > 17) return NULL;

    int max_files = fat_get_max_files();
    for (int i = 0; i < max_files; i++) {
        FAT_DirEntry* entry = fat_get_directory_entry(i);
        if (entry != NULL && entry->is_used && match_filename(entry->filename, name)) {
            return entry;
        }
    }
    return NULL;
}

EMSCRIPTEN_KEEPALIVE
int vfs_delete(const char* name) {
    FAT_DirEntry* entry = find_directory_entry(name);
    if (entry == NULL) return -1;

    fat_free_chain(entry->start_cluster);

    entry->is_used = 0;
    entry->file_size = 0;
    entry->start_cluster = 0xFFFF;
    memset(entry->filename, 0, sizeof(entry->filename));

    void mark_disk_as_dirty(void);
    mark_disk_as_dirty();
    return 0;
}

EMSCRIPTEN_KEEPALIVE
int vfs_write(const char* name, const uint8_t* data, uint32_t size) {
    if (name == NULL || name[0] == '\0' || filename_length(name) > 17 ||
        data == NULL || size == 0) return -1;

    FAT_DirEntry* existing = find_directory_entry(name);

    int free_slot = -1;
    int max_files = fat_get_max_files();
    if (existing != NULL) {
        for (int i = 0; i < max_files; i++) {
            if (fat_get_directory_entry(i) == existing) {
                free_slot = i;
                break;
            }
        }
    } else {
        for (int i = 0; i < max_files; i++) {
            FAT_DirEntry* entry = fat_get_directory_entry(i);
            if (entry != NULL && !entry->is_used) {
                free_slot = i;
                break;
            }
        }
    }

    if (free_slot == -1) return -2;

    uint16_t start_cluster = fat_write_data(data, size);
    if (start_cluster == 0xFFFF) return -1;

    if (existing != NULL) {
        fat_free_chain(existing->start_cluster);
    }

    FAT_DirEntry* entry = fat_get_directory_entry(free_slot);
    if (entry == NULL) {
        fat_free_chain(start_cluster);
        return -1;
    }
    safe_copy_filename(entry->filename, name);
    entry->file_size = size;
    entry->start_cluster = start_cluster;
    entry->is_used = 1;

    void mark_disk_as_dirty(void);
    mark_disk_as_dirty(); 
    return 0;
}

EMSCRIPTEN_KEEPALIVE
uint32_t vfs_get_file_size(const char* name) {
    FAT_DirEntry* entry = find_directory_entry(name);
    const uint32_t max_file_size = (DISK_SIZE - (SECTOR_SIZE + 4096 + 2048));
    return (entry != NULL && entry->file_size <= max_file_size) ? entry->file_size : 0;
}

EMSCRIPTEN_KEEPALIVE
int vfs_read(const char* name, uint8_t* out_buffer, uint32_t capacity) {
    FAT_DirEntry* entry = find_directory_entry(name);
    if (entry == NULL || out_buffer == NULL || entry->file_size == 0 ||
        entry->file_size > capacity) return -1;

    const uint32_t max_file_size = DISK_SIZE - (SECTOR_SIZE + 4096 + 2048);
    if (entry->file_size > max_file_size) return -1;

    return fat_read_data(entry->start_cluster, entry->file_size, out_buffer, capacity) ? 0 : -1;
}