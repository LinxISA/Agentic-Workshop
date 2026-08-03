from __future__ import annotations

import csv
import hashlib
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RUNNER = ROOT / "11_qproj_davincioo" / "run.py"


def tree_digest(root: Path) -> str:
    digest = hashlib.sha256()
    for path in sorted(path for path in root.rglob("*") if path.is_file()):
        digest.update(path.relative_to(root).as_posix().encode())
        digest.update(path.read_bytes())
    return digest.hexdigest()


class QProjModelLabTest(unittest.TestCase):
    def run_lab(
        self,
        output: Path,
        *extra: str,
        env: dict[str, str] | None = None,
    ) -> subprocess.CompletedProcess[str]:
        command = [sys.executable, str(RUNNER), "--output-dir", str(output), *extra]
        return subprocess.run(
            command,
            cwd=ROOT,
            env=env,
            text=True,
            capture_output=True,
            check=False,
        )

    def test_replay_emits_reference_summary_trace_timeline_and_five_knob_sweep(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            output = Path(tmp)
            result = self.run_lab(output)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

            summary = json.loads((output / "qproj_summary.json").read_text())
            self.assertEqual(summary["evidence_mode"], "reference_replay")
            self.assertEqual(summary["record_count"], 562)
            self.assertEqual(summary["simulated_cycles"], 11028)
            self.assertEqual(
                summary["opcode_counts"],
                {
                    "TASSIGN": 281,
                    "TEXTRACT": 160,
                    "TLOAD": 40,
                    "TMATMUL": 1,
                    "TMATMUL_ACC": 79,
                    "TSTORE": 1,
                },
            )
            self.assertIn("reference", summary["claim_boundary"].lower())

            trace_rows = [
                json.loads(line)
                for line in (output / "qproj_trace_sample.jsonl").read_text().splitlines()
            ]
            self.assertGreaterEqual(len(trace_rows), 6)
            self.assertEqual(trace_rows[0]["sequence_id"], 573)
            self.assertEqual(trace_rows[-1]["sequence_id"], 1134)
            self.assertTrue(
                all(
                    {"input_tiles", "output_tiles", "scalar_inputs"}.issubset(row)
                    for row in trace_rows
                )
            )
            self.assertTrue(all("deps" not in row for row in trace_rows))
            self.assertTrue(
                all(
                    row["dependency_note"] == "Dependencies are derived by DaVinciOO rename/scoreboard state."
                    for row in trace_rows
                )
            )

            by_sequence = {row["sequence_id"]: row for row in trace_rows}
            self.assertEqual(
                by_sequence[573]["scalar_inputs"],
                [{"dtype": "uint64", "value": "0"}],
            )
            self.assertEqual(
                by_sequence[573]["output_tiles"],
                [
                    {
                        "address": "0x0",
                        "shape": [16, 256],
                        "layout": "outer=col_major,inner=row_major,fractal_size=1024",
                        "dtype": "float32",
                    }
                ],
            )
            self.assertEqual(
                by_sequence[575]["input_tiles"],
                [
                    {
                        "address": "0xfffe81b5d000",
                        "shape": [1, 1, 1, 16, 256],
                        "layout": "ND",
                        "dtype": "bfloat16",
                    }
                ],
            )
            self.assertEqual(
                by_sequence[579]["scalar_inputs"],
                [
                    {"dtype": "uint16", "value": "0"},
                    {"dtype": "uint16", "value": "0"},
                ],
            )
            self.assertEqual(
                [tile["address"] for tile in by_sequence[587]["input_tiles"]],
                ["0x0", "0x8000"],
            )
            self.assertEqual(
                [tile["address"] for tile in by_sequence[589]["input_tiles"]],
                ["0x0", "0x800", "0x0"],
            )
            self.assertEqual(
                by_sequence[1134]["output_tiles"],
                [
                    {
                        "address": "0xfffc81b5d000",
                        "shape": [1, 1, 1, 16, 256],
                        "layout": "ND",
                        "dtype": "float32",
                    }
                ],
            )

            with (output / "qproj_timeline.csv").open(newline="") as handle:
                timeline = list(csv.DictReader(handle))
            self.assertGreaterEqual(len(timeline), 6)
            self.assertEqual(timeline[0]["evidence_mode"], "reference_replay")

            sweep = json.loads((output / "qproj_sweep.json").read_text())
            self.assertEqual(sweep["evidence_mode"], "reference_replay")
            self.assertEqual(
                set(sweep["swept_parameters"]),
                {
                    "rob_entries",
                    "tile_tags",
                    "tma_bandwidth_bytes_per_cycle",
                    "cube_macs_per_cycle_bf16",
                    "engine_count",
                },
            )
            self.assertGreaterEqual(len(sweep["points"]), 11)
            self.assertTrue(all(point["simulated_cycles"] > 0 for point in sweep["points"]))
            self.assertTrue(all(point["interpretation"] == "sensitivity_only" for point in sweep["points"]))

            with (output / "qproj_sweep.csv").open(newline="") as handle:
                csv_points = list(csv.DictReader(handle))
            self.assertEqual(len(csv_points), len(sweep["points"]))

            host_prefix = str(Path.home())
            for artifact in output.iterdir():
                if artifact.is_file():
                    self.assertNotIn(host_prefix, artifact.read_text())

    def test_replay_is_byte_for_byte_deterministic(self) -> None:
        with tempfile.TemporaryDirectory() as first, tempfile.TemporaryDirectory() as second:
            left = Path(first)
            right = Path(second)
            self.assertEqual(self.run_lab(left).returncode, 0)
            self.assertEqual(self.run_lab(right).returncode, 0)
            self.assertEqual(tree_digest(left), tree_digest(right))

    def test_unified_runner_registers_qproj_as_experiment_11(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            output = Path(tmp)
            result = subprocess.run(
                [sys.executable, str(ROOT / "run_all.py"), "--output-dir", str(output)],
                cwd=ROOT,
                text=True,
                capture_output=True,
                check=False,
            )
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            summary = json.loads((output / "summary.json").read_text())
            self.assertEqual(summary["passed"], 11)
            self.assertEqual(summary["experiments"][-1]["id"], "11")
            qproj = json.loads((output / "11" / "qproj_summary.json").read_text())
            self.assertEqual(qproj["evidence_mode"], "reference_replay")

    def test_live_mode_requires_environment_driven_inputs(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            env = os.environ.copy()
            for name in (
                "DAVINCIOO_ROOT",
                "QPROJ_PTO",
                "QPROJ_TRACE",
                "QPROJ_WORKSPACE",
                "QPROJ_GFSIM",
                "PTOAS",
                "PTO_ISA",
            ):
                env.pop(name, None)
            result = self.run_lab(Path(tmp), "--mode", "live", env=env)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("DAVINCIOO_ROOT", result.stderr)
            self.assertIn("QPROJ_PTO or QPROJ_TRACE", result.stderr)

    def test_live_trace_mode_runs_environment_selected_gfsim_and_sanitizes_outputs(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            temp = Path(tmp)
            davincioo = temp / "davincioo"
            davincioo.mkdir()
            trace = temp / "q_proj.pto.trace"
            trace.write_text('{"sequence_id":573,"opcode":"TASSIGN"}\n')
            fake_gfsim = temp / "gfsim"
            fake_gfsim.write_text(
                """#!/usr/bin/env python3
import json
import sys
from pathlib import Path

args = sys.argv[1:]
summary_out = Path(args[args.index('--summary-out') + 1])
summary_out.write_text(json.dumps({
    'tool': 'gfsim',
    'model': 'davinci_ooo_model',
    'trace_path': args[args.index('--trace') + 1],
    'record_count': 562,
    'simulated_cycles': 11028,
    'opcode_counts': {'TASSIGN': 281, 'TEXTRACT': 160, 'TLOAD': 40, 'TMATMUL': 1, 'TMATMUL_ACC': 79, 'TSTORE': 1},
}))
if '--dump-cycles' in args:
    print('retire_index=0 opcode=TASSIGN engine=SCALAR sequence_id=573 alloc_cycle=0 issue_cycle=0 engine_complete_cycle=1 retire_cycle=3')
    print('retire_index=561 opcode=TSTORE engine=TMA sequence_id=1134 alloc_cycle=10073 issue_cycle=10993 engine_complete_cycle=11025 retire_cycle=11027')
"""
            )
            fake_gfsim.chmod(0o755)
            output = temp / "artifacts"
            env = os.environ.copy()
            env.update(
                {
                    "DAVINCIOO_ROOT": str(davincioo),
                    "QPROJ_TRACE": str(trace),
                    "QPROJ_GFSIM": str(fake_gfsim),
                }
            )

            result = self.run_lab(output, "--mode", "live", env=env)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            summary = json.loads((output / "qproj_summary.json").read_text())
            self.assertEqual(summary["evidence_mode"], "live_run")
            self.assertEqual(summary["simulated_cycles"], 11028)
            self.assertNotIn(str(temp), (output / "qproj_summary.json").read_text())
            sweep = json.loads((output / "qproj_sweep.json").read_text())
            self.assertTrue(all(point["evidence_mode"] == "live_run" for point in sweep["points"]))


if __name__ == "__main__":
    unittest.main()
