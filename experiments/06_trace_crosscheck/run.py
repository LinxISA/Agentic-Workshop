#!/usr/bin/env python3
from __future__ import annotations

import csv
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from common import output_dir, write_csv, write_json


HERE = Path(__file__).resolve().parent


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def canonical_pc(value: str) -> str:
    return f"0x{int(value, 16):08x}"


def canonical_reg(value: str) -> str:
    if value in {"-", ""}:
        return "-"
    return f"r{int(value[1:])}"


def canonical_value(value: str) -> str:
    if value in {"-", ""}:
        return "-"
    return str(int(value, 0))


def main() -> int:
    out = output_dir("06", "Cross-check offline ELF, QEMU, and hardware fixtures")
    fixture = HERE / "fixtures"
    elf = json.loads((fixture / "elf_symbols.json").read_text(encoding="utf-8"))
    qemu = read_csv(fixture / "qemu_trace.csv")
    hardware = read_csv(fixture / "hardware_trace.csv")
    normalized = []
    mismatches = []
    for index, (qrow, hrow) in enumerate(zip(qemu, hardware, strict=True)):
        q = {
            "pc": canonical_pc(qrow["pc"]),
            "opcode": qrow["opcode"].lower(),
            "rd": canonical_reg(qrow["rd"]),
            "value": canonical_value(qrow["value"]),
        }
        h = {
            "pc": canonical_pc(hrow["pc"]),
            "opcode": hrow["opcode"].lower(),
            "rd": canonical_reg(hrow["rd"]),
            "value": canonical_value(hrow["value"]),
        }
        matched = q == h
        if not matched:
            mismatches.append({"instruction": index, "qemu": q, "hardware": h})
        normalized.append({"instruction": index, **q, "matched": str(matched).lower()})
    entry_matches = canonical_pc(elf["entry"]) == normalized[0]["pc"]
    write_csv(out / "normalized_trace.csv", ["instruction", "pc", "opcode", "rd", "value", "matched"], normalized)
    write_json(
        out / "crosscheck.json",
        {
            "checked_instructions": len(normalized),
            "elf_entry_matches_first_pc": entry_matches,
            "mismatches": mismatches,
            "sources": ["ELF metadata fixture", "QEMU trace fixture", "hardware commit trace fixture"],
        },
    )
    if mismatches or not entry_matches:
        print("06 trace cross-check: FAIL", file=sys.stderr)
        return 1
    print("06 ELF/QEMU/hardware trace cross-check: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
