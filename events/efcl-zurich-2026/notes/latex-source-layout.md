# LaTeX source-layout plan

Use LaTeX Beamer for the new EFCL slides. This is a proposed layout, not generated deck source. Keep it inside `events/efcl-zurich-2026/latex/`; leave historical SummerSchool Slidev sources and the existing placeholder intact.

```text
latex/
  main.tex                    # document class, package setup, includes, bibliography
  theme.tex                   # typography, colors, title and frame conventions
  macros.tex                  # contract labels, source captions, diagram/code helpers
  sections/
    01-motivation.tex
    02-ndf-contracts.tex
    03-hardware-refinement.tex
    04-compiler-flow.tex
    05-backends.tex
    06-evidence-feedback.tex
    07-practical-walkthrough.tex
    08-related-work.tex
    09-vision-discussion.tex
  assets/
    diagrams/                 # authored vector diagrams and their editable sources
    snippets/                 # approved short excerpts with provenance sidecars
    figures/                  # approved images
  refs/
    references.bib            # exact primary-source versions
    source-register.md        # repo/version/path, disclosure scope, asset provenance
```

`main.tex` owns assembly; sections own narrative frames and speaker notes; theme/macros own shared presentation rules. Keep citations near the claim and place detailed provenance in the source register. Section files may contain multiple frames; filenames do not imply slide count or duration.

Later choose and document a reproducible TeX engine/build command, font and code-formatting setup. Compile, render and inspect the complete PDF after authoring; no build or render is performed in this planning step. Start from the [section checklist](slide-authoring-checklist.md) and [reviewed narrative](pycircuit-outline.md).
