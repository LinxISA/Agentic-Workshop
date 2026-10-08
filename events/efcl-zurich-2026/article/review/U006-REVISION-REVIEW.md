# U006 revision: structure and evidence review — 7 October 2026

A separate evidence-check pass inspected the actual edited chapter against primary sources after drafting. This is a second pass by the same authoring agent, not a claim of an external independent reviewer.

## Structure

The chapter now proceeds from fused inter-card/local matrix-vector/multicore workload to named roles and completion milestones, architecture mechanisms, current/proposed SSNPU contracts, component control demand and end-to-end outstanding, then conditional benefits. Cross-references preserve U001 readiness, U002 lifetime, U004 data atomics, U005 reductions, U007 visibility/precision and U008 progress. Compact bibliographic pointers support later snippets; no exhaustive audience validation backlog was added.

## Corrections and evidence strength

- Strong, pinned normative/current evidence: PTO e182c9b generated field contracts, GQM entry/release/acquire/failure semantics, and v0 nonblocking scheduling-request semantics. Corrected BXU/BXS names; no whole-descriptor atomic publication, sleep implementation, lost-wake proof, fairness or silicon behavior is inferred.
- Strong, version-scoped API evidence: CUDA warp/CTA/cluster scopes, archived NCCL LSA/multimem/GIN and its separate 2.30+ fusion teaching example; CANN 9.0 client/server and AIV GM-flag/local-staging paths; Pallas distinct send/receive DMA semaphores; TT illustrated controller roles and explicit CB polling. They establish mechanisms, not matched performance or universal generation properties.
- Historical evidence: Linx c7cb8d93 HAC/MSGB legacy examples and TT's explicitly outdated Ethernet guide. The latter now says fabric manages Ethernet cores; corrected the chapter so the old low-level path is not presented as current recommended practice.
- Weak/unverified: the supplied CANN 8.5 alpha002 communication-path URL could not be retrieved. No SDMA/RDMA/Notify assignment is derived from it. Current backend/silicon issue width, sufficient SMT count, coroutine effectiveness, full device publication/coherence and robust wake/cancel/late-completion paths are unproven here.
- Proposed/inferred: target descriptor chain, tunable issue/SMT, software coroutine roles, end-to-end occupancy and cost ledger. Hot-address serialization remains. No candidate integration is promoted to current implementation, and no measured SSNPU win/PPA claim is made.

## Validation and artifact status

The revised article has 162 unique bibliography keys and 161 cited keys, with no missing citation, reference-label, or input-file targets.

Citation keys, input files, cross-reference targets, Markdown relative links and whitespace were checked statically. No implementation tests, benchmarks, synthesis or installs were run. Existing compiler discovery/build evidence still applies: no compatible installed pdfLaTeX/BibTeX was identified in the searched locations. The supplied 72-page PDF remains unchanged and predates this U006 source revision. Its prior rendering/contact-sheet QA does not validate the new source's rendered pagination or typography; a rebuild and new PDF QA remain pending.
