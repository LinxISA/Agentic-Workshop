#!/usr/bin/env bash
# Build only the article. No processor/model/compiler tests and no downloads.
set -euo pipefail
cd "$(dirname "$0")"
BUILD="$(pwd)/.build"
mkdir -p "$BUILD" review
command -v pdflatex >/dev/null || { echo 'Missing pdflatex. Use an existing TeX Live installation.' >&2; exit 1; }
command -v bibtex >/dev/null || { echo 'Missing bibtex. Use an existing TeX Live installation.' >&2; exit 1; }

# Some minimal Debian images contain all TeX packages but omit format/database
# caches. Reconstruct only writable local caches from already installed files.
if ! kpsewhich pdflatex.fmt >/dev/null 2>&1 || ! kpsewhich article.cls >/dev/null 2>&1; then
  DIST=/usr/share/texlive/texmf-dist
  EXTRA=/usr/share/texmf
  CACHE="$BUILD/tex-cache"
  test -f "$DIST/tex/latex/base/latex.ltx" || { echo 'No configured format and no supported installed TeX tree.' >&2; exit 1; }
  mkdir -p "$CACHE"
  export TEXINPUTS=".:$EXTRA/tex//:$DIST/tex//:"
  export TEXFORMATS="$CACHE//:"
  export TEXMFVAR="$CACHE" TEXMFCONFIG="$CACHE" TEXMFSYSVAR="$CACHE" TEXMFSYSCONFIG="$CACHE"
  export TFMFONTS="$EXTRA/fonts/tfm//:$DIST/fonts/tfm//:"
  export T1FONTS="$EXTRA/fonts/type1//:$DIST/fonts/type1//:"
  export VFFONTS="$EXTRA/fonts/vf//:$DIST/fonts/vf//:"
  export ENCFONTS="$EXTRA/fonts/enc//:$DIST/fonts/enc//:"
  export TEXFONTMAPS="$CACHE//:$EXTRA/fonts/map//:$DIST/fonts/map//:"
  export BSTINPUTS=".:$DIST/bibtex/bst//:"
  export BIBINPUTS=.:
  if ! test -f "$CACHE/pdflatex.fmt"; then
    pdftex -ini -etex -jobname=pdflatex -progname=pdflatex \
      -interaction=nonstopmode -halt-on-error -output-directory="$CACHE" \
      latex.ltx > "$BUILD/format.log" 2>&1
  fi
  cat "$EXTRA/fonts/map/dvips/lm/lm.map" \
      "$DIST/fonts/map/dvips/amsfonts/cm.map" \
      "$DIST/fonts/map/dvips/amsfonts/symbols.map" > "$CACHE/pdftex.map"
fi

pdflatex -interaction=nonstopmode -halt-on-error -output-directory="$BUILD" main.tex > "$BUILD/pass1.log" 2>&1
(cd "$BUILD"; BIBINPUTS="..:" bibtex main) > "$BUILD/bibtex.log" 2>&1
pdflatex -interaction=nonstopmode -halt-on-error -output-directory="$BUILD" main.tex > "$BUILD/pass2.log" 2>&1
pdflatex -interaction=nonstopmode -halt-on-error -output-directory="$BUILD" main.tex > "$BUILD/pass3.log" 2>&1
if grep -Eq 'undefined references|undefined citations|Citation.*undefined|Reference.*undefined' "$BUILD/main.log"; then
  echo 'Unresolved citations or references; inspect .build/main.log' >&2
  exit 1
fi
cp "$BUILD/main.pdf" review/superscalar-npu-eight-problems.pdf
printf 'Built %s\n' 'review/superscalar-npu-eight-problems.pdf'
if command -v pdfinfo >/dev/null; then
  pdfinfo review/superscalar-npu-eight-problems.pdf | grep -E 'Pages:|Page size:|File size:'
fi
