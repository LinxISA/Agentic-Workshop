# Architecture-First Tutorial Implementation Plan

## Outcome

Build a private, offline-capable Slidev tutorial with two 60-minute sessions and 42 full-bleed slides. The deck teaches computer architecture through Roofline, locality, the memory hierarchy, queue pressure, LinxCore microarchitecture, PTO semantic boundaries, NDF traceability, pyCircuit cycle models, and reproducible experiments. Agentic Circuit remains the modeling and evidence instrument rather than the subject of the course.

## Work packages

1. **Lock the narrative contract**
   - Keep exactly 21 slides per session.
   - Give every page one objective, one claim, one architecture visual, one interaction, sources, a claim boundary, timing, and presenter notes.
   - Use `vendor/pto-spec` as the only ISA semantic source; explicitly separate PTO, LinxCore, NDF, pyCircuit, and course-model claims.

2. **Build the visual system**
   - Derive a dark navy, cyan, lime, amber, and magenta design language from `PTO ISA_扩展版.pptx`.
   - Generate one independent full-bleed ImageGen background for every slide.
   - Keep labels, numerical plots, wiring, waveforms, and traces deterministic in Vue/SVG.

3. **Implement the two sessions**
   - Session 1: workload → Roofline → locality → memory hierarchy → concurrency → NoC → Tile/dataflow → architecture causality.
   - Session 2: LinxCore → semantic boundary → pipeline/queues → frontend/rename/issue/execute/LSU → backpressure → NDF/pyCircuit → controlled experiments → Pareto choice.
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
   - Render all 42 pages at 1920×1080.
   - Reject overflow, clipping, broken images, unreadable contrast, three-line titles, and intersections between the title block and deterministic overlays.
   - Review both contact sheets and representative full-resolution interaction pages.

## Done criteria

- `npm test` passes from a clean dependency install.
- `npm run export` creates both PDFs.
- Browser QA reports 42/42 pages, zero geometry issues, zero contrast issues, zero image issues, and zero remote requests.
- The tutorial remains useful when ImageGen art is removed: every technical claim is still carried by deterministic labels, models, traces, or experiment artifacts.
