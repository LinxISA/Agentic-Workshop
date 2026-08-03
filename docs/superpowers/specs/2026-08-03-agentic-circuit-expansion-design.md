# Agentic Circuit Course Expansion Design

## Communication job

By the end, architecture students should understand that Agentic Circuit (AGC) is a proposed executable architecture-generation language: Python elaborates a static module graph, AGC IR preserves the graph and specialization boundaries, and the C++ runtime executes cycle, queue, arbitration, and contention behavior.

## Source synchronization

- Treat `/Users/zhoubot/Documents/SummerSchool/publish/Agent时代体系结构研究-周若愚.key` as the visual and wording source of truth.
- The 2026-08-03 17:49 source contains 44 pages.
- Pages 1–28 and 31–44 are pixel-identical to the prior 42-page export; new pages 29–30 are the two PTO ISA Cheatsheet pages.
- Render Keynote pages 2–44 exactly at 1920×1080. Keep the approved ImageGen cover for K01.
- Map every K01–K44 page exactly once in the web course.

## Course insertion

Insert ten AGC pages immediately after source page K37 and before the existing q_proj model sequence:

1. Python describes the construction process, not simulation order.
2. `NPUCity` elaborates into a static hierarchy with Cluster instances, L2, scheduler, buses, and optional DMA.
3. `@system`, `@template`, `@function`, and `@const` have distinct hierarchy and expansion contracts.
4. Static parameters change topology and specialization identity; Runtime parameters only change simulation configuration.
5. JIT means JIT Elaboration: canonicalize, hash, cache lookup, execute Python on miss, verify, freeze, cache.
6. The specialization key includes template name, source hash, canonical Static parameters, dependency hashes, dialect version, and runtime ABI.
7. `@spec.valueclass` makes Static parameters comparable, serializable, ordered, and hashable; unstable objects are rejected.
8. AGC IR preserves `agc.module` and `agc.instance` boundaries so one specialized class can back multiple independent instances.
9. The compiler pipeline verifies topology and materializes runtime queues before lowering to C++ simulation, behavioral SystemVerilog, or RTL.
10. Determinism and responsibility boundaries separate Python organization, template specialization, static IR, and concurrent runtime behavior.

## Visual and interaction design

- Preserve the Keynote deep-navy, cyan, yellow, green, and magenta system.
- Use source-derived, heavily darkened full-bleed backgrounds so technical overlays remain legible without inventing product diagrams.
- Keep all Chinese copy, code, module names, formulas, and IR text as deterministic Slidev/Vue/HTML content.
- Add three lightweight interactions:
  - Cluster count and DMA controls show elaborated topology changes.
  - Static and Runtime controls demonstrate when the specialization key changes.
  - A stepper advances through the JIT Elaboration and lowering pipeline.
- Every slide has one claim and one main visual composition; code excerpts are cropped to the exact concept being taught.

## Technical boundaries

- AGC syntax, dialect operations, passes, and target lowerings are a design proposal, not a claim that they already exist in pyCircuit.
- pyCircuit documentation is evidence for the reusable foundation: source scan, Python JIT elaboration, `@module`, `@function`, `@const`, `m.new()`, `m.array()`, `@spec.valueclass`, one IR per specialized module, hierarchy-preserving `pyc.instance`, and C++/Verilog backends.
- Python statement order determines construction order only. Generated Compute, Storage, Bus, Crossbar, Scheduler, and DMA modules operate concurrently in simulation.
- Python `for` and `if` used for topology must depend only on canonical Static parameters.
- Runtime parameters never participate in specialization identity.
- Source hash and dependency hashes are mandatory cache-key inputs to prevent stale specialization reuse after source changes.

## Final inventory

- Session 1: 35 slides, 75 minutes.
- Session 2: 41 slides, 75 minutes.
- Total: 76 slides = 44 Keynote mappings + 22 retained custom pages + 10 AGC expansion pages.
- Routes remain `/`, `/session-1/1…35`, and `/session-2/1…41`.

## Verification

- Validate exact K01–K44 mapping and source-render hashes.
- Validate the ten AGC claims and proposal boundaries in audience-visible content.
- Validate specialization-key behavior with unit tests.
- Build both decks, verify offline assets and static routes, render every page at 1920×1080 and 1366×768, and inspect contact sheets.
- Publish to GitHub Pages only after local validation passes.
