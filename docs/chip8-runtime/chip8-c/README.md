# `src/chip8.c` — Source file

**Source path:** `src/chip8.c`

## Responsibility

Owns the global CPU instance, decodes and executes opcodes, renders sprites, checks memory, manages runtime settings, and implements the guest VFS request protocol.

## Functions in this file

- [`decode_signed_offset`](./decode-signed-offset.md)
- [`can_write_memory`](./can-write-memory.md)
- [`can_read_memory`](./can-read-memory.md)
- [`is_user_memory_range`](./is-user-memory-range.md)
- [`ranges_overlap`](./ranges-overlap.md)
- [`read_be_u16`](./read-be-u16.md)
- [`write_be_u32`](./write-be-u32.md)
- [`is_valid_utf8_filename`](./is-valid-utf8-filename.md)
- [`set_vfs_status`](./set-vfs-status.md)
- [`handle_vfs_syscall`](./handle-vfs-syscall.md)
- [`render_sprite`](./render-sprite.md)
- [`init`](./init.md)
- [`set_key`](./set-key.md)
- [`set_quirks`](./set-quirks.md)
- [`set_chip8_dev_mode`](./set-chip8-dev-mode.md)
- [`set_memory_readonly_range`](./set-memory-readonly-range.md)
- [`update_timers`](./update-timers.md)
- [`step`](./step.md)
- [`load_opcode_at`](./load-opcode-at.md)
- [`load_data_at`](./load-data-at.md)
- [`get_display_ptr`](./get-display-ptr.md)
- [`get_v_regs_ptr`](./get-v-regs-ptr.md)
- [`get_pc`](./get-pc.md)
- [`get_draw_flag`](./get-draw-flag.md)
- [`clear_draw_flag`](./clear-draw-flag.md)
- [`get_mem_ptr`](./get-mem-ptr.md)
- [`get_i`](./get-i.md)
- [`get_call_stack_ptr`](./get-call-stack-ptr.md)
- [`get_execution_fault`](./get-execution-fault.md)

## Terminology

- **Declaration:** A promise to the compiler about a function's name, parameters, and return type.
- **Implementation:** The code that performs the declared work.
- **Static:** A C item visible only inside its source file.
