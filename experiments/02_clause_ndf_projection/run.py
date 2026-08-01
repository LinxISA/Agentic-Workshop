#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from common import output_dir, write_csv, write_json


def main() -> int:
    out = output_dir("02", "Project PTO clauses into a tiny NDF dependency graph")
    clauses = [
        {"id": "load_a", "op": "TLOAD", "reads": ["A"], "writes": ["ta"]},
        {"id": "load_b", "op": "TLOAD", "reads": ["B"], "writes": ["tb"]},
        {"id": "add", "op": "TADD", "reads": ["ta", "tb"], "writes": ["tc"]},
        {"id": "store", "op": "TSTORE", "reads": ["tc"], "writes": ["C"]},
    ]
    producer = {value: clause["id"] for clause in clauses for value in clause["writes"]}
    edges = [
        {"src": producer[value], "dst": clause["id"], "value": value}
        for clause in clauses
        for value in clause["reads"]
        if value in producer
    ]
    write_json(
        out / "ndf_projection.json",
        {"clauses": clauses, "edges": edges, "topological_order": [clause["id"] for clause in clauses]},
    )
    write_csv(out / "ndf_edges.csv", ["src", "dst", "value"], edges)
    print("02 clause to NDF projection: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
