#ifndef FAT_H
#define FAT_H

#include <stdint.h>
#include <stdbool.h>
#include <string.h>
#include "disk_storage.h"

#define SECTOR_SIZE       512
#define DISK_SIZE         (1024 * 1024)
#define CLUSTER_SIZE      512

#define MAX_FILES         64
#define FAT_ENTRY_FREE    0x0000
#define FAT_ENTRY_EOF     0xFFFF

#define FAT_ERROR_NO_SPACE 0xFFFF

typedef struct __attribute__((packed)) {
    char filename[18];
    uint32_t file_size;
    uint16_t start_cluster;
    uint8_t is_used;
    uint8_t reserved[7];
} FAT_DirEntry;

typedef struct __attribute__((packed)) {
    char magic[4];
    uint16_t total_clusters;
    uint16_t free_clusters;
    uint16_t root_dir_offset;
    uint16_t data_area_offset;
} FAT_BootSector;

FAT_DirEntry* fat_get_directory_entry(int index);
int fat_get_entry_name(int index, char* out_name, uint32_t capacity);
int fat_get_max_files(void);
void init_fs_pointers();
void format_disk();
uint16_t fat_write_data(const uint8_t* data, uint32_t size);
bool fat_read_data(uint16_t start_cluster, uint32_t size, uint8_t* out_buffer, uint32_t capacity);
void fat_free_chain(uint16_t start_cluster);
void fat_recount_free_clusters(void);
uint32_t fat_get_entry_size(int index);
uint32_t fat_get_free_space_bytes(void);

#endif