# Functional control-logic inventory across six architectures

Review date: 6 October 2026. This inventory names functional mechanisms, not area, size or performance. **H** denotes hardware or hardware-model control; **S** denotes compiler/kernel/runtime bookkeeping. A function does not necessarily correspond to one distinct physical block. Missing public microarchitecture details are **not publicly specified**, not assumed absent. See the [U001 comparison](U001-comparison.md).

## Our superscalar NPU — inspected model scope

The following is TimingSim evidence; the separate Davo/PyCircuit typed bring-up path must not be merged into one claimed implementation. Local source mappings are excluded.

| Control function | Mechanisms / responsibility |
| --- | --- |
| Instruction / control flow | H-model: scalar front-end sequencing and ROB control; block command sequencing and chain-order gates. S: operation decomposition and explicit program control. |
| Dependency / readiness | H-model: renamed operand/tag mappings, whole-tile readiness, conditional cell readiness and vector scoreboard. |
| Issue / select | H-model: bounded CUBE/VEC and other block issue queues, candidate readiness/resource checks, per-class vector issue and conditional bypass; cell-mode vector block entry retains an ordering constraint. No verified AgeMatrix claim. |
| Allocation / ownership | H-model: logical tags/generations, mapping state, physical binding, buffer/ACC admission and ownership/release checks. |
| Data movement | H-model: local-storage request queues, bank/port arbitration, DMA/load-store paths and some CUBE/VEC bank reservations. S: tile layout and movement choices. |
| Sync / completion / recovery | H-model: producer wakeups, group readiness joins, scalar/block completion and retirement, non-flush gates and recovery controls. S: required program dependencies/synchronization. |
| Distributed control | Intra-core/group coordination is visible; a complete cross-card control implementation is not established by this inspection. |

Davo/PyCircuit separately contains typed ROB identity/binding/completion/recovery and rename/map publication contracts. Their existence is not proof of the same physical organization, complete-core integration or mapped hardware as TimingSim.

## Public-source architecture inventory

| Function | NVIDIA Hopper | Ascend 910B / Atlas A2 | TPU / Pallas |
| --- | --- | --- | --- |
| Instruction / control flow | H: resident warp state, eligible-warp selection and SIMT participation/divergence/reconvergence control; Volta+ independent thread scheduling retains per-thread PC/call-stack execution state and regroups participating threads. S: kernel control flow. | H/API-visible: scalar control and Cube/Vector pipeline sequencing, with separate AIC/AIV work modes. S: host tiling and kernel control. | H/API-visible: scalar control and MXU/VPU execution sequencing. S: compiler/kernel schedule. |
| Dependency / readiness | H: scoreboard/dependency tracking and resource/readiness gating; exact circuit topology not publicly specified. S: producer/consumer pipeline state. | S/API: explicit pipeline dependencies and events; internal dependency structures not publicly specified. | S/API: scheduled dependencies, buffer state and semaphore waits; internal dependency structures not publicly specified. |
| Issue / select | H: eligible-warp selection with in-order instruction issue within a warp, plus asynchronous matrix execution. S: warp specialization and software pipeline. This is not CPU-style speculative OoO. | H: pipe execution/control. S: partitioning and launch of Cube/Vector work; internal selection policy not publicly specified. | H: engine execution control. S: compiler schedules work; runtime indexing where supported. Internal issue queues not publicly specified. |
| Allocation / ownership | S/H: register/shared-memory use, pipeline-stage ownership and async-operation lifetime. | S/API: UB/L1/L0 buffers, TPipe/TQue ownership and DoubleBuffer bookkeeping. | S/API: VMEM buffers, multibuffering and semaphore ownership. |
| Data movement | H: TMA and load/store execution. S: descriptors, layouts and staging. | H/API: DMA/copy pipelines and generation-specific exchange paths. S: tiling and staged transfers. | H/API: DMA engines. S: transfer schedules and layout. |
| Sync / events / barriers | H/API: barriers and asynchronous completion mechanisms. S: synchronization scope and arrival/wait placement. | H/API: pipe events and cross-core synchronization. S: correct queue/event ordering. | H/API: DMA completion/semaphores. S: pipeline synchronization. |
| Completion / retirement / recovery | Async completion is exposed; CPU-style ROB/rename/retirement/recovery organization is not publicly specified. | API-visible completion/events; CPU-style ROB/rename/recovery organization is not publicly specified. | API-visible completion/semaphore behavior; CPU-style ROB/rename/recovery organization is not publicly specified. |
| Distributed control | Runtime/kernel coordination and platform communication; complete distributed-control inventory outside this U001 scope. | S/API: multi-core and cross-card orchestration; paths/platform must be specified. | S/compiler/runtime: distributed execution/communication; generation-specific internals outside this scope. |

Sources: NVIDIA [scheduler statistics / scoreboard and barrier stalls](https://docs.nvidia.com/nsight-compute/ProfilingGuide/#scheduler-statistics), [thread execution state](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/advanced-kernel-programming.html#hardware-implementation), [SIMT participation and reconvergence](https://docs.nvidia.com/cuda/cuda-programming-guide/03-advanced/advanced-kernel-programming.html#simt-execution-model), [Hopper guide](https://docs.nvidia.com/cuda/hopper-tuning-guide/), [PTX](https://docs.nvidia.com/cuda/parallel-thread-execution/), [FlashAttention-3](https://arxiv.org/html/2407.08608v2); Ascend [work modes](https://www.hiascend.com/doc_center/source/en/CANNCommunityEdition/900/programug/Ascendcopdevg/atlas_ascendc_10_0008.html), [async programming](https://www.hiascend.com/doc_center/source/en/CANNCommunityEdition/850/opdevg/Ascendcopdevg/atlas_ascendc_10_10015.html), [host tiling](https://www.hiascend.com/document/detail/zh/CANNCommunityEdition/850/opdevg/Ascendcopdevg/atlas_ascendc_10_00021.html). Newer Ascend [3510 control/data paths](https://www.hiascend.com/document/detail/en/CANNCommunityEdition/910/programug/Ascendcopdevg/docs/en/guide/programming_guide/advanced_programming/hardware_implementation/architecture_spec/npu_architecture_version_3510.md) must be kept separate from A2. TPU [pipelining](https://docs.jax.dev/en/latest/pallas/tpu/pipelining.html), [details](https://docs.jax.dev/en/latest/pallas/tpu/details.html), [runtime indexing](https://docs.jax.dev/en/latest/pallas/tpu/sparse.html).

| Function | Tenstorrent | Groq published TSP |
| --- | --- | --- |
| Instruction / control flow | H: RISC-V instruction/control roles and unpack/math/pack engine command execution. S: reader/writer/compute kernels. | H: slice instruction execution and control of streaming operations. S: compiler space/time schedule and instruction/data placement. |
| Dependency / readiness | S/API/H: circular-buffer reserve/wait/push/pop and engine/Dst ownership synchronization. | S: compiler-arranged dependencies and arrival timing; H/runtime: timing-contract maintenance. No inferred dynamic scoreboard. |
| Issue / select | H: command processing in compute/NoC engines. S: command sequencing; FPU/SFPU overlap is kernel/configuration dependent. | H: execution of scheduled instruction streams. Dynamic associative issue/ROB/rename structures not publicly specified in these designs. |
| Allocation / ownership | S/API: L1 circular buffers and Dst/unpack/math/pack ownership. | S: placement, stream routing and intermediate lifetime planning. Physical control implementation must follow the cited published design. |
| Data movement | H: NoC and transfer engines. S: reader/writer transfer commands and local-buffer layouts. | H: memory/switch slices and stream paths. S: routes/timing; chaining may avoid intermediate writeback. |
| Sync / events / barriers | S/API/H: circular-buffer readiness, engine synchronization and NoC semaphores. | H/runtime: synchronization and deskew, including multi-TSP timing alignment. Deterministic scheduling does not mean no runtime sync. |
| Completion / retirement / recovery | Kernel/engine completion and ownership handoff are exposed; CPU-style ROB/rename/recovery organization not publicly specified. | Scheduled execution and timing synchronization are described; CPU-style precise retirement/recovery organization not publicly specified. |
| Distributed control | S/API/H: NoC communication and semaphore coordination; static placement is not necessarily a cycle schedule. | S: compiler network schedule; H/runtime: synchronized multi-TSP communication in the published design. |

Sources: Tenstorrent [Metalium guide](https://github.com/tenstorrent/tt-metal/blob/main/METALIUM_GUIDE.md), [compute engines / ownership](https://docs.tenstorrent.com/tt-metal/latest/tt-metalium/tt_metal/advanced_topics/compute_engines_and_dataflow_within_tensix.html), [implementation investigation](https://github.com/tenstorrent/tt-metal/issues/55759); Groq [ISCA 2020](https://www.groq.com/wp-content/uploads/2020/06/ISCA-TSP.pdf), [ISCA 2022](https://groq.com/wp-content/uploads/2023/05/GroqISCAPaper2022_ASoftwareDefinedTensorStreamingMultiprocessorForLargeScaleMachineLearning-1.pdf). Groq coverage is limited to published designs, not every current product.

## Responsibility takeaway

Every architecture needs control for dependencies, ownership, movement and completion. Compiler/software schedules and hardware/runtime control divide that work differently. Compare their functions and obligations, including recovery, correctness and forward progress, without inventing undisclosed blocks or ranking by the number of named mechanisms. NVIDIA profiler stall categories support functional responsibilities, not a reconstruction of undisclosed circuit topology.
