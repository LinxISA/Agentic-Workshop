#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from common import output_dir, write_csv, write_json


def main() -> int:
    out = output_dir("05", "Exercise a two-entry LinxCore-style ready/valid queue")
    sent = [3, 5, 8, 13]
    ready_pattern = [True, False, False, True, True, False, True, True]
    queue: list[int] = []
    received: list[int] = []
    next_item = 0
    rows = []
    backpressure = 0
    cycle = 0
    while len(received) < len(sent):
        ready = ready_pattern[cycle % len(ready_pattern)]
        before = list(queue)
        popped = queue.pop(0) if ready and queue else None
        if popped is not None:
            received.append(popped)
        pushed = None
        if next_item < len(sent) and len(queue) < 2:
            pushed = sent[next_item]
            queue.append(pushed)
            next_item += 1
        elif next_item < len(sent):
            backpressure += 1
        rows.append(
            {
                "cycle": cycle,
                "consumer_ready": str(ready).lower(),
                "queue_before": str(before),
                "pushed": "-" if pushed is None else pushed,
                "popped": "-" if popped is None else popped,
                "queue_after": str(queue),
            }
        )
        cycle += 1
    write_csv(out / "queue_trace.csv", ["cycle", "consumer_ready", "queue_before", "pushed", "popped", "queue_after"], rows)
    write_json(out / "queue_summary.json", {"sent": sent, "received": received, "cycles": cycle, "backpressure_cycles": backpressure})
    print("05 LinxCore ready/valid queue: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
