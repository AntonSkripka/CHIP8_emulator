CC = emcc
SRC = src/chip8.c src/stack.c
OUT = web/js/chip8.js

FLAGS = -s MODULARIZE=1 \
        -s EXPORT_NAME="createChip8" \
        -s "EXPORTED_FUNCTIONS=['_init','_set_key','_update_timers','_step','_load_data_at','_load_opcode_at','_get_display_ptr','_get_draw_flag','_clear_draw_flag','_get_v_regs_ptr','_get_mem_ptr','_get_i','_get_pc','_init_stack_interface','_stack_push','_stack_pop','_get_spd','_get_stack_value','_get_call_stack_ptr','_malloc','_free']" \
        -s "EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap', 'HEAPU8', 'HEAP32']" \
        -s ALLOW_MEMORY_GROWTH=1 \
        -O3

all:
	$(CC) $(SRC) -o $(OUT) $(FLAGS)

clean:
	rm -f web/js/chip8.js web/js/chip8.wasm