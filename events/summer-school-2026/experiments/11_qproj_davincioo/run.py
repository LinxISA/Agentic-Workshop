#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from common import write_csv, write_json


ROOT = Path(__file__).resolve().parent
FIXTURE = ROOT / "fixtures" / "reference_evidence.json"
SWEEP_PARAMETERS = [
    "rob_entries",
    "tile_tags",
    "tma_bandwidth_bytes_per_cycle",
    "cube_macs_per_cycle_bf16",
    "engine_count",
]
TRACE_ENGINE = {
    "TASSIGN": "SCALAR",
    "TEXTRACT": "VEC",
    "TLOAD": "TMA",
    "TMATMUL": "CUBE",
    "TMATMUL_ACC": "CUBE",
    "TSTORE": "TMA",
}
DEPENDENCY_NOTE = "Dependencies are derived by DaVinciOO rename/scoreboard state."
BASE_CONFIG = {
    "rob_entries": 64,
    "tile_tags": 4096,
    "issue_queue_entries": 8,
    "scalar_count": 1,
    "vec_count": 1,
    "cube_count": 1,
    "tma_count": 1,
    "tma_bandwidth_bytes_per_cycle": 512,
    "cube_macs_per_cycle_bf16": 4096,
}
POINTS = [
    ("baseline", "baseline", 0, "reference", {}),
    ("rob_16", "rob_entries", 16, "entries", {"rob_entries": 16}),
    ("rob_32", "rob_entries", 32, "entries", {"rob_entries": 32}),
    ("rob_128", "rob_entries", 128, "entries", {"rob_entries": 128}),
    ("tags_32", "tile_tags", 32, "tags", {"tile_tags": 32}),
    ("tags_128", "tile_tags", 128, "tags", {"tile_tags": 128}),
    (
        "tma_bw_256",
        "tma_bandwidth_bytes_per_cycle",
        256,
        "bytes/cycle",
        {"tma_bandwidth_bytes_per_cycle": 256},
    ),
    (
        "tma_bw_1024",
        "tma_bandwidth_bytes_per_cycle",
        1024,
        "bytes/cycle",
        {"tma_bandwidth_bytes_per_cycle": 1024},
    ),
    (
        "cube_macs_2048",
        "cube_macs_per_cycle_bf16",
        2048,
        "MACs/cycle",
        {"cube_macs_per_cycle_bf16": 2048},
    ),
    (
        "cube_macs_8192",
        "cube_macs_per_cycle_bf16",
        8192,
        "MACs/cycle",
        {"cube_macs_per_cycle_bf16": 8192},
    ),
    ("cube_engines_2", "engine_count", 2, "Cube engines", {"cube_count": 2}),
    ("tma_engines_2", "engine_count", 2, "TMA engines", {"tma_count": 2}),
]


class LiveConfigurationError(RuntimeError):
    pass


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Offline replay or live DaVinciOO q_proj model lab")
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=ROOT.parent / "artifacts" / "11",
        help="artifact directory (default: experiments/artifacts/11)",
    )
    parser.add_argument(
        "--mode",
        choices=("replay", "live"),
        default=os.environ.get("QPROJ_MODE", "replay"),
        help="replay checked-in reference evidence or run environment-selected DaVinciOO tools",
    )
    return parser.parse_args()


def render_config(config: dict[str, int]) -> str:
    return f"""[rob]
entries = {config['rob_entries']}

[rename]
tile_tags = {config['tile_tags']}

[issue_queue]
entries = {config['issue_queue_entries']}

[scalar]
count = {config['scalar_count']}

[vec]
count = {config['vec_count']}

[cube]
count = {config['cube_count']}

[tma]
count = {config['tma_count']}

[scalar_cost]
default_latency = 1
tassign_latency = 1
unknown_latency = 1

[vec_cost]
fast_bandwidth_bytes_per_cycle = 512
slow_bandwidth_bytes_per_cycle = 256
elementwise_compute_cycles = 4
reduction_compute_cycles = 8
reduction_merge_cycles = 3
slow_compute_cycles = 12
move_compute_cycles = 4
unknown_latency = 12

[cube_cost]
input_bandwidth_bytes_per_cycle = 512
macs_per_cycle_fp32 = 4096
macs_per_cycle_fp16 = {config['cube_macs_per_cycle_bf16']}
macs_per_cycle_bf16 = {config['cube_macs_per_cycle_bf16']}
macs_per_cycle_fp8 = 8192
macs_per_cycle_int8 = 8192
macs_per_cycle_fp4 = 32768
accumulate_extra_cycles = 0
overlap_mode = false
unknown_latency = 72

[tma_cost]
bandwidth_bytes_per_cycle = {config['tma_bandwidth_bytes_per_cycle']}
load_overhead_cycles = 0
store_overhead_cycles = 0
move_overhead_cycles = 0
unknown_latency = 2
"""


def run_command(command: list[str], *, cwd: Path | None = None) -> subprocess.CompletedProcess[str]:
    completed = subprocess.run(command, cwd=cwd, text=True, capture_output=True, check=False)
    if completed.returncode != 0:
        detail = completed.stderr.strip() or completed.stdout.strip() or f"exit code {completed.returncode}"
        raise RuntimeError(detail)
    return completed


def resolve_live_inputs() -> tuple[Path, Path]:
    root_value = os.environ.get("DAVINCIOO_ROOT")
    trace_value = os.environ.get("QPROJ_TRACE")
    pto_value = os.environ.get("QPROJ_PTO")
    missing = []
    if not root_value:
        missing.append("DAVINCIOO_ROOT")
    if not trace_value and not pto_value:
        missing.append("QPROJ_PTO or QPROJ_TRACE")
    if missing:
        raise LiveConfigurationError("missing environment variables: " + ", ".join(missing))

    davincioo_root = Path(root_value).expanduser()
    if trace_value:
        trace = Path(trace_value).expanduser()
    else:
        workspace_value = os.environ.get("QPROJ_WORKSPACE")
        if not workspace_value:
            raise LiveConfigurationError("QPROJ_WORKSPACE is required with QPROJ_PTO")
        workspace = Path(workspace_value).expanduser()
        script = davincioo_root / "model" / "scripts" / "davinci_ooo_model.py"
        command = [
            sys.executable,
            str(script),
            "flow",
            "pto-cycle",
            "--pto",
            str(Path(pto_value).expanduser()),
            "--entry",
            "q_proj",
            "--workspace",
            str(workspace),
        ]
        if os.environ.get("PTOAS"):
            command.extend(["--ptoas-bin", os.environ["PTOAS"]])
        if os.environ.get("PTO_ISA"):
            command.extend(["--pto-isa-dir", os.environ["PTO_ISA"]])
        run_command(command, cwd=davincioo_root)
        traces = sorted((workspace / "trace").glob("*.pto.trace"))
        if len(traces) != 1:
            raise RuntimeError(f"expected one q_proj trace, found {len(traces)}")
        trace = traces[0]

    gfsim = Path(os.environ.get("QPROJ_GFSIM", davincioo_root / "build" / "model" / "gfsim")).expanduser()
    if not trace.is_file():
        raise LiveConfigurationError("QPROJ_TRACE/QPROJ_PTO did not resolve to a trace file")
    if not gfsim.is_file():
        raise LiveConfigurationError("QPROJ_GFSIM did not resolve to a gfsim executable")
    return trace, gfsim


def parse_cycle_line(line: str) -> dict[str, str]:
    return dict(re.findall(r"([a-z_]+)=([^ ]+)", line))


def compact_timeline(stdout: str, evidence_mode: str) -> list[dict[str, str | int]]:
    rows = [parse_cycle_line(line) for line in stdout.splitlines() if line.startswith("retire_index=")]
    selected: list[dict[str, str]] = []
    seen: set[str] = set()
    for row in rows:
        opcode = row.get("opcode", "UNKNOWN")
        if opcode not in seen:
            selected.append(row)
            seen.add(opcode)
    if rows and rows[-1] not in selected:
        selected.append(rows[-1])
    fields = ("sequence_id", "opcode", "engine", "alloc_cycle", "issue_cycle", "engine_complete_cycle", "retire_cycle")
    return [
        {"evidence_mode": evidence_mode, **{field: row.get(field, "") for field in fields}}
        for row in selected
    ]


def sanitize_trace_row(row: dict[str, Any]) -> dict[str, Any]:
    opcode = str(row.get("opcode", "UNKNOWN"))
    return {
        "block_idx": row.get("block_idx", 0),
        "sequence_id": row["sequence_id"],
        "opcode": opcode,
        "engine": TRACE_ENGINE.get(opcode, "UNKNOWN"),
        "input_tiles": row.get("input_tiles", []),
        "scalar_inputs": row.get("scalar_inputs", []),
        "output_tiles": row.get("output_tiles", []),
        "dependency_note": DEPENDENCY_NOTE,
    }


def compact_trace(trace: Path) -> list[dict[str, Any]]:
    rows = [json.loads(line) for line in trace.read_text(encoding="utf-8").splitlines() if line.strip()]
    selected: list[dict[str, Any]] = []
    seen: set[str] = set()
    for row in rows:
        opcode = str(row.get("opcode", "UNKNOWN"))
        if opcode not in seen:
            selected.append(sanitize_trace_row(row))
            seen.add(opcode)
    if rows and rows[-1]["sequence_id"] not in {row["sequence_id"] for row in selected}:
        selected.append(sanitize_trace_row(rows[-1]))
    return selected


def live_evidence() -> dict[str, Any]:
    trace, gfsim = resolve_live_inputs()
    points: list[dict[str, Any]] = []
    timeline: list[dict[str, str | int]] = []
    baseline_summary: dict[str, Any] | None = None
    with tempfile.TemporaryDirectory(prefix="qproj-model-lab-") as tmp:
        scratch = Path(tmp)
        for point_id, parameter, value, unit, overrides in POINTS:
            config = {**BASE_CONFIG, **overrides}
            config_path = scratch / f"{point_id}.toml"
            summary_path = scratch / f"{point_id}.json"
            config_path.write_text(render_config(config), encoding="utf-8")
            command = [
                str(gfsim),
                "simulate",
                "--trace",
                str(trace),
                "--config",
                str(config_path),
                "--summary-out",
                str(summary_path),
            ]
            if point_id == "baseline":
                command.append("--dump-cycles")
            completed = run_command(command)
            summary = json.loads(summary_path.read_text(encoding="utf-8"))
            if point_id == "baseline":
                baseline_summary = summary
                timeline = compact_timeline(completed.stdout, "live_run")
            points.append(
                {
                    "id": point_id,
                    "parameter": parameter,
                    "value": value,
                    "unit": unit,
                    "rob_entries": config["rob_entries"],
                    "tile_tags": config["tile_tags"],
                    "tma_bandwidth_bytes_per_cycle": config["tma_bandwidth_bytes_per_cycle"],
                    "cube_macs_per_cycle_bf16": config["cube_macs_per_cycle_bf16"],
                    "cube_engine_count": config["cube_count"],
                    "tma_engine_count": config["tma_count"],
                    "simulated_cycles": summary["simulated_cycles"],
                    "evidence_mode": "live_run",
                    "interpretation": "sensitivity_only",
                }
            )
    assert baseline_summary is not None
    baseline_cycles = int(baseline_summary["simulated_cycles"])
    for point in points:
        point["speedup_vs_reference"] = round(baseline_cycles / point["simulated_cycles"], 6)
        delta = abs(point["simulated_cycles"] - baseline_cycles) / baseline_cycles
        point["bottleneck_signal"] = "observed_cycle_change" if delta >= 0.01 else "no_material_change"
    return {
        "summary": {
            "evidence_mode": "live_run",
            "source_kind": "DaVinciOO_gfsim_live",
            "record_count": baseline_summary["record_count"],
            "simulated_cycles": baseline_cycles,
            "opcode_counts": baseline_summary["opcode_counts"],
            "claim_boundary": "Fresh local gfsim execution; results apply only to the selected trace and configuration.",
        },
        "trace_sample": compact_trace(trace),
        "timeline": timeline,
        "sweep": {
            "evidence_mode": "live_run",
            "method": "one_factor_at_a_time",
            "swept_parameters": SWEEP_PARAMETERS,
            "claim_boundary": "Sensitivity evidence only; equal cycle counts do not establish architectural equivalence.",
            "points": points,
        },
    }


def replay_evidence() -> dict[str, Any]:
    fixture = json.loads(FIXTURE.read_text(encoding="utf-8"))
    baseline_cycles = int(fixture["sweep_cycles"]["baseline"])
    points = []
    for point_id, parameter, value, unit, overrides in POINTS:
        config = {**BASE_CONFIG, **overrides}
        cycles = int(fixture["sweep_cycles"][point_id])
        delta = abs(cycles - baseline_cycles) / baseline_cycles
        points.append(
            {
                "id": point_id,
                "parameter": parameter,
                "value": value,
                "unit": unit,
                "rob_entries": config["rob_entries"],
                "tile_tags": config["tile_tags"],
                "tma_bandwidth_bytes_per_cycle": config["tma_bandwidth_bytes_per_cycle"],
                "cube_macs_per_cycle_bf16": config["cube_macs_per_cycle_bf16"],
                "cube_engine_count": config["cube_count"],
                "tma_engine_count": config["tma_count"],
                "simulated_cycles": cycles,
                "speedup_vs_reference": round(baseline_cycles / cycles, 6),
                "evidence_mode": "reference_replay",
                "interpretation": "sensitivity_only",
                "bottleneck_signal": "observed_cycle_change" if delta >= 0.01 else "no_material_change",
            }
        )
    return {
        "summary": fixture["summary"],
        "trace_sample": [sanitize_trace_row(row) for row in fixture["trace_sample"]],
        "timeline": fixture["timeline"],
        "sweep": {
            "evidence_mode": "reference_replay",
            "method": "one_factor_at_a_time",
            "swept_parameters": SWEEP_PARAMETERS,
            "claim_boundary": "Replayed reference sensitivity evidence; equal cycle counts do not establish architectural equivalence.",
            "provenance": fixture["provenance"],
            "points": points,
        },
    }


def emit(out: Path, evidence: dict[str, Any]) -> None:
    out.mkdir(parents=True, exist_ok=True)
    write_json(out / "qproj_summary.json", evidence["summary"])
    trace_text = "".join(json.dumps(row, sort_keys=True, separators=(",", ":")) + "\n" for row in evidence["trace_sample"])
    (out / "qproj_trace_sample.jsonl").write_text(trace_text, encoding="utf-8")
    timeline = evidence["timeline"]
    write_csv(out / "qproj_timeline.csv", list(timeline[0]), timeline)
    sweep = evidence["sweep"]
    write_json(out / "qproj_sweep.json", sweep)
    write_csv(out / "qproj_sweep.csv", list(sweep["points"][0]), sweep["points"])


def main() -> int:
    args = parse_args()
    try:
        evidence = replay_evidence() if args.mode == "replay" else live_evidence()
        emit(args.output_dir, evidence)
    except LiveConfigurationError as error:
        print(f"q_proj live configuration error: {error}", file=sys.stderr)
        return 2
    except (OSError, RuntimeError, ValueError, json.JSONDecodeError) as error:
        print(f"q_proj model lab failed: {error}", file=sys.stderr)
        return 1
    print(f"11 q_proj DaVinciOO model lab ({args.mode}): PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
