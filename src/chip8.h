#ifndef CHIP8_H
#define CHIP8_H

#include <stdint.h>
#include <stdbool.h>

#define MEMORY_SIZE 4096
#define REGISTER_COUNT 16
#define STACK_SIZE 16
#define DISPLAY_WIDTH 64
#define DISPLAY_HEIGHT 32

typedef enum {
    CHIP8_FAULT_NONE = 0,
    CHIP8_FAULT_DATA_STACK_OVERFLOW = 1,
    CHIP8_FAULT_DATA_STACK_UNDERFLOW = 2,
    CHIP8_FAULT_CALL_STACK_OVERFLOW = 3,
    CHIP8_FAULT_CALL_STACK_UNDERFLOW = 4,
    CHIP8_FAULT_DIVISION_BY_ZERO = 5,
    CHIP8_FAULT_INVALID_INSTRUCTION = 8,
    CHIP8_FAULT_MEMORY_BOUNDS = 9,
    CHIP8_FAULT_WRITE_PROTECTED = 10
} Chip8Fault;

typedef enum {
    CHIP8_VFS_OP_GET_SIZE = 1,
    CHIP8_VFS_OP_READ = 2,
    CHIP8_VFS_OP_WRITE = 3,
    CHIP8_VFS_OP_DELETE = 4
} Chip8VfsOperation;

typedef enum {
    CHIP8_VFS_STATUS_OK = 0,
    CHIP8_VFS_STATUS_NOT_FOUND = 1,
    CHIP8_VFS_STATUS_INVALID_ARGUMENT = 2,
    CHIP8_VFS_STATUS_BUFFER_TOO_SMALL = 3,
    CHIP8_VFS_STATUS_NO_SPACE = 4,
    CHIP8_VFS_STATUS_TOO_MANY_FILES = 5,
    CHIP8_VFS_STATUS_IO_ERROR = 6,
    CHIP8_VFS_STATUS_UNSUPPORTED_OPERATION = 7
} Chip8VfsStatus;

#define CHIP8_VFS_REQUEST_SIZE 11

typedef struct {
    uint8_t  memory[MEMORY_SIZE];     
    uint8_t  V[REGISTER_COUNT];       
    uint16_t I;                       
    uint16_t pc;                      
    
    uint16_t stack[STACK_SIZE];       
    uint8_t  sp;                      

    Chip8Fault execution_fault;
    uint8_t  delay_timer;             
    uint8_t  sound_timer;             
    bool shift_quirks;
    bool load_store_quirks;
    bool sub_equality_quirk;
    bool add_i_preserve_vf_quirk;
    bool chip8_dev_mode;

    uint32_t display[DISPLAY_WIDTH * DISPLAY_HEIGHT]; 
    uint8_t  keypad[16];              
    
    bool draw_flag;                   
} Chip8;

int get_execution_fault(void);
void set_chip8_dev_mode(bool enabled);
int set_memory_readonly_range(uint16_t start, uint16_t size);

#endif