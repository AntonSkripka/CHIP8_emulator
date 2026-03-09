#include <stdint.h>
#include <stdbool.h>

#define MEMORY_SIZE 4096
#define REGISTER_COUNT 16
#define STACK_SIZE 16
#define DISPLAY_WIDTH 64
#define DISPLAY_HEIGHT 32

typedef struct {
    uint8_t  memory[MEMORY_SIZE];     
    uint8_t  V[REGISTER_COUNT];       
    uint16_t I;                       
    uint16_t pc;                      
    
    uint16_t stack[STACK_SIZE];       
    uint8_t  sp;                      

    uint8_t  delay_timer;             
    uint8_t  sound_timer;             

    uint32_t display[DISPLAY_WIDTH * DISPLAY_HEIGHT]; 
    uint8_t  keypad[16];              
    
    bool draw_flag;                   
} Chip8;