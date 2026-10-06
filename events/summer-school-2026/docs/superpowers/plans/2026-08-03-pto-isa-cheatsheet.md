# PTO ISA Cheatsheet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate two traceable 4K PTO ISA cheatsheet posters whose 11 isometric cartoon category scenes and 124 opcode labels exactly match the approved workbook-derived classification.

**Architecture:** Store the workbook-derived instruction taxonomy as canonical JSON, generate exactly two text-free Image Gen composite backgrounds, and render deterministic HTML/CSS overlays into 3840×2160 PNG files with Playwright. Node tests validate category counts, opcode uniqueness, poster partitioning, prompt provenance, rendered HTML coverage, and final PNG dimensions.

**Tech Stack:** OpenAI built-in Image Gen, JSON, JavaScript ES modules, HTML/CSS, `playwright-chromium`, `sharp`, Node test runner.

## Global Constraints

- Deliver exactly two final 3840×2160 PNG posters; do not create one image per category.
- Cover all 11 top-level categories and exactly 124 opcodes from `Sheet1!A1:C125`.
- Preserve spelling and case, including `SYNCALL`.
- Exclude the planning-only names `TPOW` and `TPOWS`.
- Image Gen must not generate Chinese, opcode labels, formulas, code, or technical annotations.
- Use the supplied image only as a style and composition reference, not as an edit target.
- Keep every generated and rendered asset local; no CDN or runtime network dependency.
- Use a consistent deep-navy, isometric, miniature 3D cartoon industrial visual language.
- Retain both final prompts and local asset paths for provenance.

---

## File Structure

- Create `assets/generated/pto-cheatsheet/source/instructions.json`: canonical taxonomy and poster assignment derived from the workbook.
- Create `assets/generated/pto-cheatsheet/source/render.mjs`: pure HTML generator for one poster.
- Create `assets/generated/pto-cheatsheet/source/cheatsheet.css`: shared 4K layout and typography.
- Create `assets/generated/pto-cheatsheet/prompts.json`: exact Image Gen prompt ledger and input-image roles.
- Create `assets/generated/pto-cheatsheet/pto-isa-cheatsheet-compute-base-v1.png`: text-free Image Gen background for poster A.
- Create `assets/generated/pto-cheatsheet/pto-isa-cheatsheet-data-system-base-v1.png`: text-free Image Gen background for poster B.
- Create `assets/generated/pto-cheatsheet/pto-isa-cheatsheet-compute-v1.png`: final poster A.
- Create `assets/generated/pto-cheatsheet/pto-isa-cheatsheet-data-system-v1.png`: final poster B.
- Create `scripts/render-pto-cheatsheet.mjs`: deterministic 4K renderer.
- Create `qa/pto-cheatsheet.spec.mjs`: taxonomy, render-contract, provenance, and raster checks.
- Modify `package.json`: add focused render/test scripts and include the focused test in the main test chain.

---

### Task 1: Lock the Canonical Instruction Taxonomy

**Files:**
- Create: `assets/generated/pto-cheatsheet/source/instructions.json`
- Create: `qa/pto-cheatsheet.spec.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `instructions.json` with `{ schemaVersion, source, posters }`.
- Produces: `posters[].categories[].groups[]` entries with `{ sourceName: string | null, label: string, opcodes: string[] }` consumed by the renderer and workbook verifier.
- Produces: `npm run test:cheatsheet` used by every later task.

- [ ] **Step 1: Write the failing taxonomy test**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const dataPath = 'assets/generated/pto-cheatsheet/source/instructions.json'
const flatten = category => category.groups.flatMap(group => group.opcodes)

test('PTO cheatsheet taxonomy matches the approved workbook partition', async () => {
  const data = JSON.parse(await readFile(dataPath, 'utf8'))
  assert.equal(data.schemaVersion, 1)
  assert.equal(data.source.workbook, 'PTO-ISA-保留指令列表.xlsx')
  assert.equal(data.source.range, 'Sheet1!A1:C125')
  assert.deepEqual(data.posters.map(item => item.id), ['compute', 'data-system'])

  const categories = data.posters.flatMap(poster => poster.categories)
  const opcodes = categories.flatMap(flatten)
  assert.equal(categories.length, 11)
  assert.equal(opcodes.length, 124)
  assert.equal(new Set(opcodes).size, 124)
  assert.ok(opcodes.includes('SYNCALL'))
  assert.ok(!opcodes.includes('TPOW'))
  assert.ok(!opcodes.includes('TPOWS'))

  assert.deepEqual(data.posters.map(poster => poster.categories.length), [7, 4])
  assert.deepEqual(data.posters.map(poster => poster.categories.flatMap(flatten).length), [74, 50])
  assert.deepEqual(categories.map(category => [category.name, flatten(category).length]), [
    ['逐元素双目运算', 12],
    ['逐元素单目运算', 4],
    ['逐元素超越函数', 7],
    ['逐元素与标量运算', 15],
    ['归约运算', 12],
    ['广播运算', 16],
    ['矩阵运算', 8],
    ['数据搬运与访存', 5],
    ['复杂变换计算', 29],
    ['系统与控制', 7],
    ['通信', 9],
  ])
})
```

- [ ] **Step 2: Add the focused package script and verify the test fails**

Add:

```json
"test:cheatsheet": "node --test qa/pto-cheatsheet.spec.mjs"
```

Run: `npm run test:cheatsheet`

Expected: FAIL because `instructions.json` does not exist.

- [ ] **Step 3: Create the canonical taxonomy JSON**

Write the exact classification approved in `docs/superpowers/specs/2026-08-03-pto-isa-cheatsheet-design.md` with this shape:

```json
{
  "schemaVersion": 1,
  "source": {
    "workbook": "PTO-ISA-保留指令列表.xlsx",
    "range": "Sheet1!A1:C125",
    "opcodeCount": 124,
    "excludedPlanningEntries": ["TPOW", "TPOWS"]
  },
  "posters": [
    {
      "id": "compute",
      "title": "PTO ISA CHEATSHEET",
      "subtitle": "计算与数据并行",
      "categories": []
    },
    {
      "id": "data-system",
      "title": "PTO ISA CHEATSHEET",
      "subtitle": "数据流动与系统协作",
      "categories": []
    }
  ]
}
```

Each category object must contain `id`, `name`, `accent`, `visual`, and `groups`. Each group must contain the exact workbook subcategory in `sourceName`, a display heading in `label`, and the exact opcode array. Use `sourceName: null` and `label: "指令"` for the two workbook categories without a subcategory. Populate all categories and opcode arrays from the approved design specification; do not abbreviate or infer names.

- [ ] **Step 4: Run the focused test**

Run: `npm run test:cheatsheet`

Expected: PASS for taxonomy count, uniqueness, poster partition, and excluded planning entries.

- [ ] **Step 5: Commit the taxonomy contract**

```bash
git add package.json qa/pto-cheatsheet.spec.mjs assets/generated/pto-cheatsheet/source/instructions.json
git commit -m "test: lock PTO cheatsheet taxonomy"
```

---

### Task 2: Generate the Two Text-Free Image Gen Backgrounds

**Files:**
- Create: `assets/generated/pto-cheatsheet/prompts.json`
- Create: `assets/generated/pto-cheatsheet/pto-isa-cheatsheet-compute-base-v1.png`
- Create: `assets/generated/pto-cheatsheet/pto-isa-cheatsheet-data-system-base-v1.png`
- Modify: `qa/pto-cheatsheet.spec.mjs`

**Interfaces:**
- Consumes: user reference image as `style/composition reference`.
- Produces: two local text-free raster backgrounds consumed by `render-pto-cheatsheet.mjs`.
- Produces: prompt records with `{ id, useCase, asset, referenceRole, prompt }`.

- [ ] **Step 1: Extend the test for prompt and base-asset provenance**

```js
test('PTO cheatsheet keeps exactly two Image Gen base assets and prompts', async () => {
  const prompts = JSON.parse(await readFile('assets/generated/pto-cheatsheet/prompts.json', 'utf8'))
  assert.deepEqual(prompts.map(item => item.id), ['compute', 'data-system'])
  assert.equal(prompts.length, 2)
  for (const item of prompts) {
    assert.equal(item.referenceRole, 'style/composition reference')
    assert.match(item.prompt, /no text/i)
    assert.match(item.prompt, /isometric/i)
    assert.ok(item.asset.endsWith('-base-v1.png'))
  }
})
```

Run: `npm run test:cheatsheet`

Expected: FAIL because prompts and backgrounds are absent.

- [ ] **Step 2: Generate poster A background with built-in Image Gen**

Use the supplied image as a style/composition reference and generate a new image with this exact prompt:

```text
Use case: scientific-educational
Asset type: text-free composite background for a 4K 16:9 PTO ISA teaching cheatsheet
Primary request: create one coherent deep-navy poster containing seven distinct isometric miniature 3D cartoon industrial dioramas, arranged on a disciplined four-column by two-row grid with one quiet title cell; this is one composite image, not seven separate images
Input images: Image 1 is a style and composition reference only, not an edit target
Scene/backdrop: dark navy-to-black studio background with generous spacing and subtle vignette
Subject: seven rounded display plinths: two-input tile arithmetic factory; single-input tile transformation machine; nonlinear function reactor with curved mechanical paths; scalar capsule feeding a tile array; row-and-column reduction funnels; broadcast distribution tower feeding a regular grid; cube matrix factory combining two tile racks
Style/medium: premium isometric 3D cartoon miniature, polished industrial toy model, physically plausible materials, friendly and educational, matching the reference image's camera angle and visual density
Composition/framing: 16:9 landscape; seven clearly separated dioramas with consistent scale; reserve the upper-left grid cell as a dark low-detail title area; reserve a clean lower label zone inside every diorama region for deterministic text overlay
Lighting/mood: soft cinematic rim lighting, crisp readable silhouettes, restrained glow
Color palette: deep navy background, cyan and blue data, warm amber compute, green distribution details, very sparse magenta accents
Constraints: no text, no letters, no digits, no Chinese, no opcode labels, no formulas, no equations, no code, no logos, no watermark, no pseudo-writing; every machine screen and sign must be blank; exactly seven category dioramas; one composite poster
Avoid: separate asset sheets, flat icons, realistic people, brand marks, busy circuitry, illegible tiny objects, bright background, text-like markings
```

Inspect the result and accept only if all seven scenes are visually separated, the title cell is calm, and label zones are unobstructed. Save the selected output as `assets/generated/pto-cheatsheet/pto-isa-cheatsheet-compute-base-v1.png`.

- [ ] **Step 3: Generate poster B background with built-in Image Gen**

Use the same reference role and generate a new image with this exact prompt:

```text
Use case: scientific-educational
Asset type: text-free composite background for a 4K 16:9 PTO ISA teaching cheatsheet
Primary request: create one coherent deep-navy poster containing four distinct isometric miniature 3D cartoon industrial dioramas for data movement, complex tile transformation, system control, and communication; this is one composite image, not separate category images
Input images: Image 1 is a style and composition reference only, not an edit target
Scene/backdrop: dark navy-to-black studio background with generous spacing and subtle vignette
Subject: one port-and-warehouse transport diorama with straight and branching routes; one double-width tile processing center containing five connected micro-workstations for initialization, datatype conversion, layout transformation, sorting, and union; one control tower with lifecycle storage slots and a synchronization gate; one pair of tile cities connected by bidirectional bridges plus a visually distinct asynchronous express channel
Style/medium: premium isometric 3D cartoon miniature, polished industrial toy model, physically plausible materials, friendly and educational, matching the reference image's camera angle and visual density
Composition/framing: 16:9 landscape; asymmetric grid with the complex transformation center occupying twice the visual area of another card; reserve a quiet dark title band; reserve clean lower label zones for all four category regions
Lighting/mood: soft cinematic rim lighting, crisp readable silhouettes, restrained glow
Color palette: deep navy background, cyan and blue storage and traffic, warm amber transformation, green control details, sparse magenta communication accents
Constraints: no text, no letters, no digits, no Chinese, no opcode labels, no formulas, no equations, no code, no logos, no watermark, no pseudo-writing; every screen and sign must be blank; exactly four category dioramas; one composite poster
Avoid: separate asset sheets, flat icons, realistic people, brand marks, busy circuitry, illegible tiny objects, bright background, text-like markings
```

Inspect the result and accept only if all four scenes are distinct, the transformation center visibly contains five sub-workstations, and label zones are clear. Save the selected output as `assets/generated/pto-cheatsheet/pto-isa-cheatsheet-data-system-base-v1.png`.

- [ ] **Step 4: Save the exact prompt ledger and run the provenance test**

Create `prompts.json` with the two exact prompt strings, local base-asset paths, the reference role, and `generator: "OpenAI built-in Image Gen"`.

Run: `npm run test:cheatsheet`

Expected: PASS for taxonomy and prompt provenance.

- [ ] **Step 5: Commit the generated visual bases**

```bash
git add assets/generated/pto-cheatsheet/prompts.json assets/generated/pto-cheatsheet/*-base-v1.png qa/pto-cheatsheet.spec.mjs
git commit -m "feat: add PTO cheatsheet visual bases"
```

---

### Task 3: Build the Deterministic 4K Composer

**Files:**
- Create: `assets/generated/pto-cheatsheet/source/render.mjs`
- Create: `assets/generated/pto-cheatsheet/source/cheatsheet.css`
- Create: `scripts/render-pto-cheatsheet.mjs`
- Modify: `qa/pto-cheatsheet.spec.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `instructions.json`, `cheatsheet.css`, and one background PNG per poster.
- Produces: `renderPosterHtml({ poster, css, backgroundDataUrl }): string`.
- Produces: `npm run cheatsheet:render` and two final 3840×2160 PNG files.

- [ ] **Step 1: Write the failing HTML coverage test**

```js
import { renderPosterHtml } from '../assets/generated/pto-cheatsheet/source/render.mjs'

test('deterministic poster HTML includes every opcode exactly once', async () => {
  const data = JSON.parse(await readFile(dataPath, 'utf8'))
  for (const poster of data.posters) {
    const html = renderPosterHtml({
      poster,
      css: '.poster{}',
      backgroundDataUrl: 'data:image/png;base64,AA==',
    })
    const expected = poster.categories.flatMap(flatten)
    const rendered = [...html.matchAll(/data-opcode="([^"]+)"/g)].map(match => match[1])
    assert.deepEqual(rendered, expected)
    assert.equal(new Set(rendered).size, rendered.length)
  }
})
```

Run: `npm run test:cheatsheet`

Expected: FAIL because `render.mjs` does not exist.

- [ ] **Step 2: Implement the pure HTML renderer**

Implement and export:

```js
export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export function renderPosterHtml({ poster, css, backgroundDataUrl }) {
  const cards = poster.categories.map((category, index) => {
    const groups = category.groups.map(group => `
      <section class="opcode-group">
        <h3>${escapeHtml(group.label)}</h3>
        <div class="opcode-grid">
          ${group.opcodes.map(opcode => `<code data-opcode="${escapeHtml(opcode)}">${escapeHtml(opcode)}</code>`).join('')}
        </div>
      </section>`).join('')
    return `<article class="category-card category-${escapeHtml(category.id)} slot-${index + 1}" style="--accent:${escapeHtml(category.accent)}">
      <h2>${escapeHtml(category.name)}</h2>
      <div class="groups">${groups}</div>
    </article>`
  }).join('')

  return `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><style>${css}</style></head>
    <body><main class="poster poster-${escapeHtml(poster.id)}" style="--background:url('${backgroundDataUrl}')">
      <header><p>${escapeHtml(poster.title)}</p><h1>${escapeHtml(poster.subtitle)}</h1></header>
      <div class="category-grid">${cards}</div>
    </main></body></html>`
}
```

- [ ] **Step 3: Implement the shared CSS contract**

Use a fixed 3840×2160 canvas, local fonts, no animation, and exact grid areas:

```css
html, body { width: 3840px; height: 2160px; margin: 0; overflow: hidden; }
body { background: #04101f; }
.poster {
  width: 3840px; height: 2160px; position: relative; color: #f7fbff;
  background-image: linear-gradient(180deg, rgba(2,10,24,.04), rgba(2,8,20,.32)), var(--background);
  background-size: cover; background-position: center;
  font-family: "PingFang SC", "Noto Sans CJK SC", sans-serif;
}
header { position: absolute; left: 110px; top: 72px; z-index: 2; }
header p { margin: 0; color: #77dcff; font: 700 34px/1 "SFMono-Regular", Menlo, monospace; letter-spacing: .18em; }
header h1 { margin: 18px 0 0; font-size: 92px; line-height: 1; }
.category-grid { position: absolute; inset: 240px 90px 80px; display: grid; gap: 30px; }
.poster-compute .category-grid { grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(2, 1fr); }
.poster-compute .slot-1 { grid-column: 2; grid-row: 1; }
.poster-compute .slot-2 { grid-column: 3; grid-row: 1; }
.poster-compute .slot-3 { grid-column: 4; grid-row: 1; }
.poster-compute .slot-4 { grid-column: 1; grid-row: 2; }
.poster-compute .slot-5 { grid-column: 2; grid-row: 2; }
.poster-compute .slot-6 { grid-column: 3; grid-row: 2; }
.poster-compute .slot-7 { grid-column: 4; grid-row: 2; }
.poster-data-system .category-grid { grid-template-columns: 1fr 1.35fr 1fr; grid-template-rows: repeat(2, 1fr); }
.poster-data-system .slot-1 { grid-column: 1; grid-row: 1; }
.poster-data-system .slot-2 { grid-column: 2; grid-row: 1 / span 2; }
.poster-data-system .slot-3 { grid-column: 3; grid-row: 1; }
.poster-data-system .slot-4 { grid-column: 1 / span 1; grid-row: 2; }
.category-card { align-self: end; min-height: 310px; padding: 28px 34px; border-radius: 30px; background: linear-gradient(180deg, rgba(4,16,35,.26), rgba(4,14,31,.91)); border: 2px solid color-mix(in srgb, var(--accent) 46%, transparent); box-shadow: 0 24px 70px rgba(0,0,0,.28); backdrop-filter: blur(8px); }
.category-card h2 { margin: 0 0 18px; font-size: 48px; line-height: 1.05; }
.groups { display: grid; gap: 14px; }
.opcode-group h3 { margin: 0 0 8px; color: var(--accent); font-size: 28px; }
.opcode-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 5px 14px; }
.opcode-grid code { color: #e9f8ff; font: 700 27px/1.22 "SFMono-Regular", Menlo, monospace; white-space: nowrap; }
.category-complex-transform .opcode-grid { grid-template-columns: repeat(3, minmax(0,1fr)); }
```

Tune only category-specific font sizes or column counts needed to prevent overflow; keep the shared visual system unchanged.

- [ ] **Step 4: Implement the Playwright renderer**

```js
import { chromium } from 'playwright-chromium'
import { readFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { renderPosterHtml } from '../assets/generated/pto-cheatsheet/source/render.mjs'

const root = resolve(import.meta.dirname, '..')
const assetDir = resolve(root, 'assets/generated/pto-cheatsheet')
const sourceDir = resolve(assetDir, 'source')
const data = JSON.parse(await readFile(resolve(sourceDir, 'instructions.json'), 'utf8'))
const css = await readFile(resolve(sourceDir, 'cheatsheet.css'), 'utf8')
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 3840, height: 2160 }, deviceScaleFactor: 1 })

try {
  await mkdir(assetDir, { recursive: true })
  for (const poster of data.posters) {
    const baseName = poster.id === 'compute'
      ? 'pto-isa-cheatsheet-compute-base-v1.png'
      : 'pto-isa-cheatsheet-data-system-base-v1.png'
    const outputName = poster.id === 'compute'
      ? 'pto-isa-cheatsheet-compute-v1.png'
      : 'pto-isa-cheatsheet-data-system-v1.png'
    const background = await readFile(resolve(assetDir, baseName))
    const page = await context.newPage()
    await page.setContent(renderPosterHtml({
      poster,
      css,
      backgroundDataUrl: `data:image/png;base64,${background.toString('base64')}`,
    }), { waitUntil: 'load' })
    await page.screenshot({ path: resolve(assetDir, outputName) })
    await page.close()
  }
} finally {
  await browser.close()
}
```

- [ ] **Step 5: Add the render script and run focused tests**

Add:

```json
"cheatsheet:render": "node scripts/render-pto-cheatsheet.mjs"
```

Run: `npm run test:cheatsheet`

Expected: PASS, including exact HTML opcode coverage.

- [ ] **Step 6: Render the two final posters**

Run: `npm run cheatsheet:render`

Expected: two final PNG files in `assets/generated/pto-cheatsheet/`.

- [ ] **Step 7: Commit the deterministic composer**

```bash
git add package.json qa/pto-cheatsheet.spec.mjs scripts/render-pto-cheatsheet.mjs assets/generated/pto-cheatsheet/source/render.mjs assets/generated/pto-cheatsheet/source/cheatsheet.css assets/generated/pto-cheatsheet/*-v1.png
git commit -m "feat: render PTO ISA cheatsheet posters"
```

---

### Task 4: Verify Workbook Fidelity and Visual Quality

**Files:**
- Modify: `qa/pto-cheatsheet.spec.mjs`
- Modify: `package.json`
- Modify only if inspection reveals defects: `assets/generated/pto-cheatsheet/source/cheatsheet.css`
- Regenerate after any layout fix: the two final poster PNG files.

**Interfaces:**
- Consumes: canonical JSON, two final PNG files, and the local workbook supplied through `PTO_CHEATSHEET_XLSX` during one-time verification.
- Produces: test evidence for exact raster dimensions and a clean visual review at 4K and 1080p.

- [ ] **Step 1: Add final raster assertions**

```js
import sharp from 'sharp'

test('final PTO cheatsheet posters are exactly 4K 16:9 PNGs', async () => {
  for (const name of [
    'pto-isa-cheatsheet-compute-v1.png',
    'pto-isa-cheatsheet-data-system-v1.png',
  ]) {
    const path = `assets/generated/pto-cheatsheet/${name}`
    const metadata = await sharp(path).metadata()
    assert.equal(metadata.format, 'png')
    assert.deepEqual([metadata.width, metadata.height], [3840, 2160])
  }
})
```

- [ ] **Step 2: Add the focused test to the main test chain**

Insert `npm run test:cheatsheet` after `npm run test:images` in the existing `test` script so future repository verification covers the cheatsheet contract.

- [ ] **Step 3: Compare the canonical JSON against the workbook with artifact-tool**

Use the bundled workspace dependency loader paths, import the workbook read-only, fill down category/subcategory cells exactly as in the extraction step, and compare the resulting opcode array and category mapping with `instructions.json`. Before running, set `PTO_CHEATSHEET_XLSX` to the supplied workbook, and set `CODEX_NODE` plus `CODEX_NODE_MODULES` to the exact paths returned by `load_workspace_dependencies`. Keep those values in the local environment only:

```bash
test -n "$PTO_CHEATSHEET_XLSX"
test -n "$CODEX_NODE"
test -n "$CODEX_NODE_MODULES"
task_repo=$(pwd)
task_dir=$(mktemp -d)
ln -s "$CODEX_NODE_MODULES" "$task_dir/node_modules"
cd "$task_dir"
PTO_CHEATSHEET_DATA="$task_repo/assets/generated/pto-cheatsheet/source/instructions.json" "$CODEX_NODE" --input-type=module -e '
import { readFile } from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(process.env.PTO_CHEATSHEET_XLSX));
const rows = workbook.worksheets.getItem("Sheet1").getRange("A1:C125").values;
const expected = JSON.parse(await readFile(process.env.PTO_CHEATSHEET_DATA, "utf8"));
const expectedRows = expected.posters.flatMap(poster => poster.categories.flatMap(category =>
  category.groups.flatMap(group => group.opcodes.map(opcode => ({
    category: category.name,
    subcategory: group.sourceName,
    opcode,
  }))),
));

let category = null;
let subcategory = null;
const actualRows = [];
for (const row of rows.slice(1)) {
  if (row[0]) {
    category = String(row[0]).trim();
    subcategory = row[1] ? String(row[1]).trim() : null;
  } else if (row[1]) {
    subcategory = String(row[1]).trim();
  }
  if (row[2]) actualRows.push({ category, subcategory, opcode: String(row[2]).trim() });
}

if (JSON.stringify(actualRows) !== JSON.stringify(expectedRows)) {
  console.error(JSON.stringify({ expectedRows, actualRows }, null, 2));
  process.exit(1);
}
console.log(`verified ${actualRows.length} workbook opcode rows`);
'
```

The repository source must not store that absolute path. Expected comparison: 124 exact matches, zero missing names, zero extra names, zero category mismatches.

- [ ] **Step 4: Run the renderer and focused verification**

Run:

```bash
npm run cheatsheet:render
npm run test:cheatsheet
git diff --check
```

Expected: all commands succeed.

- [ ] **Step 5: Inspect both final PNGs at original resolution**

Open both images with `view_image` using original detail. Check:

- every category has one recognizable 3D cartoon scene;
- no generated pseudo-text is visible in the base art;
- title, category, subcategory, and opcode hierarchy is obvious;
- long names such as `TROWEXPANDEXPDIF`, `TCOLEXPANDEXPDIF`, `TDEINTERLEAVE`, and `TPUT_ASYNC` are not clipped;
- the complex-transform card remains readable despite containing 29 opcodes;
- background art does not compete with labels.

- [ ] **Step 6: Inspect 1920×1080 downscaled previews**

Use `sharp` in a read-only verification command to create temporary 1920×1080 previews, inspect both, then discard the previews. If text becomes illegible, adjust only font size, opacity, or column count in `cheatsheet.css`, rerender, and repeat the two visual checks once.

- [ ] **Step 7: Run the repository-level targeted checks**

Run:

```bash
npm run test:cheatsheet
npm run build
```

Expected: both commands succeed and no existing course route or build artifact regresses.

- [ ] **Step 8: Commit verification and final assets**

```bash
git add package.json qa/pto-cheatsheet.spec.mjs assets/generated/pto-cheatsheet/source/cheatsheet.css assets/generated/pto-cheatsheet/pto-isa-cheatsheet-compute-v1.png assets/generated/pto-cheatsheet/pto-isa-cheatsheet-data-system-v1.png
git commit -m "test: verify PTO cheatsheet delivery"
```
