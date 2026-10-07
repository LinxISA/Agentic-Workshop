# Mac import and static document checks — 7 October 2026

The author-confirmed frozen source ZIP was read from a manually placed local download, then imported into an isolated repository worktree. Its 860051 bytes matched SHA256 `0280b94cde5fe582951772b2599b964b7929a7184c53fb5e6684e1da4829bec6`. All31 archive entries passed path traversal/symlink checks. The27 article files were copied unchanged; four context files were handled separately, with only U005 sections selected for its own draft PR.

The supplied review PDF is919651 bytes and matches SHA256 `ebbd5356eef0b8302a11b1ef2b06dca88429aa48f31c051d715c701f69507675`. Local PDFKit opened and rendered all72 pages successfully; no page had empty extracted text. All72 page thumbnails received contact-sheet inspection for gross clipping, overlap, blank pages and pagination. This local check supplements the supplied full-resolution/cloud review record; it does not repeat a complete semantic review.

Static checks found152 unique bibliography keys,152 cited keys, no unresolved citation keys, and all LaTeX input files present. Public-path hygiene and git diff --check passed. No processor/model/compiler tests, benchmarks or synthesis were run.

## Local build limitation

Mac has Tectonic0.15.0 but no configured pdfLaTeX/BibTeX. A temporary copy removed only the pdfTeX-specific `\pdfoutput=1` line to permit a Tectonic engine attempt; the published source and supplied PDF were not changed. The `--only-cached --untrusted` build stopped because `size11.clo` is absent from the existing cache. No software or TeX resource was installed/downloaded. The supplied72-page PDF therefore remains the reviewed build artifact; a successful independent Mac rebuild is pending an appropriate installed/cached TeX environment.

This article is a review draft. No merge is requested. Latest U004 source is not present in the imported ZIP and remains a separate pending publication task.
