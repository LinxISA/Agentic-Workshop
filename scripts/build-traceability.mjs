import { readFile, writeFile } from 'node:fs/promises'
import { readDeckContract } from './slide-contract.mjs'

const slides = await readDeckContract()
const sourceCatalog = await readFile('content/architecture-sources.yaml', 'utf8')
const sourceIds = new Set([...sourceCatalog.matchAll(/^  ([a-z0-9-]+):$/gm)].map(match => match[1]))
const errors = []
for (const slide of slides) for (const source of slide.sources) if (!sourceIds.has(source)) errors.push(`${slide.id}: undefined source ${source}`)

const mappings = [
  { claim:'PTO bundle-active state is implemented and directly asserted', source:'vendor/pto-spec/asl/bundle/state.asl', sourcePattern:/readonly func BundleIsActive\(\)/, evidence:'vendor/pto-spec/tests/asl/bundle-tests.asl', evidencePattern:/assert BundleIsActive\(\)/ },
  { claim:'The pyCircuit IssueQueue build is instantiated by its testbench', source:'vendor/pyCircuit/designs/IssueQueue/issq.py', sourcePattern:/def _select_oldest_ready\(/, evidence:'vendor/pyCircuit/designs/IssueQueue/tb_issq.py', evidencePattern:/from issq import build/ },
  { claim:'LinxCore ROB control is wired into the ROB bank', source:'vendor/LinxCore/src/bcc/backend/rob.py', sourcePattern:/def build_rob_ctrl_stage\(/, evidence:'vendor/LinxCore/src/bcc/backend/modules/rob_bank.py', evidencePattern:/m\.new\(\s*build_rob_ctrl_stage,/ },
]
for(const mapping of mappings){
  const source=await readFile(mapping.source,'utf8').catch(()=>''),evidence=await readFile(mapping.evidence,'utf8').catch(()=>'')
  if(!mapping.sourcePattern.test(source))errors.push(`missing mapped source symbol for: ${mapping.claim}`)
  if(!mapping.evidencePattern.test(evidence))errors.push(`missing mapped evidence reference for: ${mapping.claim}`)
}
if(errors.length){for(const error of errors)console.error(error);process.exit(1)}

const lines=['# Course Traceability Matrix','','Generated from the authoritative deck contract. `COURSE-Sxx` identifiers are course slide records. The mappings below are separate verified examples; they are not presented as one cross-layer semantic chain.','','| Course record | Session | Claim | Overlay | Sources | Boundary |','|---|---:|---|---|---|---|',...slides.map(slide=>`| COURSE-${slide.id} | ${slide.session} | ${slide.claim.replaceAll('|','\\|')} | ${slide.overlay} | ${slide.sources.map(source=>`\`${source}\``).join(', ')} | ${slide.claimBoundary.replaceAll('|','\\|')} |`),'','## Verified mappings','','| Scope | Claim | Source | Evidence |','|---|---|---|---|',...mappings.map(mapping=>`| separate example | ${mapping.claim} | \`${mapping.source}\` | \`${mapping.evidence}\` |`)]
await writeFile('docs/TRACEABILITY.md',`${lines.join('\n')}\n`)
console.log(`Traceability matrix generated for ${slides.length} slides; ${mappings.length} explicit source/evidence mappings verified`)
