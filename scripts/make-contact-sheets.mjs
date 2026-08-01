import sharp from 'sharp'
import { mkdir, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const cell = { width: 384, height: 216 }
const columns = 4
const gap = 12

async function make(deck) {
  const inputDir = resolve('qa/rendered', deck)
  const files = (await readdir(inputDir))
    .filter((name) => name.endsWith('.png'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  const rows = Math.ceil(files.length / columns)
  const width = columns * cell.width + (columns + 1) * gap
  const height = rows * cell.height + (rows + 1) * gap
  const images = await Promise.all(files.map(async (name, index) => ({
    input: await sharp(resolve(inputDir, name)).resize(cell.width, cell.height, { fit: 'contain', background: '#06101d' }).png().toBuffer(),
    left: gap + (index % columns) * (cell.width + gap),
    top: gap + Math.floor(index / columns) * (cell.height + gap),
  })))
  await sharp({ create: { width, height, channels: 3, background: '#06101d' } })
    .composite(images)
    .png()
    .toFile(resolve('qa/contact-sheets', `${deck}.png`))
  console.log(`${deck}: ${files.length} slides -> ${width}x${height} contact sheet`)
}

await mkdir('qa/contact-sheets', { recursive: true })
await make('session-1')
await make('session-2')
