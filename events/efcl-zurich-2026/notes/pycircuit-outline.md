# PyCircuit and NDF: hardware design for the agent era

## Thesis

Make architectural intent explicit enough for an agent to implement a bounded change, for tools to check its consequences, and for evidence to inform the next architectural decision.

**Intent → NDF contracts → architect + Agent refinement → PyCircuit struct / module / Rule → IR checks / transforms / link → C++ simulation / Verilog → evidence → revised implementation or architectural decision.**

## Narrative

1. **Start with a change that can break a core.** Rename accepts a destination, but its mapping, recovery record, ROB binding and dispatch must agree. A delayed completion must not update a reused ROB slot. Introduce one coherent requirement and carry it through the talk: how can an agent change this system within an explicit boundary?

   Source entry: [SSM Rule and Core](../sources/pycircuit-reference-entries.md#ssm-rule-and-core).

2. **Turn intent into NDF contracts.** NDF is *Normative Description Format*. Stable IDs record scope, owner, dependencies and observable outcomes. L0–L3 refine intent → behavior → mechanism → acceptance; H1–H3 locate subsystem → functional block → leaf module. These are independent dimensions. A dependency closure, allowed edit scope and fixed oracle make the agent's boundary operational.

   Source entry: [NDF and SummerSchool](../sources/pycircuit-reference-entries.md#ndf-and-summerschool), [SSM hierarchy](../sources/pycircuit-reference-entries.md#ssm-contracts-and-hierarchy).

3. **Refine the contract into hardware.** Data formats and payloads become `struct`; component responsibilities, interfaces and state owners become `module`; state updates and atomic transitions become `Rule`. Cross-module contracts span relationships among several objects. Trace requirements to implementations without forcing one-to-one mapping. Architects resolve intent and tradeoffs; agents propose bounded implementations. This refinement is human/Agent-assisted, not automatic NDF-to-hardware compilation.

   Source entry: [SSM contracts and code binding](../sources/pycircuit-reference-entries.md#ssm-contracts-and-hierarchy).

4. **Follow Python into checked hardware IR.** Capture the Python AST without executing model functions. The native compiler analyzes Rule write ownership, lowers source semantics, simplifies value structures and extracts interfaces. Link the explicit module closure and check the hardware package. Explain how state becomes storage, enables and connections; source locations make diagnostics actionable.

   Source entry: [Frontend](../sources/pycircuit-reference-entries.md#pycircuit-frontend), [compiler and linker](../sources/pycircuit-reference-entries.md#pycircuit-compiler-link-and-emit).

5. **Observe two outputs of the same representation.** Generate C++ simulation and Verilog from the common checked hardware representation. Use matching excerpts and one cycle diagram: old state → proposed updates → checks → commit. Shared lowering is useful, but an independent oracle is still necessary. The simulation path is C++; SystemC is not assumed.

   Source entry: [Backend entries](../sources/pycircuit-reference-entries.md#pycircuit-compiler-link-and-emit).

6. **Let evidence change the right layer.** Associate diagnostics, functional checks, traces, performance and available physical PPA evidence with the stable NDF ID, code version and configuration. Distinguish implementation violations, contract omissions/errors and architectural bottlenecks or tradeoffs. An agent revises implementation; an architect authorizes changed contracts, parameters or mechanisms. Re-evaluate the new version. Evidence supports or refutes hypotheses as well as revealing errors; correctness, host simulation speed and physical PPA remain separate outcomes.

   Source entry: [Task, oracle and evidence boundaries](../sources/pycircuit-reference-entries.md#agent-task-boundary).

7. **Show the audience how to use the repository.** Walk through the same requirement: read its clause → map dependencies → clarify a proposed change → record NDF/code changes → attach feedback and version/configuration. Start at `docs/model/ndf/README.md`; inspect structure through `scripts/ndf_model.py`; record changes through `docs/model/changes/README.md`; use `docs/model/tool-contract.md` for task and evidence interfaces. Relation checks establish structure, while architects judge semantics.

   Source entry: [SSM contract/index navigation](../sources/pycircuit-reference-entries.md#ssm-contracts-and-hierarchy), [task interfaces](../sources/pycircuit-reference-entries.md#agent-task-boundary).

8. **Open the larger question.** Explore how more architectural knowledge can become reusable, compositional contracts and feedback for agents. Invite discussion about responsibility, refactoring and review authority; present governance proposals as open questions.

   Discussion: [Architecture governance Q&A](pycircuit-ndf-discussion.md).

## Instructions for later slide authoring

- Choose one coherent requirement and ROB/Rename example. Retrieve its stable NDF ID, `code-ref`, dependency map, concise Python, corresponding IR, check/transform snippets and matching C++/Verilog outputs. Annotate **Python → IR → checks/transforms/link → C++ / Verilog**, with exact repository, branch and file references. Select query/check commands from the current tool contract.
- Find a real feedback record: original requirement/hypothesis, diagnostic/trace/metric, locating reference, who changed which layer, before/after NDF or code diff, versions/configurations and re-evaluation. ROB recovery or depth/commit-width exploration may work if such records exist. When history is incomplete, use truthful fragments plus the method flow; keep asset placeholders instead of inventing outcomes or PPA data.
- Use an end-to-end flow, a two-axis NDF/hardware map and a cycle/identity diagram. Keep governance details in Q&A. No fixed slide count or duration is implied.

Source entry: [Versioned local reference entries](../sources/pycircuit-reference-entries.md). The [authoring background](pycircuit-section-brief.md) keeps current implementation evidence separate. The audience narrative follows the planned completed flow; the current system remains in progress. Confirm disclosure scope before uploading local or SSM excerpts. No implementation snippets are embedded here.

## Related-work reference

[LLM-assisted hardware design: primary sources and comparison boundaries](../sources/related-work.md).

## Production handoff

[Section authoring checklist](slide-authoring-checklist.md) and [LaTeX Beamer source-layout plan](latex-source-layout.md).
