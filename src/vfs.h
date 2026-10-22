#ifndef VFS_H
#define VFS_H
#include "fat.h"

int vfs_write(const char* name, const uint8_t* data, uint32_t size);
uint32_t vfs_get_file_size(const char* name);
int vfs_read(const char* name, uint8_t* out_buffer, uint32_t capacity);
int vfs_delete(const char* name);

#endif