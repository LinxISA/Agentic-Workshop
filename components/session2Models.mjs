export function parseTraceJsonl(text) {
  return text.trim().split('\n').filter(Boolean).map(line => JSON.parse(line))
}

export async function readArtifactResponse(response, read) {
  if (!response.ok) throw new Error(`artifact unavailable (HTTP ${response.status})`)
  return read(response)
}

export function selectSweepPoint(artifact, id) {
  const point = artifact.points.find(candidate => candidate.id === id)
  if (!point) throw new Error(`unknown sweep point: ${id}`)
  return {
    id: point.id,
    parameter: point.parameter,
    value: point.value,
    unit: point.unit,
    simulatedCycles: point.simulated_cycles,
    bottleneckSignal: point.bottleneck_signal,
    speedup: point.speedup_vs_reference,
  }
}

export function shouldHandleRootKey(event, keys) {
  const controls = new Set(['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'])
  const tagName = event.target?.tagName?.toUpperCase()
  return !controls.has(tagName) && !event.target?.isContentEditable && keys.includes(event.key)
}

export function inspectTraceRecord(record) {
  const display = value => value === undefined ? 'not present in checked sample' : JSON.stringify(value)
  return {
    blockIndex: record.block_idx ?? 'not present in checked sample',
    sequenceId: record.sequence_id,
    opcode: record.opcode,
    engine: record.engine,
    inputTiles: record.input_tiles?.length ?? record.input_tile_count,
    outputTiles: record.output_tiles?.length ?? record.output_tile_count,
    inputTileRefs: display(record.input_tiles),
    outputTileRefs: display(record.output_tiles),
    scalarInputs: display(record.scalar_inputs),
    tileMetadata: record.input_tiles || record.output_tiles ? 'available in input_tiles / output_tiles' : 'not present in checked sample',
    dependencyNote: record.dependency_note ?? 'derived by rename / scoreboard',
    dependencies: 'not explicit in JSONL',
  }
}

export function routeOpcode(opcode) {
  if (/^TLOAD|^TSTORE/.test(opcode)) return 'TMA'
  if (/^TMATMUL/.test(opcode)) return 'Cube'
  if (/^TEXTRACT|^TMOV/.test(opcode)) return 'Vector'
  return 'Scalar'
}

export function simulateQueue({ capacity, latency, arrivals, service, cycles }) {
  let pending = []
  let visible = 0
  let completed = 0
  let backpressured = false
  let stallSeen = false
  for (let cycle = 0; cycle < cycles; cycle += 1) {
    const matured = pending.filter(entry => entry.readyAt <= cycle).length
    pending = pending.filter(entry => entry.readyAt > cycle)
    visible += matured
    const requested = arrivals[cycle] ?? 0
    const accepted = Math.min(requested, Math.max(0, capacity - pending.length - visible))
    backpressured = accepted < requested
    stallSeen ||= backpressured
    for (let index = 0; index < accepted; index += 1) pending.push({ readyAt: cycle + latency })
    const consumed = Math.min(visible, service[cycle] ?? 0)
    visible -= consumed
    completed += consumed
  }
  return { cycle: cycles, pending: pending.length, visible, completed, backpressured, stallSeen, occupancy: pending.length + visible }
}

export function advanceCycle(state) {
  const next = {
    ...state,
    cycle: state.cycle + 1,
    trace: [...state.trace], rob: [...state.rob], iq: [...state.iq],
    executing: state.executing.map(op => ({ ...op, remaining: op.remaining - 1 })),
    completed: [...state.completed], retired: [...state.retired],
  }
  const justCompleted = next.executing.filter(op => op.remaining <= 0)
  next.executing = next.executing.filter(op => op.remaining > 0)
  next.completed.push(...justCompleted.map(({ remaining, ...op }) => op))
  while (next.rob.length && next.completed.some(op => op.sequence_id === next.rob[0].sequence_id)) {
    const [head] = next.rob.splice(0, 1)
    next.completed = next.completed.filter(op => op.sequence_id !== head.sequence_id)
    next.retired.push(head.sequence_id)
  }
  const done = new Set(next.retired)
  for (const op of next.completed) done.add(op.sequence_id)
  const readyIndex = next.iq.findIndex(op => (op.deps ?? []).every(dep => done.has(dep)))
  if (readyIndex >= 0) {
    const [op] = next.iq.splice(readyIndex, 1)
    const engine = routeOpcode(op.opcode)
    const latency = engine === 'Cube' ? 3 : engine === 'TMA' ? 2 : 1
    next.executing.push({ ...op, engine, remaining: latency })
  }
  if (next.trace.length) {
    const [op, ...rest] = next.trace
    next.trace = rest
    next.rob.push(op)
    next.iq.push(op)
  }
  return next
}

export function filterTimeline(events, { opcode = 'all', engine = 'all' }) {
  return events.filter(event => (opcode === 'all' || event.opcode === opcode) && (engine === 'all' || event.engine === engine))
}
