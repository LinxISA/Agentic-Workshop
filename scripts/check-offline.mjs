import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...await walk(path))
    else out.push(path)
  }
  return out
}

const textFiles = (await walk('dist')).filter((p) => /\.(?:html|js|css|json|map)$/.test(p))
const forbidden = []
for (const file of textFiles) {
  const text = await readFile(file, 'utf8')
  const patterns = [
    /<(?:script|img|iframe|link)[^>]+(?:src|href)=["']https?:\/\/[^"']+/gi,
    /url\(["']?https?:\/\/[^)"']+/gi,
    /(?:fetch|import|WebSocket|EventSource)\s*\(\s*["']https?:\/\/[^"']+/g,
  ]
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) forbidden.push([file, match[0]])
  }
}
if (forbidden.length) {
  console.error('Remote runtime references found:', forbidden.slice(0, 20))
  process.exit(1)
}
console.log(`Offline scan passed across ${textFiles.length} built text assets`)
