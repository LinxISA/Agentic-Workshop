# NPU talk: slide-authoring checklist

Use the [eight-problem summary](problem-summary.md) to preserve scope and boundaries. Follow the [architectural outline](outline.md), keeping the question → mechanism → benefit → tradeoff structure and takeaway for every section. No fixed slide count or duration is implied.

- [ ] Keep the sequence: disturbed schedule → FlashAttention overlap → bounded ready selection → narrow control/wide data → logical/physical lifetime → prefetch/buffering → complete-core ledger.
- [ ] Build conceptual figures first; use accurate labels and explicit assumptions. Carry one coherent workload through dependency, resource and lifetime views.
- [ ] Later retrieve matched traces and measurements for the benefits actually claimed. Record workload/shape/precision, baseline, configuration and source identity.
- [ ] Distinguish causal architectural arguments from measured outcomes. Do not reuse article percentages as chart data without adequate evidence; separate host simulation speed from hardware performance and physical PPA.
- [ ] Use approved code snippets only as optional mechanism support. Keep default configurations and implementation-review details in preparation notes, not the talk.
- [ ] Preserve meaningful costs: selection complexity, storage/bandwidth, metadata, fairness, backpressure, recovery and forward progress.
- [ ] Confirm disclosure scope before including local system material. Missing material stays a placeholder; no fabricated output or experiment.
- [ ] Later create the independent NPU Beamer deck, compile and render it, and inspect figure/code legibility, clipping, citations and speaker notes. Do not fold it into the PyCircuit deck.

Source entry: [article source note](../../sources/superscalar-npu.md); shared production context: [LaTeX layout](../../notes/latex-source-layout.md); [two-talk index](../README.md).

## Fair comparison research handoff

- [ ] For the same agreed problem/context, explain NVIDIA GPGPU → TPU / compiler-directed → Tenstorrent / dataflow → our superscalar NPU, using the [comparison template](problem-list.md#fair-mechanism-comparison-template).
- [ ] Record each mechanism, applicable conditions, advantage and cost/tradeoff/limitation. Do not presume a winner or portray alternatives as lacking solutions.
- [ ] Later name concrete products/generations, compiler/runtime/configuration, workload/shape, precision, resource budget and level. Quantify only comparable conditions.
- [ ] Choose applicable throughput, utilization, latency, storage, bandwidth, control-cost and energy metrics, with explicit correctness and liveness requirements. Keep public evidence, author assumptions and pending research distinct; do not fill unknowns by inference.

This handoff requests later mechanism research; it contains no newly collected product evidence or performance verdict.

- [ ] Include the accepted U001 low-concurrency/short-task scenario: launch, data preparation, synchronization, critical dependency waits and fine-grained scheduling overhead in end-to-end latency; relate cross-card synchronization to U006 without generalizing all decode workloads. Evidence remains pending.
- [ ] Apply the [shared whole-core evaluation dimension](problem-list.md#shared-whole-core-evaluation-dimension) across U001–U008: dynamic-control window/tag/state/comparison/arbitration/recovery costs versus reduced waiting, SRAM reservation and data movement; ledger throughput, task latency, area, power, energy, storage and timing. Use the same scale for our design and alternatives, with measurements and assumptions labeled separately. Accepted for problem outline; evidence pending.
