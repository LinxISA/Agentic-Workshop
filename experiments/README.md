# Offline course experiments

Eleven deterministic, dependency-free replay experiments connect the course's software, ISA, model, RTL, and verification themes. They run with Python 3 and never access the network. Experiment 11 also has an opt-in live mode that executes only local, environment-selected DaVinciOO tools.

## Quick start

```sh
cd experiments
./smoke.sh
python3 -m unittest tests/test_smoke.py -v
```

Artifacts are regenerated under `artifacts/<id>/`. To keep generated files elsewhere, run `./smoke.sh --output-dir /tmp/summer-school-artifacts`.

## Experiment map

| ID | Directory | Teaching point | Main artifact |
|---|---|---|---|
| 01 | `01_pto_tensor_trace` | PTO `TALLOC/TLOAD/TADD/TSTORE` dataflow | `pto_trace.json` |
| 02 | `02_clause_ndf_projection` | Project clauses into NDF producer-consumer edges | `ndf_projection.json`, `ndf_edges.csv` |
| 03 | `03_pycircuit_pipeline` | A three-stage pyCircuit-style pipeline | `pipeline_trace.csv` |
| 04 | `04_microarch_trace_compare` | Compare scalar and dual-issue timing while preserving state | `comparison.json` |
| 05 | `05_linxcore_queue` | A two-entry ready/valid queue with backpressure | `queue_trace.csv` |
| 06 | `06_trace_crosscheck` | Normalize and compare ELF/QEMU/hardware fixtures | `crosscheck.json` |
| 07 | `07_intentional_failure` | Recognize a deliberate bounds-invariant failure | `expected_failure.json` |
| 08 | `08_design_space_pareto` | Compute a three-objective Pareto frontier | `design_points.csv` |
| 09 | `09_roofline_bandwidth_sweep` | Separate bandwidth- and compute-limited Roofline regions | `roofline_sweep.json`, `roofline_sweep.csv` |
| 10 | `10_hierarchy_queue_sweep` | Separate locality and queue-depth effects | `hierarchy_sweep.json`, `hierarchy_sweep.csv` |
| 11 | `11_qproj_davincioo` | Replay or freshly run the Qwen3-14B `q_proj` DaVinciOO model and OFAT sensitivity sweep | `qproj_summary.json`, `qproj_sweep.json`, `qproj_timeline.csv` |

Each directory has a standalone `run.py`. The common option is:

```sh
python3 01_pto_tensor_trace/run.py --output-dir artifacts/01
```

Experiment 07 intentionally exits with status 2. The unified runner counts that expected diagnostic as a pass; an unexpected success or a different exit code is a failure.

## Reproducibility contract

- Inputs are checked-in fixtures or literal teaching vectors.
- Outputs contain no timestamps, random values, host paths, or platform-dependent ordering.
- CSV files use `\n` line endings; JSON keys are sorted.
- The test suite runs the full set twice and compares a SHA-256 digest of every artifact byte.
- Experiment 11's default artifacts are explicitly labeled `reference_replay`; live mode is opt-in and never overwrites that evidence label.
