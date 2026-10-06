# GitHub Pages Publishing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the complete 56-slide Summer School site from the public `LinxISA/SummerSchool` repository at a verified live `https://linxisa.github.io/SummerSchool/` URL.

**Architecture:** A small path module normalizes the local root and GitHub Pages project prefix. Node build wrappers pass the correct base to Slidev, then a static-route generator creates physical numbered deep-link entries and `.nojekyll`. A GitHub Actions workflow builds the source on `main`, uploads `dist/`, deploys it through the `github-pages` environment, and exposes the verified public URL.

**Tech Stack:** Node.js 22, npm, Slidev 52, Vite 8, Node test runner, GitHub Actions, GitHub Pages REST API, Playwright Chromium.

## Global Constraints

- Public URL: `https://linxisa.github.io/SummerSchool/`.
- Public repository: `LinxISA/SummerSchool`.
- Local base path remains empty; Pages base path is exactly `/SummerSchool`.
- Both sessions remain 28 slides and 75 minutes.
- All 56 numbered slide routes must work when opened directly.
- No runtime CDN, external image, absolute user path, server, database, authentication layer, custom domain, or committed `dist/` tree.
- The live URL is not complete until it returns the course and both Slidev decks in a real browser.

---

### Task 1: Base-path contract and Slidev build wrapper

**Files:**
- Create: `scripts/pages-paths.mjs`
- Create: `scripts/build-deck.mjs`
- Create: `qa/pages-paths.spec.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: optional `process.env.SUMMERSCHOOL_BASE_PATH`.
- Produces: `normalizeBasePath(value: string): string`, `deckBase(session: 'session-1' | 'session-2', value?: string): string`, and a CLI `node scripts/build-deck.mjs <session>`.

- [ ] **Step 1: Write failing normalization tests**

```js
assert.equal(normalizeBasePath(''), '')
assert.equal(normalizeBasePath('/SummerSchool/'), '/SummerSchool')
assert.equal(deckBase('session-1', ''), '/session-1/')
assert.equal(deckBase('session-2', '/SummerSchool'), '/SummerSchool/session-2/')
assert.throws(() => normalizeBasePath('https://example.com'))
assert.throws(() => deckBase('session-3', ''))
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test qa/pages-paths.spec.mjs`

Expected: FAIL because `scripts/pages-paths.mjs` does not exist.

- [ ] **Step 3: Implement the path module and build wrapper**

`pages-paths.mjs` accepts an empty path or a slash-prefixed pathname, removes trailing slashes, rejects URLs, dot segments, query strings, and fragments, and returns deck bases with one leading and trailing slash.

`build-deck.mjs` validates the session, derives these exact paths, and invokes Slidev with inherited stdio:

```js
const config = {
  'session-1': { entry: 'decks/session-1/slides.md', out: 'dist/session-1' },
  'session-2': { entry: 'decks/session-2/slides.md', out: 'dist/session-2' },
}
```

The subprocess command is:

```text
slidev build <entry> --base <deckBase> --out <out>
```

- [ ] **Step 4: Replace the two package build commands**

```json
"build:1": "node scripts/build-deck.mjs session-1",
"build:2": "node scripts/build-deck.mjs session-2"
```

- [ ] **Step 5: Run GREEN tests and both deck builds**

Run:

```bash
node --test qa/pages-paths.spec.mjs
npm run build:1
npm run build:2
```

Expected: tests pass; both Slidev builds exit 0 with local bases `/session-1/` and `/session-2/`.

- [ ] **Step 6: Commit the task**

```bash
git add scripts/pages-paths.mjs scripts/build-deck.mjs qa/pages-paths.spec.mjs package.json
git commit -m "build: support GitHub Pages base paths"
```

### Task 2: Static numbered routes and Pages artifact contract

**Files:**
- Create: `scripts/build-static-routes.mjs`
- Create: `qa/pages-artifact.spec.mjs`
- Modify: `scripts/build-index.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: completed `dist/session-1/index.html`, `dist/session-2/index.html`, and `SUMMERSCHOOL_BASE_PATH`.
- Produces: `dist/.nojekyll`, 56 numbered `index.html` files, and a prefix-aware root index.

- [ ] **Step 1: Write failing artifact tests**

The test reads `SUMMERSCHOOL_EXPECTED_BASE_PATH`, defaulting to an empty string, and asserts:

```js
assert.match(session1Html, new RegExp(`${escapedBase}/session-1/assets/`))
assert.match(session2Html, new RegExp(`${escapedBase}/session-2/assets/`))
assert.equal(await readFile('dist/session-1/28/index.html', 'utf8'), session1Html)
assert.equal(await readFile('dist/session-2/28/index.html', 'utf8'), session2Html)
assert.equal(await readFile('dist/.nojekyll', 'utf8'), '')
```

It also verifies all routes 1 through 28 for both sessions and asserts the root index links to the expected prefixed session locations.

- [ ] **Step 2: Run the artifact test and verify RED**

Run: `node --test qa/pages-artifact.spec.mjs`

Expected: FAIL because numbered route entries and `.nojekyll` do not exist.

- [ ] **Step 3: Implement deterministic static routes**

`build-static-routes.mjs` reads each deck's generated `index.html`, creates `dist/<session>/<n>/`, writes the identical HTML for `n=1..28`, and writes an empty `dist/.nojekyll`.

No asset files are copied into numbered directories.

- [ ] **Step 4: Make the root index prefix-aware**

Import `normalizeBasePath`, derive a pathname prefix from `SUMMERSCHOOL_BASE_PATH`, and emit these exact href forms:

```text
<prefix>/session-1/
<prefix>/session-2/
<prefix>/generated/main-hero.png
```

For an empty prefix, emit `/session-1/`, `/session-2/`, and `/generated/main-hero.png`.

- [ ] **Step 5: Add route building and tests to package scripts**

```json
"build:routes": "node scripts/build-static-routes.mjs",
"build": "npm run clean && npm run build:1 && npm run build:2 && npm run build:index && npm run build:routes",
"test:pages": "node --test qa/pages-paths.spec.mjs qa/pages-artifact.spec.mjs"
```

Run `test:pages` after `test:offline` in the aggregate `test` script.

- [ ] **Step 6: Verify local and Pages-prefix artifacts**

Run:

```bash
npm run build
npm run test:offline
npm run test:pages
SUMMERSCHOOL_BASE_PATH=/SummerSchool npm run build
SUMMERSCHOOL_EXPECTED_BASE_PATH=/SummerSchool npm run test:pages
```

Expected: all commands exit 0; both build modes contain all 56 numbered entries.

- [ ] **Step 7: Commit the task**

```bash
git add scripts/build-static-routes.mjs scripts/build-index.mjs qa/pages-artifact.spec.mjs package.json
git commit -m "build: generate static Pages slide routes"
```

### Task 3: GitHub Pages workflow and operator documentation

**Files:**
- Create: `.github/workflows/pages.yml`
- Modify: `README.md`
- Modify: `docs/OFFLINE_BUNDLE.md`

**Interfaces:**
- Consumes: `npm ci`, the aggregate test script, Pages-prefix build, and `dist/`.
- Produces: a GitHub Pages deployment from `main` and `workflow_dispatch`.

- [ ] **Step 1: Write the workflow contract before the workflow exists**

Add a Node test in `qa/pages-artifact.spec.mjs` that reads `.github/workflows/pages.yml` and asserts the visible contract contains:

```text
push: main
workflow_dispatch
contents: read
pages: write
id-token: write
SUMMERSCHOOL_BASE_PATH: /SummerSchool
actions/configure-pages@v5
actions/upload-pages-artifact@v4
actions/deploy-pages@v4
path: dist
```

- [ ] **Step 2: Run the workflow contract and verify RED**

Run: `node --test qa/pages-artifact.spec.mjs`

Expected: FAIL because `.github/workflows/pages.yml` is absent.

- [ ] **Step 3: Implement the build and deploy jobs**

The workflow checks out source, installs Node 22 with npm cache, runs `npm ci`, runs `npm test`, rebuilds with `SUMMERSCHOOL_BASE_PATH=/SummerSchool`, verifies the Pages artifact with `SUMMERSCHOOL_EXPECTED_BASE_PATH=/SummerSchool npm run test:pages`, configures Pages, uploads `dist`, and deploys it through the `github-pages` environment.

Use concurrency group `pages` and `cancel-in-progress: false`.

- [ ] **Step 4: Document local and public usage**

README must identify:

```text
Local: http://127.0.0.1:4173/
Public: https://linxisa.github.io/SummerSchool/
```

`docs/OFFLINE_BUNDLE.md` documents the empty local base, the `/SummerSchool` Pages base, and the numbered-route generation.

- [ ] **Step 5: Verify workflow syntax and contracts**

Run:

```bash
node --test qa/pages-artifact.spec.mjs
npm test
SUMMERSCHOOL_BASE_PATH=/SummerSchool npm run build
SUMMERSCHOOL_EXPECTED_BASE_PATH=/SummerSchool npm run test:pages
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 6: Commit the task**

```bash
git add .github/workflows/pages.yml README.md docs/OFFLINE_BUNDLE.md qa/pages-artifact.spec.mjs
git commit -m "ci: deploy Summer School to GitHub Pages"
```

### Task 4: Complete course commit, publication, and live verification

**Files:**
- Commit: all remaining intended course source, asset, experiment, documentation, and QA changes in the current worktree.
- Do not commit: `dist/`, rendered QA screenshots unless already tracked by project policy, temporary files, or credentials.

**Interfaces:**
- Consumes: verified feature branch and authenticated `gh` CLI.
- Produces: public repository, merged `main`, successful Pages deployment, and verified course URL.

- [ ] **Step 1: Audit the complete diff and large-file safety**

Run:

```bash
git status -sb
git diff --stat
git diff --cached --stat
find assets public -type f -size +95M -print
git diff --check
```

Expected: every remaining change belongs to the course; no file exceeds GitHub's 100 MB limit; no whitespace errors.

- [ ] **Step 2: Run final local release gates**

Run:

```bash
npm test
SUMMERSCHOOL_BASE_PATH=/SummerSchool npm run build
SUMMERSCHOOL_EXPECTED_BASE_PATH=/SummerSchool npm run test:pages
npm run export
pdfinfo dist/session-1.pdf | rg '^Pages:\s+28$'
pdfinfo dist/session-2.pdf | rg '^Pages:\s+28$'
```

Expected: all checks pass and both PDFs remain 28 pages.

- [ ] **Step 3: Commit all intended course changes**

Stage the reviewed complete worktree and commit:

```bash
git add -A
git commit -m "feat: publish architecture Summer School course"
```

Generated `dist/` and ignored QA output must remain outside the commit.

- [ ] **Step 4: Push and open the pull request**

```bash
git push -u origin feat/architecture-first-tutorial
gh pr create --repo LinxISA/SummerSchool --base main --head feat/architecture-first-tutorial --title "Publish architecture Summer School course" --body-file <reviewed-temp-file>
```

The PR body summarizes the 56-slide course, Pages deployment, offline experiments, visual assets, and validation evidence.

- [ ] **Step 5: Make the repository public**

Run:

```bash
gh repo edit LinxISA/SummerSchool --visibility public --accept-visibility-change-consequences
gh repo view LinxISA/SummerSchool --json visibility,isPrivate,url
```

Expected: `visibility=PUBLIC`, `isPrivate=false`.

- [ ] **Step 6: Merge the reviewed PR into main**

Run the repository's available PR checks, then use the permitted merge strategy:

```bash
gh pr checks --watch
gh pr merge --squash --delete-branch
```

Expected: PR state is `MERGED` and `main` contains `.github/workflows/pages.yml`.

- [ ] **Step 7: Enable workflow-based Pages if required**

First query:

```bash
gh api repos/LinxISA/SummerSchool/pages
```

If it returns 404, create the Pages site with:

```bash
gh api --method POST repos/LinxISA/SummerSchool/pages -f build_type=workflow
```

If it exists with another build type, update it with:

```bash
gh api --method PUT repos/LinxISA/SummerSchool/pages -f build_type=workflow
```

- [ ] **Step 8: Wait for deployment and verify the live site**

Use `gh run list`, `gh run watch`, and the Pages API until deployment completes. Then verify in Chromium and with HTTP requests:

```text
https://linxisa.github.io/SummerSchool/
https://linxisa.github.io/SummerSchool/session-1/1
https://linxisa.github.io/SummerSchool/session-1/28
https://linxisa.github.io/SummerSchool/session-2/1
https://linxisa.github.io/SummerSchool/session-2/28
```

Acceptance:

- each response is HTTP 200;
- root title is `LinxISA Summer School 2026`;
- the two root cards enter the correct Slidev decks;
- each representative deep link contains Slidev metadata and renders one visible slide;
- representative generated images and experiment JSON return HTTP 200;
- Arrow, PageUp/PageDown, Space, Escape, and `?` work in the deployed browser session.

- [ ] **Step 9: Record final evidence**

Update the final handoff with the live course URL, repository URL, merged PR, deployment run, validation counts, and any GitHub Pages propagation delay encountered.
