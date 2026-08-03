# Architecture-First 76-Slide Tutorial Implementation Plan

## Outcome

Build an offline-capable Slidev tutorial with two 75-minute sessions and 76 full-bleed slides. The first session has 35 slides and moves from chip-city spatial resources to PTO data-movement time. The second has 41 slides and introduces Agentic Circuit as an executable architecture-generation language before moving from Qwen3-14B `q_proj` PTO Trace through DaVinciOO gfsim/SimQueue and parameter exploration to PTO-ASL, NDF and a pyCircuit vertical slice. Agentic Circuit remains the modeling and evidence instrument rather than the subject of the course.

## Work packages

1. **Lock the narrative contract**
   - Keep exactly 35 slides in Session 1 and 41 slides in Session 2.
   - Give every page one objective, one claim, one architecture visual, one interaction, sources, a claim boundary, timing, and presenter notes.
   - Use `vendor/pto-spec` as the only normative ISA semantic source; explicitly separate PTO-ASL, DaVinciOO extensions, gfsim routing/evidence, NDF, pyCircuit, and course-model claims.

2. **Build the visual system**
   - Derive a dark navy, cyan, lime, amber, and magenta design language from `PTO ISA_扩展版.pptx`.
   - Preserve the 44 Keynote source pages as exact local renders, retain the 22 reviewed ImageGen backgrounds, and add ten deterministic source-derived AGC backdrops.
   - Keep labels, numerical plots, wiring, waveforms, and traces deterministic in Vue/SVG.

3. **Implement the two sessions**
   - Session 1: chip city → Roofline → CUBE/DaVinci/Ascend SoC → memory/interconnect hierarchy → PTO Tile → transfer-time experiment.
   - Session 2: q_proj → PTO/Trace → SimQueue/gfsim → cycle causality → parameter search → evidence → PTO-ASL/NDF → pyCircuit/Core.
   - Reuse interaction grammar: step, play/pause, reset, controlled parameter sweep, and evidence reveal.

4. **Make experiments reproducible**
   - Keep all experiments deterministic and runnable without network access.
   - Store JSON/CSV artifacts beside experiment code.
   - Include bandwidth and cache/locality/queue-depth sweeps that connect macro Roofline predictions to cycle-level evidence.

5. **Package for offline delivery**
   - Produce `/dist/session-1/`, `/dist/session-2/`, a local index, and two PDFs.
   - Bundle images, fonts, scripts, and pre-generated results locally; reject remote runtime requests.

6. **Verify before release**
   - Run source, blueprint, image-manifest, model, experiment, content, build, and offline tests.
   - Render all 76 pages at 1920×1080 and 1366×768.
   - Reject overflow, clipping, broken images, unreadable contrast, three-line titles, and intersections between the title block and deterministic overlays.
   - Review both contact sheets and representative full-resolution interaction pages.

## Done criteria

- `npm test` passes from a clean dependency install.
- `npm run export` creates both PDFs.
- Browser QA reports 76/76 pages at both target sizes, zero geometry issues, zero contrast issues, zero image issues, and zero remote requests.
- The tutorial remains useful when ImageGen art is removed: every technical claim is still carried by deterministic labels, models, traces, or experiment artifacts.
