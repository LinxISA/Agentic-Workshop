# PyCircuit reference entry guidance

These entries guide later source selection. Repository identities are navigation hints, not a claim that a particular branch, file or implementation is publicly available. Confirm access and disclosure scope, then record exact commit-pinned citations. Detailed local source maps remain outside this public material.

## NDF and SummerSchool

Start with the NDF proposal in repository `PTO-ISA/normative_language`; select the disclosed version of its proposal and tool documentation. The format name is **Normative Description Format**. Historical workshop background is available in [SummerSchool NDF](../../summer-school-2026/docs/NDF.md) and [Session 1](../../summer-school-2026/decks/session-1/slides.md). Its course-specific terminology should not override the format name.

## SSM contracts and hierarchy

For a permitted system example, ask the source owner to identify a shareable NDF index, contract-refinement explanation and hardware-hierarchy view. Repository identity: `LinxISA/SuperScalarModel`. Use approved excerpts or original conceptual diagrams; do not assume internal source may be distributed.

## SSM Rule and Core

Select a permitted ROB/Rename contract and its implementation association. Record what the example covers; do not infer full-core completion from a component or topology example. Keep undisclosed system source local.

## PyCircuit frontend

Repository identity: `PTO-ISA/pyCircuit`. In a confirmed public snapshot, locate `docs/reference/language.md`, `docs/development/agent-frontend-guide.md` and the syntax-capture/source-lowering entries. Confirm their paths and exact source version before citing or extracting snippets.

## PyCircuit compiler, link and emit

Follow the selected snapshot's source-unit pass chain, Rule owner/write analysis, linker validation and C++/Verilog emission. Obtain corresponding outputs for the same example; verify artifact provenance. The workshop does not publish uncommitted compiler source or assume a current public path from local development state.

## Agent task boundary

Use a disclosed task/evidence contract to illustrate stable IDs, dependency closure, edit scope, fixed oracle and version-bound results. Mechanical structure checks and independent semantic review have distinct roles. Ask the source owner for approved examples; do not distribute private task packets or execution records.

Primary literature and its comparison limits are in [related work](related-work.md). Concrete snippet retrieval belongs to later authoring.
