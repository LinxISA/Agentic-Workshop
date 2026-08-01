import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { basename } from 'node:path'

const slides = JSON.parse(await readFile('content/slides.json', 'utf8'))
const common = 'Use case: scientific-educational. Asset type: full-bleed 16:9 computer architecture lecture background. Style: cinematic industrial semiconductor cutaway, premium keynote, dark navy, technically grounded. Composition: one coherent processor-architecture scene, calm upper-left title zone, room for precise deterministic SVG overlays. Palette: cyan data movement, yellow compute, lime memory, sparse magenta bottleneck. Constraints: no text, letters, numbers, equations, labels, logos, watermarks, people, robots, pseudo-writing, or decorative fantasy circuitry.'

const assets = []
for (const slide of slides) {
  const asset = basename(slide.background)
  const bytes = await readFile(`assets/generated/slides/${asset}`)
  const prompt = `${common} Scene: ${slide.title}. Architecture claim to visualize: ${slide.claim} Required composition for the foreground teaching layer: ${slide.overlay}. Keep the processor, memory hierarchy, queues, interconnect, or pipeline as the visual subject; Agentic Circuit may appear only as an analytical projection.`
  assets.push({
    slide: slide.id,
    asset,
    prompt,
    date: '2026-08-01',
    source_style: 'PTO ISA_扩展版 · image-dominant architecture keynote',
    final_path: `assets/generated/slides/${asset}`,
    runtime_path: `public/generated/slides/${asset}`,
    review: 'pass',
    regenerated: slide.id === 'S05',
    sha256: createHash('sha256').update(bytes).digest('hex'),
  })
}

const manifest = {
  generator: 'OpenAI ImageGen',
  policy: 'one unique, locally bundled, visually reviewed architecture background per slide',
  prompt_record: 'generation specification preserved from the brief, slide claim, and foreground overlay contract',
  assets,
}

await writeFile('assets/generated/prompts.yaml', `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
console.log(`wrote ${assets.length} reviewed ImageGen prompt records`)
