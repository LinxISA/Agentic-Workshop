# Architecture-First Summer School Tutorial Design

**Date:** 2026-08-01
**Source template:** `PTO ISA_扩展版.pptx` (presenter-provided source; not stored in this repository)
**Delivery:** two 60-minute Chinese Slidev sessions, fully offline
**Audience:** graduate students and early-career computer-architecture researchers

## Design Decision

Rebuild the tutorial around computer-architecture reasoning. Agentic Circuit, NDF, PTO executable specifications, pyCircuit, and LinxCore are supporting instruments used to express, run, and explore architecture models; they are not the narrative subject.

The source deck is a visual and narrative template rather than a slide-for-slide migration. Preserve its strongest ideas—dark navy canvas, cyan/yellow architecture encoding, logistics metaphors, Roofline, memory hierarchy, Tile execution, and layered scheduling—while replacing text-heavy and code-heavy pages with full-screen architecture scenes and deterministic interactive overlays.

## Course Promise

By the end, a student should be able to:

1. turn a workload into FLOP and byte requirements;
2. locate it on a Roofline and explain the active bottleneck;
3. reason about latency, bandwidth, locality, concurrency, and capacity across a memory hierarchy;
4. move from system, chip, cluster, core, queue, and execution-unit views without losing causality;
5. encode the same architecture as an executable Agentic Circuit/NDF model;
6. run reproducible sweeps and distinguish a plausible design from an evidenced design;
7. explain why the architecture conclusion remains primary even when an agent proposes the experiments.

## Narrative Architecture

### Session 1 — Architecture Performance: Compute Is Only Half the Machine

Start with the performance gap between advertised FLOPS and achieved throughput. Build Roofline from first principles, then zoom through memory hierarchy, package, NoC, Tile, TLOAD/TSTORE, buffering, bank conflicts, and scheduling. Introduce Agentic Circuit only after the students already understand the architecture variables that need modeling.

### Session 2 — Architecture Research: From Microarchitecture to Design Exploration

Use PTO-SPEC as the workload/ISA contract and LinxCore as the processor case study. Zoom through frontend, rename/ROB, issue, execute, load/store, cache, interconnect, and backpressure. Map those objects into NDF and pyCircuit, reproduce measurements, sweep parameters, compare against Roofline, and close with an agent-assisted Pareto loop.

## Visual System

- Canvas: 16:9, 1920×1080 reference, full-bleed.
- Image occupancy: 85–100% of every slide.
- Text: one title, one claim, and only essential labels; no paragraph walls.
- Palette: navy `#061A3A`, electric cyan `#17D9FF`, compute yellow `#FFBE00`, memory lime `#B9FF33`, bottleneck magenta `#F16BB5`, off-white `#F5F8FF`.
- Visual rhythm: panorama → zoom → cutaway → dataflow → timeline → measured result.
- ImageGen: one unique full-screen raster scene per slide. It supplies atmosphere, physical metaphor, material, depth, and composition.
- Deterministic layers: SVG/Vue/Canvas supply exact axes, numeric values, module names, ports, arrows, queues, state, timing, traces, and experiment data.
- Generated images contain no words, pseudo-text, logos, watermarks, precise wiring, or numeric claims.
- The original deck's delivery-road-warehouse metaphor is retained only when it directly explains data movement.

## Interaction Grammar

Every interaction must change an architecture variable and reveal a consequence:

- Roofline: compute peak, bandwidth, arithmetic intensity, cache reuse.
- Memory hierarchy: level selection, latency, bandwidth, capacity, hit rate.
- NoC: injection rate, link width, hop count, congestion.
- Tile: TLOAD/TSTORE overlap, double buffering, bank mapping.
- Core: width, queue depth, latency, miss rate, backpressure.
- Design explorer: parameter sweep, constraint filtering, Pareto selection.

No interaction is allowed to be a decorative carousel or an unrelated UI control.

## Slide Inventory

The approved implementation contains 42 slides: 21 per session. The complete per-slide teaching, visual, interaction, and ImageGen specification is canonical in `docs/GOAL_PROMPT.md`.

Session 1 sequence:

1. architecture-first cover;
2. peak-versus-realized performance mystery;
3. workload as computation plus data movement;
4. derive the Roofline axes;
5. interactive Roofline;
6. arithmetic intensity;
7. locality moves the operating point;
8. memory latency as days;
9. bandwidth/capacity hierarchy;
10. concurrency and MLP;
11. processor as a city;
12. package, HBM, and DDR;
13. NoC congestion;
14. Tile/CUBE locality;
15. TLOAD/TSTORE path;
16. double buffering;
17. bank conflict and swizzle;
18. scheduling hierarchy;
19. performance equation;
20. architecture-to-Agentic-Circuit mapping;
21. session challenge and recap.

Session 2 sequence:

22. processor zoom cover;
23. LinxCore case-study boundary;
24. PTO-SPEC workload/ISA contract;
25. software-to-hardware mapping;
26. core pipeline overview;
27. fetch/decode;
28. rename, ROB, and precise state;
29. issue queue and readiness;
30. execution pipelines;
31. load/store subsystem;
32. caches, misses, and NoC;
33. backpressure loop;
34. NDF architecture graph;
35. pyCircuit executable model;
36. reproducible baseline experiment;
37. bandwidth sweep;
38. cache and queue sweep;
39. predicted versus measured Roofline;
40. agent-assisted research loop;
41. Pareto frontier;
42. architecture-first closing.

## Technical Boundaries

1. PTO semantic claims come only from the pinned `vendor/pto-spec` revision.
2. Do not use Arm ISA, Arm ASL, Sail Arm, or Isla.
3. LinxCore is a processor architecture case study, not an official PTO implementation.
4. NDF and Agentic Circuit are course modeling layers, not normative ISA definitions.
5. Generated art must never invent ports, cache organizations, instruction semantics, timing values, or benchmark results.
6. Exact architecture diagrams must be reviewable as code and linked to their evidence sources.
7. Every performance claim must connect to a formula, trace, or reproducible experiment artifact.

## Source-Deck Reuse Map

- Slides 1 and 4: cover and chapter-transition mood.
- Slides 5–13: logistics metaphor and architecture zoom.
- Slide 8: Roofline teaching seed.
- Slides 16–17: memory hierarchy scale.
- Slides 18–23: Tile, abstract executor, TLOAD/TSTORE, and scheduling.
- Slides 25–26: scheduling hierarchy.
- Slides 28–32: optimization experiment evidence.
- Slides 33–37: content only; replace their visual treatment.

The new web deck must not reuse low-resolution screenshots of source slides as final pages. Recreate the narrative with generated full-bleed art and code-native overlays.

## Acceptance Criteria

- Exactly 42 audience-facing slides, 21 in each session.
- Every slide has a unique ImageGen asset and a recorded final prompt.
- Every technical slide has deterministic labels and structure layered above the raster scene.
- Both sessions fit 60 minutes, including at least three interactions each.
- All images, fonts, scripts, data, and experiments run without network access.
- Roofline, hierarchy, NoC, Tile, pipeline, queue, and Pareto interactions work from local data.
- All slides render at 1920×1080 with no overflow, tiny labels, accidental low contrast, or empty visual regions.
- Presenter notes include timing, teaching claim, interaction cue, source, and claim boundary.
- `npm test`, PDF export, screenshot rendering, contact-sheet review, and offline checks pass before completion.
