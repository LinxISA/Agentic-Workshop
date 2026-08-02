import { readFile } from 'node:fs/promises'

const decks = [
  { path: 'decks/session-1/slides.md', session: 1 },
  { path: 'decks/session-2/slides.md', session: 2 },
]
const noteFields = ['Slide-ID:', 'Objective:', 'Timing:', 'Visual:', 'Interaction:', 'Sources:', 'Boundary:']
const fullBleedStages = ['FullBleedStage', 'AscendCover', 'KeynoteSourceStage']
let failed = false

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

  if (slides.length !== 21) errors.push(`expected 21 content slides, got ${slides.length}`)
  slides.forEach((slide, index) => {
    const expectedId = `S${String(index + 1 + (deck.session - 1) * 21).padStart(2, '0')}`
    if (!fullBleedStages.some(component => slide.includes(`<${component}`))) errors.push(`${expectedId}: missing approved full-bleed stage`)
    if (!slide.includes(`/generated/slides/${expectedId.toLowerCase()}-`)) errors.push(`${expectedId}: missing unique local slide background`)
    for (const field of noteFields) {
      if (!slide.includes(field)) errors.push(`${expectedId}: missing speaker-note field ${field}`)
    }
    const chars = audienceCharacterCount(slide)
    if (chars > 220) errors.push(`${expectedId}: audience copy has ${chars} characters (max 220)`)
    if (/https?:\/\//.test(slide.replace(/<!--[\s\S]*?-->/g, ''))) errors.push(`${expectedId}: remote runtime reference`)
    if (/class=["'][^"']*(?:card-grid|dashboard|panel-grid)/.test(slide)) errors.push(`${expectedId}: deprecated card-grid visual language`)
  })

  if (errors.length) {
    failed = true
    console.error(`${deck.path}:`)
    for (const error of errors) console.error(`  - ${error}`)
  } else {
    console.log(`${deck.path}: 21 slides pass full-bleed, notes, density, and offline checks`)
  }
}

if (failed) process.exit(1)
