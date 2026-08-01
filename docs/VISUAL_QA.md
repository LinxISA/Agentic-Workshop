# Visual QA Ledger

## Scope

- Session 1: 28 slides
- Session 2: 31 slides
- Total: 59 slides
- Render viewport: 1920×1080, device scale factor 1
- Contact sheets: `docs/visual-qa/session-1-contact-sheet.png`, `docs/visual-qa/session-2-contact-sheet.png`
- Machine-readable report: `qa/audit.json`

## Automated gates

| Gate | Result |
|---|---:|
| slide render count | 59 / 59 |
| remote runtime requests | 0 |
| element overflow/crop candidates | 0 |
| broken or distorted images | 0 |
| content slides with NDF ID and evidence notes | 59 / 59 |
| content slides with a meaningful visual | 59 / 59 |
| built text assets with remote runtime dependencies | 0 |

## Manual review

Both contact sheets were reviewed as a complete sequence; cover, high-density, ImageGen, interactive-component, trace, timing, Pareto, quiz, and closing slides were also inspected at full 1920×1080 resolution. Slide transitions were excluded from captures by waiting 700 ms after navigation.

| Dimension | Session 1 | Session 2 | Minimum | Review note |
|---|---:|---:|---:|---|
| hierarchy | 4.5 / 5 | 4.6 / 5 | 4.5 | takeaway titles dominate; one narrative job per slide |
| alignment | 4.5 / 5 | 4.6 / 5 | 4.5 | consistent 64 px canvas margins and component frames |
| readability | 4.4 / 5 | 4.5 / 5 | 4.4 | body text remains readable at 1920×1080; dense data stays in structured tables |
| visual relevance | 4.6 / 5 | 4.7 / 5 | 4.6 | visuals explain specification, queue, trace, module, evidence, or design-space claims |
| technical accuracy | 4.6 / 5 | 4.6 / 5 | 4.6 | PTO / course NDF / LinxCore / proposal boundaries are explicit |
| consistency | 4.7 / 5 | 4.7 / 5 | 4.7 | navy/cyan/green/orange system, shared type scale and connector semantics |
| interaction clarity | 4.4 / 5 | 4.6 / 5 | 4.4 | step/play/reset controls repeat; presenter runbook states interaction intent |
| presentation effect | 4.5 / 5 | 4.7 / 5 | 4.5 | ImageGen art is reserved for covers/transitions; exact diagrams remain deterministic |

All dimensions exceed the 4/5 acceptance threshold. No slide is accepted solely on contact-sheet appearance: the browser audit enforces canvas geometry and network behavior per page, while representative full-size inspection covers every silhouette class and every shared interactive component.

## Fixes made during QA

1. Disabled Google Fonts injection with `fonts.provider: none` and local font stacks.
2. Replaced the default remote favicon with local generated PNGs.
3. Waited for Slidev transitions before capture to avoid half-transition false images.
4. Reworked the PTO executable-spec slide into a balanced split with a dedicated spec-to-circuit ImageGen concept image.
5. Kept ImageGen away from exact signal wiring, timing, trace, state and Pareto data.
6. Reduced the global slide padding and type scale only after full-resolution inspection, preserving readable projected sizes while restoring a consistent 5%–7% safe area.
7. Removed repeated captions beneath interactive components so the diagram remains the dominant visual and no content crosses the lower canvas boundary.
8. Shortened the `ready/valid` title, raised waveform and Pareto label contrast, and increased the smallest technical labels.
9. Re-ran all 59 screenshots after the fixes; the final report contains zero geometry, image, contrast, title-wrap, or remote-request failures.
