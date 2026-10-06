# Agentic Circuit Course Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Synchronize the updated 44-page Keynote and add ten Agentic Circuit design slides after K37 while preserving a 75-minute two-session offline Slidev course.

**Architecture:** Exact Keynote pages remain immutable full-slide renders. Ten AGC pages use three focused Vue interactions plus deterministic HTML/CSS diagrams on source-derived full-bleed backgrounds. Existing q_proj, PTO core, ASL/NDF, and verification pages are renumbered without semantic changes.

**Tech Stack:** Keynote PDF export, Poppler rasterization, Slidev 52, Vue 3, Node test runner, Playwright Chromium, GitHub Pages.

## Global Constraints

- K01–K44 must map exactly once.
- New AGC syntax and passes must be labeled as proposed design, while pyCircuit capabilities must match `vendor/pyCircuit/docs/{PIPELINE,FRONTEND_API,IR_SPEC}.md`.
- Session 1 contains 35 slides and Session 2 contains 41 slides; each totals 75 minutes.
- No runtime network requests or CDN assets.
- Do not modify the user-owned Keynote.

---

### Task 1: Lock the 76-slide course contract

**Files:**
- Create: `qa/agc-course.spec.mjs`
- Modify: `qa/course-contracts.spec.mjs`
- Modify: `qa/image-manifest.spec.mjs`
- Modify: `scripts/check-content.mjs`
- Modify: `scripts/check-slide-blueprint.mjs`

**Interfaces:**
- Consumes: Slide metadata comments and `assets/generated/prompts.yaml`.
- Produces: failing expectations for S01–S76, K01–K44, AGC S40–S49, and shifted interaction IDs.

- [ ] Add tests asserting all ten AGC claims, explicit proposed-design language, Python construction-order semantics, Static/Runtime separation, cache-key source hashes, hierarchy preservation, queue materialization, and runtime responsibility.
- [ ] Change count and mapping expectations to 76 slides, 35+41 session split, and K01–K44.
- [ ] Run `node --test qa/agc-course.spec.mjs qa/course-contracts.spec.mjs qa/image-manifest.spec.mjs`; expect failures because S65–S76 and AGC content do not exist yet.

### Task 2: Synchronize the 44 Keynote pages and slide numbering

**Files:**
- Modify: `decks/session-1/slides.md`
- Modify: `decks/session-2/slides.md`
- Modify: `assets/generated/prompts.yaml`
- Modify: `assets/generated/v2-prompts.yaml`
- Modify: `content/architecture-sources.yaml`
- Modify: `assets/generated/slides/*.png`
- Modify: `public/generated/slides/*.png`

**Interfaces:**
- Consumes: `tmp/keynote-sync-20260803-v2/pages/page-01.png…page-44.png`.
- Produces: exact K01–K44 source pages at their new slide IDs and renumbered retained custom pages.

- [ ] Copy K02–K44 renders into paired asset directories with filenames derived from the target slide IDs.
- [ ] Insert the two new PTO Cheatsheet source pages at S30–S31 and shift K29–K33 plus the transfer lab.
- [ ] Map K34–K37 to S36–S39, K38–K44 to S63–S69, q_proj pages to S50–S62, and final custom pages to S70–S76.
- [ ] Update manifest hashes, dimensions, provenance, prompt ledger, and source catalog.

### Task 3: Implement AGC model contracts and interactions

**Files:**
- Create: `components/agcModels.mjs`
- Create: `components/AgcElaborationExplorer.vue`
- Create: `components/AgcSpecializationExplorer.vue`
- Create: `components/AgcPipelineStepper.vue`
- Test: `qa/agc-models.spec.mjs`

**Interfaces:**
- Produces: `canonicalizeStaticConfig`, `specializationKeyInput`, `elaborateNpuCity`, and `AGC_PIPELINE_STEPS` for the three Vue components.

- [ ] Write unit tests for deterministic key ordering, Static-only specialization identity, source/dependency hash inclusion, DMA removal, Cluster replication, and the ordered pipeline.
- [ ] Run `node --test qa/agc-models.spec.mjs`; expect module-not-found failure.
- [ ] Implement the minimal pure model functions and Vue presentations.
- [ ] Run `node --test qa/agc-models.spec.mjs`; expect all tests to pass.

### Task 4: Author the ten AGC slides and local backgrounds

**Files:**
- Modify: `decks/session-2/slides.md`
- Modify: `decks/session-2/style.css`
- Create: `assets/generated/slides/s40-*.png…s49-*.png`
- Create: `public/generated/slides/s40-*.png…s49-*.png`
- Modify: `assets/generated/prompts.yaml`
- Modify: `assets/generated/v2-prompts.yaml`

**Interfaces:**
- Consumes: the three AGC Vue components and approved spec wording.
- Produces: ten audience-facing pages between K37 and q_proj.

- [ ] Create ten heavily darkened source-derived backgrounds, each with a unique local filename.
- [ ] Add the ten slides with visible proposal boundaries and `[Sources]` notes referencing pyCircuit pipeline, frontend API, IR spec, and course design.
- [ ] Add scoped styles for code, hierarchy, decorator, key, canonicalization, IR, lowering, and responsibility diagrams.
- [ ] Run the AGC and course contract tests; expect all content assertions to pass.

### Task 5: Update routes, index, blueprints, and traceability

**Files:**
- Modify: `vite.preview.config.mjs`
- Modify: `scripts/build-index.mjs`
- Modify: `scripts/build-static-routes.mjs`
- Modify: `scripts/render-qa.mjs`
- Modify: `docs/TRACEABILITY.md`
- Modify: `README.md`
- Regenerate: `content/slides.json`

**Interfaces:**
- Produces: root entry cards for 35 and 41 slides, deep links through both final pages, and an auditable S01–S76 ledger.

- [ ] Update static and preview route limits.
- [ ] Update the homepage total to 76 and course cards to 35 and 41.
- [ ] Regenerate `content/slides.json` from deck metadata.
- [ ] Regenerate traceability and verify every source ID exists.

### Task 6: Build, visually inspect, publish, and verify

**Files:**
- Regenerate: `dist/**`
- Regenerate: `qa/rendered/**`, `qa/contact-sheets/**`, `qa/audit-*.json`

**Interfaces:**
- Produces: verified static Pages artifact and public student URL.

- [ ] Run targeted tests, then `npm test` and `npm run test:preview`.
- [ ] Run `npm run qa:render`; require 76/76 renders at each viewport, zero remote requests, and zero geometry issues.
- [ ] Inspect both contact sheets and full-resolution AGC slides; fix clipping, contrast, and overlap.
- [ ] Commit, push to `main`, wait for GitHub Pages success, and verify `/`, `/session-1/35/`, and `/session-2/41/` return HTTP 200.
