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
  const l2Fraction = (1 - l1Hit) * l2Hit
  const dramFraction = (1 - l1Hit) * (1 - l2Hit)
  return {
    dramFraction: round(dramFraction, 3),
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
