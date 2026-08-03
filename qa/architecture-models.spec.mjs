import test from 'node:test'
import assert from 'node:assert/strict'

import {
  rooflinePoint,
  memoryHierarchy,
  queueState,
  bankDistribution,
  sweepBandwidth,
  effectiveBandwidth,
  rooflineGeometry,
  paretoPosition,
  nocMeshEdges,
  doubleBufferTimeline,
  hierarchySweepPoint,
} from '../components/architectureModels.mjs'

test('roofline point selects the lower of compute and bandwidth ceilings', () => {
  assert.deepEqual(rooflinePoint({ peak: 432, bandwidth: 3.2, intensity: 32 }), {
    performance: 102.4,
    bottleneck: 'bandwidth',
    ridge: 135,
    utilization: 23.7,
  })
  assert.equal(rooflinePoint({ peak: 432, bandwidth: 3.2, intensity: 256 }).bottleneck, 'compute')
})

test('roofline geometry moves both ceilings and the operating point', () => {
  const base = rooflineGeometry({ peak: 432, bandwidth: 3.2, intensity: 32, cacheHit: 0 })
  const wider = rooflineGeometry({ peak: 432, bandwidth: 6.4, intensity: 32, cacheHit: 0 })
  const higherPeak = rooflineGeometry({ peak: 640, bandwidth: 3.2, intensity: 32, cacheHit: 0 })
  assert.notEqual(base.memoryPath, wider.memoryPath)
  assert.notEqual(base.computePath, higherPeak.computePath)
  assert.notEqual(base.pointY, wider.pointY)
  assert.ok(base.pointX >= 55 && base.pointX <= 525)
  assert.ok(base.pointY >= 50 && base.pointY <= 255)
})

test('cache hit rate raises effective bandwidth in the explicit course model', () => {
  assert.equal(effectiveBandwidth({ bandwidth: 3.2, cacheHit: 0 }), 3.2)
  assert.ok(effectiveBandwidth({ bandwidth: 3.2, cacheHit: 0.8 }) > 3.2)
})

test('memory hierarchy turns hit rates into average latency and off-chip traffic', () => {
  const result = memoryHierarchy({ l1Hit: 0.8, l2Hit: 0.75, dramCycles: 220 })
  assert.equal(result.dramFraction, 0.05)
  assert.equal(result.averageCycles, 16.3)
  assert.equal(result.reuse, 20)
})

test('queue state exposes occupancy, headroom, and backpressure', () => {
  assert.deepEqual(queueState({ arrivals: 6, service: 4, depth: 12, cycles: 4 }), {
    occupancy: 8,
    headroom: 4,
    pressure: 66.7,
    stalled: false,
  })
  assert.equal(queueState({ arrivals: 8, service: 2, depth: 12, cycles: 4 }).stalled, true)
})

test('bank swizzle distributes sequential requests across all banks', () => {
  assert.deepEqual(bankDistribution({ requests: 8, banks: 4, swizzled: false }), [8, 0, 0, 0])
  assert.deepEqual(bankDistribution({ requests: 8, banks: 4, swizzled: true }), [2, 2, 2, 2])
})

test('bandwidth sweep saturates at the compute ceiling', () => {
  assert.deepEqual(sweepBandwidth({ peak: 100, intensity: 10, values: [2, 5, 20] }), [20, 50, 100])
})

test('pareto plot maps higher performance upward', () => {
  const low = paretoPosition({ area: 3.2, performance: 1.6 })
  const high = paretoPosition({ area: 12.5, performance: 6.1 })
  assert.ok(high.x > low.x)
  assert.ok(high.y < low.y)
  assert.deepEqual(low, { x: 125.45, y: 236 })
})

test('4x4 NoC mesh contains exactly 12 horizontal and 12 vertical links', () => {
  const edges = nocMeshEdges({ size: 4, hotspot: 80, clustered: true })
  assert.equal(edges.length, 24)
  assert.equal(edges.filter(edge => edge.orientation === 'horizontal').length, 12)
  assert.equal(edges.filter(edge => edge.orientation === 'vertical').length, 12)
  assert.ok(edges.every(edge => edge.to - edge.from === 1 || edge.to - edge.from === 4))
})

test('single-buffer timeline never overlaps load, compute, and store', () => {
  const rows = doubleBufferTimeline(false)
  for (let cycle = 1; cycle < rows[0].length; cycle += 1) {
    assert.ok(rows.filter(row => row[cycle] !== '·').length <= 1)
  }
  assert.ok(doubleBufferTimeline(true).some((row, rowIndex, all) => row.slice(1).some((value, index) => value !== '·' && all.some((other, otherIndex) => otherIndex !== rowIndex && other[index + 1] !== '·'))))
})

test('deterministic hierarchy model reproduces the baseline artifact', async () => {
  const artifact = JSON.parse(await (await import('node:fs/promises')).readFile('experiments/artifacts/10/hierarchy_sweep.json', 'utf8'))
  assert.deepEqual(hierarchySweepPoint({ workloadBytes: artifact.workload_bytes, hitRate: .75, queueDepth: 8, baseCycles: artifact.base_cycles }), artifact.variants.baseline)
})
