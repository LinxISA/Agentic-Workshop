# U002 programming examples: source-grounded preparation

Read-only inspection: 6 October 2026. This entry prepares a matched stage/lifetime comparison with a GPU warp-specialized Attention kernel. The GPU example is pinned below. No benchmark, build or test was run. High-level brevity is not a measure of synchronization complexity.

## Actual benchmark entry

Repository PTO-ISA/SuperNPUBench, branch `main`, commit `349c98964144dfd9ca6a2665eca5a16ca8f3e045`. Suitable entry: [FA implementation, lines 180–308](https://github.com/PTO-ISA/SuperNPUBench/blob/349c98964144dfd9ca6a2665eca5a16ca8f3e045/benchmark/one-level-arch/kernels/basic_op/fa/fa_2d_unroll_gmma.hpp#L180). [Wrapper, lines 138–157](https://github.com/PTO-ISA/SuperNPUBench/blob/349c98964144dfd9ca6a2665eca5a16ca8f3e045/benchmark/one-level-arch/test/kernel/fa/src/fa_2d_unroll_gmma.cpp#L138) invokes the four-PE cooperative kernel.

Representative available artifact configuration: Sq=Skv=256, Tm=Tk=128, X=1/Y=2, matrix BF16 or FP32 with FP32 vector work. Kernel geometry uses a group M extent and a per-PE score shard: for group M128, the score shard is32×128. The source also supports other configurations; do not equate the selected example with every build or infer its exact compiler/API revision from source checkout alone.

Exact short excerpts (separate locations, not a contiguous executable sample):

```cpp
TLOAD<tileQMatrix, 1>(tQ, gQ);
TLOAD<tileKMatrix, 1>(tK, gK);
TMATMUL(tW, tQ, tK, qkFp32Options);
TROWMAX(tLocalMaxR, tW);
TROWEXPANDEXPDIF(tW, tW, tNewMax);
TROWSUM(tLocalSumR, tW);
```

Locations: lines195,204,207,219,241,244 in the pinned FA implementation. Q load is outside the KV loop; K/score intermediates are declared within it. Online max/sum and output accumulation persist across KV blocks. The FP32 direct path passes the probability tile to PV; differing/packed formats require conversion and a local shard. [PV path, lines259–286](https://github.com/PTO-ISA/SuperNPUBench/blob/349c98964144dfd9ca6a2665eca5a16ca8f3e045/benchmark/one-level-arch/kernels/basic_op/fa/fa_2d_unroll_gmma.hpp#L259).

## Synchronization is expressed at more than one layer

The selected inner kernel does not spell out a producer empty/full barrier for every Tile operation. Source operand/result relationships express dependencies; this does not mean there are no runtime waits or that physical allocation/reuse follows C++ lexical scope.

The wrapper explicitly calls `res_check_publish_inputs` and `res_check_wait_for_all` in RES_CHECK mode. Their helper uses shared flags, polling and compiler memory clobbers to publish input I/O and avoid exporting partial results. These are verification-wrapper synchronization, not evidence of identical production-kernel barriers. [Helper, lines14–36](https://github.com/PTO-ISA/SuperNPUBench/blob/349c98964144dfd9ca6a2665eca5a16ca8f3e045/benchmark/one-level-arch/test/common/multi_thread_res_check.h#L14).

A separate local Linx-TileOP-API checkout at `fac242a95bc70cd1783547555e5bd7335d1969bf` shows the next abstraction layer: common API headers route the Linx path to inline assembly, with named TLSU TLOAD and CUBE TMATMUL block operations. [API dispatch](https://github.com/LinxISA/Linx-TileOP-API/blob/fac242a95bc70cd1783547555e5bd7335d1969bf/include/common/tileop_api_impl.hpp#L4), [TLOAD emission](https://github.com/LinxISA/Linx-TileOP-API/blob/fac242a95bc70cd1783547555e5bd7335d1969bf/include/jcore/template_asm.hpp#L514), [canonical block-operation notes](https://github.com/LinxISA/Linx-TileOP-API/blob/fac242a95bc70cd1783547555e5bd7335d1969bf/include/jcore/template_asm.hpp#L2408). This checkout is **not established as the exact build dependency of the selected ELF**. Pin the toolchain and inspect matching emitted instructions before comparing low-level control cost.

The inspected TimingSim model separately implements operand readiness, group wakeups, resource checks, physical binding and guarded release. That is model evidence for how implicit Tile dependencies can be enforced; it is not proof of exact overlap or storage savings in this benchmark configuration. Detailed model source maps stay local. See [U002 comparison](U002-comparison.md).

## Actual GPU counterpart: FlashAttention-3 Hopper

Author repository commit `dc8fd708575a530bf773645efdc36b6bc6c53552`, CUTLASS submodule `62750a2b75c802660e4894434dc55e839f322277`; BSD-3-Clause source. Selected scope: ordinary FP16/BF16, head dimension D=Dv128, no packed-GQA or paged fallback. The launch uses two pipeline stages; the software tile is128×176 for noncausal and128×128 for causal/local cases. FP32 accumulation is explicit. [Launch](https://github.com/Dao-AILab/flash-attention/blob/dc8fd708575a530bf773645efdc36b6bc6c53552/hopper/flash_fwd_launch_template.h#L38), [tile selection](https://github.com/Dao-AILab/flash-attention/blob/dc8fd708575a530bf773645efdc36b6bc6c53552/hopper/tile_size.h#L29).

Producer warpgroup and compute warpgroups have distinct roles and register-budget adjustments; the ordinary selected case uses two compute warpgroups with one active producer warp. A GPU warpgroup is not equivalent to a benchmark PE. [Role setup](https://github.com/Dao-AILab/flash-attention/blob/dc8fd708575a530bf773645efdc36b6bc6c53552/hopper/flash_fwd_kernel_sm90.h#L308).

Exact selected K-producer lines, with surrounding control omitted:

```cpp
pipeline_k.producer_acquire(smem_pipe_write);
copy(params.tma_load_K.with(*pipeline_k.producer_get_barrier(smem_pipe_write), mcast_mask_kv, TMA::CacheHintSm90::EVICT_LAST),
    tKgK_TMA(_, n_block_idx, bidb_kv_idx), tKsK_TMA(_, smem_pipe_write.index()));
```

[Producer source, lines749–758](https://github.com/Dao-AILab/flash-attention/blob/dc8fd708575a530bf773645efdc36b6bc6c53552/hopper/mainloop_fwd_sm90_tma_gmma_ws.hpp#L749). V uses its corresponding producer path at lines762–772. Under the wrapper, acquire waits on an empty stage and arms the full barrier's expected transaction count. [Pinned CUTLASS acquire, lines501–509](https://github.com/NVIDIA/cutlass/blob/62750a2b75c802660e4894434dc55e839f322277/include/cutlass/pipeline/sm90_pipeline.hpp#L501).

Exact selected **non-contiguous** consumer lines; omissions include GEMM calls, readiness waits, masking and conditional branches:

```cpp
warpgroup_wait<1>();
pipeline_k.consumer_release(smem_pipe_read);  // release K
softmax.template online_softmax</*Is_first=*/false, Check_inf>(tSrS);
warpgroup_wait<0>();
pipeline_v.consumer_release(smem_pipe_read_v);  // release V
```

[IntraWGOverlap steady loop, lines1170–1206](https://github.com/Dao-AILab/flash-attention/blob/dc8fd708575a530bf773645efdc36b6bc6c53552/hopper/mainloop_fwd_sm90_tma_gmma_ws.hpp#L1170): QK processes the current block while PV uses the previous block; K/V readiness waits occur at1175/1180. After wait1, K can be released and softmax processed; after wait0, V can be released in the ordinary no-QV path. The alternate no-overlap branch is not the selected D128 default. Consumer release signals the empty barrier via one thread per consumer warpgroup. [Release implementation, lines87–92](https://github.com/Dao-AILab/flash-attention/blob/dc8fd708575a530bf773645efdc36b6bc6c53552/hopper/sm90_pipeline_no_cluster.hpp#L87).

The GEMM wrapper performs fence/issue/commit; `wg_wait=-1` leaves waits to the surrounding loop. [GEMM wrapper](https://github.com/Dao-AILab/flash-attention/blob/dc8fd708575a530bf773645efdc36b6bc6c53552/hopper/utils.h#L254). Online softmax maintains exponential/running-sum state. [Softmax](https://github.com/Dao-AILab/flash-attention/blob/dc8fd708575a530bf773645efdc36b6bc6c53552/hopper/softmax.h#L101).

TMA bypassing intermediate GPRs, warp specialization assigning roles and `setmaxnreg` changing register budgets are three different mechanisms; none alone is late SRAM allocation. [Pinned register reconfiguration](https://github.com/NVIDIA/cutlass/blob/62750a2b75c802660e4894434dc55e839f322277/include/cutlass/arch/reg_reconfig.h#L55).

## Matched comparison handoff

Match Q/K/V and running-state dtypes, sequence/head geometry, per-stage work, layout and live-buffer ownership. Compare GPU producer empty → transfer → full/arrival → consumer compute → release against the corresponding Tile load, dependence, consumption and physical-binding/release paths. Keep returned-data readiness separate from consumer completion, and group software tiles separate from per-PE shards.

Use the same abstraction level on both sides: high-level Tile calls versus a high-level GPU kernel, or matched lowered instructions/control. The GPU kernel is pinned; still required are exact benchmark compiler/API build provenance, matched input dtype/head/mask, emitted instruction mapping and actual model stage ownership/lifetime evidence. No programming-complexity winner or numerical residency benefit is established.

## Variable-latency interpretation

When comparing stage lifetimes, distinguish correctness ownership/capacity from performance slack based on expected/profiled latency. Compiler/kernel multibuffering and lookahead may be conservative under variation, but runtime completion, semaphores and backpressure can wait safely; late data may extend slot occupancy or stall. Lifetime analysis, sliced prefetch and streaming reuse can reduce reservation intervals. Conditional late binding changes destination reservation timing, not the need for return buffers or the peak true live set. See the [variable-latency comparison](U002-comparison.md#variable-latency-and-compiler-orchestrated-storage). No blanket worst-case-overreservation claim or storage percentage is established by the source examples.

Review entry: [five-architecture lifecycle and cost summary](U002-comparison.md#reviewed-five-architecture-summary). These saved examples are supporting preparation; further source tracing is paused.
