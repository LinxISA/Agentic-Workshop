# Superscalar NPU: candidate problem list

Review entry: [eight-problem summary](problem-summary.md).

Current focus: problem discovery, followed by discussion and gradual evidence gathering. The three initial candidates below were proposed by the assistant; they have not been measured or individually finalized by the speaker. User-described problems are recorded separately. They are not a complete or ranked list. No solution is assigned here.

| Problem ID | Candidate symptom | Context to clarify | Possible system consequence | Status | Future evidence placeholder |
| --- | --- | --- | --- | --- | --- |
| NPU-P-001 | Compute resources are idle while work waits on dependencies, memory or bank contention. | Which workload phase waits, which resource is blocked, and whether other admissible work exists. | Reduced useful throughput or engine utilization. | Proposed; discuss the separate causes before acceptance. | A named workload trace with idle/wait attribution; not collected. |
| NPU-P-002 | Physical storage is reserved before its data becomes ready or is used. | Allocation-to-production/use interval, overlapping lifetimes and which storage pool is constrained. | Less capacity available for other live work; possible admission waiting. | Proposed; distinguish required residency from avoidable reservation. | A logical/physical lifetime and occupancy trace; not collected. |
| NPU-P-003 | Latency variation disrupts a static schedule and propagates stalls. | Expected versus actual latency, dependency propagation and the workload's predictability. | Lost overlap or longer completion time. | Proposed; scope and impact remain to be discussed. | Matched timing observations under stated latency conditions; not collected. |

## User-described problem: NPU-U-001

**Hybrid matrix–vector pipeline coordination and shape-dependent scheduling**

- **Origin / status:** User-described candidate; evidence and detailed scope remain to be established. This is distinct from the three assistant-proposed candidates above.
- **Scenario:** Attention alternates Matrix → Vector → Matrix → Vector activities. High-throughput low-precision matrix production must feed intermediate data into finer-grained reduction, local maximum and softmax work, then coordinate the following matrix stage.
- **Low-concurrency scenario (accepted for problem outline; evidence pending):** Small batches, short sequences or few independent tasks may offer too little parallel work to hide launch, data preparation, synchronization and critical dependency waits. Fine-grained scheduling overhead may then become prominent in end-to-end task latency. Cross-card synchronization relates to NPU-U-006; this does not characterize every decode workload.
- **Trigger:** Producer/consumer throughput, work granularity and dependencies do not align; a changed shape may alter the useful tile geometry and schedule.
- **Symptom:** Programming and coordinating the pipeline becomes difficult. Intermediate bandwidth, on-chip data movement, locality and data availability must align with consumption. Finer-grained Matrix/Vector overlap also incurs task launch, issue and synchronization overhead; the user is concerned about repeated compiler rescheduling as shapes change.
- **Possible consequence:** Lost overlap or utilization, data-movement and coordination overhead, buffering pressure and increased scheduling/programming effort. SRAM residency and reservation cost are covered in NPU-U-002 rather than counted again here. This is not classified simply as a memory-access problem.
- **Scope boundary:** NPU and Tenstorrent/dataflow implementations may be relevant, but this record does not establish that every architecture is affected or that every shape change requires recompilation. No particular shape, precision or numerical result is assumed.
- **Future evidence placeholder:** A specified Attention decomposition; producer/consumer timing, intermediate bandwidth, on-chip data movement and locality; fine-grained task launch/issue/synchronization costs; matched shape/tile/schedule variants; and a record of which changes require recompilation versus runtime configuration. Not collected.

Record the problem first. Architecture-by-architecture comparison and mechanism selection come later; no superscalar solution is assigned here.

## User-described problem: NPU-U-002

**Latency hiding versus on-chip SRAM reservation footprint**

- **Origin / status:** Second user-described candidate; evidence and workload scope remain to be established. Related to assistant candidate NPU-P-002, with an explicit latency-hiding and SRAM-cost context; retain this separate user ID rather than counting the overlap as an independent finding.
- **Scenario:** Long, variable memory latency or a deeper hierarchy motivates more outstanding requests to hide bubbles and sustain useful throughput.
- **Trigger:** In the scenario under discussion, a pipeline reserves physical payload SRAM early for those operations, potentially long before the payload arrives or is consumed.
- **Symptom:** Request concurrency and payload reservation become coupled, lengthening physical occupancy and increasing the reserved footprint.
- **Possible consequence:** Greater on-chip SRAM capacity, area, energy or occupancy time may be needed to sustain overlap; limited capacity can constrain admission and throughput.
- **Scope boundary:** Outstanding request identity/concurrency and physical payload residency are different quantities. Buffer demand depends on bandwidth, latency, live data and variation. HBM capacity growth and additional hierarchy levels are user-raised trend hypotheses; increased capacity does not by itself establish increased latency.
- **Direction to compare later:** Dynamic, fine-grained allocation and management is a proposed comparison direction, not an established advantage or selected solution. Do not expand a solution in this problem record.
- **Future evidence placeholder:** A named workload's request concurrency, payload arrival/use times, SRAM reservation/occupancy trace, memory-latency distribution and matched resource-cost comparison. No numerical result is assumed; evidence is not collected.

## User-described problem: NPU-U-003

**Mixed-precision quantization data-layout overhead and SIMD/SIMT utilization**

- **Origin / status:** Third user-described candidate; format, workload and evidence remain to be clarified.
- **Scenario:** A workload moves between 32-bit and 8/4-bit representations, including scale metadata, while computation uses fixed vector/lane widths.
- **Trigger:** Representation widths and mixed-format layout do not naturally match the execution width or operand organization.
- **Symptom:** The compiler may need packing, unpacking, shuffling and other data-organization transformations. These can complicate efficient lane use and add work beyond useful arithmetic.
- **Possible consequence:** Conversion/layout overhead and reduced effective arithmetic utilization may affect throughput, bandwidth or programming/compiler effort in the relevant workload.
- **Clarification needed:** The spoken format names do not yet establish FP versus INT. Scale granularity, storage and algorithm are unspecified. The spoken transformation name “roof rolling” is unclear; loop unrolling is only a possible interpretation, not a confirmed requirement.
- **Scope boundary:** This is a candidate issue for specified formats and workloads, not a claim that all SIMD/SIMT execution is inefficient. No representation-specific behavior or numerical loss is assumed, and no solution is selected.
- **Future evidence placeholder:** Exact representation and scale layout, target vector/lane width, an annotated workload/compiler transformation sequence, useful arithmetic versus layout/conversion work, and measured utilization under a named configuration. Not collected.

## User-described problem: NPU-U-004

**Sparse/irregular workload memory access and atomic-reduction efficiency**

- **Origin / status:** Fourth user-described candidate. The user raises sparse/irregular and compute-heavy/dense workloads as two possible evolution directions; both remain hypotheses awaiting evidence.
- **Scenario:** Data-dependent sparse indices drive gather/scatter, histogram-style accumulation and atomic add/max/min operations. The user cites DeepSeek and top-k as examples to scope later.
- **Trigger:** Irregular address patterns and updates to shared destinations may not align with the execution and memory behavior of a given NPU.
- **Symptom:** The user reports efficiency loss in existing NPU execution, without identifying the product, exact algorithm, configuration or measurement. Treat this as a reported concern awaiting evidence.
- **Possible consequence:** Irregular access and atomic-reduction overhead may reduce useful throughput or memory efficiency in the specified workload; contention and update distribution need to be characterized.
- **Clarification needed:** The spoken names “MHC” and “ingram” remain unconfirmed. Do not classify them as sparse-attention mechanisms without clarification. Greater sparsity is a trend hypothesis, not a conclusion about every LLM or all Chinese LLMs.
- **Scope boundary:** No universal claim about NPU inefficiency, quantitative loss or selected solution is made. Sparse attention, other irregular operations and atomic reductions should be distinguished when the workload is clarified.
- **Future evidence placeholder:** Confirmed algorithm/model names, sparse-index and destination-update distributions, gather/scatter and atomic semantics, named NPU/configuration, and workload-specific timing/throughput or memory-efficiency measurements. Not collected.

## User-described problem: NPU-U-005

**Vector/reduction bottlenecks across tensor shapes and axes**

- **Origin / status:** Fifth user-described candidate; specific workloads, shapes and profiling evidence remain to be established.
- **Scenario:** Transformer matrix stages can be followed by substantial reduction work. Effective vector throughput may become a bottleneck in a particular workload, depending on its operation mix and tensor organization.
- **Trigger:** Wide versus narrow tensors, different tensor ranks and reduction axes change lane mapping, cross-lane communication, local-storage organization and data-movement requirements.
- **Symptom:** Vector/reduction execution may spend substantial work or time on communication, rearrangement and movement, or use lanes unevenly, limiting effective throughput. SIMD and SIMT implementations both need to handle these shape- and axis-dependent requirements.
- **Possible consequence:** Reduced useful vector/reduction throughput and longer completion time may constrain the surrounding pipeline under the specified workload and configuration.
- **Scope boundary:** Unlike NPU-U-001, which concerns coordination between matrix and vector pipeline stages, this candidate focuses on efficiency within vector/reduction execution. It does not establish that all Transformers are vector-bound or that every vector bottleneck is caused by reduction. No measured loss, architectural winner or solution is assigned.
- **Future evidence placeholder:** Named Transformer workload and operation mix; tensor shapes, ranks and reduction axes; precision and execution configuration; profiling that separates useful reduction work, lane utilization, cross-lane communication, local-storage access and data movement. Not collected.
- **Reference lead (unconfirmed attribution):** Cliff Young, ‘ML Engineering in the Giant Model Age’, HPCA 2025 plenary keynote (not a paper), 5 March 2025: [official program](https://hpca-conf.org/2025/main-program/). The official program verifies the speaker, title and matrix-multiplication/attention systems topic, but no original slides or video verifying the specific vector/reduction bottleneck claim were found. Do not cite this abstract as proof of NPU-U-005; supporting evidence remains pending.

## User-described problem: NPU-U-006

**Single-threaded scalar control as a bottleneck for asynchronous compute–communication orchestration**

- **Origin / status:** User-described / Problem captured; hardware-specific evidence pending. The target hardware is unspecified; the user describes its scalar control as single-threaded.
- **Scenario:** Multiple cores within one card coordinate operator/workload partitioning and scheduling, while execution across cards also requires collective communication. Asynchronous, message-driven compute–communication orchestration requires scalar handling of events, control flow and atomics.
- **Trigger:** On the user-described platform, single-threaded scalar execution must serve both asynchronous events and the current compute operation's start/end control.
- **Symptom:** Event handling and compute control may contend or serialize, limiting asynchronous response and compute–communication overlap. Message paths involving device memory or PCIe may add latency and coordination overhead that needs to be characterized.
- **Possible consequence:** Scalar orchestration may constrain overlap or interfere with compute throughput under the specified workload and configuration. No quantitative impact is established.
- **Desired capability / clarification:** Independent, concurrent scalar execution contexts should handle multiple events and asynchronous work while maintaining compute throughput. The user's spoken “multiple processes” is recorded as desired concurrent scalar execution contexts; hardware threads versus software processes remain unspecified. No particular SMT or OS-process implementation is selected.
- **Scope boundary:** This is a hardware-specific reported concern, not a claim that all NPUs have single-threaded scalar control or that every message traverses PCIe. Exact scalar execution semantics, intra-/inter-card message and collective paths, device-memory/PCIe involvement and measured performance remain to be established. No complete solution or architectural conclusion is assigned.
- **Future evidence placeholder:** Named platform/topology and scalar execution model; compute start/end control responsibilities; event concurrency and handling timelines; intra-/inter-card collective and message paths; device-memory/PCIe involvement where applicable; and measured scalar/control/atomic overhead, asynchronous response, compute–communication overlap and compute-throughput interference. Not collected.

## User-described problem: NPU-U-007

**Debuggability and memory-order management under asynchronous parallel execution**

- **Origin / status:** User-described / Problem captured; platform-specific evidence pending. The execution system, ISA and memory model remain unspecified.
- **Scenario:** Matrix, vector, memory and communication activities run in parallel, including compute–communication overlap across cards.
- **Trigger:** The user-described system lacks precise exceptions; required load/store ordering in its asynchronous execution model also relies on programmer-supplied barriers or synchronization.
- **Symptom — debugging:** A software error can be difficult to associate with a particular instruction and a consistent execution state. This can reduce developer efficiency and limit an Agent's diagnostic ability; it does not imply that an Agent cannot perform any debugging.
- **Symptom — ordering:** Missing or misplaced synchronization may violate required ordering and cause incorrect execution. Excessive or overly broad synchronization may restrict parallelism and reduce performance.
- **Possible consequence:** Harder fault localization and correctness validation, greater programmer responsibility for ordering, and a correctness/performance tradeoff when placing synchronization.
- **Scope boundary:** Unlike NPU-U-006, which focuses on scalar orchestration and throughput, this candidate concerns correctness, debugging and memory ordering. It does not claim that all hardware lacks precise exceptions or guarantees no ordering. Exact exception semantics, hardware ordering guarantees and programmer obligations require a named ISA/memory model and evidence.
- **Future evidence placeholder:** Named platform/ISA and exception semantics; an error-localization example with available instruction/state observations; documented load/store ordering and synchronization requirements; and examples of missing, misplaced or overly broad barriers with correctness and performance observations. Not collected. No particular new mechanism or implementation is selected.

## User-described problem: NPU-U-008

**Forward progress under bounded resources, late allocation, and backpressure**

- **Origin / status:** User-approved discussion problem / Problem captured; evidence pending. No measured failure is established.
- **Scenario:** Concurrent work shares bounded storage, queues and other resources, with late allocation and backpressure affecting admission and execution.
- **Trigger:** Resource ownership and dependency waits may form a cycle; arbitration may also defer some work indefinitely or unfairly.
- **Symptom:** Work may deadlock or starve instead of eventually completing. Conceptual example only: one task holds resource A while waiting for B, and another holds B while waiting for A. This hypothetical cycle is not a reported or measured bug.
- **Possible consequence:** Execution may fail to make forward progress despite individual operations being valid; unfair arbitration may prevent particular tasks from completing.
- **Scope boundary:** Unlike NPU-U-002's storage/residency cost and NPU-U-006's orchestration throughput, this candidate asks whether admitted work can ultimately complete. Deadlock, starvation and unfairness require separate characterization under stated resource and scheduling assumptions. No specific platform defect or fix is asserted.
- **Fairness across architectures:** Forward progress is a design obligation for our superscalar NPU and all compared architectures; dynamic scheduling alone does not guarantee liveness, and improved resource utilization must account for admission, reservation, resource ordering, and fairness costs.
- **Future evidence placeholder:** Resource/dependency wait graphs, resource ownership and capacity, credit/reservation/admission rules, backpressure propagation, arbitration/fairness assumptions and completion observations. Not collected; no fix is designed here.

## Parallel workload-trend hypotheses

The user describes two possible directions to consider together:

- **Sparse / irregular:** Data-dependent indexed gather/scatter and atomic updates or reductions; this is the context of NPU-U-004.
- **Compute-heavy / dense:** Greater compute demand with long bursts of bulk memory traffic. This is workload background, not a newly established efficiency problem.

Both directions are user hypotheses requiring workload evidence. The user's geographic examples are speculative and do not establish a country-based division of model behavior. A workload may combine features of both directions.

Future discussion: how should an architecture cover both irregular fine-grained activity and dense bulk compute/data movement? No mechanism or winner is selected here. This background does not create an additional problem ID; NPU-U-005 separately records the user-described vector/reduction efficiency concern.

## Shared whole-core evaluation dimension

**Accepted for problem outline; evidence pending.** Across NPU-U-001–NPU-U-008, account for the area, energy and clock-timing costs of dynamic-control windows, tags/state, comparisons, arbitration and recovery alongside potential reductions in waiting, SRAM reservation and data movement. The final whole-core ledger must include throughput, end-to-end task latency, area, power, energy, storage and timing under stated conditions. Apply the same scale to our superscalar NPU and all compared architectures without presuming a winner; distinguish measurements from assumptions and pending evidence. This is a shared evaluation dimension, not a ninth problem.

## Next discussion

Clarify one candidate at a time: what is observable, when it matters, and what observation could confirm or refute it. Refine, split or reject candidates before selecting mechanisms. Do not infer a measured result, prevalence or numerical benefit from this list.

The [talk outline](outline.md) retains the broader problem → mechanism → benefit → tradeoff organization; its mechanisms are architectural possibilities, not solutions already selected for these candidates. Use the [authoring checklist](slide-authoring-checklist.md) later, once the problem scope is agreed.

## Comparison scope

The discussion compares three architectural families:

- **NVIDIA GPGPU:** system-level scheduling and resource management, including the compiler/runtime/hardware division of responsibility and dynamic scheduling.
- **TPU / compiler-directed static scheduling:** placement and scheduling decisions across the compiler and hardware execution model. Select a particular generation and mechanisms later.
- **Tenstorrent / dataflow architectures:** dataflow execution, scheduling and resource management across hardware and software. Select generation, software stack and mechanisms later; do not assume a purely static design or absence of dynamic mechanisms.

For each candidate problem, the applicable comparison group remains to be confirmed. Compare matched workload, numerical precision, resource budget and architectural level. No model selection, performance ranking or evidence collection is implied by recording this scope.

## Fair mechanism comparison template

For each agreed problem and the same context, discuss in order **NVIDIA GPGPU → TPU / compiler-directed scheduling → Tenstorrent / dataflow → our superscalar NPU**. Do not treat other architectures as having no solution or presume our design wins.

| Architecture | Mechanism for this problem | Applicable conditions | Advantage | Cost / tradeoff / limitation | Evidence status |
| --- | --- | --- | --- | --- | --- |
| NVIDIA GPGPU | To research | To establish | To establish | To establish | Pending |
| TPU / compiler-directed | To research | To establish | To establish | To establish | Pending |
| Tenstorrent / dataflow | To research | To establish | To establish | To establish | Pending |
| Our superscalar NPU | Candidate mechanism to scope | To establish | Hypothesis to assess | To establish | Pending |

Later evidence must name product/generation, compiler/runtime/configuration, workload/shape, precision, resource budget and comparison level. Quantitative comparisons require matched conditions. Select relevant metrics among throughput, utilization, latency, storage, bandwidth, control cost and energy, with explicit correctness and liveness requirements; do not force every metric onto every problem. Label public evidence, author assumptions and pending research separately. Unknown mechanisms remain unknown. This template supplies no product findings or ranking.
