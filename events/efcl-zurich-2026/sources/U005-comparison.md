# U005 — Reduction execution across shapes and axes

Research snapshot: 7 October 2026; four-PE/shared-handoff update included. Scope: local/tiled reduction and the vector stages around it; inter-device collectives are a separate problem. This is a mechanism and resource-cost comparison, not a PPA or measured-performance ranking. U003 covers layout × dtype; here layout matters only insofar as it determines who must exchange partial results.

## 1. The architectural problem

A reduction is a many-to-few dependency. For each output, the implementation must read the participating values, combine them, and make the result available to its consumers. Its cost depends on reduction length, number of independent outputs, physical ownership, numerical semantics, and the lifetime of partial results. Tensor rank alone predicts none of these.

For a logical `X[M,K]`, row reduction produces `M` outputs, whereas column reduction produces `K`. An implementation can combine register-local values first, then combine across lanes, warps, tiles, or cores. A binary tree over `K` inputs has `K−1` combines and an ideal depth of `ceil(log2 K)`; neither count specifies the actual instruction count or latency, because instructions may process multiple values and communication may dominate. This is an analytical model, not a claim about any implementation below.

### Shape and axis cases to distinguish

| Case | Execution issue | Typical choices and their costs |
|---|---|---|
| Many short rows | A full warp/vector/tile per row may leave execution slots unused | Pack independent rows together; pay grouping, masking, and result-placement work |
| Few long rows | Little output-level parallelism, but a long intra-row dependency | Split a row into partial reductions; pay a merge stage, partial storage, and synchronization |
| Wide rows fitting on chip | Keeping a row live can eliminate intermediate memory traffic | Trade registers/scratchpad against occupancy or concurrent tiles |
| Rows exceeding local capacity | A single resident-row strategy no longer fits | Stream chunks, reread inputs, or stage partials; choose between storage and extra passes |
| Column reduction of row-major input | The reduced axis is strided, but neighboring outputs are contiguous | Vectorize across output columns and accumulate over rows; a transpose is an option, not a universal requirement |
| `[B,H,Q,K]`, reducing `K` | Independent outputs are indexed by `(B,H,Q)` | Flatten compatible retained dimensions into a row index; rank four does not itself require a four-stage reduction |
| Middle or nonadjacent axes | Retained and reduced dimensions may be interleaved physically | Use stride-aware indexing, staged reductions, or rearrangement; preserve logical grouping when flattening |
| Ragged lengths / partial tiles | Active elements and the combine tree change | Predicate or pad with the operation’s identity; handle empty/all-masked cases explicitly |

These are design inferences. Concrete examples of compiler-managed shuffles/shared memory and shape-sensitive row buffering appear in [XLA:GPU Emitters](https://openxla.org/xla/emitters) and [Triton’s fused-softmax tutorial](https://triton-lang.org/main/getting-started/tutorials/02-fused-softmax.html), both accessed 2026-10-06.

## 2. Softmax exposes more than an adder bottleneck

Stable softmax has a dependency chain: row maximum → subtract and exponentiate → row sum → normalization. Its surrounding work includes broadcasting statistics, masks, conversions, and retaining or revisiting values. One reduction instruction cannot subsume that chain merely by reducing the number of combines.

Online normalization merges partial states `(mₐ,sₐ)` and `(mᵦ,sᵦ)` using `m=max(mₐ,mᵦ)` and `s=sₐ·exp(mₐ−m)+sᵦ·exp(mᵦ−m)`. It reduces input passes for computing the normalizer, at the cost of rescaling arithmetic and state. Producing every softmax output still requires access to the elements after the final normalizer is known, through retention or another pass. The real-arithmetic identity does not imply bitwise agreement between floating-point reduction trees. [Milakov and Gimelshein, *Online normalizer calculation for softmax*, arXiv v2, 2018-07-28](https://arxiv.org/pdf/1805.02867)

Measure or reason about the relevant engines separately: add/max, exponentials, reciprocal/divide, movement, and matrix multiplication have different service rates. A larger matrix peak does not establish a larger reduction or exponential peak. This is particularly important when lower-precision GEMM increases matrix throughput while the normalization path remains wider.

## 3. NVIDIA GPU: ownership hierarchy and generation-specific primitives

### Common SIMT path

A thread can first reduce its own registers. Warp shuffles exchange values between participating lanes without shared memory; a floating-point sum can then use a shuffle-and-add tree. Combining partials from several warps normally adds a shared-memory or other explicitly coordinated stage. A full tensor may additionally need multiple CTAs and a final merge. XLA explicitly describes reduction code generation using shuffles and shared memory. [CUDA C++ Programming Guide 13.0.3, §§10.21–10.22](https://docs.nvidia.com/cuda/archive/13.0.3/cuda-c-programming-guide/index.html#warp-reduce-functions); [XLA:GPU Emitters](https://openxla.org/xla/emitters)

The CUDA 13.0.3 `__reduce_*_sync` signatures cover integer arithmetic/bitwise operations; its cooperative-groups example lowers floating addition to shuffles. This API fact must not be generalized into “Blackwell has no floating-point warp reduction.” [CUDA C++ Programming Guide 13.0.3, §11.6.3.2](https://docs.nvidia.com/cuda/archive/13.0.3/cuda-c-programming-guide/index.html#reduce)

### Hopper: hide the vector stage, pay for overlap

FlashAttention-3 targets Hopper/H100. Its asynchronous WGMMA and TMA pipelines overlap matrix work, movement, and softmax across tiles/warpgroups. The paper identifies low-throughput non-matmul work, including exponentials, as a meaningful constraint. The overlap requires barriers, buffer ownership, additional live register state, and deliberate warpgroup/register allocation. Faster GEMM alone does not remove this work or its producer–consumer dependencies. This is a particular attention implementation, not a promise that arbitrary reductions become hidden on Hopper. [Shah et al., *FlashAttention-3*, 2024-07-12, §§2.2, 3.1–3.2](https://tridao.me/publications/flash3/flash3.pdf)

### Blackwell: separate max, sum, and mapping choices

PTX 8.7 documents `redux.sync.min/max.f32` for `sm_100a`, introduced in PTX 8.6, including optional absolute-value and NaN-propagating behavior. It does not define an FP32 `redux.sync.add` form. Thus softmax’s maximum and sum need not use identical mechanisms. This statement is scoped to that PTX version and target; it is not a blanket claim for every GPU marketed as Blackwell. [PTX ISA 8.7, §9.7.13.12](https://docs.nvidia.com/cuda/archive/12.8.0/parallel-thread-execution/index.html#parallel-synchronization-and-communication-instructions-redux-sync)

FlashAttention-4 provides a complementary software example for data-center Blackwell: tensor-memory accumulator placement permits assigning one complete row of the current score tile (128 elements in the cited mapping) to one thread, removing cross-thread row-reduction communication in that mapping. The cost moves to holding that tile row in registers, TMEM transfers, buffering, and pipeline coordination. Its partial software emulation of exponentials also trades FMA work and extra registers against pressure on the special-function unit. These are implementation-specific tradeoffs, not evidence that every Blackwell reduction is register-local. [*FlashAttention-4*, arXiv:2603.05451v1, 2026, §§3.1.2–3.1.3](https://arxiv.org/html/2603.05451v1)

For standalone wide-row softmax, Triton’s tutorial explicitly chooses a padded power-of-two row block and inspects register/shared-memory usage when deriving occupancy. More per-row work can reduce memory traffic yet shrink the number of resident programs. [Triton fused softmax, current tutorial accessed 2026-10-06](https://triton-lang.org/main/getting-started/tutorials/02-fused-softmax.html)

## 4. Ascend: explicitly composed vector reduction stages

Ascend C exposes several reduction scopes: pairwise, per data block, per repeat, and whole-buffer APIs. High-level `ReduceSum` wraps lower-level reduction work; masks, repeat counts, source strides, and shortened destination strides remain part of the lowering contract. This is a concrete local-vector execution model, rather than a GPU warp-ownership model. [CANN 8.0, *Reduction Instructions*](https://www.hiascend.com/document/detail/en/canncommercial/800/opdevg/Ascendcopdevg/atlas_ascendc_10_0023.html)

Shape changes the useful instruction composition. Huawei’s CANN 8.0 example reduces 256 FP32 elements with either repeated WholeReduceSum, repeated BlockReduceSum, or BlockReduceSum followed by WholeReduceSum. Its preferred sequence illustrates that a larger reduction scope need not be the best building block. The example explicitly includes intermediate local storage, mask changes, and vector-pipeline barriers. Its published timing is intentionally not used as an architecture-wide comparison here. [CANN 8.0, *Using the Reduction Instruction Properly in Different Scenarios*](https://www.hiascend.com/doc_center/source/en/canncommercial/800/opdevg/ascendcbestP/atlas_ascendc_best_practices_10_0031.html)

For Atlas A2/A3 in CANN 9.0, the documented WholeReduceSum operands are half or float, with matching source/destination types. A repeat covers up to 128 16-bit or 64 32-bit elements under its contiguous mask. The page specifies a binary-tree computation and documents intermediate saturation in its half example. Neither a half operand nor a generic typed API should be described as silently receiving FP32 accumulation. Product-specific extensions must be checked separately. [CANN Community 9.0 WholeReduceSum](https://www.hiascend.com/doc_center/source/en/CANNCommunityEdition/900/API/ascendcopapi/atlasascendc_api_07_0081.html)

The CANN 9.1 SoftMax API makes the surrounding cost visible: maximum, broadcast, subtract, exponential, sum, broadcast, and division execute on the vector path. It flattens retained dimensions for logical row-wise softmax; ND and NZ storage require different internal reduction traversals. Temporary-buffer size and tiling are explicit, and the “basic block” fast path has shape restrictions. A compiler/library can absorb this orchestration, but the local-memory capacity, traffic, and dependency costs remain. [CANN 9.1 SoftMax, updated 2026-09-17](https://www.hiascend.com/document/detail/en/CANNCommunityEdition/910/API/ascendcopapi/docs/en/api/SIMD-API/advanced_api/activation_functions/SoftMax_api/SoftMax.md)

## 5. TPU: compiler-directed vector topology, distinct from Ascend

Google documents separate matrix, vector, and scalar units; softmax is an example of vector-unit work. An MXU’s arithmetic/accumulation specifications do not establish the precision or throughput of every vector reduction. [Google Cloud, *TPU architecture*, accessed 2026-10-06](https://docs.cloud.google.com/tpu/docs/system-architecture-tpu-vm?hl=en)

The JAX scaling guide’s v5p discussion describes a two-dimensional VPU with 8 sublanes × 128 lanes. Reducing along sublanes can use local shuffle/combine steps; cross-lane reduction involves a separate cross-lane unit. This makes the physical axis important even when the logical operation is simply “sum.” Treat this as the guide’s v5p-specific architectural explanation, not a universal cycle model for all TPU generations. [JAX scaling-book, *How to Think About TPUs*, Appendix A, page dated 2025-02-04; accessed 2026-10-06](https://github.com/jax-ml/scaling-book/blob/main/tpus.md)

Pallas documents VMEM accesses generally tiled as `(8,128)`, block-shape restrictions, compiler-managed transfers, and usually sequential grid iteration within the documented execution model. Consecutive iterations can retain an output window while processing successive input windows. Consequently, reduction lowering must choose between local vector reduction, rolling partial accumulation, rearrangement, and a larger staged algorithm while managing VMEM and register lifetimes. Pallas also advises generally upcasting narrower operands to 32-bit for elementwise computation. [JAX, *Writing TPU kernels with Pallas*, accessed 2026-10-06](https://docs.jax.dev/en/latest/pallas/tpu/details.html)

OpenXLA’s profiler distinguishes vector ALUs, loads/stores, MXU, transpose unit, and reduction/permutation unit. That is the appropriate resource-accounting perspective: low MXU utilization alone cannot distinguish a vector bottleneck from reduction/permutation or data movement. Its displayed instruction-rate model should not be exported to an unspecified TPU generation. [XProf Utilization Viewer, updated 2026-02-05](https://openxla.org/xprof/utilization_viewer)

## 6. Tenstorrent: tile reduction inside an explicit dataflow pipeline

TT-Metalium places `reduce_tile` in its FPU/matrix-engine API group, separate from SFPU/vector operations. The reduction API supports row, column, or scalar results and sum, average, or maximum; it consumes a source tile and a scaler tile from circular buffers and writes to acquired DST state. Its result placement and packer-mask setup are explicit. A software-level tile reduction must not be equated with one generic SIMD horizontal-reduction opcode. [TT-Metalium Compute APIs](https://docs.tenstorrent.com/tt-metal/latest/tt-metalium/tt_metal/apis/kernel_apis/compute/compute.html); [reduce_tile reference](https://docs.tenstorrent.com/tt-metal/latest/tt-metalium/tt_metal/apis/kernel_apis/compute/reduce_tile.html), `latest`, accessed 2026-10-06

The surrounding pipeline coordinates unpack, math, and pack through circular buffers and DST ownership. With standard 32×32 tiles, the documented 32-bit DST mode halves tile capacity relative to 16-bit mode; double-buffering further divides currently available capacity in exchange for compute/pack overlap. Crucially, 32-bit DST storage alone is not a guarantee that every selected compute operation has full FP32 arithmetic. [TT-Metalium, *Compute Engines and Data Flow within Tensix*, `latest`, accessed 2026-10-06](https://docs.tenstorrent.com/tt-metal/latest/tt-metalium/tt_metal/advanced_topics/compute_engines_and_dataflow_within_tensix.html)

For a generation-specific vector example, the Wormhole B0 ISA documents a 32-lane, 32-bit SFPU with separate arithmetic, movement, and lane-manipulation instructions. This is another resource from the FPU reduction path. [Tenstorrent Wormhole B0 Vector Unit ISA, `main`, accessed 2026-10-06](https://github.com/tenstorrent/tt-isa-documentation/blob/main/WormholeB0/TensixTile/TensixCoprocessor/VectorUnit.md)

Inference for larger shapes: reduce tile-local pieces, then combine partials across tiles and, when the reduction axis is distributed, across cores. Assigning whole independent rows to cores can avoid that cross-core merge but may limit load balance. Splitting long rows increases parallelism while adding NoC traffic, buffering, and synchronization. The cited tile API alone establishes neither a universal distributed reduction nor arbitrary softmax fusion.

## 7. Numerical behavior is part of the execution contract

Keep five questions separate:

1. What are the input, intermediate/accumulator, and output types?
2. What combine tree and chunk order are allowed?
3. What are the rounding, overflow, subnormal, NaN, signed-zero, and tie rules?
4. What identities and results apply to tails, empty reductions, and all-masked softmax rows?
5. Is the requirement accuracy within tolerance, repeatability on one configuration, or bitwise reproducibility across architectures?

XLA permits implementation choices in reduction grouping and order and requires a suitably associative combine operation; ordinary floating-point addition is only approximately associative. A fixed scalar reference order therefore cannot be assumed for a compiler-generated reduction. [OpenXLA operation semantics, Reduce, accessed 2026-10-06](https://openxla.org/xla/operation_semantics#reduce)

CCCL explicitly separates no determinism guarantee, run-to-run reproducibility, and GPU-to-GPU reproducibility. Availability depends on the algorithm/types/operator, and guarantees are scoped to a fixed CCCL/CUDA version and applicable tuning. Stronger reproducibility may constrain the implementation; it is separate from selecting a wider accumulator. [NVIDIA CCCL Determinism, unstable documentation, accessed 2026-10-06](https://nvidia.github.io/cccl/unstable/cccl/determinism.html)

Max also needs a contract: Blackwell’s documented NaN modifier changes whether a NaN participant propagates, and signed zeros have specified ordering. A “max tree” is not fully specified by naming the mathematical maximum. [PTX ISA 8.7, redux.sync](https://docs.nvidia.com/cuda/archive/12.8.0/parallel-thread-execution/index.html#parallel-synchronization-and-communication-instructions-redux-sync)

## 8. Comparison with the current Superscalar NPU model

Earlier implementation-review basis: the [typed-axis and model boundary](U003-comparison.md#typed-axis-reduction-and-conversion-width-microsteps) records a reviewed `rowreduce` profile covering 16/32-bit layouts. That profile is not the current ISA ceiling. The pinned `e182c9b` TROWSUM contract, numerical limitations, masking rules, and CELL geometry are detailed in the four-PE update below. Typed operations do not imply a separately selected accumulator width, a physical tree, a cycle count, or a fused softmax pipeline.

The architectural opportunity is to express a tile-axis reduction directly, so software does not have to reconstruct its logical meaning solely through lane exchanges or repeated local-buffer operations. The important question is where the cost then resides:

| Cost dimension | What the model must establish |
|---|---|
| Reduction logic | Supported combine operations, tree/folding structure, axis coverage, and masking |
| Data paths | Which row/column values are directly reachable; operand/result port demand and broadcast capability |
| Register/state capacity | Live source tiles, partials, statistics, widened values, and concurrently executing operations |
| Control | Dependency tracking, readiness, issue restrictions, completion visibility, and multi-stage sequencing |
| Numerical semantics | Typed arithmetic, intermediate precision, tree/order guarantees, exceptional values, and conversion points |
| Compiler/software | Shape decomposition, tails, unsupported-axis handling, partial-result combination, and producer/consumer scheduling |

These are required design questions, not claims that corresponding hardware is already implemented. A direct row/column opcode can simplify the software expression while still using a multi-cycle or resource-shared implementation. Conversely, GPU row ownership or compiler-selected vector topology may remove a communication stage without adding a new tensor-axis opcode.

For wide or higher-rank tensors, the comparison must show how one supported tile reduction composes into the whole logical operation. For softmax, independently establish maximum, sum, exponential, broadcast/rescaling, and normalization support and their data dependencies. The present contract establishes neither FP4 reduction nor full fusion. Absence of a separate accumulator-width field also does not authorize assuming implicit widening.

## 9. Four-PE ownership and a shared Tile Register handoff

Update: 7 October 2026. The shared Tile Register below is the author-described target architecture. This discussion does not establish a verified topology, port count, latency, bandwidth, or executable cross-PE implementation.

### Independent complete groups versus one distributed group

For eight independent groups of four inputs, four PEs can each own two complete groups. Each PE computes two final group results; no cross-PE reduction merge is needed. Input placement and delivery of those final results can still involve communication. With enough balanced independent groups and a suitable layout, this is a strong low-communication candidate.

If the four PEs instead own disjoint pieces of the same global group, their local results are only partials. Every required contribution must reach a merge before that global answer is complete. A long or under-parallelized row can benefit from a larger work partition, but its new merge dependency must be included. Splitting a four-element group across four PEs leaves one element per PE and provides no local compression before exchange.

The target shared-register path is:

1. Reduce or otherwise compress the local partition
2. Publish each partial into its owned shared Tile Register region and establish visibility/readiness
3. Read the required partials and merge them, possibly consuming early arrivals incrementally
4. Publish the final result and distribute it if multiple PEs need it
5. Reclaim storage only after its readers and outstanding references are finished

For four 256-element FP32 partitions, the inputs contain 4096 logical bytes and the four FP32 partials contain 16 logical bytes. Writing all four partials and reading them once adds 16 logical write bytes and 16 logical read bytes; this excludes physical granularity, padding, metadata, result storage, and distribution. Keeping the merger's own partial local could avoid one shared pair. These counts are illustrative arithmetic, not performance or physical-allocation measurements. The CUBE-envelope example below also shows why 16 logical partial bytes do not establish a 16-byte physical shared transfer.

Shared storage does not remove synchronization. The contract still needs group/generation identity, write-before-read ordering, a readiness join or equivalent dependency tracking, and consumption-before-reuse. A hardware-managed dependency can replace some explicit software barriers while enforcing the same causal edges. Final-result availability cannot precede the last required partial. Ports, banks, arbitration, concurrent engine traffic, slow participants, and result broadcast can therefore limit the intended benefit.

### Numerical and geometry boundary

The pinned [TROWSUM contract](https://github.com/PTO-ISA/pto-spec/blob/e182c9b70d54a3a264bac54af9b915a0e43bb519/docs/tile/reduce-and-expand/row-reduction/TROWSUM.md) defines a typed increasing-column left fold from zero. It does not authorize floating-point tree reassociation. Independent complete groups can run in parallel without changing their individual fold order. Independently folding pieces of one row from zero and merging their rounded sums generally changes that order, even if contiguous partitions are merged left to right. Passing a running accumulator between contiguous partitions can preserve the arithmetic recurrence through a separately supported sequence or implementation mechanism, but current TROWSUM has no seed operand. Full instruction equivalence must also preserve complete-source preflight, numeric status, and atomic result/descriptor publication. Ordered handoff retains the serial arithmetic dependence and is not by itself proof of the full instruction contract. Any relaxed-order distributed sum needs separate numerical permission and explicit type, status, rounding, exceptional-value, and reproducibility rules.

For the four-element tail example, the logical mapping remains `[groups,4] → [groups,1]`. Thirty-two RowMajor FP32 values are 128 logical bytes and hold eight groups. The pinned [CELL geometry](https://github.com/PTO-ISA/pto-spec/blob/e182c9b70d54a3a264bac54af9b915a0e43bb519/docs/tile/model/shape/cube-cell.md) gives FP32 M16 CELLs of `16×2` and M32 CELLs of `32×1`: eight valid four-column rows need a `16×4` 256-byte M16 envelope or a `32×4` 512-byte M32 envelope. Capacity is not throughput. For 16-bit types the CELLs are `16×4` and `32×2`; for 8-bit types, `16×8` and `32×4`.

Eight FP32 results contain 32 logical bytes, but current CUBE row-reduction destinations retain the source physical column envelope. Logical result size or a prefix view does not establish a smaller allocation or released capacity. The current [reduction legality](https://github.com/PTO-ISA/pto-spec/blob/e182c9b70d54a3a264bac54af9b915a0e43bb519/docs/tile/model/legality/reduction-and-expansion.md) rejects generic Local CUBE ExecutionMask. Ragged final groups require defined identities with the required numeric behavior, a smaller legal shape, or separate handling. The public TROWSUM guidance also identifies incomplete floating helper semantics for TF32, HF32, E4M3 and E5M2; legality listing is not complete arithmetic validation.

### Concrete CUDA mechanisms rather than one synchronization category

Fresh primary-source inspection on 7 October 2026 pinned these examples:

- [FlashAttention softmax.h, commit `94e22c90`](https://github.com/Dao-AILab/flash-attention/blob/94e22c906678e5483fa0e9e24d8e787bc2c0ed4c/csrc/flash_attn/src/softmax.h): `thread_reduce_` performs thread-local fragment combines; `reduce_max` adds `Allreduce<4>`. This path keeps partial row sums local during online updates, then calls `quad_allreduce_` in `normalize_softmax_lse` when the denominator is needed. This is the named `csrc/flash_attn/src` path, not every FlashAttention/Hopper/Blackwell implementation
- [FlashAttention utils.h, same commit](https://github.com/Dao-AILab/flash-attention/blob/94e22c906678e5483fa0e9e24d8e787bc2c0ed4c/csrc/flash_attn/src/utils.h): `Allreduce<4>` uses XOR shuffle offsets 2 and 1 with arithmetic combines. It forms four-thread exchange groups within a warp while using a full-warp participation mask. It does not stage those exchanged values through shared memory or insert a CTA-wide barrier
- [OneFlow softmax.cuh, commit `25c8978c`](https://github.com/Oneflow-Inc/oneflow/blob/25c8978c1c8b1371ef6aa4187dae4495bd233c35/oneflow/core/cuda/softmax.cuh): `WarpAllReduce` uses shuffle XOR. `BlockAllReduce` invokes CUB with shared temporary storage, has thread zero publish the result to a shared broadcast scalar, then executes `__syncthreads()` before readers return that scalar
- [CCCL warp-reduction specialization, commit `dc7fcbdc`](https://github.com/NVIDIA/cccl/blob/dc7fcbdc47b3c75ca8871d448fe3a52cbc5a2e8c/cub/cub/block/specializations/block_reduce_warp_reductions.cuh): the deterministic path writes warp aggregates to shared storage, synchronizes the block, and merges them in thread zero. The file also has a separate non-deterministic addition path. This does not establish which CUB revision or specialization the pinned OneFlow build selects

Local arithmetic, lane shuffle, shared-memory access, block barrier, and result broadcast are different costs. A source-level `sync` name is insufficient to count them as equivalent synchronization events. The code inspections establish mechanisms and scopes; no emitted-instruction, timing, benchmark, or model test was run.

### Shared memory and shared Tile Register at matching scopes

GPU shared memory and the target shared Tile Register both support on-chip handoff. Their names do not prove identical physical tiers or that registers are always faster. The target's plausible advantage is conditional on an implementation with high effective bandwidth, low producer-to-consumer latency, and dependency-aware partial-Tile consumption, relative to a baseline that actually needs a farther path or a more conservative wait.

The [CUDA 13.0.3 guide](https://docs.nvidia.com/cuda/archive/13.0.3/cuda-c-programming-guide/index.html#distributed-shared-memory) distinguishes register/lane cooperation, CTA shared-memory cooperation on one SM, and supported cluster distributed shared memory. The cluster facility has its own co-scheduling, existence, synchronization, and lifetime contract. Ordinary CTA shared memory is not arbitrary chip-wide shared storage. A wider cross-SM reduction needs the appropriate cluster/global-memory/multi-kernel protocol. Match the four-PE locality with the actual GPU scope; do not charge every GPU candidate for a cross-SM path while assuming a nearby target handoff.

Evaluate effective bandwidth and latency under the access pattern, read/write ports, bank conflicts, arbitration, readiness publication/join, slowest-participant delay, physical allocation, and broadcast or repeated reads. A shared register still needs visibility and reuse ordering. Fewer explicit barrier instructions can be a programming advantage without yet proving lower execution cost.

### Ascend and TPU use distinct larger-scope paths

Ascend's local [BlockReduceSum/WholeReduceSum composition](https://www.hiascend.com/doc_center/source/en/canncommercial/800/opdevg/ascendcbestP/atlas_ascendc_best_practices_10_0031.html) is shape-dependent. A distributed reduction additionally needs partial movement and a merge. The official live [SyncAll developer preview](https://asc.gitcode.com/api/SIMD-API/basic_api/sync_control/inter_core_sync/SyncAll.html) shows results written to GM before synchronization and subsequent accumulation. It separates software GM signal/polling from hardware synchronization; the pipeline-configurable form is listed for 950, not A2/A3. Product, residency, and flag-ownership constraints remain. The page identifies master `5c07153f668d` with uncommitted changes; it is not a frozen commercial-release guarantee. Synchronization alone does not transfer the partial payloads.

TPU's local two-dimensional vector-axis cost is separate from inter-core/device communication. [Pallas core-specific programming](https://docs.jax.dev/en/latest/pallas/tpu/core_map.html) gives an intra-device remote-copy/semaphore example; [distributed Pallas](https://docs.jax.dev/en/latest/pallas/tpu/distributed.html) uses asynchronous push DMA with distinct send and receive completion. Local partials can compose with those operations or compiler/runtime collectives, subject to buffer lifetime, topology, numerical order, and matched waits. These interfaces are not evidence of one shared Tile Register across TPU cores.

**Conclusion:** Prefer complete local short groups when sufficient balanced parallel work exists; consider cross-PE partitioning for a long or otherwise under-parallelized group when its numeric contract and complete handoff cost justify it. Shared on-chip handoff may improve the implementation, but does not establish zero synchronization or a universal architectural winner.

## Workshop takeaway

The useful comparison is the placement of cost: GPU reductions expose thread ownership and communication; Ascend exposes vector reduction scope, local buffers, and stage composition; TPU lowering couples the reduced axis to vector topology and compiler-managed memory; Tenstorrent makes tile/DST/buffer ownership central. A Superscalar NPU’s direct axis semantics should be evaluated by how much control and movement they remove, what logic and state they require, and which numerical/software guarantees they actually provide. No cross-platform performance order follows from these mechanisms alone.

### Evidence limits

- Live `latest`/`main` documentation is recorded with the access date rather than presented as a pinned release
- The Blackwell discussion distinguishes the PTX 8.7 `sm_100a` primitive from the FA4 implementation; neither is extrapolated to consumer SM120
- The candidate Cliff Young HPCA 2025 vector-bottleneck attribution is unconfirmed and is not used as evidence
- No benchmark, simulation, implementation test, or source-code change was performed for this research
