#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent
EXPERIMENTS = [
    ("01", "01_pto_tensor_trace", 0),
    ("02", "02_clause_ndf_projection", 0),
    ("03", "03_pycircuit_pipeline", 0),
    ("04", "04_microarch_trace_compare", 0),
    ("05", "05_linxcore_queue", 0),
    ("06", "06_trace_crosscheck", 0),
    ("07", "07_intentional_failure", 2),
    ("08", "08_design_space_pareto", 0),
]


def main() -> int:
    parser = argparse.ArgumentParser(description="Run all offline Summer School experiments")
    parser.add_argument("--output-dir", type=Path, default=ROOT / "artifacts")
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    results = []
    for experiment_id, directory, expected_code in EXPERIMENTS:
        artifact_dir = args.output_dir / experiment_id
        command = [sys.executable, str(ROOT / directory / "run.py"), "--output-dir", str(artifact_dir)]
        completed = subprocess.run(command, cwd=ROOT, text=True, capture_output=True, check=False)
        passed = completed.returncode == expected_code
        results.append(
            {
                "id": experiment_id,
                "name": directory,
                "expected_exit_code": expected_code,
                "observed_exit_code": completed.returncode,
                "status": "pass" if passed else "fail",
                "stdout": completed.stdout.strip(),
                "stderr": completed.stderr.strip(),
            }
        )
        print(f"[{experiment_id}] {'PASS' if passed else 'FAIL'} {directory}")
    passed_count = sum(item["status"] == "pass" for item in results)
    summary = {"passed": passed_count, "failed": len(results) - passed_count, "experiments": results}
    (args.output_dir / "summary.json").write_text(json.dumps(summary, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(f"summary: {passed_count}/{len(results)} passed")
    return 0 if passed_count == len(results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
