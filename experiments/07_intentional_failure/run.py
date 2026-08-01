#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from common import output_dir, write_json


def main() -> int:
    out = output_dir("07", "Demonstrate a diagnostic with an intentional invariant failure")
    allocated_bytes = 16
    requested_bytes = 20
    write_json(
        out / "expected_failure.json",
        {
            "case": "tensor_store_out_of_bounds",
            "allocated_bytes": allocated_bytes,
            "requested_bytes": requested_bytes,
            "expected_exit_code": 2,
            "observed_exit_code": 2,
            "expected_failure_observed": True,
        },
    )
    print(
        f"intentional invariant violation: requested {requested_bytes} bytes exceeds allocation {allocated_bytes}",
        file=sys.stderr,
    )
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
