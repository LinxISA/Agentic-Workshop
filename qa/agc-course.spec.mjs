import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { audienceVisibleText } from './course-contracts.spec.mjs'

async function readSlides() {
  const source = await readFile('decks/session-2/slides.md', 'utf8')
  const headings = [...source.matchAll(/^#\s+.+$/gm)]
  return new Map(headings.map((heading, index) => {
    const segment = source.slice(heading.index, headings[index + 1]?.index ?? source.length)
    return [segment.match(/Slide-ID:\s*(S\d{2})/)?.[1], segment]
  }))
}

const slidesPromise = readSlides()
const latestKeynoteSection = [
  ['S38', /Agentic Model/i],
  ['S39', /基础仿真组件/],
  ['S40', /MLIR/i],
  ['S41', /Agentic Architecture Model/i],
  ['S42', /架构城市|Agentic Architecture Model/i],
  ['S43', /Python.*建造过程/s],
  ['S44', /NPUCity/i],
  ['S45', /四类装饰器/],
  ['S46', /SimQueue/i],
  ['S47', /硅基 NPU Core/i],
]

for (const [id, pattern] of latestKeynoteSection) {
  test(`${id} follows the latest Keynote Agentic Architecture sequence`, async () => {
    const slides = await slidesPromise
    assert.ok(slides.has(id), `${id} must exist`)
    assert.match(audienceVisibleText(slides.get(id)), pattern)
    const page = Number(id.slice(1))
    assert.match(slides.get(id), new RegExp(`/generated/keynote-latest/page-${page}\\.png`))
    assert.match(slides.get(id), new RegExp(`- source: K${page}`))
  })
}

test('the latest Keynote chapter replaces the superseded interactive AGC sequence', async () => {
  const slides = await slidesPromise
  const section = Array.from({ length: 10 }, (_, index) => slides.get(`S${38 + index}`)).join('\n')
  assert.doesNotMatch(section, /AgcElaborationExplorer|AgcSpecializationExplorer|AgcPipelineStepper/)
})
