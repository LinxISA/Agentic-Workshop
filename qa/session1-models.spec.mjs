import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const deckPath = new URL('../decks/session-1/slides.md', import.meta.url)

async function sessionOneSlides() {
  const source = await readFile(deckPath, 'utf8')
  const headings = [...source.matchAll(/^#\s+.+$/gm)]
  return headings.map((heading, index) => source.slice(heading.index, headings[index + 1]?.index ?? source.length))
}

function notes(slide) {
  return [...slide.matchAll(/<!--([\s\S]*?)-->/g)].map(match => match[1]).join('\n')
}

function visibleText(slide) {
  const labels = [...slide.matchAll(/\b(?:label|aria-label)="([^"]+)"/g)].map(match => match[1]).join(' ')
  return `${labels} ${slide
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')}`
}

test('Session 1 contains exactly S01-S33 and totals 75 minutes', async () => {
  const slides = await sessionOneSlides()
  assert.equal(slides.length, 33)
  assert.deepEqual(slides.map(slide => notes(slide).match(/Slide-ID:\s*(S\d{2})/)?.[1]),
    Array.from({ length: 33 }, (_, index) => `S${String(index + 1).padStart(2, '0')}`))
  assert.equal(slides.reduce((total, slide) => total + Number(notes(slide).match(/Timing:\s*(\d+)\s*min/)?.[1]), 0), 75)
})

test('every Session 1 slide carries the complete teaching-note contract', async () => {
  const slides = await sessionOneSlides()
  const fields = ['Slide-ID:', 'Objective:', 'Timing:', 'Visual:', 'Interaction:', 'Sources:', 'Boundary:', 'Narrative:', 'Transition:', '[Sources]']
  for (const slide of slides) {
    const slideNotes = notes(slide)
    for (const field of fields) assert.ok(slideNotes.includes(field), `${slideNotes.match(/Slide-ID:\s*S\d{2}/)?.[0] ?? 'unknown'} missing ${field}`)
  }
})

test('Keynote pages map exactly to their approved Session 1 positions', async () => {
  const slides = await sessionOneSlides()
  const sourceFor = slide => notes(slide).match(/Sources:\s*([^\n]+)/)?.[1] ?? ''
  assert.match(sourceFor(slides[0]), /\bsource-deck\b/)
  for (let page = 2; page <= 22; page += 1) assert.match(sourceFor(slides[page - 1]), new RegExp(`\\bpublish-keynote-page-${page}\\b`))
  assert.match(sourceFor(slides[22]), /\bcourse-synthesis\b/)
  for (let page = 23; page <= 31; page += 1) assert.match(sourceFor(slides[page]), new RegExp(`\\bpublish-keynote-page-${page}\\b`))
  assert.match(sourceFor(slides[32]), /\bcourse-synthesis\b/)
  const mappingFor = slide => [...notes(slide).matchAll(/^\s*-\s*source:\s*(K\d{2})\s*$/gm)].map(match => match[1])
  for (let page = 1; page <= 22; page += 1) assert.deepEqual(mappingFor(slides[page - 1]), [`K${String(page).padStart(2, '0')}`])
  assert.deepEqual(mappingFor(slides[22]), [])
  for (let page = 23; page <= 31; page += 1) assert.deepEqual(mappingFor(slides[page]), [`K${String(page).padStart(2, '0')}`])
  assert.deepEqual(mappingFor(slides[32]), [])
})

for (const [index, component] of [[7, 'InteractiveRoofline'], [24, 'ClockCycleConverter'], [25, 'MemoryHierarchyExplorer'], [29, 'PtoMachineExplorer'], [32, 'TransferTimeLab']]) {
  test(`S${String(index + 1).padStart(2, '0')} visibly mounts ${component}`, async () => {
    const slides = await sessionOneSlides()
    assert.match(slides[index].replace(/<!--[\s\S]*?-->/g, ''), new RegExp(`<${component}\\b`))
  })
}

test('PTO operation explorer visibly separates normative PTO-ASL from DaVinciOO extensions', async () => {
  const slides = await sessionOneSlides()
  const text = visibleText(slides[29])
  for (const opcode of ['TLOAD', 'TMOV', 'TEXTRACT', 'TPUSH', 'TPOP', 'TPUT', 'TGET']) assert.match(text, new RegExp(`\\b${opcode}\\b`))
  assert.match(text, /DaVinciOO communication extensions\s*[—-]\s*not normative PTO-ASL/i)
})

test('clock converter derives cycles from time and frequency', async () => {
  const { convertTimeToCycles } = await import('../components/clockCycleModel.mjs')
  assert.deepEqual(convertTimeToCycles({ duration: 4, durationUnit: 'ns', frequency: 2, frequencyUnit: 'GHz' }), {
    seconds: 4e-9,
    hertz: 2e9,
    cycles: 8,
  })
  assert.deepEqual(convertTimeToCycles({ duration: 1, durationUnit: 'day', frequency: 1, frequencyUnit: 'GHz' }), {
    seconds: 86400,
    hertz: 1e9,
    cycles: 86400000000000,
  })
})

test('clock converter rejects unsupported units and non-positive inputs', async () => {
  const { convertTimeToCycles } = await import('../components/clockCycleModel.mjs')
  assert.throws(() => convertTimeToCycles({ duration: 0, durationUnit: 'ns', frequency: 2, frequencyUnit: 'GHz' }), /positive/i)
  assert.throws(() => convertTimeToCycles({ duration: 1, durationUnit: 'fortnight', frequency: 2, frequencyUnit: 'GHz' }), /unit/i)
})

test('clock converter keeps the last valid result while a numeric draft is empty', async () => {
  const { convertTimeDraft, convertTimeToCycles } = await import('../components/clockCycleModel.mjs')
  const previous = convertTimeToCycles({ duration: 4, durationUnit: 'ns', frequency: 2, frequencyUnit: 'GHz' })
  assert.equal(convertTimeDraft({ duration: '', durationUnit: 'ns', frequency: 2, frequencyUnit: 'GHz' }, previous), previous)
  assert.equal(convertTimeDraft({ duration: 4, durationUnit: 'ns', frequency: '', frequencyUnit: 'GHz' }, previous), previous)
  assert.deepEqual(convertTimeDraft({ duration: 5, durationUnit: 'ns', frequency: 2, frequencyUnit: 'GHz' }, previous), {
    seconds: 5e-9,
    hertz: 2e9,
    cycles: 10,
  })
})

test('clock converter does not hide invalid non-empty drafts', async () => {
  const { convertTimeDraft, convertTimeToCycles } = await import('../components/clockCycleModel.mjs')
  const previous = convertTimeToCycles({ duration: 4, durationUnit: 'ns', frequency: 2, frequencyUnit: 'GHz' })
  assert.throws(() => convertTimeDraft({ duration: -1, durationUnit: 'ns', frequency: 2, frequencyUnit: 'GHz' }, previous), /duration must be positive/i)
  assert.throws(() => convertTimeDraft({ duration: 4, durationUnit: 'fortnight', frequency: 2, frequencyUnit: 'GHz' }, previous), /unsupported duration unit/i)
  assert.throws(() => convertTimeDraft({ duration: 4, durationUnit: 'ns', frequency: -2, frequencyUnit: 'GHz' }, previous), /frequency must be positive/i)
})

test('memory hierarchy owns the displayed L1, L2, and DRAM access shares', async () => {
  const { memoryHierarchy } = await import('../components/architectureModels.mjs')
  const result = memoryHierarchy({ l1Hit: 0.9, l2Hit: 0.8, dramCycles: 220 })
  assert.deepEqual([result.l1Fraction, result.l2Fraction, result.dramFraction].map(value => (value * 100).toFixed(1)), ['90.0', '8.0', '2.0'])
  assert.equal(result.l1Fraction + result.l2Fraction + result.dramFraction, 1)
})

test('memory hierarchy non-default fractions preserve precision and sum exactly to one', async () => {
  const { memoryHierarchy } = await import('../components/architectureModels.mjs')
  const result = memoryHierarchy({ l1Hit: 0.333, l2Hit: 0.666, dramCycles: 220 })
  assert.deepEqual([result.l1Fraction, result.l2Fraction, result.dramFraction], [0.333, 0.444222, 0.222778])
  assert.equal(result.l1Fraction + result.l2Fraction + result.dramFraction, 1)
})

test('PTO operation table separates semantic effects from DaVinci gfsim routing', async () => {
  const { ptoMachineOperations } = await import('../components/ptoMachineModel.mjs')
  const table = Object.fromEntries(ptoMachineOperations.map(item => [item.op, item]))
  assert.deepEqual(table.TLOAD, { op: 'TLOAD', semanticEffect: 'GM → Tile', gfsimEngine: 'TMA', normative: true, detail: '从 Global Memory 装入 Tile。' })
  assert.match(table.TMOV.semanticEffect, /shape-matched Tile copy/i)
  assert.equal(table.TMOV.gfsimEngine, 'Vector')
  assert.match(table.TEXTRACT.semanticEffect, /subregion/i)
  assert.equal(table.TEXTRACT.gfsimEngine, 'Vector')
  assert.equal(table.TPUSH.gfsimEngine, 'Scalar')
  assert.equal(table.TPOP.gfsimEngine, 'Scalar')
  assert.match(table.TPUSH.semanticEffect, /slot.*capacity/i)
  assert.match(table.TPOP.semanticEffect, /slot.*capacity/i)
  assert.deepEqual([table.TPUT.gfsimEngine, table.TGET.gfsimEngine], ['TMA', 'TMA'])
  assert.match(table.TPUT.semanticEffect, /GM → UB → GM.*local → remote write/i)
  assert.match(table.TGET.semanticEffect, /GM → UB → GM.*remote → local read/i)
  assert.equal(table.TPUT.normative, false)
  assert.equal(table.TGET.normative, false)
})

test('source-page labs are closed drawers with accessible triggers by default', async () => {
  const slides = await sessionOneSlides()
  for (const [index, component] of [[7, 'InteractiveRoofline'], [25, 'MemoryHierarchyExplorer'], [29, 'PtoMachineExplorer']]) {
    const audience = slides[index].replace(/<!--[\s\S]*?-->/g, '')
    assert.match(audience, new RegExp(`<details class="keynote-lab-drawer">[\\s\\S]*?<summary[^>]*aria-label="[^"]+"[^>]*>[\\s\\S]*?<${component}\\b`))
    assert.doesNotMatch(audience, /<details[^>]*\sopen(?:\s|>)/)
  }
})

test('interactive selectors expose selection state and polite live results', async () => {
  for (const component of ['ArchitectureCoordinate', 'PtoMachineExplorer', 'TransferTimeLab', 'KeynoteInteractiveStage']) {
    const source = await readFile(new URL(`../components/${component}.vue`, import.meta.url), 'utf8')
    assert.match(source, /aria-live="polite"/, `${component} needs a polite live result`)
    assert.match(source, /aria-(?:pressed|selected|checked)=/, `${component} needs exposed selection state`)
  }
})

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

test('transfer model follows the approved chunk and bottleneck formula', async () => {
  const { calculateTransferTime } = await import('../components/transferTimeModel.mjs')
  assert.deepEqual(calculateTransferTime(transferFixture), {
    chunks: 4,
    effectiveBandwidthBytesPerCycle: 32,
    intrinsicCycles: 52,
    totalCycles: 70,
  })
})

test('transfer model rejects invalid sizes, bandwidths, and cycle costs', async () => {
  const { calculateTransferTime } = await import('../components/transferTimeModel.mjs')
  for (const field of ['dataBytes', 'tileCapacityBytes', 'sourceBandwidthBytesPerCycle', 'linkBandwidthBytesPerCycle', 'destinationBandwidthBytesPerCycle']) {
    assert.throws(() => calculateTransferTime({ ...transferFixture, [field]: 0 }), /positive/i)
  }
  for (const field of ['setupCycles', 'queueCycles', 'synchronizationCycles']) {
    assert.throws(() => calculateTransferTime({ ...transferFixture, [field]: -1 }), /non-negative/i)
  }
})
