import { readFile, writeFile } from 'node:fs/promises'

const decks = ['session-1', 'session-2']
const rows = []
const components = ['PipelineStepper', 'LinxCoreModuleExplorer', 'CircuitDataflow', 'TimingDiagram', 'TraceComparator', 'NdfTraceability', 'DesignSpaceExplorer', 'ParetoFrontier']

for (const deck of decks) {
  const path = `decks/${deck}/slides.md`
  const source = await readFile(path, 'utf8')
  const headings = [...source.matchAll(/^#\s+(.+)$/gm)]
  for (let index = 0; index < headings.length; index += 1) {
    const match = headings[index]
    const end = headings[index + 1]?.index ?? source.length
    const segment = source.slice(match.index, end)
    const ids = segment.match(/NDF-ID:\s*([^\n]+)/)?.[1]?.trim() ?? 'MISSING'
    const evidence = segment.match(/Evidence:\s*([^\n]+)/)?.[1]?.trim() ?? 'MISSING'
    const used = components.filter((name) => segment.includes(`<${name}`))
    const visual = used.length ? used.join(', ') : (segment.match(/Visual intent:\s*([^；\n]+)/)?.[1]?.trim() ?? 'deterministic HTML/CSS')
    rows.push({ deck, slide: index + 1, title: match[1].replaceAll('|', '\\|'), ids, visual, evidence: evidence.replaceAll('|', '\\|') })
  }
}

const lines = [
  '# Course Traceability Matrix',
  '',
  'Generated from deck speaker notes. This is a course-level NDF projection, not a PTO normative artifact.',
  '',
  '| Course requirement | Slide | Claim | Diagram/component | Experiment/evidence |',
  '|---|---:|---|---|---|',
  ...rows.map((row) => `| ${row.ids} | ${row.deck} · ${row.slide} | ${row.title} | ${row.visual} | ${row.evidence} |`),
  '',
]

if (rows.some((row) => row.ids === 'MISSING' || row.evidence === 'MISSING')) {
  console.error('Traceability generation found missing NDF-ID or Evidence notes')
  process.exit(1)
}

await writeFile('docs/TRACEABILITY.md', `${lines.join('\n')}\n`)
console.log(`Traceability matrix generated for ${rows.length} slides`)
