# Qwen3-14B q_proj DaVinciOO model lab

The default command is a fully offline replay of checked reference evidence:

```sh
python3 run.py --output-dir ../artifacts/11
```

It emits deterministic JSON/CSV plus a compact JSONL trace sample. Every replay artifact is labeled `reference_replay`; the fixture derives from DaVinciOO's checked Qwen3-14B decode-layer trace, sequence IDs 573 through 1134, and the current `model/scripts/README.md` q_proj baseline. Each representative trace record preserves the source `input_tiles`, `output_tiles`, and `scalar_inputs` arrays, including address, shape, layout, and dtype. There is intentionally no invented `deps` array: `dependency_note` states that DaVinciOO derives dependencies through rename/scoreboard state. Sweep points change one factor at a time and are sensitivity evidence only, not proof of architectural equivalence.

## Live modes

All local paths come from environment variables and are never written into output artifacts.

Re-simulate an existing q_proj trace:

```sh
export DAVINCIOO_ROOT=/path/to/DavinciOO
export QPROJ_TRACE=/path/to/q_proj.pto.trace
export QPROJ_GFSIM=/path/to/gfsim
python3 run.py --mode live --output-dir /tmp/qproj-live
```

Capture from PTO and then simulate:

```sh
export DAVINCIOO_ROOT=/path/to/DavinciOO
export QPROJ_PTO=/path/to/q_proj.pto
export QPROJ_WORKSPACE=/tmp/qproj-flow
export QPROJ_GFSIM=/path/to/gfsim
export PTOAS=/path/to/ptoas
export PTO_ISA=/path/to/pto-isa
python3 run.py --mode live --output-dir /tmp/qproj-live
```

`QPROJ_GFSIM` may be omitted when the binary is at `$DAVINCIOO_ROOT/build/model/gfsim`. `PTOAS` and `PTO_ISA` are passed to the DaVinciOO flow only when set.

## Sweep contract

The one-factor-at-a-time points cover:

- ROB entries: 16, 32, 64 baseline, and 128
- tile tags: 32, 128, and 4096 baseline
- TMA bandwidth: 256, 512 baseline, and 1024 bytes/cycle
- Cube BF16 throughput: 2048, 4096 baseline, and 8192 MACs/cycle
- engine count: one baseline versus two Cube engines and two TMA engines

Cycle changes are reported as bottleneck signals. A flat point is reported only as “no material change” for this trace/configuration.
