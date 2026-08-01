from __future__ import annotations

import csv
import hashlib
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def tree_digest(root: Path) -> str:
    digest = hashlib.sha256()
    for path in sorted(p for p in root.rglob("*") if p.is_file()):
        digest.update(path.relative_to(root).as_posix().encode())
        digest.update(path.read_bytes())
    return digest.hexdigest()


class ExperimentSmokeTest(unittest.TestCase):
    def run_all(self, output: Path) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [sys.executable, str(ROOT / "run_all.py"), "--output-dir", str(output)],
            cwd=ROOT,
            text=True,
            capture_output=True,
            check=False,
        )

    def test_all_experiments_pass_and_emit_expected_artifacts(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            output = Path(tmp)
            result = self.run_all(output)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

            summary = json.loads((output / "summary.json").read_text())
            self.assertEqual(summary["passed"], 10)
            self.assertEqual(summary["failed"], 0)
            self.assertEqual(len(summary["experiments"]), 10)
            self.assertEqual(
                [item["id"] for item in summary["experiments"]],
                [f"{index:02d}" for index in range(1, 11)],
            )

            pto = json.loads((output / "01" / "pto_trace.json").read_text())
            self.assertEqual([step["op"] for step in pto["trace"]], ["TALLOC", "TLOAD", "TLOAD", "TADD", "TSTORE"])
            self.assertEqual(pto["result"], [11, 22, 33, 44])

            projection = json.loads((output / "02" / "ndf_projection.json").read_text())
            self.assertEqual(projection["topological_order"], ["load_a", "load_b", "add", "store"])

            pipeline = json.loads((output / "03" / "pipeline_summary.json").read_text())
            self.assertEqual(pipeline["outputs"], [4, 8, 12, 16])

            comparison = json.loads((output / "04" / "comparison.json").read_text())
            self.assertTrue(comparison["architectural_match"])
            self.assertLess(comparison["dual_issue_cycles"], comparison["scalar_cycles"])

            queue = json.loads((output / "05" / "queue_summary.json").read_text())
            self.assertEqual(queue["received"], [3, 5, 8, 13])
            self.assertGreater(queue["backpressure_cycles"], 0)

            crosscheck = json.loads((output / "06" / "crosscheck.json").read_text())
            self.assertEqual(crosscheck["mismatches"], [])
            self.assertEqual(crosscheck["checked_instructions"], 4)

            intentional = json.loads((output / "07" / "expected_failure.json").read_text())
            self.assertEqual(intentional["observed_exit_code"], 2)
            self.assertTrue(intentional["expected_failure_observed"])

            with (output / "08" / "design_points.csv").open(newline="") as handle:
                rows = list(csv.DictReader(handle))
            self.assertEqual(sum(row["pareto"] == "true" for row in rows), 4)

            roofline = json.loads((output / "09" / "roofline_sweep.json").read_text())
            self.assertEqual(roofline["ridge_bandwidth_tb_s"], 4.0)
            self.assertEqual(roofline["points"][-1]["bottleneck"], "compute")

            hierarchy = json.loads((output / "10" / "hierarchy_sweep.json").read_text())
            self.assertLess(hierarchy["variants"]["locality"]["dram_bytes"], hierarchy["variants"]["baseline"]["dram_bytes"])
            self.assertLess(hierarchy["variants"]["deeper_queue"]["stall_cycles"], hierarchy["variants"]["baseline"]["stall_cycles"])

    def test_repeated_runs_are_byte_for_byte_deterministic(self) -> None:
        with tempfile.TemporaryDirectory() as first, tempfile.TemporaryDirectory() as second:
            left = Path(first)
            right = Path(second)
            self.assertEqual(self.run_all(left).returncode, 0)
            self.assertEqual(self.run_all(right).returncode, 0)
            self.assertEqual(tree_digest(left), tree_digest(right))

    def test_intentional_failure_is_nonzero_when_run_directly(self) -> None:
        result = subprocess.run(
            [sys.executable, str(ROOT / "07_intentional_failure" / "run.py")],
            cwd=ROOT,
            text=True,
            capture_output=True,
            check=False,
        )
        self.assertEqual(result.returncode, 2)
        self.assertIn("intentional invariant violation", result.stderr)


if __name__ == "__main__":
    unittest.main()
