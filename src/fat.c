#include <stdint.h>
#include <stdbool.h>
#include <string.h>
#include <stdio.h>
#include <emscripten.h>
#include "disk_storage.h"
#include "fat.h"

static FAT_BootSector* boot_sector;
static uint16_t* fat_table;
static FAT_DirEntry* root_directory;
static uint8_t* data_area;

static uint16_t total_disk_clusters = 0;

void init_fs_pointers() {
    uint8_t* base = get_disk_memory_ptr();
    
    boot_sector = (FAT_BootSector*)base;
    fat_table = (uint16_t*)(base + SECTOR_SIZE);
    root_directory = (FAT_DirEntry*)(base + SECTOR_SIZE + 4096);
    
    uint32_t data_offset = SECTOR_SIZE + 4096 + 2048;
    data_area = base + data_offset;
    
    total_disk_clusters = (DISK_SIZE - data_offset) / CLUSTER_SIZE;
}

void format_disk() {
    clear_disk_memory();
    init_fs_pointers();

    memcpy(boot_sector->magic, "CH8F", 4);
    boot_sector->total_clusters = total_disk_clusters;
    boot_sector->free_clusters = total_disk_clusters;
    boot_sector->root_dir_offset = SECTOR_SIZE + 4096;
    boot_sector->data_area_offset = SECTOR_SIZE + 4096 + 2048;
    
    fat_table[0] = 0xFFF8;
    fat_table[1] = 0xFFFF;
    
    mark_disk_as_dirty();
    printf("Форматування успішне. Доступно кластерів: %d\n", total_disk_clusters);
}

EMSCRIPTEN_KEEPALIVE
void vfs_init() {
    init_fs_pointers();
    if (strncmp(boot_sector->magic, "CH8F", 4) != 0) {
        printf("Форматування...\n");
        format_disk();
    } else {
        printf("Вільні кластери: %d\n", boot_sector->free_clusters);
    }
}


static uint16_t find_free_cluster() {
    for (uint16_t i = 2; i < total_disk_clusters; i++) {
        if (fat_table[i] == FAT_ENTRY_FREE) {
            return i;
        }
    }
    return FAT_ERROR_NO_SPACE;
}

static inline uint8_t* get_cluster_address(uint16_t cluster) {
    return data_area + ((cluster - 2) * CLUSTER_SIZE);
}

static void write_cluster_payload(uint16_t cluster, const uint8_t* source, uint32_t size) {
    uint8_t* dest = get_cluster_address(cluster);
    memcpy(dest, source, size);
    
    if (size < CLUSTER_SIZE) {
        memset(dest + size, 0, CLUSTER_SIZE - size);
    }
}

uint16_t fat_write_data(const uint8_t* data, uint32_t size) {
    if (size == 0) return FAT_ENTRY_EOF;

    uint32_t needed_clusters = (size + CLUSTER_SIZE - 1) / CLUSTER_SIZE;
    if (needed_clusters > boot_sector->free_clusters) {
        return FAT_ERROR_NO_SPACE; 
    }

    uint16_t first_cluster = FAT_ERROR_NO_SPACE;
    uint16_t current_cluster = FAT_ERROR_NO_SPACE;
    const uint8_t* data_ptr = data;
    uint32_t bytes_remaining = size;

    for (uint32_t i = 0; i < needed_clusters; i++) {
        uint16_t next_free = find_free_cluster();
        if (next_free == FAT_ERROR_NO_SPACE) {
            if (first_cluster != FAT_ERROR_NO_SPACE) {
                fat_free_chain(first_cluster);
            }
            return FAT_ERROR_NO_SPACE; 
        }

        if (first_cluster == FAT_ERROR_NO_SPACE) {
            first_cluster = next_free;
        } else {
            fat_table[current_cluster] = next_free;
        }

        current_cluster = next_free;
        fat_table[current_cluster] = FAT_ENTRY_EOF;

        uint32_t bytes_to_write = (bytes_remaining > CLUSTER_SIZE) ? CLUSTER_SIZE : bytes_remaining;
        write_cluster_payload(current_cluster, data_ptr, bytes_to_write);

        data_ptr += bytes_to_write;
        bytes_remaining -= bytes_to_write;
        boot_sector->free_clusters--;
    }

    mark_disk_as_dirty(); 
    return first_cluster;
}

static inline bool is_valid_cluster(uint16_t cluster) {
    return (cluster >= 2 && cluster < total_disk_clusters); 
}

void fat_read_data(uint16_t start_cluster, uint32_t size, uint8_t* out_buffer) {
    if (size == 0 || out_buffer == NULL) return;
    if (!is_valid_cluster(start_cluster)) return;

    uint16_t current_cluster = start_cluster;
    uint32_t bytes_remaining = size;
    uint8_t* dest_ptr = out_buffer;

    while (bytes_remaining > 0) {
        uint32_t bytes_to_read = (bytes_remaining > CLUSTER_SIZE) ? CLUSTER_SIZE : bytes_remaining;
        
        const uint8_t* cluster_ptr = get_cluster_address(current_cluster);
        memcpy(dest_ptr, cluster_ptr, bytes_to_read);

        dest_ptr += bytes_to_read;
        bytes_remaining -= bytes_to_read;

        uint16_t next_cluster = fat_table[current_cluster];

        if (next_cluster == FAT_ENTRY_EOF || !is_valid_cluster(next_cluster)) {
            break; 
        }
        
        current_cluster = next_cluster;
    }
}

void fat_free_chain(uint16_t start_cluster) {
    if (!is_valid_cluster(start_cluster)) return;

    uint16_t current_cluster = start_cluster;
    
    while (current_cluster != FAT_ENTRY_EOF) {
        uint16_t next_cluster = fat_table[current_cluster];
        
        fat_table[current_cluster] = FAT_ENTRY_FREE;
        
        if (boot_sector->free_clusters < total_disk_clusters) {
            boot_sector->free_clusters++;
        }
        
        if (next_cluster == FAT_ENTRY_FREE || !is_valid_cluster(next_cluster)) {
            break;
        }
        
        current_cluster = next_cluster;
    }
    
    mark_disk_as_dirty();
}

EMSCRIPTEN_KEEPALIVE
FAT_DirEntry* fat_get_directory_entry(int index) {
    if (index < 0 || index >= MAX_FILES || root_directory == NULL) {
        return NULL;
    }
    return &root_directory[index];
}

EMSCRIPTEN_KEEPALIVE
int fat_get_max_files(void) {
    return MAX_FILES;
}

EMSCRIPTEN_KEEPALIVE
uint32_t fat_get_entry_size(int index) {
    if (index < 0 || index >= MAX_FILES || root_directory == NULL) return 0;
    return root_directory[index].file_size;
}

EMSCRIPTEN_KEEPALIVE
uint32_t fat_get_free_space_bytes(void) {
    if (boot_sector == NULL) return 0;
    return boot_sector->free_clusters * CLUSTER_SIZE;
}