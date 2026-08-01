import { readFile } from 'node:fs/promises'

const blueprintPath = new URL('../content/slides.json', import.meta.url)
const expectedIds = Array.from({ length: 42 }, (_, index) => `S${String(index + 1).padStart(2, '0')}`)
const requiredFields = ['id', 'session', 'title', 'claim', 'background', 'overlay', 'interaction', 'minutes', 'sources', 'claimBoundary']

let slides
try {
  slides = JSON.parse(await readFile(blueprintPath, 'utf8'))
} catch (error) {
  console.error(`Unable to load content/slides.json: ${error.message}`)
  process.exit(1)
}

const errors = []
const ids = slides.map((slide) => slide.id)
if (JSON.stringify(ids) !== JSON.stringify(expectedIds)) {
  errors.push(`slide IDs must be exactly ${expectedIds.join(', ')}`)
}

for (const slide of slides) {
  for (const field of requiredFields) {
    const value = slide[field]
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      errors.push(`${slide.id ?? 'unknown'} is missing ${field}`)
    }
  }
  if (![1, 2].includes(slide.session)) errors.push(`${slide.id} has invalid session ${slide.session}`)
  if (!Number.isFinite(slide.minutes) || slide.minutes <= 0) errors.push(`${slide.id} has invalid minutes`)
  if (!/^\/generated\/slides\/s\d{2}-[a-z0-9-]+\.png$/.test(slide.background)) {
    errors.push(`${slide.id} background must be a local /generated/slides/sNN-name.png path`)
  }
}

const backgrounds = slides.map((slide) => slide.background)
if (new Set(backgrounds).size !== backgrounds.length) errors.push('every slide must have a unique background')

for (const session of [1, 2]) {
  const sessionSlides = slides.filter((slide) => slide.session === session)
  const minutes = sessionSlides.reduce((sum, slide) => sum + slide.minutes, 0)
  if (sessionSlides.length !== 21) errors.push(`session ${session} must contain 21 slides, got ${sessionSlides.length}`)
  if (minutes > 60) errors.push(`session ${session} exceeds 60 minutes (${minutes})`)
}

if (errors.length) {
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

const timings = [1, 2].map((session) => slides.filter((slide) => slide.session === session).reduce((sum, slide) => sum + slide.minutes, 0))
console.log(`42 slides pass blueprint validation; session timing=${timings[0]}+${timings[1]} minutes; backgrounds unique`)
