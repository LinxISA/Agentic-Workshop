# Article review record

Review date: 7 October 2026 UTC

## Deliverable

- English technical article covering U001–U008, with framing, a common cost/evidence method, synthesis, and reproducibility notes
- Approximately 30,500 words of section source, five editable TikZ figures, and 152 cited bibliography entries
- Review PDF: 72 A4 pages
- Source entry point: `main.tex`
- PDF: `superscalar-npu-eight-problems.pdf`

## Document production checks

- The supplied `build.sh` was run successfully using installed pdfTeX/LaTeX/BibTeX packages only
- Missing system TeX format/search caches were handled by workspace-local format and font-map generation; no software was downloaded or installed
- All 152 citation keys resolve; no duplicate bibliography keys or uncited bibliography entries were found
- Final LaTeX log has no unresolved references/citations, missing-glyph errors, or overfull boxes
- A few underfull boxes remain in a table cell and long bibliography entries; visual inspection, rather than hiding log warnings, is the acceptance criterion
- PNG pages were rendered with Poppler at 110 dpi; the entire document received visual inspection, including extra checks of diagrams, equations, tables, footnotes, and bibliography links

## Independent semantic review

The eight chapters and framing were independently reviewed against the supporting source packet. The review checked numerical contracts, ownership, physical-capacity accounting, ordering, target-versus-implementation claims, and the assumptions of the local recovery/progress arguments.

Corrections incorporated:

1. U002 uses charged physical allocation bytes, including envelopes and rounding, in its occupancy and byte-time equations. Logical payload bytes remain a separate quantity
2. Variable-size latency accounting uses a byte-weighted mean, with per-request latency distinguished from its average
3. U004 distinguishes returning atomic RMW from no-return updates, and states that local ordered prefixes alone do not establish stable order across independently reserved groups
4. The common service-rate lower bound explicitly assumes an upper service-capacity bound within its analytical model
5. U005 preserves the exact typed increasing-column fold, corrected CELL geometry and destination envelope, unsupported generic reduction mask, and incomplete FP8-helper boundary
6. U007's precise-state argument remains conditional on protected versions and controlled publication; escaped remote effects are outside a local rollback guarantee
7. U008's finite-batch proof retains its terminal-output, admission, service, and remote-delivery assumptions

Visual revisions included shortening an overflowing readiness-diagram label, shortening a badly wrapped heading, removing an isolated two-word continuation, and fitting the appendix without an almost-empty page.

## Evidence that remains bounded

- This review does not independently validate processor, compiler, model, runtime, or RTL behavior
- No model tests, implementation tests, benchmarks, synthesis, or physical PPA measurements were run
- Several references use mutable vendor documentation or public development previews. Their generation/version/access-date limits remain stated in the article
- The two CANN pages for SetAtomicAdd and Histograms retain the supplied source-review evidence because a fresh retrieval attempt failed
- LLVM #117 and API #249 head metadata is dated. Broader new-head validation is not asserted; earlier recognizer limits are identified as historical
- Whole-block B.CATR atomicity is a normative target contract whose enforcement was not demonstrated by the reviewed executable path
- API/type legality, executable arithmetic completeness, emitted ISA, timing behavior, and physical hardware are separate evidence levels

The article is ready as a review draft. It is not an architecture-performance ranking or a claim that implementation/evidence gaps are closed.

## U005 four PE handoff revision

The 7 October update adds independent complete groups versus distributed partials, a shared Tile Register handoff diagram, and a scope-matched comparison with GPU shared memory, Ascend GM/synchronization, and TPU DMA/semaphores.

Fresh primary-code inspection pinned FlashAttention to `94e22c906678e5483fa0e9e24d8e787bc2c0ed4c`, OneFlow to `25c8978c1c8b1371ef6aa4187dae4495bd233c35`, and CCCL to `dc7fcbdc47b3c75ca8871d448fe3a52cbc5a2e8c`. The current CCCL specialization is not claimed as the dependency selected by the pinned OneFlow build. Local arithmetic, shuffle exchange, shared accesses, barriers, and broadcast are separately identified.

Focused independent review checked the new code descriptions, generation/scope boundaries, exact-fold arithmetic, full instruction semantics, and benefit attribution. Its substantive correction is included: accumulator handoff can preserve arithmetic order through a separate supported mechanism, but current TROWSUM has no seed operand; full equivalence also needs complete-source preflight, numeric status, and atomic publication. Logical partial-byte counts are explicitly distinguished from physical shared transfers and retained CUBE envelopes.

The shared Tile Register remains an author-described target facility. No measured SSNPU speedup, shared-register latency/bandwidth, four-way scaling result, or PPA advantage is established. High bandwidth, short latency, and dependency-aware partial handoff are conditional benefit requirements, evaluated alongside competent GPU local/shuffle/shared-memory baselines.

Changed and reflowed PDF pages were rendered and visually reviewed before replacing the existing Library versions. No model or implementation tests were run.

## U006 source revision

**Source/PDF divergence:** U006 source and bibliography were revised on 7 October after the frozen PDF was imported. The supplied PDF remains the earlier 72-page artifact and does not contain this revision; no successful local rebuild is claimed. See [U006 revision review](U006-REVISION-REVIEW.md).
