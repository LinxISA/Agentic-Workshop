# Architecture-First Tutorial Web Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the existing SummerSchool Slidev site as a 42-slide, architecture-first, full-bleed interactive tutorial derived from `PTO ISA_扩展版.pptx`, with one reviewed ImageGen asset per slide and reproducible offline experiments.

**Architecture:** Keep the two-deck Slidev structure and shared Vue component model. Store the canonical 42-slide inventory in machine-readable data, render every page through a shared full-bleed stage, use generated raster scenes for atmosphere, and layer exact processor diagrams and experiment results with Vue/SVG/Canvas. Reuse the existing experiment and offline pipeline, replacing the rejected card-oriented content and theme.

**Tech Stack:** Slidev 52.18.1, Vue 3, TypeScript/JavaScript, SVG/Canvas, Node.js, Python experiment scripts, Playwright, Sharp, built-in Image Gen.

## Global Constraints

- Exactly 42 slides: 21 in `session-1`, 21 in `session-2`.
- Exactly one unique, reviewed, full-bleed ImageGen background per slide.
- Architecture is the subject; Agentic Circuit/NDF/PTO-SPEC/pyCircuit/LinxCore are supporting tools and cases.
- PTO semantic claims use the pinned `vendor/pto-spec`; no Arm ASL, Sail Arm, or Isla.
- Generated art never supplies exact labels, ports, wiring, timing, equations, or measured data.
- All runtime assets are local and work with network disabled.
- Every slide has speaker notes with objective, timing, interaction, source, and claim boundary.
- No placeholder assets, remote URLs, text walls, card grids, or white screenshot charts.

---

## Target File Structure

```text
content/
  slides.json                     # canonical 42-slide inventory and timing
  architecture-sources.yaml       # claim-to-source mapping
assets/generated/slides/
  s01-architecture-first.png ... s42-architecture-first-closing.png
public/generated/slides/
  s01-architecture-first.png ... s42-architecture-first-closing.png
components/
  FullBleedStage.vue              # shared full-screen image/overlay frame
  ArchitectureZoom.vue            # system→chip→core→queue zoom
  InteractiveRoofline.vue         # Roofline model and controls
  MemoryHierarchyExplorer.vue     # latency/bandwidth/capacity/energy view
  NoCTraffic.vue                  # mesh traffic and congestion
  TileDataflow.vue                # TLOAD/TSTORE/local-buffer flow
  BankConflictExplorer.vue        # bank mapping and swizzle
  QueuePressure.vue               # issue/ROB/LSU occupancy and backpressure
  ArchitectureModelOverlay.vue    # architecture↔NDF mapping
  ExperimentPanel.vue             # reproducible experiment runner/results
decks/session-1/slides.md
decks/session-2/slides.md
styles/theme.css
scripts/check-slide-blueprint.mjs
scripts/check-image-prompts.mjs
scripts/check-content.mjs
docs/GOAL_PROMPT.md
docs/PRESENTER_RUNBOOK.md
docs/STUDENT_QUICKSTART.md
docs/VISUAL_QA.md
```

### Task 1: Lock the 42-slide Content Contract

**Files:**
- Create: `content/slides.json`
- Create: `content/architecture-sources.yaml`
- Create: `scripts/check-slide-blueprint.mjs`
- Modify: `package.json`
- Test: `scripts/check-slide-blueprint.mjs`

**Interfaces:**
- Produces: slide objects with `id`, `session`, `title`, `claim`, `background`, `overlay`, `interaction`, `minutes`, `sources`, and `claimBoundary`.
- Consumes: the canonical descriptions in `docs/GOAL_PROMPT.md`.

- [ ] **Step 1: Write the failing blueprint validator**

Create `scripts/check-slide-blueprint.mjs` that reads `content/slides.json` and fails unless IDs are exactly `S01`–`S42`, each session has 21 slides, every background is unique and local, required notes fields are non-empty, Session 1 timing is `<= 60`, and Session 2 timing is `<= 60`.

- [ ] **Step 2: Register the failing test**

Add to `package.json`:

```json
"test:blueprint": "node scripts/check-slide-blueprint.mjs"
```

Run: `npm run test:blueprint`  
Expected: FAIL because `content/slides.json` does not exist.

- [ ] **Step 3: Create the canonical slide inventory**

Translate all 42 entries from `docs/GOAL_PROMPT.md` into `content/slides.json`. Use `background` values such as `/generated/slides/s01-architecture-first.png`. Assign realistic timing totaling 55–58 minutes per session so interactions have slack.

- [ ] **Step 4: Create source and boundary mappings**

Write `content/architecture-sources.yaml` with source IDs for the source PPTX, Roofline equations, pinned PTO-SPEC files, LinxCore case-study files, pyCircuit model files, and experiment artifacts. Every slide must cite at least one source or explicitly state that it is a course synthesis.

- [ ] **Step 5: Verify and commit**

Run: `npm run test:blueprint`  
Expected: PASS with `42 slides; session timing within limit; backgrounds unique`.

```bash
git add content scripts/check-slide-blueprint.mjs package.json
git commit -m "docs: lock architecture tutorial slide contract"
```

### Task 2: Build the Full-Bleed Visual System

**Files:**
- Create: `components/FullBleedStage.vue`
- Create: `components/ArchitectureZoom.vue`
- Modify: `styles/theme.css`
- Modify: `layouts/BaseLayout.vue`
- Modify: `layouts/hero.vue`
- Modify: `layouts/section.vue`
- Test: `scripts/check-content.mjs`

**Interfaces:**
- Produces: `<FullBleedStage background title claim focus overlayTone>` with named slots `diagram`, `controls`, and `footer`.
- Produces: `<ArchitectureZoom :level :activePath>` for consistent multi-level camera transitions.

- [ ] **Step 1: Extend content checks to reject the old visual language**

Add failures for remote URLs, slides without `/generated/slides/` backgrounds, pages with more than 220 audience-facing Chinese characters, and use of deprecated card-grid classes.

- [ ] **Step 2: Run the content check**

Run: `npm run test:content`  
Expected: FAIL on the current card-oriented decks.

- [ ] **Step 3: Implement `FullBleedStage.vue`**

Implement background image preload, responsive cover crop, navy contrast scrim, configurable quiet title zone, deterministic overlay slot, source/footer slot, and reduced-motion behavior. Do not place architecture labels in the raster image.

- [ ] **Step 4: Replace the theme tokens**

Define the exact palette from the design spec, projection-safe type sizes, 5–7% safe margins, focus glow, data/compute/memory/bottleneck colors, and full-bleed transitions. Remove card shadows, repeated rounded panels, and dense dashboard styling.

- [ ] **Step 5: Implement architecture zoom continuity**

Create `ArchitectureZoom.vue` with levels `system`, `package`, `chip`, `cluster`, `core`, `queue`, and `cycle`. It must use deterministic SVG outlines and highlight the current level without asserting proprietary structures.

- [ ] **Step 6: Verify and commit**

Run: `npm run test:content`  
Expected: current deck may still fail slide inventory requirements, but component/theme static checks pass.

```bash
git add components/FullBleedStage.vue components/ArchitectureZoom.vue styles layouts scripts/check-content.mjs
git commit -m "feat: add full-bleed architecture visual system"
```

### Task 3: Generate and Audit Session 1 Image Assets

**Files:**
- Create: `assets/generated/slides/s01-*.png` through `s21-*.png`
- Create: `public/generated/slides/s01-*.png` through `s21-*.png`
- Modify: `assets/generated/prompts.yaml`
- Create: `scripts/check-image-prompts.mjs`

**Interfaces:**
- Consumes: the global ImageGen prefix and S01–S21 descriptions in `docs/GOAL_PROMPT.md`.
- Produces: 21 distinct local raster assets and 21 traceable prompt records.

- [ ] **Step 1: Write the prompt/asset validator**

Require one record and one existing asset for every slide ID, unique prompt text, `review: pass`, no remote path, and identical filenames between `assets/generated/slides/` and `public/generated/slides/`.

- [ ] **Step 2: Generate S01–S07**

Call the built-in Image Gen separately for each slide. Use the global prefix plus the exact slide-specific scene. Inspect every result with `view_image`, regenerate only for a named defect, then copy the selected final image into both project locations.

- [ ] **Step 3: Generate S08–S14**

Repeat the one-call-per-asset workflow. Reject pseudo-text, ambiguous memory levels, cluttered city imagery, and any generated structure that looks like a claimed exact chip floorplan.

- [ ] **Step 4: Generate S15–S21**

Repeat the workflow. Ensure TLOAD/TSTORE, double buffering, banking, and scheduling art leaves clean space for exact SVG overlays.

- [ ] **Step 5: Validate and commit**

Run: `node scripts/check-image-prompts.mjs --session 1`  
Expected: PASS with 21 unique reviewed assets.

```bash
git add assets/generated public/generated scripts/check-image-prompts.mjs
git commit -m "assets: generate session one architecture scenes"
```

### Task 4: Implement Session 1 Architecture Interactions

**Files:**
- Create: `components/InteractiveRoofline.vue`
- Create: `components/MemoryHierarchyExplorer.vue`
- Create: `components/NoCTraffic.vue`
- Create: `components/TileDataflow.vue`
- Create: `components/BankConflictExplorer.vue`
- Modify: `components/TimingDiagram.vue`
- Test: `qa/component-contracts.spec.mjs`

**Interfaces:**
- `InteractiveRoofline`: props `peakFlops`, `bandwidth`, `arithmeticIntensity`, `cacheHitRate`; emits `bottleneck-change`.
- `MemoryHierarchyExplorer`: consumes local JSON levels and exposes selected level metrics.
- `NoCTraffic`: accepts mesh dimensions, injection rate, hotspot ratio, and link bandwidth.
- `TileDataflow`: accepts tile shape, bank count, and overlap mode.
- `BankConflictExplorer`: accepts stride and swizzle mode; returns conflict degree.

- [ ] **Step 1: Write component contract tests**

Test the Roofline formula, ridge point, hierarchy selection, NoC saturation, double-buffer overlap, and bank-conflict calculation using deterministic fixtures.

- [ ] **Step 2: Run tests and confirm failure**

Run: `node --test qa/component-contracts.spec.mjs`  
Expected: FAIL because the components and helpers do not exist.

- [ ] **Step 3: Implement the Roofline and hierarchy components**

Use SVG axes and local numeric fixtures. Provide keyboard-accessible controls, reset, current bottleneck text, and a stable non-animated state for PDF export.

- [ ] **Step 4: Implement NoC and Tile components**

Use deterministic grids and timing. Do not generate traffic randomly; scenario IDs must map to checked-in fixtures.

- [ ] **Step 5: Implement bank and timing components**

Display exact bank mapping, conflict degree, and LOAD/COMPUTE/STORE overlap. Avoid tiny labels and more than three simultaneous control groups.

- [ ] **Step 6: Verify and commit**

Run: `node --test qa/component-contracts.spec.mjs`  
Expected: PASS.

```bash
git add components qa/component-contracts.spec.mjs
git commit -m "feat: add roofline memory and tile interactions"
```

### Task 5: Rebuild Session 1 Slides

**Files:**
- Modify: `decks/session-1/slides.md`
- Modify: `scripts/check-content.mjs`
- Test: `decks/session-1/slides.md`

**Interfaces:**
- Consumes: S01–S21 entries from `content/slides.json`, Session 1 images, and Task 4 components.
- Produces: exactly 21 full-screen Slidev pages with complete speaker notes.

- [ ] **Step 1: Rewrite S01–S07**

Implement the cover, performance mystery, workload, Roofline derivation, interactive Roofline, arithmetic intensity, and locality slides exactly as specified in the goal prompt.

- [ ] **Step 2: Rewrite S08–S14**

Implement latency-as-days, hierarchy, concurrency, processor city, package/HBM/DDR, NoC, and Tile/CUBE slides.

- [ ] **Step 3: Rewrite S15–S21**

Implement TLOAD/TSTORE, double buffer, bank conflict, scheduling, causal performance graph, Agentic Circuit mapping, and session challenge.

- [ ] **Step 4: Add speaker notes**

For every page add objective, 1–5 minute timing, interaction cue, source IDs, and one claim boundary. Total timing must stay at or below 60 minutes.

- [ ] **Step 5: Verify and commit**

Run: `npm run test:blueprint && npm run test:content && npm run build:1`  
Expected: PASS.

```bash
git add decks/session-1/slides.md
git commit -m "feat: rebuild session one around architecture performance"
```

### Task 6: Generate and Audit Session 2 Image Assets

**Files:**
- Create: `assets/generated/slides/s22-*.png` through `s42-*.png`
- Create: `public/generated/slides/s22-*.png` through `s42-*.png`
- Modify: `assets/generated/prompts.yaml`

**Interfaces:**
- Consumes: the global prefix and S22–S42 descriptions in `docs/GOAL_PROMPT.md`.
- Produces: 21 distinct local raster assets and prompt records.

- [ ] **Step 1: Generate S22–S28**

Generate and inspect one asset per slide. LinxCore imagery must remain a neutral modular processor case study and must not invent named module details.

- [ ] **Step 2: Generate S29–S35**

Generate issue, execute, load/store, miss propagation, backpressure, NDF projection, and cycle-model scenes. Leave exact queue entries and signal paths to overlays.

- [ ] **Step 3: Generate S36–S42**

Generate experiment, sweep, predicted-vs-measured, agent loop, Pareto, and closing scenes. The agent loop must contain no humanoid robot.

- [ ] **Step 4: Validate and commit**

Run: `node scripts/check-image-prompts.mjs --session 2`  
Expected: PASS with 21 unique reviewed assets.

```bash
git add assets/generated public/generated
git commit -m "assets: generate session two microarchitecture scenes"
```

### Task 7: Implement Session 2 Microarchitecture Interactions

**Files:**
- Modify: `components/LinxCoreModuleExplorer.vue`
- Create: `components/QueuePressure.vue`
- Create: `components/ArchitectureModelOverlay.vue`
- Create: `components/ExperimentPanel.vue`
- Modify: `components/PipelineStepper.vue`
- Modify: `components/TraceComparator.vue`
- Modify: `components/ParetoFrontier.vue`
- Test: `qa/microarchitecture-contracts.spec.mjs`

**Interfaces:**
- `QueuePressure`: deterministic entries, dependencies, issue ports, ROB head, and backpressure state.
- `ArchitectureModelOverlay`: maps architecture element IDs to NDF IDs and evidence IDs.
- `ExperimentPanel`: loads checked-in artifact JSON/CSV and can invoke a local experiment when available.

- [ ] **Step 1: Write failing model and trace tests**

Test queue readiness, in-order commit, miss-induced backpressure, architecture-to-NDF mapping, artifact schema validation, and Pareto dominance.

- [ ] **Step 2: Run tests and confirm failure**

Run: `node --test qa/microarchitecture-contracts.spec.mjs`  
Expected: FAIL.

- [ ] **Step 3: Refactor the LinxCore and pipeline views**

Expose frontend, rename/ROB, issue, execute, LSU, and commit as selectable architecture regions. Keep all claims tied to inspected source or clearly labeled course models.

- [ ] **Step 4: Implement queue and backpressure views**

Render explicit state ownership, ready/valid, occupancy, wakeup/select, ROB head, replay, and pressure propagation.

- [ ] **Step 5: Implement model/evidence overlays**

Connect architecture IDs to NDF clauses, pyCircuit state, trace rows, and experiment artifacts without mixing normative and implementation layers.

- [ ] **Step 6: Verify and commit**

Run: `node --test qa/microarchitecture-contracts.spec.mjs`  
Expected: PASS.

```bash
git add components qa/microarchitecture-contracts.spec.mjs
git commit -m "feat: add microarchitecture and evidence interactions"
```

### Task 8: Rebuild Session 2 Slides

**Files:**
- Modify: `decks/session-2/slides.md`
- Test: `decks/session-2/slides.md`

**Interfaces:**
- Consumes: S22–S42 inventory, generated images, microarchitecture components, and experiment artifacts.
- Produces: exactly 21 full-screen pages with speaker notes.

- [ ] **Step 1: Rewrite S22–S28**

Implement the processor zoom, LinxCore boundary, PTO-SPEC contract, cross-layer mapping, pipeline, frontend, and rename/ROB pages.

- [ ] **Step 2: Rewrite S29–S35**

Implement issue, execute, LSU, cache-miss propagation, backpressure, NDF, and pyCircuit pages.

- [ ] **Step 3: Rewrite S36–S42**

Implement baseline, parameter sweeps, predicted-vs-measured, agent loop, Pareto, and architecture-first closing pages.

- [ ] **Step 4: Add speaker notes and timing**

Ensure every page has the complete note contract and Session 2 totals no more than 60 minutes.

- [ ] **Step 5: Verify and commit**

Run: `npm run test:blueprint && npm run test:content && npm run build:2`  
Expected: PASS.

```bash
git add decks/session-2/slides.md
git commit -m "feat: rebuild session two around microarchitecture research"
```

### Task 9: Align Reproducible Experiments with the New Story

**Files:**
- Modify: `experiments/run_all.py`
- Modify: `experiments/03_pycircuit_pipeline/run.py`
- Modify: `experiments/04_microarch_trace_compare/run.py`
- Modify: `experiments/05_linxcore_queue/run.py`
- Modify: `experiments/08_design_space_pareto/run.py`
- Create: `experiments/09_roofline_sweep/run.py`
- Create: `experiments/10_memory_hierarchy_sweep/run.py`
- Modify: `experiments/tests/test_smoke.py`
- Modify: `experiments/README.md`

**Interfaces:**
- Produces: fixed-schema JSON/CSV for Roofline, memory hierarchy, queue pressure, trace gaps, and Pareto slides.

- [ ] **Step 1: Add failing smoke tests**

Require deterministic outputs for bandwidth sweep, cache hit-rate sweep, queue-depth sweep, predicted/measured gap decomposition, and Pareto dominance.

- [ ] **Step 2: Run and confirm failure**

Run: `python3 -m pytest experiments/tests/test_smoke.py -q`  
Expected: FAIL for missing experiments 09 and 10.

- [ ] **Step 3: Implement the Roofline sweep**

Use fixed workload FLOPs/Bytes and a documented analytic model. Emit bandwidth, AI, predicted performance, measured/model performance, and active bottleneck.

- [ ] **Step 4: Implement the hierarchy sweep**

Sweep capacity, hit rate, miss latency, outstanding requests, and queue depth using deterministic scenarios. Emit traceable intermediate terms rather than only final IPC.

- [ ] **Step 5: Align existing microarchitecture artifacts**

Update queue, trace comparison, and Pareto outputs to expose the exact metrics consumed by S29–S41.

- [ ] **Step 6: Verify and commit**

Run: `npm run experiments`  
Expected: PASS and refreshed artifacts committed.

```bash
git add experiments
git commit -m "feat: add architecture bottleneck experiments"
```

### Task 10: Enforce Image, Source, Content, and Offline Gates

**Files:**
- Modify: `scripts/check-content.mjs`
- Modify: `scripts/check-offline.mjs`
- Modify: `scripts/check-sources.sh`
- Modify: `package.json`
- Modify: `qa/audit.json`

**Interfaces:**
- Consumes: slide inventory, prompt manifest, generated assets, sources, built decks.
- Produces: one `npm test` gate that rejects missing/duplicate art, remote dependencies, timing overflow, source gaps, and slide-count drift.

- [ ] **Step 1: Add all new checks to `npm test`**

Order tests as sources → blueprint → image prompts → experiments → content → build → offline.

- [ ] **Step 2: Prove the offline gate catches a remote request**

Add a temporary fixture in the test harness, assert rejection, then keep only the permanent detector—not the bad fixture—in the final tree.

- [ ] **Step 3: Run the complete non-visual suite**

Run: `npm test`  
Expected: PASS with 42 slides and 42 local unique backgrounds.

- [ ] **Step 4: Commit**

```bash
git add scripts package.json qa/audit.json
git commit -m "test: enforce architecture tutorial delivery gates"
```

### Task 11: Perform Full Visual QA and Repair Every Slide

**Files:**
- Modify as needed: `decks/`, `components/`, `styles/`, `assets/generated/slides/`
- Modify: `docs/VISUAL_QA.md`
- Create: `docs/visual-qa/session-1-contact-sheet.png`
- Create: `docs/visual-qa/session-2-contact-sheet.png`

**Interfaces:**
- Produces: screenshot evidence and per-slide review status for all 42 pages.

- [ ] **Step 1: Render all pages at 1920×1080**

Run: `npm run qa:render && npm run qa:contact`  
Expected: 42 screenshots and two contact sheets.

- [ ] **Step 2: Review every full-resolution screenshot**

For each slide record pass/fail for image relevance, full-bleed crop, title contrast, architecture accuracy, label readability, overlay alignment, interaction fallback, and style continuity.

- [ ] **Step 3: Repair failures one cause at a time**

Regenerate art only for raster problems. Fix technical problems in SVG/Vue. Re-render the affected slide and update the review record.

- [ ] **Step 4: Verify zero visual failures**

Run: `npm run qa:render && npm run qa:contact`  
Expected: all 42 slides marked pass in `docs/VISUAL_QA.md`.

- [ ] **Step 5: Commit**

```bash
git add decks components styles assets/generated public/generated docs/VISUAL_QA.md docs/visual-qa
git commit -m "fix: complete per-slide visual quality review"
```

### Task 12: Finish Presenter, Student, PDF, and Offline Delivery

**Files:**
- Modify: `README.md`
- Modify: `docs/PRESENTER_RUNBOOK.md`
- Modify: `docs/STUDENT_QUICKSTART.md`
- Modify: `docs/OFFLINE_BUNDLE.md`
- Modify: `docs/TRACEABILITY.md`

**Interfaces:**
- Produces: a self-contained presenter workflow and student entry path.

- [ ] **Step 1: Update course documentation**

Describe the architecture-first positioning, two-session timing, six core interactions, local experiment fallback, and the boundary between PTO-SPEC, LinxCore, NDF, pyCircuit, and Agentic Circuit.

- [ ] **Step 2: Rebuild traceability**

Run: `npm run traceability`  
Expected: all 42 slide IDs connect to sources, components, experiments, and evidence where applicable.

- [ ] **Step 3: Run final verification**

```bash
npm ci
npm run experiments
npm run test:content
npm run build
npm run test:offline
npm run export
npm run qa:render
npm run qa:contact
```

Expected: every command exits 0; both PDFs exist; `dist/` loads with network disabled; all visual reviews pass.

- [ ] **Step 4: Commit the delivery documentation**

```bash
git add README.md docs
git commit -m "docs: finalize architecture tutorial delivery"
```

## Self-Review Results

- Spec coverage: all design requirements map to Tasks 1–12.
- Page coverage: S01–S42 are specified in `docs/GOAL_PROMPT.md` and enforced in Task 1.
- ImageGen coverage: 42 unique calls, project-local persistence, prompt manifest, and visual review are covered in Tasks 3, 6, 10, and 11.
- Architecture accuracy: exact information is isolated in deterministic components in Tasks 4 and 7.
- Reproducibility/offline: experiments and delivery gates are covered in Tasks 9, 10, and 12.
- Placeholder scan: the plan contains no deferred page, asset, interaction, or verification requirement.

