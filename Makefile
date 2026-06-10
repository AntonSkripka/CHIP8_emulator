CC = emcc
SRC = src/chip8.c src/stack.c src/math_core.c src/disk_storage.c src/fat.c src/vfs.c
OUT = web/js/chip8.js

FLAGS = -s MODULARIZE=1 \
        -s EXPORT_NAME="createChip8" \
        -s "EXPORTED_FUNCTIONS=['_init','_set_key','_update_timers','_step','_load_data_at','_load_opcode_at','_get_display_ptr','_get_draw_flag','_clear_draw_flag','_get_v_regs_ptr','_get_mem_ptr','_get_i','_get_pc','_init_stack_interface','_stack_push','_stack_pop','_get_spd','_get_stack_value','_get_call_stack_ptr', '_math_mul','_math_div','_math_rem','_get_disk_memory_ptr','_get_is_dirty','_set_is_dirty','_vfs_init','_vfs_write','_vfs_get_file_size','_vfs_read','_vfs_delete','_fat_get_max_files','_fat_get_directory_entry','_fat_get_entry_size','_fat_get_free_space_bytes', '_malloc','_free']" \
        -s "EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap', 'HEAPU8', 'HEAP32']" \
        -s ALLOW_MEMORY_GROWTH=1 \
        -O3

all:
	$(CC) $(SRC) -o $(OUT) $(FLAGS)

clean:
	rm -f web/js/chip8.js web/js/chip8.wasm