# `src/stack.h` — Source file

**Source path:** `src/stack.h`

## Responsibility

Defines stack capacity and fault codes, and declares the stack interface. The file defines types/constants and declarations; function behavior is specified by the implementation pages linked below.

## Functions in this file

- [`init_stack_interface`](../stack-c/init-stack-interface.md)
- [`stack_push`](../stack-c/stack-push.md)
- [`stack_pop`](../stack-c/stack-pop.md)
- [`stack_pusha`](../stack-c/stack-pusha.md)
- [`stack_popa`](../stack-c/stack-popa.md)
- [`stack_peak`](../stack-c/stack-peak.md)
- [`stack_size`](../stack-c/stack-size.md)
- [`stack_clear`](../stack-c/stack-clear.md)
- [`get_spd`](../stack-c/get-spd.md)
- [`get_fp`](../stack-c/get-fp.md)
- [`get_stack_value`](../stack-c/get-stack-value.md)
- [`get_stack_fault`](../stack-c/get-stack-fault.md)
- [`stack_enter`](../stack-c/stack-enter.md)
- [`stack_leave`](../stack-c/stack-leave.md)
- [`stack_adjust`](../stack-c/stack-adjust.md)
- [`stack_drop`](../stack-c/stack-drop.md)
- [`stack_load_frame`](../stack-c/stack-load-frame.md)
- [`stack_load_frame_u16`](../stack-c/stack-load-frame-u16.md)
- [`stack_store_frame`](../stack-c/stack-store-frame.md)

## Terminology

- **Declaration:** A promise to the compiler about a function's name, parameters, and return type.
- **Implementation:** The code that performs the declared work.
- **Static:** A C item visible only inside its source file.
