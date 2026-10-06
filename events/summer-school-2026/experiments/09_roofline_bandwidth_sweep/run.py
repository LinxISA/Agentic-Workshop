#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from common import output_dir, write_csv, write_json


PEAK_TFLOPS = 128.0
ARITHMETIC_INTENSITY = 32.0
BANDWIDTHS = [1.0, 2.0, 4.0, 6.0, 8.0]


def main() -> int:
    out = output_dir("09", "Sweep memory bandwidth through the Roofline ridge point")
    points = []
    for bandwidth in BANDWIDTHS:
        bandwidth_ceiling = bandwidth * ARITHMETIC_INTENSITY
        performance = min(PEAK_TFLOPS, bandwidth_ceiling)
        points.append(
            {
                "bandwidth_tb_s": bandwidth,
                "performance_tflops": performance,
                "utilization_percent": round(performance / PEAK_TFLOPS * 100, 1),
                "bottleneck": "bandwidth" if bandwidth_ceiling < PEAK_TFLOPS else "compute",
            }
        )
    result = {
        "model": "P=min(Ppeak, AI*BW)",
        "peak_tflops": PEAK_TFLOPS,
        "arithmetic_intensity_flop_per_byte": ARITHMETIC_INTENSITY,
        "ridge_bandwidth_tb_s": PEAK_TFLOPS / ARITHMETIC_INTENSITY,
        "points": points,
        "claim_boundary": "Deterministic course model; not a LinxCore RTL benchmark.",
    }
    write_json(out / "roofline_sweep.json", result)
    write_csv(out / "roofline_sweep.csv", list(points[0]), points)
    print("09 Roofline bandwidth sweep: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
