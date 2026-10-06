from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path
from typing import Any, Iterable


ROOT = Path(__file__).resolve().parent


def output_dir(experiment_id: str, description: str) -> Path:
    parser = argparse.ArgumentParser(description=description)
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=ROOT / "artifacts" / experiment_id,
        help="artifact directory (default: experiments/artifacts/<id>)",
    )
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    return args.output_dir


def write_json(path: Path, value: Any) -> None:
    path.write_text(json.dumps(value, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def write_csv(path: Path, fieldnames: list[str], rows: Iterable[dict[str, Any]]) -> None:
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)
