# Offline ELF/QEMU/hardware cross-check fixture

This experiment deliberately does not invoke a compiler, QEMU, or RTL simulator. The three files under `fixtures/` are a checked-in teaching snapshot:

- `elf_symbols.json` captures the minimum ELF metadata used by the comparison.
- `qemu_trace.csv` represents an instruction-level reference trace.
- `hardware_trace.csv` represents a cycle-stamped retirement trace.

`run.py` removes tool-specific spelling differences (address width, register prefix, numeric base, and opcode case), then compares the architectural events. Replace the fixtures with traces from a real tool flow without changing the normalizer contract.
