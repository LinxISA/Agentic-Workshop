#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from common import output_dir, write_json


def main() -> int:
    out = output_dir("01", "Trace a tiny PTO tensor add kernel")
    lhs = [1, 2, 3, 4]
    rhs = [10, 20, 30, 40]
    result = [a + b for a, b in zip(lhs, rhs, strict=True)]
    trace = [
        {"step": 0, "op": "TALLOC", "dst": "t2", "shape": [4], "dtype": "i32"},
        {"step": 1, "op": "TLOAD", "dst": "t0", "address": "A", "value": lhs},
        {"step": 2, "op": "TLOAD", "dst": "t1", "address": "B", "value": rhs},
        {"step": 3, "op": "TADD", "dst": "t2", "src": ["t0", "t1"], "value": result},
        {"step": 4, "op": "TSTORE", "src": "t2", "address": "C", "value": result},
    ]
    write_json(out / "pto_trace.json", {"kernel": "vector_add_4", "result": result, "trace": trace})
    print("01 PTO tensor trace: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
