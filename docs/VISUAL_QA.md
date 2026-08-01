# Visual QA Ledger

## Scope

- Session 1: 21 slides
- Session 2: 21 slides
- Total: 42 slides
- Render viewport: 1920×1080, device scale factor 1
- Contact sheets: `docs/visual-qa/session-1-contact-sheet.png`, `docs/visual-qa/session-2-contact-sheet.png`
- Machine-readable report: `qa/audit.json`

## Automated gates

| Gate | Result |
|---|---:|
| slide render count | 42 / 42 |
| remote runtime requests | 0 |
| element overflow/crop candidates | 0 |
| title/diagram intersections | 0 |
| broken or distorted images | 0 |
| missing full-bleed backgrounds | 0 |
| failed local asset responses | 0 |
| contrast failures | 0 |
| titles exceeding two lines | 0 |
| interactive states exercised | 21 |

## Manual review

Both final contact sheets were reviewed as complete sequences after the global Slidev theme was moved into each deck's root `style.css`. Representative full-resolution inspection covered ImageGen backgrounds, Roofline, memory hierarchy, LinxCore module exploration, queue pressure, waveforms, NDF traceability, experiments, and the Pareto explorer.

The accepted visual contract is:

- every slide uses a unique full-bleed processor-architecture background;
- the title and one-sentence claim stay in a calm high-contrast region;
- exact architecture labels, charts, traces, and waveforms are deterministic overlays;
- interactive overlays remain subordinate to the processor image and do not cross the title or footer safe areas;
- no runtime request leaves localhost.

## Fixes made during QA

1. Disabled remote font injection and replaced remote favicons with local generated PNGs.
2. Added Slidev base-path handling for background assets under `/session-1/` and `/session-2/`.
3. Moved shared theme rules out of scoped Markdown styles into deck-level global styles.
4. Added automated title/diagram intersection detection and a two-line title limit.
5. Re-sized the Roofline, memory hierarchy, LinxCore, timing, NDF, pipeline, queue, bank, and Pareto components against the actual Slidev logical canvas.
6. Re-rendered all 42 pages; the final audit contains zero geometry, image, contrast, title, overlap, or remote-request failures.
7. Exercised 21 interactive pages after their initial render, captured the changed state locally, and verified that focus did not block deck navigation.
