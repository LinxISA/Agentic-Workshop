#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from common import output_dir, write_csv, write_json


WORKLOAD_BYTES = 4096
BASE_CYCLES = 1000
VARIANTS = {
    "baseline": {"hit_rate": 0.75, "queue_depth": 8},
    "locality": {"hit_rate": 0.875, "queue_depth": 8},
    "deeper_queue": {"hit_rate": 0.75, "queue_depth": 24},
    "balanced": {"hit_rate": 0.875, "queue_depth": 24},
}


def evaluate(hit_rate: float, queue_depth: int) -> dict[str, float | int]:
    dram_bytes = round(WORKLOAD_BYTES * (1 - hit_rate))
    misses = dram_bytes // 32
    exposed_misses = max(0, misses - queue_depth)
    stall_cycles = exposed_misses * 8
    total_cycles = BASE_CYCLES + stall_cycles
    return {
        "hit_rate": hit_rate,
        "queue_depth": queue_depth,
        "dram_bytes": dram_bytes,
        "outstanding_misses": misses,
        "stall_cycles": stall_cycles,
        "total_cycles": total_cycles,
        "normalized_performance": round(BASE_CYCLES / total_cycles, 4),
    }


def main() -> int:
    out = output_dir("10", "Separate locality and queue-depth effects")
    variants = {name: evaluate(**config) for name, config in VARIANTS.items()}
    result = {
        "workload_bytes": WORKLOAD_BYTES,
        "base_cycles": BASE_CYCLES,
        "variants": variants,
        "claim_boundary": "Course hierarchy/overlap model; omits PPA and detailed cache timing.",
    }
    rows = [{"variant": name, **values} for name, values in variants.items()]
    write_json(out / "hierarchy_sweep.json", result)
    write_csv(out / "hierarchy_sweep.csv", list(rows[0]), rows)
    print("10 hierarchy and queue sweep: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
