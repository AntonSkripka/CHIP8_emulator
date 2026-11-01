#ifndef STACK_H
#define STACK_H

#include <stdint.h>

#define DATA_STACK_CAPACITY 1024

typedef enum {
    STACK_FAULT_NONE = 0,
    STACK_FAULT_OVERFLOW = 1,
    STACK_FAULT_UNDERFLOW = 2,
    STACK_FAULT_FRAME_UNDERFLOW = 6,
    STACK_FAULT_INVALID_FRAME = 7
} StackFault;

void init_stack_interface(uint8_t* ptr);
void stack_push(uint8_t reg_index);
void stack_pop(uint8_t reg_index);
void stack_pusha(void);
void stack_popa(void);
void stack_peak(uint8_t reg_index);
void stack_size(uint8_t reg_index);
void stack_clear(void);
int get_spd(void);
int get_fp(void);
uint8_t get_stack_value(int index);
int get_stack_fault(void);
void stack_enter(void);
void stack_leave(void);
void stack_adjust(uint8_t amount);
void stack_drop(uint8_t amount);
void stack_load_frame(int8_t offset);
uint16_t stack_load_frame_u16(int8_t offset);
void stack_store_frame(int8_t offset);

#endif
