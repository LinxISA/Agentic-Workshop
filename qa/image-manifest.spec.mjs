import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'

const digest = async path => createHash('sha256').update(await readFile(path)).digest('hex')

test('every slide has one reviewed, unique, offline visual asset', async () => {
  const manifest = JSON.parse(await readFile('assets/generated/prompts.yaml', 'utf8'))
  assert.equal(manifest.generator, 'OpenAI ImageGen')
  assert.equal(manifest.provenance_status, 'reconstructed_after_generation')
  assert.equal(manifest.original_call_metadata_available, false)
  assert.match(manifest.prompt_record, /original ImageGen call-time prompt metadata was not retained/)
  assert.equal(manifest.assets.length, 42)
  assert.equal(new Set(manifest.assets.map(item => item.slide)).size, 42)
  assert.equal(new Set(manifest.assets.map(item => item.asset)).size, 42)
  assert.equal(new Set(manifest.assets.map(item => item.prompt)).size, 42)
  for (const item of manifest.assets) {
    assert.match(item.slide, /^S\d{2}$/)
    assert.equal(item.review, 'pass')
    assert.ok(item.prompt.length > 220)
    assert.match(item.date, /^2026-\d{2}-\d{2}$/)
    assert.equal(item.source_style, 'PTO ISA_扩展版 · image-dominant architecture keynote')
    assert.equal(item.final_path, `assets/generated/slides/${item.asset}`)
    assert.equal(item.runtime_path, `public/generated/slides/${item.asset}`)
    if (item.generator === 'Keynote PDF render') {
      assert.ok(item.source_page >= 2 && item.source_page <= 9)
      assert.match(item.prompt, /^Source-render contract:/)
    }
    const source = item.final_path
    const runtime = item.runtime_path
    assert.equal(await digest(source), item.sha256)
    assert.equal(await digest(runtime), item.sha256)
  }
})
