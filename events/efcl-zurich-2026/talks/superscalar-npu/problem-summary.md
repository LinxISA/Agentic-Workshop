# Superscalar NPU: eight-problem review summary

Status: problems captured for discussion; workload/platform evidence remains pending. Stable IDs and detailed scope are maintained in the [problem list](problem-list.md). The initial NPU-P candidates are preparation context, not additional confirmed findings.

## Workload change and resource efficiency

| Stable ID | Question and boundary |
| --- | --- |
| [NPU-U-001](problem-list.md#user-described-problem-npu-u-001) | How can hybrid matrix–vector stages coordinate across shapes, granularity and data locality? Include launch/issue/synchronization overhead and low-concurrency, short-task end-to-end latency. This concerns stage handoff, not U005's internal reduction efficiency; SRAM residency belongs to U002 and cross-card orchestration to U006. |
| [NPU-U-002](problem-list.md#user-described-problem-npu-u-002) | How much physical SRAM residency/reservation is required to hide memory latency? Separate outstanding identities from payload storage. This concerns footprint and cost, not U008's guarantee of eventual completion. |
| [NPU-U-003](problem-list.md#user-described-problem-npu-u-003) | How do mixed-precision layouts and scale metadata add packing, conversion or shuffle work and affect SIMD/SIMT lane use? Exact formats and the spoken transformation term remain unresolved. |
| [NPU-U-004](problem-list.md#user-described-problem-npu-u-004) | How efficiently can a specified platform handle sparse/irregular gather/scatter and atomic updates? Algorithm names, access/update distributions and measurements remain unspecified; sparse and dense trends are hypotheses, not geographic facts. |
| [NPU-U-005](problem-list.md#user-described-problem-npu-u-005) | How do tensor width, rank and reduction axes affect internal vector/reduction throughput, lane mapping, communication and local storage? Do not assume all Transformers are vector-bound. The HPCA keynote lead does not prove this claim. |

## System orchestration, correctness and liveness

| Stable ID | Question and boundary |
| --- | --- |
| [NPU-U-006](problem-list.md#user-described-problem-npu-u-006) | Does single-threaded scalar control on the user-described platform serialize asynchronous events and compute start/end control, restricting intra-/inter-card overlap? Concurrent scalar contexts are a desired capability, not a selected hardware-thread, software-process or SMT implementation. Message paths need platform evidence. |
| [NPU-U-007](problem-list.md#user-described-problem-npu-u-007) | How do exception/state observability and programmer-managed ordering affect fault localization and correctness? Missing/misplaced barriers may fail correctness; excessive barriers may cost performance. Distinguish this from U006's orchestration throughput; specify ISA/memory-model guarantees before drawing conclusions. |
| [NPU-U-008](problem-list.md#user-described-problem-npu-u-008) | Can work eventually complete under bounded resources, late allocation and backpressure? Separate deadlock, starvation and fairness; the A/B wait cycle is hypothetical. Liveness is an obligation for our design and every comparison architecture, not a consequence guaranteed by dynamic scheduling. |

## Whole-core tradeoff and comparison discipline

Narrative order: workload variation → resource efficiency → system orchestration → correctness/liveness → whole-core tradeoff. The [architectural outline](outline.md) offers mechanisms to discuss, not selected solutions; use the [authoring checklist](slide-authoring-checklist.md) to retain these problem boundaries.

For each applicable problem, compare NVIDIA GPGPU → TPU/compiler-directed scheduling → Tenstorrent/dataflow → our superscalar NPU under matched workload, precision, resource budget and architectural level. Identify generation and software stack later; do not assume any family lacks mechanisms or that superscalar wins.

Use throughput, end-to-end task latency, utilization, storage, bandwidth, control cost and energy as applicable, with correctness and liveness as explicit evaluation requirements. The [shared whole-core ledger](problem-list.md#shared-whole-core-evaluation-dimension) also includes area, power and clock timing: account for windows, tags/state, comparisons, arbitration and recovery alongside potential reductions in waiting, SRAM reservation and data movement. Apply the same scale to all designs and distinguish measured evidence, assumptions and pending questions.

Unresolved terms/scopes: FP versus INT and scale layout; “roof rolling”; “MHC” and “ingram”; scalar execution-context semantics; exact device-memory/PCIe paths; exception semantics and ISA memory ordering. No new evidence, performance ranking or implementation decision is supplied by this review.
