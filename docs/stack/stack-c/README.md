# `src/stack.c` — Source file

**Source path:** `src/stack.c`

## Responsibility

Implements private stack storage, register save/restore, frame operations, and stack status queries.

## Functions in this file

- [`init_stack_interface`](./init-stack-interface.md)
- [`stack_push`](./stack-push.md)
- [`stack_pop`](./stack-pop.md)
- [`stack_pusha`](./stack-pusha.md)
- [`stack_popa`](./stack-popa.md)
- [`stack_peak`](./stack-peak.md)
- [`stack_size`](./stack-size.md)
- [`stack_clear`](./stack-clear.md)
- [`get_spd`](./get-spd.md)
- [`get_fp`](./get-fp.md)
- [`get_stack_value`](./get-stack-value.md)
- [`get_stack_fault`](./get-stack-fault.md)
- [`stack_enter`](./stack-enter.md)
- [`stack_leave`](./stack-leave.md)
- [`stack_adjust`](./stack-adjust.md)
- [`stack_drop`](./stack-drop.md)
- [`resolve_frame_address`](./resolve-frame-address.md)
- [`stack_load_frame`](./stack-load-frame.md)
- [`stack_load_frame_u16`](./stack-load-frame-u16.md)
- [`stack_store_frame`](./stack-store-frame.md)

## Terminology

- **Declaration:** A promise to the compiler about a function's name, parameters, and return type.
- **Implementation:** The code that performs the declared work.
- **Static:** A C item visible only inside its source file.
