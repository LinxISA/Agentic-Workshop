import { readFile, writeFile } from 'node:fs/promises'

const session1Path = 'decks/session-1/slides.md'
const session2Path = 'decks/session-2/slides.md'

function parseDeck(source) {
  const segments = source.split('\n---\n')
  const frontmatter = segments.shift()
  const slides = new Map()
  for (const segment of segments) {
    const id = segment.match(/Slide-ID:\s*(S\d{2})/)?.[1]
    if (!id) throw new Error('Slide block is missing Slide-ID')
    slides.set(id, segment)
  }
  return { frontmatter, slides }
}

const session1 = parseDeck(await readFile(session1Path, 'utf8'))
const session2 = parseDeck(await readFile(session2Path, 'utf8'))
const originalSlides = new Map([...session1.slides, ...session2.slides])

const removed = new Set(['S23', 'S35', 'S39', 'S64', 'S65', 'S66'])
const order = Array.from({ length: 76 }, (_, index) => `S${String(index + 1).padStart(2, '0')}`)
  .filter(id => !removed.has(id))
order.splice(order.indexOf('S29') + 1, 0, 'KEYNOTE_EXTRA_TILE')

if (order.length !== 71) throw new Error(`Expected 71 slides after Keynote sync, got ${order.length}`)

const preserveInteractive = new Set([
  'S08', 'S25', 'S26', 'S32',
  ...Array.from({ length: 14 }, (_, index) => `S${50 + index}`),
  ...Array.from({ length: 10 }, (_, index) => `S${67 + index}`),
])
const keynoteDrawerSlides = new Set(['S08', 'S25', 'S26', 'S32'])

const titleOverrides = new Map([
  [23, '空间、时间和 PTO'],
  [28, 'PTO 为每个存储层级增加搬运指令'],
  [29, 'Tile 数据搬运的城市隐喻'],
  [33, '昇腾 950 的多尺度调度'],
  [34, 'PTO：多层级的系统调度'],
  [35, 'PTO 示例：Agentic Kernel Generator'],
  [36, 'PTO 指令集：TLOAD / TSTORE'],
  [37, '数据搬运时间实验'],
  [38, '第三章：Agentic Model'],
  [39, 'Agentic Architecture Model：基础仿真组件'],
  [40, 'Agentic Architecture Model：基于 MLIR 的架构方言'],
  [41, 'Agentic Architecture Model'],
  [42, 'Agentic Architecture Model：架构城市'],
  [43, 'Python 描述的是建造过程'],
  [44, 'NPUCity：代码执行一次，得到一张静态图'],
  [45, '四类装饰器，四种架构生成边界'],
  [46, 'Lowering 把连接属性物化成 SimQueue'],
  [47, '第四章：硅基 NPU Core'],
])

function escapeAttribute(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
}

function timingFor(page) {
  if (page <= 37) return page === 1 ? 3 : 2
  return page <= 44 ? 3 : 2
}

function titleFor(oldId, page) {
  if (titleOverrides.has(page)) return titleOverrides.get(page)
  if (!oldId) return `Keynote 第 ${page} 页`
  return originalSlides.get(oldId)?.match(/^#\s+(.+)$/m)?.[1] ?? `Keynote 第 ${page} 页`
}

function addLatestKeynoteSource(block, page) {
  const keyId = `K${String(page).padStart(2, '0')}`
  let result = block.replace(/^\s*-\s*source:\s*K\d{2}\s*$/gmi, '')
  result = result.replace('[Sources]', `[Sources]\n- source: ${keyId}\n- catalog: publish-keynote-latest`)
  result = result.replace(/^Sources:\s*([^\n]+)$/m, (_, sources) => {
    const values = sources.split(';').map(value => value.trim()).filter(Boolean)
    return `Sources: ${['publish-keynote-latest', ...values.filter(value => value !== 'publish-keynote-latest')].join('; ')}`
  })
  return result
}

function preserveBlock(oldId, newId, page) {
  let block = originalSlides.get(oldId)
  if (!block) throw new Error(`Missing original block ${oldId}`)
  block = block.replace(new RegExp(`Slide-ID:\\s*${oldId}`, 'g'), `Slide-ID: ${newId}`)
  block = block.replace(new RegExp(`slide-id="${oldId}"`, 'g'), `slide-id="${newId}"`)
  block = block.replace(/^Timing:\s*[^\n]+$/m, `Timing: ${timingFor(page)} min`)
  block = addLatestKeynoteSource(block, page)
  if (keynoteDrawerSlides.has(oldId)) {
    block = block.replace(/background="[^"]+"/, `background="/generated/keynote-latest/page-${String(page).padStart(2, '0')}.png"`)
  }
  return block
}

function keynoteBlock(oldId, newId, page) {
  const title = escapeAttribute(titleFor(oldId, page))
  const pageLabel = String(page).padStart(2, '0')
  return `
# ${title}

<KeynoteSourceStage background="/generated/keynote-latest/page-${pageLabel}.png" title="${title}" claim="最新 Keynote 第 ${page} 页" slide-id="${newId}" />

<!--
Slide-ID: ${newId}
Objective: 严格按照演讲人最新 Keynote 第 ${page} 页呈现课程内容。
Timing: ${timingFor(page)} min
Visual: 最新 Keynote 第 ${page} 页的 1920×1080 确定性整页渲染。
Interaction: 使用方向键、PageUp/PageDown 或空格翻页。
Sources: publish-keynote-latest
Boundary: 可见文字、图片、图表与排版直接来自演讲人最新 Keynote，不推断未公开实现细节。
Narrative: 以最新 Keynote 的删改和顺序作为本轮网页课程的唯一内容来源。
Transition: 按最新 Keynote 顺序进入下一页。
[Sources]
- source: K${pageLabel}
- catalog: publish-keynote-latest
-->
`
}

const output = order.map((oldId, index) => {
  const page = index + 1
  const newId = `S${String(page).padStart(2, '0')}`
  if (oldId !== 'KEYNOTE_EXTRA_TILE' && preserveInteractive.has(oldId)) {
    return preserveBlock(oldId, newId, page)
  }
  return keynoteBlock(oldId === 'KEYNOTE_EXTRA_TILE' ? null : oldId, newId, page)
})

await writeFile(session1Path, `${[session1.frontmatter, ...output.slice(0, 37)].join('\n---\n').trimEnd()}\n`)
await writeFile(session2Path, `${[session2.frontmatter, ...output.slice(37)].join('\n---\n').trimEnd()}\n`)

console.log('synced latest 71-page Keynote into Slidev: session-1=37, session-2=34')
