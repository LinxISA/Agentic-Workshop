import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const deckPaths = ['decks/session-1/slides.md', 'decks/session-2/slides.md']

export function stripNonAudienceSource(source) {
  return source
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^---\s*$[\s\S]*?^---\s*$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
}

export function visibleVueTags(source) {
  const visibleSource = stripNonAudienceSource(source)
  const withoutQuotedAttributeValues = visibleSource.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '""')
  return [...withoutQuotedAttributeValues.matchAll(/<(?!\/)([A-Z][A-Za-z0-9]*)\b/g)].map(match => match[1])
}

export function audienceVisibleText(source) {
  const visibleSource = stripNonAudienceSource(source)
  const visibleAttributes = [...visibleSource.matchAll(/\b(?:title|claim|eyebrow|label|aria-label)=(?:"([^"]*)"|'([^']*)')/g)]
    .map(match => match[1] ?? match[2])
  const markdownText = visibleSource.replace(/<[^>]+>/g, ' ')
  return `${visibleAttributes.join(' ')} ${markdownText}`.replace(/\s+/g, ' ').trim()
}

export function keynoteSourceIds(source) {
  const noteText = [...source.matchAll(/<!--([\s\S]*?)-->/g)].map(match => match[1]).join('\n')
  const sourceSection = noteText.split('[Sources]')[1] ?? ''
  return [...sourceSection.matchAll(/^\s*-\s*source:\s*(K\d{2})\s*$/gmi)].map(match => match[1])
}

export function hasDavinciExtensionBoundary(text) {
  const normalized = text.replace(/\s+/g, ' ')
  const approvedPhrase = /\bTPUT\b\s*[\/／]\s*\bTGET\b\s*(?:—|–|-|:|：)\s*DaVinciOO\s+communication\s+extensions?\s*(?:—|–|-|:|：)\s*(?:not\s+normative|non[- ]normative)\s+PTO-ASL\b/i
  return approvedPhrase.test(normalized)
}

async function readSlidesById() {
  const slides = new Map()
  for (const path of deckPaths) {
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

const slidesPromise = readSlidesById()
const interactionContracts = [
  ['S08', 'InteractiveRoofline'],
  ['S20', 'ClockCycleConverter'],
  ['S21', 'MemoryHierarchyExplorer'],
  ['S25', 'PtoMachineExplorer'],
  ['S28', 'TransferTimeLab'],
  ['S33', 'TraceAnatomy'],
  ['S34', 'SimQueueExplorer'],
  ['S35', 'DaVinciTopology'],
  ['S38', 'CyclePlayback'],
  ['S40', 'ParameterSweep'],
  ['S41', 'EvidenceTimeline'],
  ['S55', 'ClosedLoopVerification'],
]

for (const [id, componentName] of interactionContracts) {
  test(`${id} renders the ${componentName} Vue component`, async () => {
    const slides = await slidesPromise
    assert.ok(slides.has(id), `${id} must exist`)
    assert.ok(visibleVueTags(slides.get(id)).includes(componentName), `${id} must render <${componentName}>`)
  })
}

test('component placement ignores tags in notes, frontmatter, and code examples', () => {
  const source = `---\ntitle: <InteractiveRoofline />\n---\n<!-- <InteractiveRoofline /> -->\n\`<InteractiveRoofline />\`\n\`\`\`vue\n<InteractiveRoofline />\n\`\`\``
  assert.deepEqual(visibleVueTags(source), [])
})

test('component placement rejects prefixed and suffixed lookalike tags', () => {
  assert.deepEqual(visibleVueTags('<FakeInteractiveRoofline /><InteractiveRooflinePreview />'), ['FakeInteractiveRoofline', 'InteractiveRooflinePreview'])
  assert.ok(!visibleVueTags('<FakeInteractiveRoofline /><InteractiveRooflinePreview />').includes('InteractiveRoofline'))
})

test('component placement ignores tag-shaped strings inside attribute values', () => {
  const source = '<FullBleedStage claim="example: <InteractiveRoofline />" aria-label="<ClockCycleConverter />" />'
  assert.deepEqual(visibleVueTags(source), ['FullBleedStage'])
})

const semanticContracts = [
  ['S30', /\bq_proj\b/i, 'q_proj'],
  ['S34', /\bSimQueue\b/i, 'SimQueue'],
  ['S51', /\bPTO-ASL\b/i, 'PTO-ASL'],
  ['S52', /\bNDF\b/, 'NDF'],
]

for (const [id, pattern, label] of semanticContracts) {
  test(`${id} visibly teaches ${label}`, async () => {
    const slides = await slidesPromise
    assert.ok(slides.has(id), `${id} must exist`)
    assert.match(audienceVisibleText(slides.get(id)), pattern)
  })
}

test('audience semantic checks ignore notes and component names', () => {
  assert.doesNotMatch(audienceVisibleText('<!-- q_proj -->\n<SimQueueExplorer />'), /q_proj|SimQueue/)
})

test('audience-visible narrative excludes ARM ASL', async () => {
  const slides = await slidesPromise
  const offenders = [...slides].filter(([, source]) => /\bARM\s+ASL\b/i.test(audienceVisibleText(source))).map(([id]) => id)
  assert.deepEqual(offenders, [])
})

test('audience-visible narrative excludes the LinxCore case study', async () => {
  const slides = await slidesPromise
  const offenders = [...slides].filter(([, source]) => /\bLinxCore\b/i.test(audienceVisibleText(source))).map(([id]) => id)
  assert.deepEqual(offenders, [])
})

test('S51 visibly labels TPUT and TGET as non-normative DaVinciOO communication extensions', async () => {
  const slides = await slidesPromise
  assert.ok(slides.has('S51'), 'S51 must exist')
  assert.ok(hasDavinciExtensionBoundary(audienceVisibleText(slides.get('S51'))))
})

test('extension boundary rejects globally scattered semantic keywords', () => {
  const scattered = `TPUT ${'unrelated '.repeat(80)} TGET ${'unrelated '.repeat(80)} DaVinciOO communication extensions. PTO-ASL.`
  assert.equal(hasDavinciExtensionBoundary(scattered), false)
})

test('extension boundary rejects misattributing TPUT and TGET to normative PTO-ASL', () => {
  const misattribution = 'TPUT and TGET are normative PTO-ASL operations and DaVinciOO communication extensions'
  assert.equal(hasDavinciExtensionBoundary(misattribution), false)
})

test('extension boundary rejects negation that applies only to unrelated TMOV', () => {
  const unrelatedNegation = 'TPUT / TGET — DaVinciOO communication extensions — TMOV is not normative PTO-ASL'
  assert.equal(hasDavinciExtensionBoundary(unrelatedNegation), false)
})

test('S51 visibly lists normative PTO-ASL operation cards', async () => {
  const slides = await slidesPromise
  assert.ok(slides.has('S51'), 'S51 must exist')
  const text = audienceVisibleText(slides.get('S51'))
  for (const opcode of ['TLOAD', 'TMOV', 'TEXTRACT', 'TPUSH', 'TPOP']) assert.match(text, new RegExp(`\\b${opcode}\\b`))
})

test('speaker notes map K01 through K34 exactly once', async () => {
  const slides = await slidesPromise
  const actual = [...slides.values()].flatMap(keynoteSourceIds).sort()
  const expected = Array.from({ length: 34 }, (_, index) => `K${String(index + 1).padStart(2, '0')}`)
  assert.deepEqual(actual, expected)
})

test('Keynote mapping ignores visible text and source IDs outside the Sources section', () => {
  const source = `- source: K01\n<!--\n- source: K02\n[Sources]\n- source: K03\n-->`
  assert.deepEqual(keynoteSourceIds(source), ['K03'])
})

async function loadTransferModel() {
  return import('../components/transferTimeModel.mjs')
}

const transferFixture = {
  dataBytes: 1000,
  tileCapacityBytes: 256,
  sourceBandwidthBytesPerCycle: 64,
  linkBandwidthBytesPerCycle: 32,
  destinationBandwidthBytesPerCycle: 48,
  setupCycles: 5,
  queueCycles: 7,
  synchronizationCycles: 11,
}

const positiveTransferCases = [
  {
    name: 'uses source bandwidth when source is the narrowest stage',
    input: { ...transferFixture, dataBytes: 1024, tileCapacityBytes: 256, sourceBandwidthBytesPerCycle: 16, linkBandwidthBytesPerCycle: 32, destinationBandwidthBytesPerCycle: 64, setupCycles: 2, queueCycles: 3, synchronizationCycles: 4 },
    expected: { chunks: 4, effectiveBandwidthBytesPerCycle: 16, intrinsicCycles: 72, totalCycles: 79 },
  },
  {
    name: 'uses link bandwidth when the link is the narrowest stage',
    input: transferFixture,
    expected: { chunks: 4, effectiveBandwidthBytesPerCycle: 32, intrinsicCycles: 52, totalCycles: 70 },
  },
  {
    name: 'uses destination bandwidth when destination is the narrowest stage',
    input: { ...transferFixture, dataBytes: 513, tileCapacityBytes: 256, sourceBandwidthBytesPerCycle: 64, linkBandwidthBytesPerCycle: 32, destinationBandwidthBytesPerCycle: 16, setupCycles: 0, queueCycles: 0, synchronizationCycles: 0 },
    expected: { chunks: 3, effectiveBandwidthBytesPerCycle: 16, intrinsicCycles: 33, totalCycles: 33 },
  },
  {
    name: 'does not add a chunk when data ends exactly on a tile boundary',
    input: { ...transferFixture, dataBytes: 512, tileCapacityBytes: 256, sourceBandwidthBytesPerCycle: 64, linkBandwidthBytesPerCycle: 64, destinationBandwidthBytesPerCycle: 64, setupCycles: 3, queueCycles: 0, synchronizationCycles: 0 },
    expected: { chunks: 2, effectiveBandwidthBytesPerCycle: 64, intrinsicCycles: 14, totalCycles: 14 },
  },
  {
    name: 'rounds both chunk count and transfer cycles upward',
    input: { ...transferFixture, dataBytes: 257, tileCapacityBytes: 256, sourceBandwidthBytesPerCycle: 100, linkBandwidthBytesPerCycle: 100, destinationBandwidthBytesPerCycle: 100, setupCycles: 0, queueCycles: 0, synchronizationCycles: 0 },
    expected: { chunks: 2, effectiveBandwidthBytesPerCycle: 100, intrinsicCycles: 3, totalCycles: 3 },
  },
  {
    name: 'adds queue and synchronization costs only to total cycles',
    input: { ...transferFixture, dataBytes: 64, tileCapacityBytes: 64, sourceBandwidthBytesPerCycle: 16, linkBandwidthBytesPerCycle: 16, destinationBandwidthBytesPerCycle: 16, setupCycles: 5, queueCycles: 7, synchronizationCycles: 11 },
    expected: { chunks: 1, effectiveBandwidthBytesPerCycle: 16, intrinsicCycles: 9, totalCycles: 27 },
  },
]

for (const { name, input, expected } of positiveTransferCases) {
  test(`transfer model ${name}`, async () => {
    const { calculateTransferTime } = await loadTransferModel()
    assert.deepEqual(calculateTransferTime(input), expected)
  })
}

for (const [field, value] of [
  ['dataBytes', 0],
  ['tileCapacityBytes', 0],
  ['sourceBandwidthBytesPerCycle', 0],
  ['linkBandwidthBytesPerCycle', -1],
  ['destinationBandwidthBytesPerCycle', 0],
]) {
  test(`transfer model rejects non-positive ${field}`, async () => {
    const { calculateTransferTime } = await loadTransferModel()
    assert.throws(() => calculateTransferTime({ ...transferFixture, [field]: value }), /positive|greater than zero/i)
  })
}

for (const field of ['setupCycles', 'queueCycles', 'synchronizationCycles']) {
  test(`transfer model rejects negative ${field}`, async () => {
    const { calculateTransferTime } = await loadTransferModel()
    assert.throws(() => calculateTransferTime({ ...transferFixture, [field]: -1 }), /non-negative|zero or greater/i)
  })
}
