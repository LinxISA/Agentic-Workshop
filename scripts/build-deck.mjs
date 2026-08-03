import { spawnSync } from 'node:child_process'

import { deckBase } from './pages-paths.mjs'

const config = {
  'session-1': { entry: 'decks/session-1/slides.md', out: 'dist/session-1' },
  'session-2': { entry: 'decks/session-2/slides.md', out: 'dist/session-2' },
}

const session = process.argv[2]
if (!Object.hasOwn(config, session)) {
  throw new TypeError(`Unknown deck session: ${session ?? '(missing)'}`)
}

const { entry, out } = config[session]
const result = spawnSync('slidev', ['build', entry, '--base', deckBase(session), '--out', out], {
  stdio: 'inherit',
})

if (result.error) {
  throw result.error
}

process.exitCode = result.status ?? 1
