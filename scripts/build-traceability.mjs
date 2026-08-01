import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { readDeckContract } from './slide-contract.mjs'

const slides = await readDeckContract()
const sourceCatalog = await readFile('content/architecture-sources.yaml', 'utf8')
const sourceIds = new Set([...sourceCatalog.matchAll(/^  ([a-z0-9-]+):$/gm)].map(match => match[1]))
const errors = []
for (const slide of slides) for (const source of slide.sources) if (!sourceIds.has(source)) errors.push(`${slide.id}: undefined source ${source}`)
for (const path of ['docs/NDF.md','vendor/pto-spec/asl/bundle/state.asl','vendor/pyCircuit/designs/IssueQueue/issq.py','vendor/LinxCore/src/bcc/backend/rob.py','vendor/pyCircuit/designs/IssueQueue/tb_issq.py']) if (!existsSync(path)) errors.push(`missing traceability artifact ${path}`)
if(errors.length){for(const error of errors)console.error(error);process.exit(1)}

const lines=['# Course Traceability Matrix','','Generated from the authoritative deck contract. `COURSE-Sxx` identifiers are course slide records; PTO, LinxCore, and pyCircuit claims retain their repository paths.','','| Course record | Session | Claim | Overlay | Sources | Boundary |','|---|---:|---|---|---|---|',...slides.map(slide=>`| COURSE-${slide.id} | ${slide.session} | ${slide.claim.replaceAll('|','\\|')} | ${slide.overlay} | ${slide.sources.map(source=>`\`${source}\``).join(', ')} | ${slide.claimBoundary.replaceAll('|','\\|')} |`),'','## Verified cross-layer example','','- Course requirement: `NDF-MTH-001` in `docs/NDF.md`.','- PTO semantic symbol: `BundleIsActive()` in `vendor/pto-spec/asl/bundle/state.asl:143`.','- pyCircuit model: `vendor/pyCircuit/designs/IssueQueue/issq.py`.','- LinxCore implementation symbol: `build_rob_ctrl_stage()` in `vendor/LinxCore/src/bcc/backend/rob.py:217`.','- Executable evidence: `vendor/pyCircuit/designs/IssueQueue/tb_issq.py`.']
await writeFile('docs/TRACEABILITY.md',`${lines.join('\n')}\n`)
console.log(`Traceability matrix generated for ${slides.length} deck-backed slides; cross-layer paths verified`)
