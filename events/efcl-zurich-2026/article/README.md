# Superscalar NPU technical article

A substantive English LaTeX article covering all eight architectural problems. This is an article, not a Beamer deck. The earlier [source analyses](../sources/README.md) and [talk outline](../talks/superscalar-npu/outline.md) remain intact.

## Read

- [Review PDF](review/superscalar-npu-eight-problems.pdf)
- [Main LaTeX entry point](main.tex)
- [Review record and evidence limits](review/REVIEW.md)
- [Mac import/static checks and local build limitation](review/MAC-IMPORT-CHECKS.md)

## Structure

- `sections/introduction.tex` and `sections/method.tex`: workload, thesis, evidence levels, responsibilities, and whole-core cost ledger
- `sections/u001.tex`: matrix/vector coordination and granularity
- `sections/u002.tex`: latency hiding and storage lifetimes
- `sections/u003.tex`: dtype, layout, packing, scales, AVX, and SVE
- `sections/u004.tex`: irregular/sparse access, masking, TLEA, scatter/gather, and atomic contracts
- `sections/u005.tex`: reductions, four-element groups, four-PE local/shared ownership, scope-matched GPU/Ascend/TPU handoff, exact typed folds, CELL geometry, masks, and softmax
- `sections/u006.tex`: scalar/event orchestration and compute/communication fusion
- `sections/u007.tex`: precise faults, debugging, ordering, completion, visibility, and recovery
- `sections/u008.tex`: finite-resource admission, reclamation, deadlock, fairness, and conditional progress proofs
- `sections/synthesis.tex` and `sections/reproducibility.tex`: design conditions and future matched evaluation
- `figures/`: original editable TikZ diagrams; no external raster assets
- `references*.bib`: primary references and version-scoped evidence records

## Build

Requirements: an existing TeX Live installation with pdfLaTeX, BibTeX, Latin Modern fonts, and common LaTeX packages including TikZ, natbib, microtype, booktabs, tabularx, enumitem, xurl, tocloft, and hyperref. No shell escape is required.

Run from this directory:

```sh
./build.sh
```

The script writes temporary files to `.build/` and the review PDF to `review/superscalar-npu-eight-problems.pdf`. It does not download or install software. On a minimal Debian-style image whose TeX packages are installed but format/search caches are missing, it generates a writable local format and font map from those installed packages.

On a conventionally configured TeX system, the equivalent manual sequence is:

```sh
mkdir -p .build
pdflatex -interaction=nonstopmode -halt-on-error -output-directory=.build main.tex
(cd .build && BIBINPUTS="..:" bibtex main)
pdflatex -interaction=nonstopmode -halt-on-error -output-directory=.build main.tex
pdflatex -interaction=nonstopmode -halt-on-error -output-directory=.build main.tex
```

The `\pdfoutput=1` directive ensures PDF output even when a local format is reconstructed directly from `latex.ltx`.

## Render for visual review

With an existing Poppler installation:

```sh
mkdir -p .build/pages
pdftoppm -r 150 -png review/superscalar-npu-eight-problems.pdf .build/pages/page
```

Inspect every rendered page after meaningful edits. Compilation and citation checks do not detect diagram overlap, bad pagination, clipped tables, or unreadable links.

## Evidence policy

The article distinguishes public contracts, pinned implementation observations, author-reported results, and conditional proposals. It includes pending integration in the target architecture after merge, without claiming new-head validation. In particular, U005 uses PTO revision `e182c9b` for the ordered `TROWSUM` fold and CELL geometry. Logical payload bytes are kept separate from charged physical allocation bytes.

No new model test, implementation test, benchmark, synthesis, or physical PPA result is represented as part of article production. Public documentation previews and mutable `main`/`latest` references remain labeled. The review PDF is a review draft, not a claim that all architecture evidence gaps are closed.
