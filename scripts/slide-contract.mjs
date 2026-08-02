import { readFile } from 'node:fs/promises'

export const deckPaths = ['decks/session-1/slides.md', 'decks/session-2/slides.md']

const attr = (segment, name) => segment.match(new RegExp(`${name}="([^"]+)"`))?.[1]
const note = (segment, name) => segment.match(new RegExp(`${name}:\\s*([^\\n]+)`))?.[1]?.trim()

export async function readDeckContract() {
  const existing = JSON.parse(await readFile('content/slides.json', 'utf8'))
  const previous = new Map(existing.map(slide => [slide.id, slide]))
  const slides = []
  for (let session = 1; session <= deckPaths.length; session += 1) {
    const source = await readFile(deckPaths[session - 1], 'utf8')
    const headings = [...source.matchAll(/^#\s+(.+)$/gm)]
    for (let index = 0; index < headings.length; index += 1) {
      const segment = source.slice(headings[index].index, headings[index + 1]?.index ?? source.length)
      const id = note(segment, 'Slide-ID')
      const diagram = segment.match(/<template #diagram>([\s\S]*?)<\/template>/)?.[1] ?? ''
      const rootComponent = segment.match(/^<([A-Z][A-Za-z0-9]+)/m)?.[1]
      const component = diagram.match(/<([A-Z][A-Za-z0-9]+)/)?.[1]
        ?? (rootComponent === 'FullBleedStage' ? undefined : rootComponent)
      slides.push({
        id,
        session,
        title: attr(segment, 'title'),
        claim: attr(segment, 'claim'),
        background: attr(segment, 'background'),
        overlay: component ?? previous.get(id)?.overlay ?? 'deterministic HTML/CSS overlay',
        interaction: note(segment, 'Interaction'),
        minutes: Number(note(segment, 'Timing')?.match(/[0-9.]+/)?.[0]),
        sources: note(segment, 'Sources')?.split(';').map(value => value.trim()),
        claimBoundary: note(segment, 'Boundary'),
      })
    }
  }
  return slides
}
