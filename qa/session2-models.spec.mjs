import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

import {
  advanceCycle,
  filterTimeline,
  inspectTraceRecord,
  parseTraceJsonl,
  readArtifactResponse,
  routeOpcode,
  selectSweepPoint,
  shouldHandleRootKey,
  simulateQueue,
} from '../components/session2Models.mjs'

test('trace inspection exposes only checked JSONL fields and labels unavailable Tile metadata', async () => {
  const jsonl = await readFile('public/experiments/artifacts/11/qproj_trace_sample.jsonl', 'utf8')
  const [record] = parseTraceJsonl(jsonl)
  const detail = inspectTraceRecord(record)
  assert.equal(detail.blockIndex, 0)
  assert.equal(detail.sequenceId, 573)
  assert.equal(detail.opcode, 'TASSIGN')
  assert.equal(detail.engine, 'SCALAR')
  assert.equal(detail.inputTiles, 0)
  assert.equal(detail.outputTiles, 1)
  assert.equal(detail.inputTileRefs, record.input_tiles ? JSON.stringify(record.input_tiles) : 'not present in checked sample')
  assert.equal(detail.outputTileRefs, record.output_tiles ? JSON.stringify(record.output_tiles) : 'not present in checked sample')
  assert.equal(detail.scalarInputs, record.scalar_inputs ? JSON.stringify(record.scalar_inputs) : 'not present in checked sample')
  assert.equal(detail.dependencyNote, 'Dependencies are derived by DaVinciOO rename/scoreboard state.')
  assert.equal(detail.dependencies, 'not explicit in JSONL')
})

test('trace inspection renders sanitized checked Tile references when the artifact provides them', () => {
  const detail = inspectTraceRecord({
    sequence_id: 575, opcode: 'TLOAD', engine: 'TMA', input_tile_count: 1, output_tile_count: 1,
    input_tiles: [{ id: 'tile-0', role: 'source' }], output_tiles: [{ id: 'tile-1', role: 'result' }], scalar_inputs: [128],
  })
  assert.equal(detail.inputTileRefs, '[{"id":"tile-0","role":"source"}]')
  assert.equal(detail.outputTileRefs, '[{"id":"tile-1","role":"result"}]')
  assert.equal(detail.scalarInputs, '[128]')
})

test('artifact reader rejects non-OK HTTP responses', async () => {
  await assert.rejects(
    readArtifactResponse(new Response('missing', { status: 404 }), response => response.text()),
    /artifact unavailable \(HTTP 404\)/,
  )
})

test('opcode routing distinguishes PTO families from the DaVinci gfsim engine mapping', () => {
  assert.deepEqual([
    routeOpcode('TLOAD'),
    routeOpcode('TEXTRACT'),
    routeOpcode('TMOV'),
    routeOpcode('TMATMUL_ACC'),
    routeOpcode('TPUSH'),
  ], ['TMA', 'Vector', 'Vector', 'Cube', 'Scalar'])
})

test('SimQueue keeps pending entries invisible until latency elapses and backpressures at capacity', () => {
  const afterOne = simulateQueue({ capacity: 2, latency: 2, arrivals: [2, 1, 0], service: [0, 0, 1], cycles: 1 })
  assert.deepEqual(afterOne, { cycle: 1, pending: 2, visible: 0, completed: 0, backpressured: false, stallSeen: false, occupancy: 2 })
  const afterTwo = simulateQueue({ capacity: 2, latency: 2, arrivals: [2, 1, 0], service: [0, 0, 1], cycles: 2 })
  assert.equal(afterTwo.backpressured, true)
  assert.equal(afterTwo.stallSeen, true)
  const afterThree = simulateQueue({ capacity: 2, latency: 2, arrivals: [2, 1, 0], service: [0, 0, 1], cycles: 3 })
  assert.deepEqual(afterThree, { cycle: 3, pending: 0, visible: 1, completed: 1, backpressured: false, stallSeen: true, occupancy: 1 })
})

test('root keyboard interactions ignore events originating from controls', () => {
  for (const tagName of ['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA']) {
    assert.equal(shouldHandleRootKey({ key: ' ', target: { tagName } }, [' ', 'ArrowRight']), false)
    assert.equal(shouldHandleRootKey({ key: 'ArrowRight', target: { tagName } }, [' ', 'ArrowRight']), false)
  }
  assert.equal(shouldHandleRootKey({ key: 'ArrowRight', target: { tagName: 'SECTION' } }, [' ', 'ArrowRight']), true)
  assert.equal(shouldHandleRootKey({ key: 'Enter', target: { tagName: 'SECTION' } }, [' ', 'ArrowRight']), false)
})

test('cycle playback advances exactly one cycle and preserves in-order retirement', () => {
  const start = {
    cycle: 0,
    trace: [
      { sequence_id: 1, opcode: 'TLOAD', deps: [] },
      { sequence_id: 2, opcode: 'TEXTRACT', deps: [1] },
    ],
    rob: [], iq: [], executing: [], completed: [], retired: [],
  }
  const c1 = advanceCycle(start)
  const c2 = advanceCycle(c1)
  assert.equal(c1.cycle, 1)
  assert.deepEqual(c1.rob.map(op => op.sequence_id), [1])
  assert.equal(c2.cycle, 2)
  assert.deepEqual(c2.rob.map(op => op.sequence_id), [1, 2])
  assert.ok(c2.executing.some(op => op.sequence_id === 1 && op.engine === 'TMA'))
  assert.deepEqual(c2.retired, [])
})

test('parameter sweep selects concrete checked OFAT points', async () => {
  const artifact = JSON.parse(await readFile('public/experiments/artifacts/11/qproj_sweep.json', 'utf8'))
  assert.deepEqual(selectSweepPoint(artifact, 'baseline'), {
    id: 'baseline', parameter: 'baseline', value: 0, unit: 'reference',
    simulatedCycles: 11028, bottleneckSignal: 'no_material_change', speedup: 1,
  })
  assert.deepEqual(selectSweepPoint(artifact, 'cube_macs_8192'), {
    id: 'cube_macs_8192', parameter: 'cube_macs_per_cycle_bf16', value: 8192, unit: 'MACs/cycle',
    simulatedCycles: 8522, bottleneckSignal: 'observed_cycle_change', speedup: 1.294062,
  })
})

test('timeline filters deterministically by opcode and engine', () => {
  const events = [
    { sequence_id: 1, opcode: 'TLOAD', engine: 'TMA', start: 0, end: 3 },
    { sequence_id: 2, opcode: 'TEXTRACT', engine: 'Vector', start: 2, end: 4 },
    { sequence_id: 3, opcode: 'TLOAD', engine: 'TMA', start: 5, end: 7 },
  ]
  assert.deepEqual(filterTimeline(events, { opcode: 'TLOAD', engine: 'TMA' }).map(event => event.sequence_id), [1, 3])
  assert.deepEqual(filterTimeline(events, { opcode: 'all', engine: 'Vector' }).map(event => event.sequence_id), [2])
})

test('Session 2 contract is 28 slides S29–S56, 75 minutes, with required interactions and source captures', async () => {
  const source = await readFile('decks/session-2/slides.md', 'utf8')
  const ids = [...source.matchAll(/Slide-ID:\s*(S\d{2})/g)].map(match => match[1])
  const minutes = [...source.matchAll(/Timing:\s*(\d+) min/g)].map(match => Number(match[1]))
  assert.deepEqual(ids, Array.from({ length: 28 }, (_, index) => `S${index + 29}`))
  assert.equal(minutes.reduce((sum, value) => sum + value, 0), 75)
  for (const [id, component] of Object.entries({
    S33: 'TraceAnatomy', S34: 'SimQueueExplorer', S35: 'DaVinciTopology', S38: 'CyclePlayback',
    S40: 'ParameterSweep', S41: 'EvidenceTimeline', S55: 'ClosedLoopVerification',
  })) {
    const slide = source.slice(source.indexOf(`Slide-ID: ${id}`) - 1500, source.indexOf(`Slide-ID: ${id}`))
    assert.match(slide, new RegExp(`<${component}\\b`))
  }
  for (const [slideId, page] of [[29,27],[43,28],[44,29],[45,30],[46,31],[47,32],[48,33],[49,34]]) {
    assert.match(source, new RegExp(`/generated/slides/s${slideId}-keynote-page-${page}\\.png`))
  }
  const audience = source.replace(/<!--[\s\S]*?-->/g, '')
  assert.doesNotMatch(audience, /LinxCore|ARM ASL|hardware binary/i)
  assert.match(audience, /checked reference replay: 562 records \/ 11028 cycles/i)
  assert.match(audience, /proposed acceptance design/i)
  assert.doesNotMatch(audience, /10920|pyCircuit replay harness/i)
})

test('S32 and S53 describe checked trace fields without claiming explicit deps', async () => {
  const source = await readFile('decks/session-2/slides.md', 'utf8')
  for (const [id, nextId] of [['S32', 'S33'], ['S53', 'S54']]) {
    const start = source.lastIndexOf('\n# ', source.indexOf(`Slide-ID: ${id}`))
    const end = source.lastIndexOf('\n# ', source.indexOf(`Slide-ID: ${nextId}`))
    const slide = source.slice(start, end)
    assert.match(slide, /input_tiles/)
    assert.match(slide, /output_tiles/)
    assert.match(slide, /scalar_inputs/)
    assert.match(slide, /rename\s*\/\s*scoreboard/i)
    assert.doesNotMatch(slide, /(?:explicit|显式)\s*`?deps`?|sequence_id\s*\/\s*opcode\s*\/\s*deps/i)
  }
})
