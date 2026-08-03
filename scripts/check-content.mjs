import { readFile } from 'node:fs/promises'

const decks = [
  { path: 'decks/session-1/slides.md', session: 1 },
  { path: 'decks/session-2/slides.md', session: 2 },
]
const noteFields = ['Slide-ID:', 'Objective:', 'Transition:', 'Timing:', 'Visual:', 'Interaction:', 'Boundary:', '[Sources]']
const fullBleedStages = ['FullBleedStage', 'AscendCover', 'KeynoteSourceStage']
let failed = false
const keynoteMappings = []

function audienceCharacterCount(slide) {
  const withoutNotes = slide.replace(/<!--[\s\S]*?-->/g, '')
  const withoutFrontmatter = withoutNotes.replace(/^---[\s\S]*?---/m, '')
  const withoutCode = withoutFrontmatter.replace(/```[\s\S]*?```/g, '')
  const withoutTags = withoutCode.replace(/<[^>]+>/g, '')
  return [...withoutTags.replace(/[\s#*_`>\-[\]()]/g, '')].length
}

for (const deck of decks) {
  const source = await readFile(deck.path, 'utf8')
  const headings = [...source.matchAll(/^#\s+.+$/gm)]
  const slides = headings.map((match, index) => source.slice(match.index, headings[index + 1]?.index ?? source.length))
  const errors = []

  if (slides.length !== 28) errors.push(`expected 28 content slides, got ${slides.length}`)
  slides.forEach((slide, index) => {
    const expectedId = `S${String(index + 1 + (deck.session - 1) * 28).padStart(2, '0')}`
    const noteText = [...slide.matchAll(/<!--([\s\S]*?)-->/g)].map(match => match[1]).join('\n')
    const actualId = noteText.match(/Slide-ID:\s*(S\d{2})/)?.[1]
    if (actualId !== expectedId) errors.push(`${expectedId}: speaker-note Slide-ID is ${actualId ?? 'missing'}`)
    if (!fullBleedStages.some(component => slide.includes(`<${component}`))) errors.push(`${expectedId}: missing approved full-bleed stage`)
    if (!slide.includes(`/generated/slides/${expectedId.toLowerCase()}-`)) errors.push(`${expectedId}: missing unique local slide background`)
    for (const field of noteFields) {
      if (!noteText.includes(field)) errors.push(`${expectedId}: missing speaker-note field ${field}`)
    }
    const chars = audienceCharacterCount(slide)
    if (chars > 220) errors.push(`${expectedId}: audience copy has ${chars} characters (max 220)`)
    if (/https?:\/\//.test(slide.replace(/<!--[\s\S]*?-->/g, ''))) errors.push(`${expectedId}: remote runtime reference`)
    if (/class=["'][^"']*(?:card-grid|dashboard|panel-grid)/.test(slide)) errors.push(`${expectedId}: deprecated card-grid visual language`)
    const sourceSection = noteText.split('[Sources]')[1] ?? ''
    for (const match of sourceSection.matchAll(/^\s*-\s*source:\s*(K\d{2})\s*$/gmi)) keynoteMappings.push({ sourceId: match[1], slideId: expectedId })
  })

  if (errors.length) {
    failed = true
    console.error(`${deck.path}:`)
    for (const error of errors) console.error(`  - ${error}`)
  } else {
    console.log(`${deck.path}: 28 slides pass full-bleed, notes, density, and offline checks`)
  }
}

const expectedKeynoteIds = Array.from({ length: 34 }, (_, index) => `K${String(index + 1).padStart(2, '0')}`)
const mappingCounts = new Map()
for (const { sourceId } of keynoteMappings) mappingCounts.set(sourceId, (mappingCounts.get(sourceId) ?? 0) + 1)
const missingKeynoteIds = expectedKeynoteIds.filter(sourceId => !mappingCounts.has(sourceId))
const duplicateKeynoteIds = [...mappingCounts].filter(([, count]) => count !== 1).map(([sourceId, count]) => `${sourceId} (${count}×)`)
const unexpectedKeynoteIds = [...mappingCounts.keys()].filter(sourceId => !expectedKeynoteIds.includes(sourceId))
if (missingKeynoteIds.length || duplicateKeynoteIds.length || unexpectedKeynoteIds.length) {
  failed = true
  if (missingKeynoteIds.length) console.error(`Keynote mappings missing: ${missingKeynoteIds.join(', ')}`)
  if (duplicateKeynoteIds.length) console.error(`Keynote mappings must appear once: ${duplicateKeynoteIds.join(', ')}`)
  if (unexpectedKeynoteIds.length) console.error(`unexpected Keynote mappings: ${unexpectedKeynoteIds.join(', ')}`)
}

if (failed) process.exit(1)
