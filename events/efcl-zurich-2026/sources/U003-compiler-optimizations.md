# U003: compiler optimization of layout and mixed precision

Review date: 6 October 2026. Compare **remaining cost after competent compilation**, not naive instruction sequences. Some packing/layout work can be eliminated; other work is amortized or hidden. Logical Tile instructions still benefit from compiler optimization. See [U003 formats and layouts](U003-comparison.md).

## Six contracts to preserve

Track logical indices/reduction axes; physical bytes/tiling/padding/swizzle; subbyte bit positions; thread/register ownership; numeric input/accumulator/output and rounding/saturation; and scale/zero-point indexing. Vendor layout names are not equivalent, and swizzle is not dtype conversion. Quantization changes numerical meaning; a storage cast can change representation without applying a quantization formula. Precision changes require a numerical contract. [MLIR Quant dialect](https://mlir.llvm.org/docs/Dialects/QuantDialect/).

## Eliminate redundant representation work

Layout propagation, rematerialization and moving conversions before widening/broadcast can remove or shrink conversions. Equivalent layouts or thread-local register renaming may need no data movement; ownership changes across threads/warps can require shuffle or shared-memory exchange. [Triton conversion removal](https://github.com/triton-lang/triton/blob/main/lib/Dialect/TritonGPU/Transforms/RemoveLayoutConversions.cpp), [layout semantics](https://triton-lang.org/main/getting-started/tutorials/gluon/layouts.html).

Tiling, interchange and producer fusion can avoid materialized intermediates. A matrix-to-vector consumer's ownership can influence producer/epilogue layout; fixed MMA fragment ownership may still require exchange if incompatible. A transpose name alone does not establish movement. [MLIR Transform dialect](https://mlir.llvm.org/docs/Dialects/Transform/), [CUTLASS GEMM and epilogue](https://docs.nvidia.com/cutlass/latest/media/docs/cpp/efficient_gemm.html).

## Fuse or amortize useful work

Conversion and packing can be combined through NumericArrayConverter/native packed arithmetic. Scaled MMA can integrate dequantization and matrix execution under explicit format/block/scale-layout constraints; scale layout propagation does not make arbitrary scale arrangements free. [CUTLASS fundamental types](https://docs.nvidia.com/cutlass/latest/media/docs/cpp/fundamental_types.html), [scaled tcgen05 tutorial](https://triton-lang.org/main/getting-started/tutorials/gluon/tcgen05-mma-scaled.html).

A Hopper INT4×BF16 example preprocesses static weights: groups of16 INT4 values support a64-bit shared-memory load, with nibble order `[0,2,4,6,1,3,5,7]` enabling parallel upconversion. Scale-group and layout constraints remain. This amortizes static packing; it does not eliminate conversion or make preprocessing free. [CUTLASS example](https://github.com/NVIDIA/cutlass/blob/main/examples/55_hopper_mixed_dtype_gemm/55_hopper_int4_bf16_gemm.cu) (moving reference; pin a revision before code-based slides).

## Choose decomposition and scheduling profitably

Unroll-and-jam expands an outer loop and fuses inner iterations for reuse/shared loads/ILP; it is not automatic quantization. Mixed-type vectorization/SLP includes conversion costs in profitability, while unrolling can increase register pressure and code size. [LLVM pass](https://llvm.org/docs/Passes.html#loop-unroll-and-jam-unroll-and-jam-loops), [LLVM vectorizers](https://llvm.org/docs/Vectorizers.html).

Scalable vectors and masked tails reduce fixed-width dependence without guaranteeing full lane use. SVE VLA is distinct from fixed-width AVX/NEON: retaining a consumer-compatible interleaved layout or using narrowing stores can eliminate a permutation/packed intermediate; incompatible consumers still require work. See the [CPU instruction boundaries](U003-comparison.md#x86-fixed-vectors-and-consumer-dependent-packing). Autotuning carries search, compilation and configuration-coverage costs. [LLVM RVV](https://llvm.org/docs/RISCV/RISCVVectorExtension.html), [Triton autotune](https://triton-lang.org/main/python-api/generated/triton.autotune.html).

Our variable logical Tile extent can reduce software-visible decomposition solely to match hardware width; it does not imply single-cycle execution, unlimited capacity or free arbitrary-layout conversion. Unrolling can still be useful for reuse or independent-work exposure. Hardware microstep sequencing, tags, capacity and lifetime control do not replace numerical/layout planning.

## Report four different outcomes

| Outcome | Meaning |
| --- | --- |
| Eliminated | Redundant conversion/view or intermediate materialization disappears. |
| Amortized | Static packing/preprocessing is reused across executions; account for preprocessing and applicability. |
| Hidden | Transfer or conversion overlaps eligible work; resource demand remains. |
| Remaining | Required format, ownership, interface boundary or capacity constraints still impose work/waiting. |

Do not treat these outcomes as interchangeable savings. Assess matched numerical semantics, workload and implementation after optimization; no performance ratio or architecture winner is supplied here.
