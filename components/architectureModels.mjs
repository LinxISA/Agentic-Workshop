const round = (value, digits = 1) => Number(value.toFixed(digits))

export function rooflinePoint({ peak, bandwidth, intensity }) {
  const memoryCeiling = bandwidth * intensity
  const performance = Math.min(peak, memoryCeiling)
  return {
    performance: round(performance),
    bottleneck: memoryCeiling < peak ? 'bandwidth' : 'compute',
    ridge: round(peak / bandwidth),
    utilization: round(performance / peak * 100),
  }
}

export function effectiveBandwidth({ bandwidth, cacheHit }) {
  const externalByteFraction = (1 - cacheHit) + cacheHit / 8
  return round(bandwidth / externalByteFraction, 3)
}

export function rooflineGeometry({ peak, bandwidth, intensity, cacheHit = 0 }) {
  const effective = effectiveBandwidth({ bandwidth, cacheHit })
  const point = rooflinePoint({ peak, bandwidth: effective, intensity })
  const x = value => 55 + Math.log2(Math.min(1024, Math.max(1, value))) / 10 * 470
  const y = value => 255 - Math.log2(Math.min(1024, Math.max(1, value))) / 10 * 205
  const ridge = Math.min(1024, Math.max(1, point.ridge))
  return {
    ...point,
    effectiveBandwidth: effective,
    pointX: round(x(intensity), 2),
    pointY: round(y(point.performance), 2),
    ridgeX: round(x(ridge), 2),
    ridgeY: round(y(peak), 2),
    memoryPath: `M${round(x(1), 2)} ${round(y(effective), 2)}L${round(x(ridge), 2)} ${round(y(peak), 2)}`,
    computePath: `M${round(x(ridge), 2)} ${round(y(peak), 2)}H${round(x(1024), 2)}`,
  }
}

export function memoryHierarchy({ l1Hit, l2Hit, dramCycles, l1Cycles = 4, l2Cycles = 14 }) {
  const dramFraction = round((1 - l1Hit) * (1 - l2Hit), 12)
  const l2Fraction = 1 - l1Hit - dramFraction
  return {
    l1Fraction: l1Hit,
    l2Fraction,
    dramFraction,
    averageCycles: round(l1Hit * l1Cycles + l2Fraction * l2Cycles + dramFraction * dramCycles),
    reuse: round(1 / dramFraction),
  }
}

export function queueState({ arrivals, service, depth, cycles }) {
  const occupancy = Math.min(depth, Math.max(0, (arrivals - service) * cycles))
  return {
    occupancy,
    headroom: depth - occupancy,
    pressure: round(occupancy / depth * 100),
    stalled: occupancy === depth,
  }
}

export function bankDistribution({ requests, banks, swizzled }) {
  const result = Array.from({ length: banks }, () => 0)
  for (let i = 0; i < requests; i += 1) result[swizzled ? i % banks : 0] += 1
  return result
}

export function sweepBandwidth({ peak, intensity, values }) {
  return values.map(value => Math.min(peak, value * intensity))
}

export function paretoPosition({ area, performance }) {
  return {
    x: round(60 + (area - 2) / 11 * 600, 2),
    y: round(Math.max(40, Math.min(260, 300 - performance * 40)), 2),
  }
}

export function nocMeshEdges({ size = 4, hotspot = 35, clustered = false }) {
  const nodes = Array.from({ length: size * size }, (_, id) => ({ id, x: id % size, y: Math.floor(id / size) }))
  const edges = []
  for (const node of nodes) {
    if (node.x + 1 < size) edges.push({ from: node.id, to: node.id + 1, orientation: 'horizontal' })
    if (node.y + 1 < size) edges.push({ from: node.id, to: node.id + size, orientation: 'vertical' })
  }
  return edges.map((edge, index) => {
    const central = [5, 6, 9, 10].includes(edge.from) || [5, 6, 9, 10].includes(edge.to)
    return { ...edge, load: Math.min(100, 18 + (clustered && central ? hotspot : Math.round(hotspot / 3)) + index % 3) }
  })
}

export function doubleBufferTimeline(enabled) {
  return enabled
    ? [['LOAD','A','B','C','D','·','·'],['COMPUTE','·','A','B','C','D','·'],['STORE','·','·','A','B','C','D']]
    : [['LOAD','A','·','·','B','·','·'],['COMPUTE','·','A','·','·','B','·'],['STORE','·','·','A','·','·','B']]
}

export function hierarchySweepPoint({ workloadBytes, hitRate, queueDepth, baseCycles = 1000 }) {
  const dramBytes = Math.round(workloadBytes * (1 - hitRate))
  const outstandingMisses = Math.round(dramBytes / 32)
  const stallCycles = Math.max(0, (outstandingMisses - queueDepth) * 8)
  const totalCycles = baseCycles + stallCycles
  return {
    dram_bytes: dramBytes,
    hit_rate: hitRate,
    normalized_performance: round(baseCycles / totalCycles, 4),
    outstanding_misses: outstandingMisses,
    queue_depth: queueDepth,
    stall_cycles: stallCycles,
    total_cycles: totalCycles,
  }
}
