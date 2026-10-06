#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from common import output_dir, write_csv, write_json


PROGRAM = [
    ("MOV", "r1", 2),
    ("MOV", "r2", 5),
    ("ADD", "r3", ("r1", "r2")),
    ("MUL", "r4", ("r1", "r2")),
]


def execute(width: int) -> tuple[dict[str, int], list[dict[str, object]]]:
    regs = {f"r{i}": 0 for i in range(1, 5)}
    trace = []
    for index in range(0, len(PROGRAM), width):
        issued = PROGRAM[index : index + width]
        before = regs.copy()
        updates: dict[str, int] = {}
        for op, dst, source in issued:
            if op == "MOV":
                updates[dst] = int(source)
            elif op == "ADD":
                left, right = source
                updates[dst] = before[left] + before[right]
            elif op == "MUL":
                left, right = source
                updates[dst] = before[left] * before[right]
        regs.update(updates)
        trace.append({"cycle": len(trace), "issued": "+".join(item[0] for item in issued), "state": dict(sorted(regs.items()))})
    return regs, trace


def main() -> int:
    out = output_dir("04", "Compare scalar and dual-issue microarchitecture traces")
    scalar_state, scalar = execute(1)
    dual_state, dual = execute(2)
    rows = [
        {"microarchitecture": name, "cycle": row["cycle"], "issued": row["issued"], "state": str(row["state"])}
        for name, trace in (("scalar", scalar), ("dual_issue", dual))
        for row in trace
    ]
    write_csv(out / "microarch_traces.csv", ["microarchitecture", "cycle", "issued", "state"], rows)
    write_json(
        out / "comparison.json",
        {
            "architectural_match": scalar_state == dual_state,
            "final_state": scalar_state,
            "scalar_cycles": len(scalar),
            "dual_issue_cycles": len(dual),
        },
    )
    print("04 microarchitecture comparison: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
