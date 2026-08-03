import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { audienceVisibleText, visibleVueTags } from './course-contracts.spec.mjs'

async function readSlides() {
  const slides = new Map()
  for (const path of ['decks/session-1/slides.md', 'decks/session-2/slides.md']) {
    const source = await readFile(path, 'utf8')
    const headings = [...source.matchAll(/^#\s+.+$/gm)]
    for (let index = 0; index < headings.length; index += 1) {
      const segment = source.slice(headings[index].index, headings[index + 1]?.index ?? source.length)
      const id = segment.match(/Slide-ID:\s*(S\d{2})/)?.[1]
      if (id) slides.set(id, segment)
    }
  }
  return slides
}

const slidesPromise = readSlides()

const claims = [
  ['S40', /Python.*建造过程|建造过程.*Python/, 'Python construction semantics'],
  ['S41', /NPUCity|Cluster instance/, 'NPUCity static hierarchy'],
  ['S42', /@system.*@template.*@function.*@const/s, 'four decorator contracts'],
  ['S43', /Static.*Runtime/s, 'Static and Runtime separation'],
  ['S44', /JIT Elaboration/, 'JIT Elaboration'],
  ['S45', /source hash|源码 hash|源码hash/i, 'source hash in specialization identity'],
  ['S46', /valueclass.*规范化/s, 'valueclass canonicalization'],
  ['S47', /agc\.module.*agc\.instance/s, 'hierarchy-preserving AGC IR'],
  ['S48', /materialize-queues|SimQueue/, 'queue materialization'],
  ['S49', /Python.*AGC IR.*C\+\+ Runtime/s, 'responsibility boundary'],
]

for (const [id, pattern, label] of claims) {
  test(`${id} visibly teaches ${label}`, async () => {
    const slides = await slidesPromise
    assert.ok(slides.has(id), `${id} must exist`)
    assert.match(audienceVisibleText(slides.get(id)), pattern)
  })
}

test('AGC pages explicitly label the dialect and lowering surface as proposed design', async () => {
  const slides = await slidesPromise
  for (let page = 40; page <= 49; page += 1) {
    const id = `S${page}`
    assert.match(audienceVisibleText(slides.get(id) ?? ''), /设计提案|proposed design/i, `${id} needs proposal boundary`)
  }
})

test('interactive AGC pages render the elaboration, specialization, and pipeline components', async () => {
  const slides = await slidesPromise
  assert.ok(visibleVueTags(slides.get('S40')).includes('AgcElaborationExplorer'))
  assert.ok(visibleVueTags(slides.get('S43')).includes('AgcSpecializationExplorer'))
  assert.ok(visibleVueTags(slides.get('S44')).includes('AgcPipelineStepper'))
})

test('AGC audience copy distinguishes construction order from concurrent runtime behavior', async () => {
  const slides = await slidesPromise
  const text = [slides.get('S40'), slides.get('S49')].map(audienceVisibleText).join(' ')
  assert.match(text, /构造顺序/)
  assert.match(text, /并发运行/)
  assert.doesNotMatch(text, /Python.*仿真顺序/)
})
