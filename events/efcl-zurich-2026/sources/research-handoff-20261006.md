# Research handoff checkpoint — 6 October 2026

This checkpoint preserves authorized public-safe research for continuation away from the Mac. Repository synchronization does not create or start a cloud executor. A saved cloud coding environment still needs to be created/attached before execution can continue. No monitoring or schedule is created.

## Eight-question status

| Question | Saved record / status | Next authorized research boundary |
| --- | --- | --- |
| U001: hybrid matrix/vector coordination and short-task latency | [PR5](https://github.com/LinxISA/Agentic-Workshop/pull/5) remains OPEN; its six-category comparison, granularity evidence and functional control inventory are on that branch. | Preserve PR5 separately; do not merge it without authorization. No performance/PPA ranking. |
| U002: latency hiding versus physical residency | [Five-architecture review](U002-comparison.md#reviewed-five-architecture-summary), [pinned programming examples](U002-programming-examples.md). | Keep request tracking, return buffering, allocated pools and compute-live data separate. Further code-trace expansion was paused; retain those boundaries. |
| U003: mixed formats/layouts/scales and compute-width use | [Seven-architecture review](U003-comparison.md#reviewed-seven-architecture-summary), [compiler baseline](U003-compiler-optimizations.md); [PR6](https://github.com/LinxISA/Agentic-Workshop/pull/6) merged as `b753c7e9edaba00139e550959eced7ef1ebf9a9a`; automatic Pages succeeded. | Compare optimized implementations; retain fixed AVX/NEON versus SVE VLA, BFP4 distinctions and qualified typed-Tile benefits. No automatic-fusion or quantified-benefit claim. |
| U004: sparse/irregular access and updates | [Seven-way evidence and workload view](U004-comparison.md); existing TLEA/byte-ABI fix is under review. | Keep structured sparse MMA, indexed memory and atomic/collision semantics separate. Recheck live PR states before claiming default availability. |
| U005: vector/reduction internal efficiency | [Accepted problem definition](../talks/superscalar-npu/problem-list.md#user-described-problem-npu-u-005). | Named shapes, rank/axis and engine-internal utilization; distinct from U001 orchestration and U003 representation preparation. Detailed comparison pending. |
| U006: compute/communication orchestration | [Accepted problem definition](../talks/superscalar-npu/problem-list.md#user-described-problem-npu-u-006). | Context/scheduling mechanism remains open; do not assume SMT/processes or a selected implementation. |
| U007: precise debugging, exceptions and ordering | [Accepted problem definition](../talks/superscalar-npu/problem-list.md#user-described-problem-npu-u-007). | Correctness/recovery boundary; distinct from U006 orchestration. Evidence pending. |
| U008: bounded-resource forward progress | [Accepted problem definition](../talks/superscalar-npu/problem-list.md#user-described-problem-npu-u-008). | Deadlock/starvation/fairness obligations apply to every architecture; hypothetical dependency cycles are not observed bugs. |

The [eight-problem summary](../talks/superscalar-npu/problem-summary.md), [outline](../talks/superscalar-npu/outline.md) and [authoring checklist](../talks/superscalar-npu/slide-authoring-checklist.md) retain the shared whole-core cost dimension across all eight questions; it is not a ninth question.

## Existing integration and continuation rules

As last checked, spec [#369](https://github.com/PTO-ISA/pto-spec/pull/369), LLVM [#117](https://github.com/LinxISA/llvm-project/pull/117), API [#249](https://github.com/LinxISA/Linx-TileOP-API/pull/249), Bench [#202](https://github.com/PTO-ISA/SuperNPUBench/pull/202) and model [#902](https://github.com/LinxISA/SuperScalarModel/pull/902) are OPEN (API is draft). [#370](https://github.com/PTO-ISA/pto-spec/issues/370)/[#371](https://github.com/PTO-ISA/pto-spec/issues/371) are issues. Candidate TLEA scales extended logical indices into64-bit byte offsets; TLSU adds base. TLEA does not add base or row stride. Exact heads and bounded timing support are preserved in the [U004 correction](U004-comparison.md#correction-existing-tlea--byte-abi-integration-is-under-review).

The user authorized continued research/document synchronization. Preserve current task boundaries: documentation and read-only evidence; no implementation fix, project execution/tests/benchmarks/synthesis, unrelated PR merge, admin bypass or manual deployment without a separate instruction. Keep U001 PR5 separate. Saved research may be updated and pushed within this scope; do not treat that as authorization to release candidate compiler/spec/model changes.

Use public primary sources and exact revisions. No private source maps, raw chats/internal notes, credentials, local filesystem paths or presentation source files are included. This checkpoint adds no new measurement. Unverified availability, moving references and unmatched performance stay explicit; no PPA or architecture winner is inferred.
