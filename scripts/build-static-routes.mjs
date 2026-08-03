import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outputRoot = resolve(workspaceRoot, 'dist')

for (const session of ['session-1', 'session-2']) {
  const sessionRoot = resolve(outputRoot, session)
  const html = await readFile(resolve(sessionRoot, 'index.html'), 'utf8')

  for (let slide = 1; slide <= 28; slide += 1) {
    const routeRoot = resolve(sessionRoot, String(slide))
    await mkdir(routeRoot, { recursive: true })
    await writeFile(resolve(routeRoot, 'index.html'), html)
  }
}

await writeFile(resolve(outputRoot, '.nojekyll'), '')
