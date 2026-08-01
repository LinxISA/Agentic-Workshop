import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('planned architecture interactions are present on their assigned slides', async()=>{
  const s1=await readFile('decks/session-1/slides.md','utf8'),s2=await readFile('decks/session-2/slides.md','utf8')
  assert.match(s1,/slide-id="S13"[\s\S]{0,220}<template #diagram><NoCTraffic/)
  assert.match(s1,/slide-id="S16"[\s\S]{0,220}<template #diagram><DoubleBufferTimeline/)
  assert.match(s2,/slide-id="S36"[\s\S]{0,220}<template #diagram><BaselineExperiment/)
  assert.match(s2,/slide-id="S38"[\s\S]{0,220}<template #diagram><ArtifactComparison/)
})

test('experiment comparison is backed by the checked-in artifact',async()=>{
  const component=await readFile('components/ArtifactComparison.vue','utf8')
  const artifact=JSON.parse(await readFile('experiments/artifacts/10/hierarchy_sweep.json','utf8'))
  assert.match(component,/hierarchy_sweep\.json/)
  assert.equal(artifact.variants.baseline.total_cycles,1192)
  assert.equal(artifact.variants.balanced.normalized_performance,1)
})
