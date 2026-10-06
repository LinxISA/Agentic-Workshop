# Keynote Pages 02–09 Web Adaptation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reproduce Keynote pages 2–9 exactly as offline Slidev pages 2–9, with restrained web-native focus animation.

**Architecture:** Render the eight Keynote pages from the exported vector PDF into local 1920×1080 PNGs. A focused Vue stage component displays each source render unchanged and adds optional non-obscuring focus animation plus click-driven progression where the deck contract expects interaction.

**Tech Stack:** Keynote PDF export, Poppler `pdftoppm`, Slidev 52, Vue 3, CSS animation, Node test runner, Playwright Chromium.

## Global Constraints

- Modify only first-session slides S02–S09 and their directly owned assets/metadata.
- Preserve source-page copy verbatim.
- Do not use or inspect source page 10 or later.
- Bundle every visual locally and make zero remote requests.
- Decorative animation must not obscure source content and must respect reduced-motion preferences.

---

### Task 1: Produce exact source-page assets

**Files:**
- Create: `assets/generated/slides/s02-self-introduction.png` through `s09-davinci-architecture.png`
- Create: matching runtime files under `public/generated/slides/`
- Modify: `assets/generated/prompts.yaml`

**Interfaces:**
- Consumes: Keynote PDF pages 2–9.
- Produces: eight `/generated/slides/*.png` background URLs and immutable SHA-256 records.

- [ ] Render pages 2–9 at exactly 1920×1080.
- [ ] Copy each asset into both source and runtime asset directories.
- [ ] Update the S02–S09 image-manifest records with the source-page mapping and hashes.
- [ ] Run `npm run test:images`; expect all 42 image records to pass.

### Task 2: Add the source-page stage

**Files:**
- Create: `components/KeynoteSourceStage.vue`
- Create: `components/keynoteSourceStageModel.mjs`
- Create: `qa/keynote-source-stage.spec.mjs`

**Interfaces:**
- Consumes: `background`, `slideId`, `focuses`, and `interactive` props.
- Produces: a full-bleed source page, optional animated focus regions, and a click-driven focus control.

- [ ] Write tests for focus normalization, bounded regions, and non-interactive state.
- [ ] Run `node --test qa/keynote-source-stage.spec.mjs`; expect the initial module import to fail.
- [ ] Implement the model and Vue component with reduced-motion support.
- [ ] Re-run the targeted test; expect all cases to pass.

### Task 3: Map deck pages 2–9 one-to-one

**Files:**
- Modify: `decks/session-1/slides.md`
- Modify: `content/slides.json`

**Interfaces:**
- Consumes: `KeynoteSourceStage` and the eight new backgrounds.
- Produces: S02–S09 with exact source titles and source-aligned speaker notes.

- [ ] Replace only the eight `FullBleedStage` blocks for S02–S09.
- [ ] Preserve exact source titles and record `publish-keynote-page-N` in each Sources note.
- [ ] Add focus sequences to the architecture diagrams without introducing visible copy.
- [ ] Run `npm run blueprint:sync && npm run test:blueprint`; expect 42 valid records.

### Task 4: Build and visually verify

**Files:**
- Modify: `qa/audit.json`
- Create/update: `qa/rendered/session-1/02.png` through `09.png` as ignored QA output.

**Interfaces:**
- Consumes: built Slidev session and local asset set.
- Produces: visual evidence for exact mapping and geometry safety.

- [ ] Run `npm run build:1`; expect a successful offline production build.
- [ ] Run `npm run qa:render` against the local preview; expect 42 rendered slides, zero remote requests, and zero geometry issues.
- [ ] Inspect slides 2–9 at full size against source pages 2–9.
- [ ] Run the focused content, blueprint, image, and component tests; expect zero failures.
- [ ] Commit the bounded change as one reviewable revision.
