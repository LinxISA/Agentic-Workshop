import test from 'node:test'
import assert from 'node:assert/strict'

const modelPromise = import('../components/agcModels.mjs')

test('canonicalizeStaticConfig sorts nested keys deterministically', async () => {
  const { canonicalizeStaticConfig } = await modelPromise
  const left = canonicalizeStaticConfig({ cores: 4, nested: { slots: 8, banks: 16 }, enable_dma: true })
  const right = canonicalizeStaticConfig({ enable_dma: true, nested: { banks: 16, slots: 8 }, cores: 4 })
  assert.equal(JSON.stringify(left), JSON.stringify(right))
  assert.deepEqual(Object.keys(left), ['cores', 'enable_dma', 'nested'])
  assert.deepEqual(Object.keys(left.nested), ['banks', 'slots'])
})

test('canonicalizeStaticConfig rejects unstable Static values', async () => {
  const { canonicalizeStaticConfig } = await modelPromise
  assert.throws(() => canonicalizeStaticConfig({ bad: new Set([2, 1]) }), /unsupported Static value/)
  assert.throws(() => canonicalizeStaticConfig({ bad: () => 1 }), /unsupported Static value/)
})

test('specialization identity changes for Static topology but ignores Runtime configuration', async () => {
  const { specializationKey } = await modelPromise
  const common = {
    templateName: 'agc.ComputeCluster',
    sourceHash: 'source-a',
    dependencyHashes: ['dep-b', 'dep-a'],
    dialectVersion: 'agc-0.1',
    runtimeAbi: 'simqueue-1',
  }
  const base = specializationKey({ ...common, staticParams: { cores: 4, enable_dma: true }, runtimeParams: { frequency: 1_800_000_000 } })
  const sweptFrequency = specializationKey({ ...common, staticParams: { cores: 4, enable_dma: true }, runtimeParams: { frequency: 2_000_000_000 } })
  const changedTopology = specializationKey({ ...common, staticParams: { cores: 8, enable_dma: true }, runtimeParams: { frequency: 1_800_000_000 } })
  assert.equal(base, sweptFrequency)
  assert.notEqual(base, changedTopology)
})

test('specialization identity invalidates when source or dependency hashes change', async () => {
  const { specializationKey } = await modelPromise
  const base = {
    templateName: 'agc.ComputeCluster',
    sourceHash: 'source-a',
    staticParams: { cores: 4 },
    dependencyHashes: ['dep-a'],
    dialectVersion: 'agc-0.1',
    runtimeAbi: 'simqueue-1',
  }
  assert.notEqual(specializationKey(base), specializationKey({ ...base, sourceHash: 'source-b' }))
  assert.notEqual(specializationKey(base), specializationKey({ ...base, dependencyHashes: ['dep-b'] }))
})

test('NPUCity elaboration replicates clusters and removes disabled DMA from the static graph', async () => {
  const { elaborateNpuCity } = await modelPromise
  const withDma = elaborateNpuCity({ clusters: 4, coresPerCluster: 4, enableDma: true })
  const withoutDma = elaborateNpuCity({ clusters: 2, coresPerCluster: 4, enableDma: false })
  assert.deepEqual(withDma.clusters.map(cluster => cluster.name), ['cluster_0', 'cluster_1', 'cluster_2', 'cluster_3'])
  assert.equal(withDma.dma?.name, 'dma0')
  assert.equal(withoutDma.clusters.length, 2)
  assert.equal(withoutDma.dma, null)
  assert.ok(!withoutDma.modules.some(module => module.kind === 'dma'))
})

test('AGC pipeline preserves the requested elaboration and lowering order', async () => {
  const { AGC_PIPELINE_STEPS } = await modelPromise
  assert.deepEqual(AGC_PIPELINE_STEPS.map(step => step.id), [
    'scan', 'elaborate', 'specialize', 'manifest', 'verify', 'canonicalize', 'resolve-ports',
    'materialize-queues', 'connectivity', 'capacity', 'bandwidth', 'lower',
  ])
})
