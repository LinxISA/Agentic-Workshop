#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from common import output_dir, write_csv, write_json


POINTS = [
    {"design": "tiny", "latency": 20, "energy": 6, "area": 2},
    {"design": "eco", "latency": 14, "energy": 5, "area": 3},
    {"design": "balanced", "latency": 10, "energy": 7, "area": 4},
    {"design": "fast", "latency": 7, "energy": 10, "area": 6},
    {"design": "wasteful", "latency": 16, "energy": 9, "area": 5},
    {"design": "oversized", "latency": 10, "energy": 9, "area": 7},
]


def dominates(left: dict[str, int | str], right: dict[str, int | str]) -> bool:
    metrics = ("latency", "energy", "area")
    return all(left[m] <= right[m] for m in metrics) and any(left[m] < right[m] for m in metrics)


def main() -> int:
    out = output_dir("08", "Find a deterministic three-objective Pareto frontier")
    rows = []
    frontier = []
    for point in POINTS:
        is_pareto = not any(dominates(other, point) for other in POINTS if other is not point)
        row = {**point, "pareto": str(is_pareto).lower()}
        rows.append(row)
        if is_pareto:
            frontier.append(point["design"])
    write_csv(out / "design_points.csv", ["design", "latency", "energy", "area", "pareto"], rows)
    write_json(out / "pareto_frontier.json", {"objectives": ["latency", "energy", "area"], "minimize": True, "frontier": frontier})
    print("08 design-space Pareto analysis: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
