# Keynote Pages 02–09 Web Adaptation Design

## Scope

Replace only slides S02–S09 in the first Slidev session with pages 2–9 from `publish/Agent时代体系结构研究-周若愚.key`. Do not inspect, reuse, summarize, or modify page 10 or later in this pass.

## Fidelity Contract

- Output slide 2 maps to source page 2, continuing one-to-one through output slide 9 and source page 9.
- Every visible word, punctuation mark, capitalization choice, number, and unit comes from the source page without rewriting.
- The source page render is the visual base so that diagrams, photographs, icons, colors, and alignment remain faithful.
- Source pages are rendered from Keynote's PDF export at 1920×1080 and bundled locally for offline playback.
- ImageGen is not used in this pass because it could change exact text or technical meaning. It remains available for a later page-specific correction requested by the presenter.

## Web Enhancement

- A reusable `KeynoteSourceStage` renders the exact source page as a full-bleed background.
- Optional animated focus regions add restrained cyan/yellow glows without covering source text.
- Slides 5 and 9 retain click-driven interaction contracts with a small presenter control that advances focus regions.
- Animation stops under `prefers-reduced-motion` and remains decorative; the source slide is complete without it.

## Verification

- Compare rendered slides 2–9 side-by-side with source pages 2–9.
- Assert the eight local images exist, are unique, and match the image manifest.
- Build the first session and run the 1920×1080 QA renderer.
- Require zero overflow, clipping, overlap, contrast, image-load, remote-request, or interaction failures.
