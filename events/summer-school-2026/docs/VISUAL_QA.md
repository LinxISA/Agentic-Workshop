# Visual QA Ledger

## Scope

- Session 1: 33 slides
- Session 2: 31 slides
- Total: 64 slides
- Viewports: 1920×1080 and 1366×768, device scale factor 1
- Machine-readable reports: `qa/audit-1920x1080.json`, `qa/audit-1366x768.json`
- Contact sheets:
  - `qa/contact-sheets/session-1-1920x1080.png`
  - `qa/contact-sheets/session-2-1920x1080.png`
  - `qa/contact-sheets/session-1-1366x768.png`
  - `qa/contact-sheets/session-2-1366x768.png`

## Final automated gates

| Gate | 1920×1080 | 1366×768 |
|---|---:|---:|
| slide render count | 64 / 64 | 64 / 64 |
| remote runtime requests | 0 | 0 |
| geometry / overflow candidates | 0 | 0 |
| title / diagram intersections | 0 | 0 |
| broken or distorted images | 0 | 0 |
| missing full-bleed backgrounds | 0 | 0 |
| failed local asset responses | 0 | 0 |
| contrast failures | 0 | 0 |
| titles exceeding two lines | 0 | 0 |
| text below 16 rendered px | 0 | 0 |
| designated interactions exercised | 12 / 12 | 12 / 12 |

The interaction runner also captured changed states on 12 pages per viewport. Closed drawers are excluded from default-layout geometry checks, then opened and exercised separately.

## Manual review

All four final contact sheets were reviewed as complete sequences. Full-resolution inspection covered the Keynote migration pages, Roofline, memory hierarchy, PTO abstract machine, transfer-time lab, trace anatomy, SimQueue, cycle playback, parameter sweep, offline timeline, PTO-ASL/NDF separation, and the proposed gfsim↔pyCircuit acceptance loop.

The accepted visual contract is:

- each page has a full-bleed local visual, with deterministic SVG/Vue overlays for labels, formulas, traces, queues, and data paths;
- the title and one-sentence claim remain in a high-contrast safe region;
- interactive overlays do not cross title or footer safe areas;
- 1366×768 retains at least 16 rendered pixels for visible teaching text;
- animations and interactions explain state transitions or data flow; no decorative flashing frame is present;
- no runtime request leaves localhost.

## Fixes made during final QA

1. Removed the final S33 trace-panel overlap and shortened its claim without changing semantics.
2. Increased small-screen teaching labels to a 12 px logical minimum, which renders at or above 16 px at 1366×768.
3. Repositioned SimQueue, cycle playback, evidence timeline, and closed-loop panels after the readability increase.
4. Added minimum-font samples to the machine-readable audit for actionable diagnosis.
5. Re-rendered 128 slide images and exercised both static and changed interaction states; both final audits contain zero failures.
6. Verified the keyboard-help overlay at 1366×768 after its entrance transition: the dialog remains fully inside the viewport, all seven shortcut rows are visible, and Esc closes it without opening the overview.
7. Verified `/session-1`, `/session-2`, and slide-number deep links against the built preview so no deck route falls back to the course index.
