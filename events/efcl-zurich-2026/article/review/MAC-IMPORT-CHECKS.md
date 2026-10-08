# Mac import and static document checks — 7 October 2026

The author-confirmed frozen source ZIP was read from a manually placed local download, then imported into an isolated repository worktree. Its 860051 bytes matched SHA256 `0280b94cde5fe582951772b2599b964b7929a7184c53fb5e6684e1da4829bec6`. All31 archive entries passed path traversal/symlink checks. The27 article files were copied unchanged; four context files were handled separately, with only U005 sections selected for its own draft PR.

The supplied review PDF is919651 bytes and matches SHA256 `ebbd5356eef0b8302a11b1ef2b06dca88429aa48f31c051d715c701f69507675`. Local PDFKit opened and rendered all72 pages successfully; no page had empty extracted text. All72 page thumbnails received contact-sheet inspection for gross clipping, overlap, blank pages and pagination. This local check supplements the supplied full-resolution/cloud review record; it does not repeat a complete semantic review.

Static checks found152 unique bibliography keys,152 cited keys, no unresolved citation keys, and all LaTeX input files present. Public-path hygiene and git diff --check passed. No processor/model/compiler tests, benchmarks or synthesis were run.

## Local build verification and search coverage

The document targets pdfLaTeX plus BibTeX: its preamble uses `\pdfoutput=1`, and `build.sh` runs pdfLaTeX, BibTeX, and two further pdfLaTeX passes. On this Mac, `latexmk`, `pdflatex`, `bibtex`, `xelatex`, `lualatex`, and `kpsewhich` were not found on PATH. The standard MacTeX entry point `/Library/TeX/texbin` does not exist. A filesystem-name search (including symlinks) of the standard system, Homebrew, application, and user TeX locations, supplemented by Spotlight and user/cache/temp searches, did not identify another engine installation. The user TeX tree is empty; an existing older document build script also selects Tectonic. These observations describe the searched locations, not proof that no other environment exists anywhere.

Running the unmodified article `build.sh` stopped at its prerequisite check: `Missing pdflatex. Use an existing TeX Live installation.` No TeX compilation began in that attempt. A user-specified executable path or additional environment location can be checked independently; Tectonic is not a requirement for this article.

The earlier Tectonic0.15.0 attempt used a temporary copy with only the pdfTeX-specific `\pdfoutput=1` line removed. Its `--only-cached --untrusted` build stopped because `size11.clo` is absent from that engine's existing cache. This is a Tectonic-specific failure, not a result for other engines. No software or TeX resources were installed/downloaded. The published source and supplied72-page PDF remain unchanged, and the PDF rendering/static checks above still apply. An independent Mac rebuild has not yet succeeded.

This article is a review draft. No merge is requested. Latest U004 source is not present in the imported ZIP and remains a separate pending publication task.

## U006 source revision

**Source/PDF divergence:** U006 source and bibliography were revised on 7 October after the frozen PDF was imported. The supplied PDF remains the earlier 72-page artifact and does not contain this revision; no successful local rebuild is claimed. See [U006 revision review](U006-REVISION-REVIEW.md).
