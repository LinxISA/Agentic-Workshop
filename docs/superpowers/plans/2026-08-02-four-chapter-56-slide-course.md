# Four-Chapter 56-Slide Summer School Implementation Plan

## Outcome

Replace the current 42-slide, LinxCore-centered tutorial with two offline Slidev sessions of 28 slides each. Preserve all 34 Keynote source pages and extend them into the architecture-first narrative:

`空间资源 → 时间代价 → 可执行模型 → 参数搜索 → 规范约束 → Agent 驱动实现 → 实验证据`

Session 1 contains chapters 1–2. Session 2 contains chapters 3–4. Qwen3-14B `q_proj` is the end-to-end case study. PTO-ASL is the semantic source; NDF is the implementation contract; DaVinciOO gfsim/SimQueue is the cycle model; pyCircuit is the implementation surface. ARM ASL and LinxCore are out of the main narrative.

## Global Constraints

- Exactly 28 slides per session and 56 total; 75 minutes per session.
- Map every Keynote source page 1–34 exactly once. Preserve visible source wording on migrated pages.
- Keep existing source-page visual composition. Use Image Gen only for new or intentionally refined bitmap visuals; all labels, code, architecture wiring, charts, formulas, and timing remain deterministic HTML/SVG.
- `TLOAD/TMOV/TEXTRACT/TPUSH/TPOP` semantics come from `vendor/pto-spec`; `TPUT/TGET` must be labeled DaVinciOO communication extensions.
- Qwen `q_proj` reference evidence is 562 trace records and 11028 cycles, but current fresh output governs acceptance.
- Both decks, experiments, fonts, and visuals must work offline with no runtime network requests.
- Preserve `/`, `/session-1/`, and `/session-2/` routes and keyboard navigation; remove meaningless flashing focus frames.
- Speaker notes on every slide include teaching objective, transition, claim boundary, and `[Sources]`.

## Task 1: Source, narrative, and semantic ledger

- Inventory Keynote pages 1–34 and map them to web pages 1–56.
- Record exact visible text, teaching objective, source visual, and required enhancement.
- Record PTO-ASL semantics, DaVinciOO extension boundaries, opcode-to-engine routing, q_proj trace facts, and NDF/pyCircuit sources.
- Update the course blueprint and traceability data consumed by QA.

## Task 2: Session 1 — chapters 1 and 2

- Build exactly 28 slides according to the approved page blueprint.
- Preserve Keynote pages 1–26; insert the architecture coordinate-system synthesis and transfer-time lab.
- Add deterministic interactions for Roofline, clock conversion, memory hierarchy, architecture layers, PTO engine selection, and transfer-time calculation.
- Add failing tests for the new page count, timing, transfer model, semantic labels, and interaction placement before implementation.

## Task 3: q_proj model lab and offline evidence

- Add a reproducible DaVinciOO `q_proj` flow wrapper that uses environment variables, never committed absolute paths.
- Add compact offline trace/summary/timeline fixtures and parameter-sweep results.
- Cover ROB depth, tile tags, TMA bandwidth, Cube MACs/cycle, and engine count; report bottleneck sensitivity without inventing equivalence.
- Add tests that first fail for missing artifacts/contracts and then pass.

## Task 4: Session 2 — chapters 3 and 4

- Build exactly 28 slides according to the approved page blueprint.
- Replace the LinxCore main line with `pypto → PTO → trace → gfsim/SimQueue → parameter search → PTO-ASL → NDF → pyCircuit`.
- Preserve Keynote pages 27–34 and add q_proj, trace anatomy, SimQueue, DaVinciOO topology, cycle playback, sweep, ASL/NDF, vertical slice, and closed-loop evidence pages.
- Add deterministic interactive trace, queue, topology, parameter-sweep, and verification components.
- Add failing tests for page count, content boundaries, mappings, and interactions before implementation.

## Task 5: Visual assets and offline packaging

- Generate or select distinct full-bleed visuals for all new pages using the established dark navy/cyan/warm compute visual system.
- Image Gen output contains no text, numbers, logos, or exact wiring; save final project assets and prompt provenance locally.
- Update image manifest, local public copies, homepage descriptions, PDFs, and presenter runbook.

## Task 6: Integrated QA and final review

- Run source, blueprint, image, component, experiment, content, route, build, offline, and export checks.
- Render all 56 pages at 1920×1080 and 1366×768; review contact sheets and representative full-size slides.
- Fix overflow, wrapping, clipping, contrast, missing assets, stale LinxCore claims, and unsupported architecture claims.
- Run an independent final review against this plan and preserve the worktree for user review.

## Done Criteria

- `npm test` passes with 56 deck-backed slides and fresh q_proj evidence.
- `npm run export` creates both 28-page PDFs.
- Homepage opens both decks and all keyboard controls work offline.
- Every Keynote source page has an auditable mapping; every technical claim has a source or experiment artifact.
- The course remains coherent without generated art because all technical information is deterministic and sourced.
