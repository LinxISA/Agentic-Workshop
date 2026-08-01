import { chromium } from 'playwright-chromium'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const base = process.env.SUMMERSCHOOL_PREVIEW_URL || 'http://127.0.0.1:4173'
const allDecks = [
  { id: 'session-1', source: 'decks/session-1/slides.md' },
  { id: 'session-2', source: 'decks/session-2/slides.md' },
]
const selected = new Set((process.env.SUMMERSCHOOL_QA_DECKS || 'session-1,session-2').split(','))
const decks = allDecks.filter((deck) => selected.has(deck.id))

function slideCount(source) {
  return [...source.matchAll(/^# /gm)].length
}

await mkdir('qa/rendered', { recursive: true })
const browser = await chromium.launch({ headless: true })
const report = { generatedAt: new Date().toISOString(), viewport: [1920, 1080], base, decks: [] }

for (const deck of decks) {
  const source = await readFile(deck.source, 'utf8')
  const count = slideCount(source)
  const outDir = resolve('qa/rendered', deck.id)
  await mkdir(outDir, { recursive: true })
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })
  const page = await context.newPage()
  const remoteRequests = new Set()
  page.on('request', (request) => {
    const url = new URL(request.url())
    if (['http:', 'https:'].includes(url.protocol) && !['127.0.0.1', 'localhost'].includes(url.hostname)) remoteRequests.add(request.url())
  })
  const slides = []

  await page.goto(`${base}/${deck.id}/`, { waitUntil: 'networkidle' })
  await page.waitForSelector('.slidev-layout', { timeout: 15000 })

  for (let i = 1; i <= count; i += 1) {
    await page.screenshot({ path: resolve(outDir, `${String(i).padStart(2, '0')}.png`) })
    const geometry = await page.evaluate(() => {
      const layout = [...document.querySelectorAll('.slidev-layout')].find((candidate) => {
        const rect = candidate.getBoundingClientRect()
        const style = getComputedStyle(candidate)
        return rect.width > 100 && rect.height > 100 && style.visibility !== 'hidden' && style.opacity !== '0'
      })
      if (!layout) return { missingLayout: true, overflow: [], fontMinPx: null, imageIssues: [], contrastIssues: [], titleWrapped: false }
      const root = layout.getBoundingClientRect()
      const scale = root.width / layout.offsetWidth
      const overflow = []
      let fontMinPx = Infinity
      const contrastIssues = []
      const parseRgb = (value) => {
        const parts = value.match(/[\d.]+/g)?.map(Number)
        return parts && parts.length >= 3 ? parts.slice(0, 3) : null
      }
      const luminance = (rgb) => {
        const channels = rgb.map((value) => {
          const n = value / 255
          return n <= .03928 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4
        })
        return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2]
      }
      const contrast = (a, b) => {
        const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
        return (hi + .05) / (lo + .05)
      }
      for (const el of layout.querySelectorAll('*')) {
        const style = getComputedStyle(el)
        const rect = el.getBoundingClientRect()
        if (rect.width > 1 && rect.height > 1 && style.visibility !== 'hidden' && style.display !== 'none') {
          const font = Number.parseFloat(style.fontSize)
          if (Number.isFinite(font) && (el.textContent || '').trim()) fontMinPx = Math.min(fontMinPx, font * scale)
          const crossesSlide = rect.left < root.left - 1 || rect.right > root.right + 1 || rect.top < root.top - 1 || rect.bottom > root.bottom + 1
          const clipsX = ['hidden', 'clip', 'auto', 'scroll'].includes(style.overflowX) && el.scrollWidth > el.clientWidth + 2
          const clipsY = ['hidden', 'clip', 'auto', 'scroll'].includes(style.overflowY) && el.scrollHeight > el.clientHeight + 2
          if (crossesSlide || clipsX || clipsY) {
            overflow.push({
              tag: el.tagName,
              cls: String(el.className).slice(0, 120),
              text: (el.textContent || '').trim().slice(0, 80),
              reason: [crossesSlide && 'slide-boundary', clipsX && 'clip-x', clipsY && 'clip-y'].filter(Boolean).join(','),
            })
          }
        }
      }
      for (const el of layout.querySelectorAll('h1,h2,h3,p,li,td,th,code,button,span')) {
        const text = (el.innerText || el.textContent || '').trim()
        if (!text) continue
        const style = getComputedStyle(el)
        const fg = parseRgb(style.color)
        const bg = [6, 16, 29]
        const font = Number.parseFloat(style.fontSize) * scale
        if (fg && contrast(fg, bg) < (font >= 24 ? 3 : 4.5)) contrastIssues.push({ tag: el.tagName, text: text.slice(0, 80), ratio: Number(contrast(fg, bg).toFixed(2)) })
      }
      const title = layout.querySelector('h1')
      let titleWrapped = false
      if (title) {
        const range = document.createRange()
        range.selectNodeContents(title)
        const lineTops = [...range.getClientRects()].map((rect) => Math.round(rect.top / 3) * 3)
        titleWrapped = new Set(lineTops).size > 1
      }
      const imageIssues = [...layout.querySelectorAll('img')].flatMap((img) => {
        const rect = img.getBoundingClientRect()
        if (!img.complete || img.naturalWidth === 0) return [{ src: img.getAttribute('src'), issue: 'not-loaded' }]
        if (rect.width > 80 && rect.height > 80) {
          const rendered = rect.width / rect.height
          const natural = img.naturalWidth / img.naturalHeight
          if (Math.abs(rendered - natural) / natural > .2 && getComputedStyle(img).objectFit !== 'cover') return [{ src: img.getAttribute('src'), issue: 'aspect-distortion' }]
        }
        return []
      })
      return { missingLayout: false, overflow: overflow.slice(0, 20), fontMinPx: Number.isFinite(fontMinPx) ? Number(fontMinPx.toFixed(1)) : null, imageIssues, contrastIssues: contrastIssues.slice(0, 20), titleWrapped }
    })
    slides.push({ number: i, ...geometry })
    if (i < count) {
      await page.keyboard.press('ArrowRight')
      await page.waitForTimeout(700)
    }
  }
  await context.close()
  report.decks.push({ id: deck.id, count, remoteRequests: [...remoteRequests], slides })
}

await browser.close()
await writeFile('qa/audit.json', `${JSON.stringify(report, null, 2)}\n`)

const failures = report.decks.flatMap((deck) => [
  ...deck.remoteRequests.map((url) => `${deck.id}: remote request ${url}`),
  ...deck.slides.flatMap((slide) => [
    ...(slide.missingLayout ? [`${deck.id}/${slide.number}: layout missing`] : []),
    ...slide.imageIssues.map((issue) => `${deck.id}/${slide.number}: image ${issue.issue} ${issue.src}`),
    ...slide.contrastIssues.map((issue) => `${deck.id}/${slide.number}: contrast ${issue.ratio} ${issue.tag} ${issue.text}`),
    ...(slide.titleWrapped ? [`${deck.id}/${slide.number}: title wrapped`] : []),
    ...(slide.fontMinPx !== null && slide.fontMinPx < 16 ? [`${deck.id}/${slide.number}: font ${slide.fontMinPx}px`] : []),
    ...slide.overflow.map((item) => `${deck.id}/${slide.number}: overflow ${item.tag}.${item.cls} ${item.text}`),
  ]),
])

console.log(`Rendered ${report.decks.reduce((sum, deck) => sum + deck.count, 0)} slides at 1920x1080`)
console.log(`Remote requests: ${report.decks.reduce((sum, deck) => sum + deck.remoteRequests.length, 0)}`)
console.log(`Potential geometry issues: ${failures.filter((f) => f.includes('overflow') || f.includes('image') || f.includes('layout')).length}`)
if (failures.length) {
  console.error(failures.slice(0, 40).join('\n'))
  process.exitCode = 1
}
