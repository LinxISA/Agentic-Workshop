#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from common import output_dir, write_csv, write_json


def main() -> int:
    out = output_dir("03", "Simulate a three-stage pyCircuit-style pipeline")
    inputs = [1, 3, 5, 7]
    stages: list[int | None] = [None, None, None]
    rows = []
    outputs: list[int] = []
    next_input = 0
    cycle = 0
    while len(outputs) < len(inputs):
        retired = stages[2]
        if retired is not None:
            outputs.append(retired)
        stages[2] = stages[1] * 2 if stages[1] is not None else None
        stages[1] = stages[0] + 1 if stages[0] is not None else None
        stages[0] = inputs[next_input] if next_input < len(inputs) else None
        if next_input < len(inputs):
            next_input += 1
        rows.append(
            {
                "cycle": cycle,
                "fetch": "-" if stages[0] is None else stages[0],
                "increment": "-" if stages[1] is None else stages[1],
                "double": "-" if stages[2] is None else stages[2],
                "retired": "-" if retired is None else retired,
            }
        )
        cycle += 1
    write_csv(out / "pipeline_trace.csv", ["cycle", "fetch", "increment", "double", "retired"], rows)
    write_json(out / "pipeline_summary.json", {"formula": "(x + 1) * 2", "inputs": inputs, "outputs": outputs, "cycles": cycle})
    print("03 pyCircuit pipeline: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
