import test from 'node:test'
import assert from 'node:assert/strict'

import {
  rooflinePoint,
  memoryHierarchy,
  queueState,
  bankDistribution,
  sweepBandwidth,
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
