# PyCircuit and NDF: architecture governance discussion

Workshop Q&A supplement. These are open questions and working proposals, not claims of implemented capabilities or solved governance.

## Working proposals

1. **Prevent architectural drift.** Keep goals and system invariants under architect ownership, while allowing scoped contract refinement. An implementation agent should not freely change implementation, contract and oracle together. Preserve failed evidence and the rationale for any changed expectation.
2. **Separate two kinds of refactoring.** A behavior-preserving refactor remains under the existing contracts and needs independent equivalence evidence. A change to architectural behavior starts with impact analysis and authorization of a new NDF baseline; acceptance then refers to that baseline rather than silently weakening the old one.
3. **Coordinate distinct roles.** A system architect owns system invariants; subsystem owners manage local contracts and interface commitments; implementers propose code; independent verifiers assess evidence. Record NDF owner, parent contracts, code links and evidence. Give each task a fixed version, dependency closure, edit scope and acceptance criteria. Roles alone do not establish independence: authority and evidence provenance matter.
4. **Review according to impact.** Local changes receive local-owner review plus tool checks. Interface changes involve both sides. Changes to system invariants require the system architect. PyCircuit checks executable code contracts; NDF governance addresses responsibility, versions and evidence. Neither substitutes for the other.

## Questions for the audience

- What can machine checks establish, and what still requires architectural judgment?
- Who may change NDF or an oracle, and how should legitimate corrections be authorized without letting an agent redefine success?
- How should teams detect cross-module conflicts when agents work against concurrent contract versions? Which changes invalidate dependent evidence?
- What independent evidence distinguishes a safe refactor from an architectural behavior change?
- How can impact-based review avoid a system-architect bottleneck while retaining accountability for shared invariants?
- How should failed results and changed acceptance criteria remain visible so that review cannot be bypassed by rewriting the baseline?

Use these questions to invite tradeoffs and counterexamples. A possible design direction is scoped authority with explicit escalation, versioned contracts and independently held acceptance evidence; the workshop does not present it as a completed solution.

Background: [NDF and hierarchy](../sources/pycircuit-reference-entries.md#ssm-contracts-and-hierarchy), [task boundaries and evidence](../sources/pycircuit-reference-entries.md#agent-task-boundary), and the [main outline](pycircuit-outline.md).
