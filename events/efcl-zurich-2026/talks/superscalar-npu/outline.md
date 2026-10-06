# Superscalar NPU core design

Independent EFCL talk alongside [PyCircuit/NDF](../pycircuit/README.md). This is an architectural outline, with no assigned duration or slide count.

Current preparation priority: [discuss the candidate problem list](problem-list.md) before selecting mechanisms or gathering evidence. Use the [reviewed eight-problem summary](problem-summary.md) for scope and boundaries. The architectural narrative below remains a working outline; its mechanisms are possibilities, not selected solutions.

## Thesis

Working hypothesis: bounded dynamic control can reduce resource waiting by matching ready work to available execution and storage resources. Judge the benefit across the complete core: useful throughput and utilization versus storage, control and physical implementation cost. Static scheduling remains valuable where its assumptions hold.

## Comparison background

The three comparison families are NVIDIA GPGPU, TPU / compiler-directed static scheduling, and Tenstorrent / dataflow architectures. Select specific generations, software stacks and scheduling mechanisms later. Do not assume Tenstorrent is purely static or lacks dynamic mechanisms. For each problem, choose the comparison group and match workload, precision, resource budget and architectural level. See the [recorded scope](problem-list.md#comparison-scope); no performance ranking is asserted.

For each agreed problem/context, compare NVIDIA GPGPU, TPU / compiler-directed scheduling, Tenstorrent / dataflow and our superscalar NPU in that order. Explain each mechanism, applicable conditions, advantages and costs/limitations before drawing any conclusion. Other architectures have solutions; our advantage is a hypothesis to examine, not the premise. Use the [fair comparison template](problem-list.md#fair-mechanism-comparison-template).

## Narrative

### 1. A static schedule meets variable conditions

- **Problem:** Latency variation, bank conflicts and occupied resources disturb a schedule based on expected timing.
- **Mechanism:** Expose dependencies and resource availability so admissible work can advance when conditions change.
- **Benefit:** Reduce avoidable waiting rather than simply increasing the nominal issue rate.
- **Tradeoff / conditions:** Dynamic selection adds control; predictable, regular workloads may fit static scheduling well.
- **Takeaway:** Schedule quality depends on actual readiness, not only expected latency.
- **Figure / later evidence:** Contrast an ideal timeline with a disturbed one; later obtain a named workload's stall/resource traces. Label illustrative timing assumptions.

### 2. FlashAttention reveals useful fine-grained overlap

- **Problem:** Coarse execution boundaries can serialize activities that have independent portions.
- **Mechanism:** Decompose FlashAttention into smaller dependent activities and overlap compute, data movement and intermediate processing where dependencies permit.
- **Benefit:** Keep engines productive while other operations wait.
- **Tradeoff / conditions:** More overlap increases intermediate lifetimes and demands careful ordering, buffering and numerical equivalence. Small batches, short sequences or few independent tasks may expose launch, data preparation, synchronization and critical dependency waits in end-to-end latency; fine-grained scheduling overhead also matters. This accepted workload scenario has evidence pending and does not generalize to all decode. See [U001](problem-list.md#user-described-problem-npu-u-001), with cross-card synchronization in [U006](problem-list.md#user-described-problem-npu-u-006).
- **Takeaway:** Fine-grained dependency visibility creates scheduling opportunity.
- **Figure / later evidence:** A workload swimlane with dependency edges; later select real decomposition and comparative traces with matching shapes and numerical requirements.

### 3. A bounded ready window matches work to resources

- **Problem:** A blocked candidate can leave usable execution capacity idle.
- **Mechanism:** Select ready work within a bounded Issue Window, respecting age/order requirements and bank/resource availability. An Age Matrix is a conceptual age-selection structure, not the central argument.
- **Benefit:** Exploit available overlap while limiting the amount of scheduling state.
- **Tradeoff / conditions:** Window size, selection complexity, fairness and resource checks cost area and timing; lookahead cannot remove true dependencies or insufficient capacity.
- **Takeaway:** Dynamic scheduling is valuable when its bounded choices remove real stalls.
- **Figure / later evidence:** Ready candidates, blocked banks and selected grants; later compare wait attribution and throughput under stated window/resource assumptions.

### 4. Narrow control governs wide Tile data

- **Problem:** Scheduling decisions over wide payloads can be expensive if control and movement are conflated.
- **Mechanism:** Carry small tags and dependency metadata through control while wide Tile data moves through the data path.
- **Benefit:** Manage large computations with a narrower control representation and separately provisioned data bandwidth.
- **Tradeoff / conditions:** Tags need identity, lifetime and recovery discipline; metadata, lookup and bank interfaces still consume resources.
- **Takeaway:** The scheduler reasons about data identity, not the entire payload.
- **Figure / later evidence:** Parallel tag/control and Tile/data paths; later obtain an approved architecture illustration or resource accounting. Code is optional corroboration.

### 5. Separate logical lifetime from physical residency

- **Problem:** Storage reserved before it is needed, or retained beyond its last safe use, reduces capacity available to other work.
- **Mechanism:** Use VirtualTag logical identity, late physical allocation and release after the last consumer is safely finished.
- **Benefit:** Shorten physical residency and potentially support a larger logical working set with less physical storage.
- **Tradeoff / conditions:** Allocation backpressure, aliasing, recovery and delayed messages constrain safe binding/release. Capacity reduction depends on overlapping lifetimes, not a universal virtual-to-physical ratio.
- **Takeaway:** Reduce unnecessary residency while preserving dependency identity.
- **Figure / later evidence:** Logical identity spanning a shorter physical interval; later obtain lifetime/occupancy traces. Capacity sketches must state their assumptions.

### 6. Prefetch hides the mean; buffering absorbs variation

- **Problem:** A demand request pays predictable delay, while latency jitter disrupts otherwise useful overlap.
- **Mechanism:** Prefetch toward the expected use point and buffer the returned data, coordinated with resource admission.
- **Benefit:** Move predictable waiting off the critical path and tolerate bounded timing variation.
- **Tradeoff / conditions:** Distance and buffers consume capacity/bandwidth; excessive speculation can obstruct demand work. Forward progress and backpressure require explicit design.
- **Takeaway:** Prefetch timing and buffer capacity are one resource-management problem.
- **Figure / later evidence:** Demand, prefetch arrival distribution and buffer occupancy; later select real latency/occupancy evidence or label the sketch illustrative.

### 7. Close the complete-core resource ledger

- **Problem:** A local utilization improvement can shift the bottleneck or increase total cost.
- **Mechanism:** Use a matched whole-core ledger covering throughput, end-to-end task latency, utilization, storage, bandwidth, control cost, area, power, energy and clock timing, with correctness and liveness requirements. Account for windows, tags/state, comparisons, arbitration and recovery alongside saved waiting, SRAM reservation and data movement. This [shared evaluation dimension](problem-list.md#shared-whole-core-evaluation-dimension) is accepted for the problem outline; evidence remains pending.
- **Benefit:** Identify whether dynamic control buys a better system tradeoff rather than a more attractive isolated metric.
- **Tradeoff / conditions:** Shape, precision, workload mix, baseline and implementation technology affect the result. Host-model speed is separate from hardware performance.
- **Takeaway:** Count saved waiting and storage together with the control that enables them.
- **Figure / later evidence:** A complete-core ledger or matched comparison; use performance/PPA charts only when the underlying evidence is established. Apply the same scale to our design and all comparison architectures without assuming a winner; separate measurements from assumptions.

Source entry throughout: [article provenance and quantitative boundaries](../../sources/superscalar-npu.md). Optional system background: [authorized local SSM reference](../../sources/pycircuit-reference-entries.md#ssm-contracts-and-hierarchy). Code illustrates a mechanism only when approved and useful; it is not the narrative spine.

## Later authoring instructions

Use the [NPU authoring checklist](slide-authoring-checklist.md). Select a coherent workload and retain its dependency/lifetime story across figures. Retrieve approved architecture diagrams, traces and measurements before adding quantitative comparisons; accurately cite sources and version/configuration. Do not chart the article's approximately 5% performance or 95% MFU claims without adequate baseline and measurement evidence. Label capacity and latency examples as assumptions. Do not turn default flags, current implementation status or code-review findings into talk content.

Later comparison research must identify generation/product, compiler/runtime/configuration, workload/shape, precision, resource budget and architectural level. Use matched conditions for quantitative claims and relevant throughput, utilization, latency, storage, bandwidth, control-cost or energy metrics. Distinguish public evidence, author assumptions and pending questions; do not infer unknown mechanisms.

## Open discussion

When does dynamic control repay its cost? How can late allocation preserve forward progress? What establishes safe last-consumer release under aliasing and recovery? How should prefetch yield to demand and backpressure? Discuss tradeoffs without claiming universal superiority or already solved mechanisms.
