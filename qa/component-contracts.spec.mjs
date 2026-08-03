import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('the approved 71-slide interactions are present on their assigned slides', async()=>{
  const s1=await readFile('decks/session-1/slides.md','utf8'),s2=await readFile('decks/session-2/slides.md','utf8')
  for (const [id, component] of [['S08','InteractiveRoofline'],['S24','ClockCycleConverter'],['S25','MemoryHierarchyExplorer'],['S32','PtoMachineExplorer']]) {
    assert.match(s1,new RegExp(`slide-id="${id}"[\\s\\S]{0,240}<${component}\\b`))
  }
  for (const [id, component] of [['S51','TraceAnatomy'],['S52','SimQueueExplorer'],['S53','DaVinciTopology'],['S56','CyclePlayback'],['S58','ParameterSweep'],['S59','EvidenceTimeline'],['S70','ClosedLoopVerification']]) {
    assert.match(s2,new RegExp(`slide-id="${id}"[\\s\\S]{0,240}<${component}\\b`))
  }
})

test('q_proj sweep and timeline interactions are backed by checked-in offline artifacts',async()=>{
  const sweepComponent=await readFile('components/ParameterSweep.vue','utf8')
  const timelineComponent=await readFile('components/EvidenceTimeline.vue','utf8')
  const summary=JSON.parse(await readFile('experiments/artifacts/11/qproj_summary.json','utf8'))
  const sweep=JSON.parse(await readFile('experiments/artifacts/11/qproj_sweep.json','utf8'))
  assert.match(sweepComponent,/qproj_sweep\.json/)
  assert.match(timelineComponent,/qproj_timeline\.csv/)
  assert.equal(summary.record_count,562)
  assert.equal(summary.simulated_cycles,11028)
  assert.equal(sweep.points.find(point => point.id === 'baseline').simulated_cycles,11028)
  assert.equal(sweep.evidence_mode,'reference_replay')
})

test('full-bleed copy never intercepts controls in the diagram layer', async () => {
  const source = await readFile('components/FullBleedStage.vue', 'utf8')
  const copyRule = source.match(/\.full-bleed-stage__copy\s*\{([\s\S]*?)\}/)?.[1] ?? ''
  assert.match(copyRule, /pointer-events:\s*none\s*;/)
})
