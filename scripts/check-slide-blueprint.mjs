import { readFile } from 'node:fs/promises'
import { readDeckContract } from './slide-contract.mjs'

const blueprint = JSON.parse(await readFile('content/slides.json', 'utf8'))
const actual = await readDeckContract()
const expectedIds = Array.from({ length: 76 }, (_, index) => `S${String(index + 1).padStart(2, '0')}`)
const requiredFields = ['id','session','title','claim','background','overlay','interaction','minutes','sources','claimBoundary']
const errors=[]

if (JSON.stringify(actual) !== JSON.stringify(blueprint)) errors.push('content/slides.json differs from deck metadata; run npm run blueprint:sync and review the change')
if (JSON.stringify(actual.map(slide=>slide.id)) !== JSON.stringify(expectedIds)) errors.push('slide IDs must be exactly S01…S64')
for(const slide of actual){
  for(const field of requiredFields){const value=slide[field];if(value===undefined||value===null||value===''||(Array.isArray(value)&&value.length===0))errors.push(`${slide.id??'unknown'} is missing ${field}`)}
  if(!/^\/generated\/slides\/s\d{2}-[a-z0-9-]+\.png$/.test(slide.background))errors.push(`${slide.id} has invalid local background`)
}
if(new Set(actual.map(slide=>slide.background)).size!==76)errors.push('every slide must have a unique background')

const catalog = await readFile('content/architecture-sources.yaml','utf8')
const sourceIds = new Set([...catalog.matchAll(/^  ([a-z0-9-]+):$/gm)].map(match=>match[1]))
for(const slide of actual) for(const source of slide.sources) if(!sourceIds.has(source)) errors.push(`${slide.id} uses undefined source ${source}`)

const timings=[]
const expectedSessionCounts = new Map([[1, 35], [2, 41]])
for(const session of [1,2]){
  const sessionSlides=actual.filter(slide=>slide.session===session)
  const minutes=sessionSlides.reduce((sum,slide)=>sum+slide.minutes,0);timings.push(minutes)
  if(sessionSlides.length!==expectedSessionCounts.get(session))errors.push(`session ${session} must contain ${expectedSessionCounts.get(session)} slides`)
  if(minutes!==75)errors.push(`session ${session} must total 75 minutes (${minutes})`)
}
if(errors.length){for(const error of errors)console.error(`- ${error}`);process.exit(1)}
console.log(`76 deck-backed slides pass contract validation; session timing=${timings[0]}+${timings[1]} minutes; sources and backgrounds verified`)
