import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'

const digest = async path => createHash('sha256').update(await readFile(path)).digest('hex')

test('every slide has one reviewed, unique, offline ImageGen asset', async () => {
  const manifest = JSON.parse(await readFile('assets/generated/prompts.yaml', 'utf8'))
  assert.equal(manifest.generator, 'OpenAI ImageGen')
  assert.equal(manifest.assets.length, 42)
  assert.equal(new Set(manifest.assets.map(item => item.slide)).size, 42)
  assert.equal(new Set(manifest.assets.map(item => item.asset)).size, 42)
  assert.equal(new Set(manifest.assets.map(item => item.prompt)).size, 42)
  for (const item of manifest.assets) {
    assert.match(item.slide, /^S\d{2}$/)
    assert.equal(item.review, 'pass')
    assert.ok(item.prompt.length > 220)
    const source = `assets/generated/slides/${item.asset}`
    const runtime = `public/generated/slides/${item.asset}`
    assert.equal(await digest(source), item.sha256)
    assert.equal(await digest(runtime), item.sha256)
  }
})
