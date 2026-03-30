#ifndef STACK_H
#define STACK_H

#include <stdint.h>

void init_stack_interface(uint8_t* ptr);
void stack_push(uint8_t reg_index);
void stack_pop(uint8_t reg_index);
void stack_pusha(void);
void stack_popa(void);
void stack_peak(uint8_t reg_index);
void stack_size(uint8_t reg_index);
void stack_clear(void);
int get_spd(void);
uint8_t get_stack_value(int index);

#endif // STACK_H
