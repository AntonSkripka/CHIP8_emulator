#include "fat.h"
#include <string.h>
#include <stdbool.h>
#include <stddef.h>
#include <emscripten.h>

static void safe_copy_filename(char* dest, const char* src) {
    strncpy(dest, src, 17);
    dest[17] = '\0';
}

static bool match_filename(const char* entry_name, const char* search_name) {
    return strncmp(entry_name, search_name, 17) == 0;
}

static FAT_DirEntry* find_directory_entry(const char* name) {
    if (name == NULL || name[0] == '\0') return NULL;

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
    if (name == NULL || name[0] == '\0' || data == NULL || size == 0) return -1;

    FAT_DirEntry* existing = find_directory_entry(name);
    if (existing != NULL) {
        vfs_delete(name); 
    }

    int free_slot = -1;
    int max_files = fat_get_max_files();
    for (int i = 0; i < max_files; i++) {
        FAT_DirEntry* entry = fat_get_directory_entry(i);
        if (entry != NULL && !entry->is_used) {
            free_slot = i;
            break;
        }
    }

    if (free_slot == -1) return -2;

    uint16_t start_cluster = fat_write_data(data, size);
    if (start_cluster == 0xFFFF) return -1; // FAT_ERROR_NO_SPACE

    FAT_DirEntry* entry = fat_get_directory_entry(free_slot);
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
    return (entry != NULL) ? entry->file_size : 0;
}

EMSCRIPTEN_KEEPALIVE
int vfs_read(const char* name, uint8_t* out_buffer) {
    FAT_DirEntry* entry = find_directory_entry(name);
    if (entry == NULL || out_buffer == NULL) return -1;

    fat_read_data(entry->start_cluster, entry->file_size, out_buffer);
    return 0;
}