#ifndef VFS_H
#define VFS_H
#include "fat.h"

static void safe_copy_filename(char* dest, const char* src);
static bool match_filename(const char* entry_name, const char* search_name);
static FAT_DirEntry* find_directory_entry(const char* name);
int vfs_write(const char* name, const uint8_t* data, uint32_t size);
uint32_t vfs_get_file_size(const char* name);
int vfs_read(const char* name, uint8_t* out_buffer);
int vfs_delete(const char* name);

#endif