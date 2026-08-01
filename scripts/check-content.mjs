import { readFile } from 'node:fs/promises'

const decks = ['decks/session-1/slides.md', 'decks/session-2/slides.md']
let failed = false
for (const deck of decks) {
  const source = await readFile(deck, 'utf8')
  const headings = [...source.matchAll(/^#\s+.+$/gm)]
  const contentSlides = headings.map((match, index) => source.slice(match.index, headings[index + 1]?.index ?? source.length))
  const missingNotes = contentSlides.filter((s) => !s.includes('NDF-ID:'))
  const remote = source.match(/(?:src=|url\(|!\[[^\]]*\]\()\s*["']?https?:\/\//g) || []
  const visual = /<(?:PipelineStepper|LinxCoreModuleExplorer|CircuitDataflow|TimingDiagram|TraceComparator|NdfTraceability|DesignSpaceExplorer|ParetoFrontier)|<img|```(?:mermaid|plantuml)|class:\s*(?:hero|architecture|circuit-focus|code-trace|experiment|compare|evidence|quiz)/
  const missingVisual = contentSlides.filter((s) => !visual.test(s))
  if (missingNotes.length || missingVisual.length || remote.length) {
    failed = true
    console.error(`${deck}: missingNotes=${missingNotes.length} missingVisual=${missingVisual.length} remoteRuntimeRefs=${remote.length}`)
  } else {
    console.log(`${deck}: ${contentSlides.length} content slides pass notes/visual/offline-source checks`)
  }
}
if (failed) process.exit(1)
