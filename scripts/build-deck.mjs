import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

import { deckBase } from './pages-paths.mjs'

const config = {
  'session-1': { entry: 'decks/session-1/slides.md', out: 'dist/session-1' },
  'session-2': { entry: 'decks/session-2/slides.md', out: 'dist/session-2' },
}

function sessionConfig(session) {
  if (!Object.hasOwn(config, session)) {
    throw new TypeError(`Unknown deck session: ${session ?? '(missing)'}`)
  }

  return config[session]
}

export function buildArgs(session, workspace = process.cwd()) {
  const { entry, out } = sessionConfig(session)
  return ['build', entry, '--base', deckBase(session), '--out', resolve(workspace, out)]
}

export function buildDeck(session, workspace = process.cwd()) {
  return spawnSync('slidev', buildArgs(session, workspace), { stdio: 'inherit' })
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = buildDeck(process.argv[2])
  if (result.error) {
    throw result.error
  }

  process.exitCode = result.status ?? 1
}
