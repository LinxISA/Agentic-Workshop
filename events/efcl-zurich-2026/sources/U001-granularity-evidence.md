# U001: initial local granularity inventory

Read-only inspection: 6 October 2026. Model: `feat_pyc_model`, `d5419b3e721df47daae02c38ef2a9b82187e5149`, clean. Benchmark: PTO-ISA/SuperNPUBench, `main`, `349c98964144dfd9ca6a2665eca5a16ca8f3e045`, clean. No benchmark or test was run. This bounded sample is not a distribution of all operations and does not establish a typical universal tile size.

## Sampling scope and layer separation

The local `eval` tree contains two FA ELF names and nine matmul ELF names; no matching standalone softmax/reduction/qproj ELF names were found there. These are available artifact counts, not successful-run or dynamic-instruction counts. Additional inspection covered the one-level FA and matmul build lists and one row-reduction source/test. A qproj-specific filename was not located; this does not prove absence of equivalent projection workloads.

| Layer / example | Observed size or configuration | Interpretation |
| --- | --- | --- |
| VEC storage/readiness/uop data chunk | 128 bytes | 32 FP32, 64 BF16/FP16 or 128 8-bit elements by capacity; not a logical operation's total work or a guaranteed one-cycle throughput. |
| Available FA ELF pair | Sq=Skv=256; Tm=Tk=128; X=1,Y=2; BF16 or FP32 matrix, FP32 vector | Group tile extents; do not confuse them with each PE's vector tile. |
| FA per-PE score/softmax tile in inspected kernel | kPeTm=32 for group M=128; Tk=128 gives 32×128 FP32 = 16 KiB | Tk=256 gives 32 KiB for this vector tile. Group 128×128 payload is 32 KiB BF16 or 64 KiB FP32, a different layer. Row reduction uses a descriptor with one valid output column; row state can be 32×1 FP32 = 128 B logical data. |
| FA build-list scenarios | Sq/Skv=256/256,1024/1024,128/8192,256/512; Tm=128; Tk=128 or256 | FP32/BF16/FP8/MXFP8/HIF8 and low-precision modes with FP32/BF16 vector variants. Build list includes explicitly expected failures: listed configurations are not all proven runnable. |
| Standalone row sum inspected test | input64×128 FP32; tile16×128 =8 KiB; output tile16×1 =64 B logical data | Tail/physical layout and allocation may differ from logical byte arithmetic. |
| Matmul sampled build-list grids | M64–2048,N64–256,K2048–32768; tN64–256; tK64–1024 across dtype-specific grids | Candidate grids include capacity filtering. A/B/C each have different shapes; total grid extents are not one buffer or issue quantum. FP32 accumulation must be counted separately from low-precision inputs and scale metadata. |

Public benchmark source entry, pinned revision: [FA kernel](https://github.com/PTO-ISA/SuperNPUBench/blob/349c98964144dfd9ca6a2665eca5a16ca8f3e045/benchmark/one-level-arch/kernels/basic_op/fa/fa_2d_unroll_gmma.hpp), [FA build list](https://github.com/PTO-ISA/SuperNPUBench/blob/349c98964144dfd9ca6a2665eca5a16ca8f3e045/benchmark/one-level-arch/test/kernel/fa/compile.all), [matmul build list](https://github.com/PTO-ISA/SuperNPUBench/blob/349c98964144dfd9ca6a2665eca5a16ca8f3e045/benchmark/one-level-arch/test/kernel/matmul/compile.all), [row sum test](https://github.com/PTO-ISA/SuperNPUBench/blob/349c98964144dfd9ca6a2665eca5a16ca8f3e045/benchmark/one-level-arch/test/kernel/reduction/reducesum_row/src/reducesum_row.cpp). Links identify locally inspected source revisions; remote availability was not newly checked.

Issue quantum is separately bounded by class dispatch width, resource initiation intervals, buffer capacity and readiness. Matrix microsteps depend on dtype and selected path; no universal matrix microstep is established by this sample. DMA requests, transfers and synchronization must be counted independently. Neither maximum tile size nor static source/disassembly instruction count establishes dynamic performance.

## NVIDIA Hopper: matching semantic layers

These source-supplied examples separate thread cooperation, instruction footprint and software tiling. Byte figures are logical shape × dtype arithmetic, not fixed transactions, bytes per cycle or measured storage traffic.

| Layer | Example | Logical footprint / boundary |
| --- | --- | --- |
| Warp scalar work | 32 threads; FP32 scalar add, one item per active thread | Full warp: 32 FP32 items = 128 B per operand or result. Active masks can reduce work; this is not the full workload size. |
| Warp packed arithmetic | `half2`, two FP16 items per active thread | Full warp: 64 FP16 items = 128 B per operand or result; different arithmetic semantics from FP32. |
| Dense FP16/BF16 WGMMA | M=64,K=16,N=8…256 in steps of8; 128 cooperating threads | Matrix instruction cooperation is a warpgroup, not one warp or CPU-style out-of-order scheduling. |
| `m64n128k16`, FP32 accumulation | A64×16, B16×128, C/D64×128 | A=2048 B; B=4096 B; logical accumulator=32768 B. C/D denotes before/after accumulation, not necessarily two separately allocated buffers. |
| `m64n8k16`, FP32 accumulation | A64×16, B16×8, C/D64×8 | A=2048 B; B=256 B; logical accumulator=2048 B. |
| CUTLASS Hopper software tile example | 128×256×64, built from 64×256×16 WGMMA atoms with two compute warpgroups | FP16 A=16 KiB and B=32 KiB per K stage; FP32 accumulator=128 KiB. This is a software tile example, not a universal hardware issue quantum. |

Sources: [PTX, section 9.7.17.5.2](https://docs.nvidia.com/cuda/parallel-thread-execution/), [CUDA half2 arithmetic](https://docs.nvidia.com/cuda/cuda-math-api/cuda_math_api/group__CUDA__MATH____HALF2__ARITHMETIC.html), [CUTLASS 4.5.2 WGMMA, Partitioning Tensors](https://docs.nvidia.com/cutlass/4.5.2/media/docs/pythonDSL/mma_docs/wgmma_programming.html).

Our 128-byte VEC cell and a full warp's 128-byte FP32 operand span can have equal byte capacity while representing different readiness, scheduling and execution semantics. Likewise, compare a per-PE vector tile or group software tile with the corresponding GPU layer, not indiscriminately with a WGMMA atom. Match shape, dtype, buffer lifetime and numerical semantics before comparing resource cost. No matched GPU performance measurement is available here.

## Existing benefit evidence and limits

Existing local optimization notes change readiness timing and reduction-chain ordering, rather than logical tile granularity alone. They do not provide a complete pinned baseline/configuration bundle suitable for a public quantitative comparison. Their numerical results and private implementation details are retained locally.

No same-version/configuration granularity-only ablation or attributable GPU speedup is established. Matched shape/dtype, resource configuration and an isolated intervention are required; physical PPA and energy are not established by model cycles.

See the [six-category mechanism comparison](U001-comparison.md) and [U001 scope](../talks/superscalar-npu/problem-list.md#user-described-problem-npu-u-001). This inventory is preliminary evidence, not a performance verdict.
