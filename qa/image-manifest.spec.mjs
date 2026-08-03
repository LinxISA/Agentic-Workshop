import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'

const manifestPath = 'assets/generated/prompts.yaml'
const expectedSlides = Array.from({ length: 64 }, (_, index) => `S${String(index + 1).padStart(2, '0')}`)
const newImageGenSlides = ['S23', 'S33', ...Array.from({ length: 13 }, (_, index) => `S${index + 38}`), ...Array.from({ length: 7 }, (_, index) => `S${index + 58}`)]
const sourcePageBySlide = new Map([
  ...Array.from({ length: 22 }, (_, index) => [`S${String(index + 1).padStart(2, '0')}`, index + 1]),
  ...Array.from({ length: 9 }, (_, index) => [`S${index + 24}`, index + 23]),
  ...Array.from({ length: 4 }, (_, index) => [`S${index + 34}`, index + 32]),
  ...Array.from({ length: 7 }, (_, index) => [`S${index + 51}`, index + 36]),
])

const digest = bytes => createHash('sha256').update(bytes).digest('hex')

function pngDimensions(bytes) {
  assert.equal(bytes.subarray(1, 4).toString(), 'PNG', 'asset must be a PNG')
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }
}

async function loadManifest() {
  return JSON.parse(await readFile(manifestPath, 'utf8'))
}

test('manifest covers exactly S01-S64 with one unique, reviewed, offline asset per slide', async () => {
  const manifest = await loadManifest()
  assert.equal(manifest.schema_version, 2)
  assert.deepEqual(manifest.assets.map(item => item.slide).sort(), expectedSlides)
  assert.equal(new Set(manifest.assets.map(item => item.asset)).size, 64)

  for (const item of manifest.assets) {
    assert.equal(item.page, Number(item.slide.slice(1)))
    assert.ok(item.use.trim().length > 0, `${item.slide}: missing visual use`)
    assert.ok(item.prompt.length >= 40, `${item.slide}: missing prompt/render contract`)
    assert.match(item.date, /^2026-\d{2}-\d{2}$/)
    assert.equal(item.review, 'pass')
    assert.equal(item.path, `assets/generated/slides/${item.asset}`)
    assert.equal(item.final_path, item.path)
    assert.equal(item.runtime_path, `public/generated/slides/${item.asset}`)
    assert.doesNotMatch(item.runtime_path, /^(?:https?:)?\/\//)
    assert.match(item.sha256, /^[a-f0-9]{64}$/)
    assert.ok(Number.isInteger(item.width) && Number.isInteger(item.height))
  }
})

test('source-page mapping permits each K01-K42 exactly once without mislabeling the S01 generator', async () => {
  const manifest = await loadManifest()
  const mapped = manifest.assets.filter(item => item.source_page !== null)
  assert.equal(mapped.length, 42)
  assert.deepEqual(mapped.map(item => item.source_page).sort((a, b) => a - b), Array.from({ length: 42 }, (_, index) => index + 1))

  for (const item of manifest.assets) {
    assert.equal(item.source_page, sourcePageBySlide.get(item.slide) ?? null, `${item.slide}: unexpected Keynote source page`)
  }

  const cover = manifest.assets.find(item => item.slide === 'S01')
  assert.equal(cover.generator, 'OpenAI ImageGen')
  assert.equal(cover.source_page, 1)
  assert.equal(cover.provenance_status, 'legacy_asset_prompt_reconstructed')
  assert.equal(cover.original_call_metadata_available, false)
  assert.match(cover.prompt_record, /not retained/i)

  const sourceRenders = manifest.assets.filter(item => item.generator === 'Keynote PDF render')
  assert.equal(sourceRenders.length, 41)
  for (const item of sourceRenders) {
    assert.ok(item.source_page >= 2 && item.source_page <= 42)
    assert.match(item.prompt, /^Source-render contract:/)
    assert.equal(item.provenance_status, 'deterministic_source_render')
    assert.equal(item.original_prompt_available, null)
    assert.equal(item.original_call_metadata_available, null)
    const expectedAsset = `${item.slide.toLowerCase()}-keynote-page-${item.source_page}.png`
    assert.equal(item.asset, expectedAsset)
  }
})

test('ImageGen provenance distinguishes the legacy cover from 22 retained original v2 prompts', async () => {
  const manifest = await loadManifest()
  const promptLedger = JSON.parse(await readFile('assets/generated/v2-prompts.yaml', 'utf8'))
  const newRecords = manifest.assets.filter(item => item.generation_batch === 'v2')
  assert.deepEqual(newRecords.map(item => item.slide).sort(), newImageGenSlides.sort())
  assert.equal(newRecords.length, 22)

  for (const item of newRecords) {
    assert.equal(item.generator, 'OpenAI ImageGen')
    assert.equal(item.provenance_status, 'original_prompt_only')
    assert.equal(item.original_prompt_available, true)
    assert.equal(item.original_call_metadata_available, false)
    assert.equal(item.prompt_record, 'exact original ImageGen prompt retained; original API call metadata was not retained')
    assert.match(item.asset, /-v2\.png$/)
    assert.equal(item.source_page, null)
  }

  assert.deepEqual(
    newRecords.map(({ slide, asset, use, prompt }) => ({ slide, asset, use, prompt })),
    promptLedger,
    'canonical manifest must preserve the visual director prompt ledger verbatim',
  )
})

test('manifest hashes and dimensions match both project and public copies', async () => {
  const manifest = await loadManifest()
  for (const item of manifest.assets) {
    const [source, runtime] = await Promise.all([readFile(item.final_path), readFile(item.runtime_path)])
    assert.equal(digest(source), item.sha256, `${item.slide}: project hash`)
    assert.equal(digest(runtime), item.sha256, `${item.slide}: public hash`)
    assert.deepEqual(pngDimensions(source), { width: item.width, height: item.height }, `${item.slide}: project dimensions`)
    assert.deepEqual(pngDimensions(runtime), { width: item.width, height: item.height }, `${item.slide}: public dimensions`)
    if (item.generator === 'Keynote PDF render') assert.deepEqual([item.width, item.height], [1920, 1080])
    else assert.deepEqual([item.width, item.height], [1672, 941])
  }
})
