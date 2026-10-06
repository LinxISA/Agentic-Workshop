import { existsSync, realpathSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { deckBase } from './pages-paths.mjs'

const config = {
  'session-1': { entry: 'decks/session-1/slides.md', out: 'dist/session-1' },
  'session-2': { entry: 'decks/session-2/slides.md', out: 'dist/session-2' },
}
const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function sessionConfig(session) {
  if (!Object.hasOwn(config, session)) {
    throw new TypeError(`Unknown deck session: ${session ?? '(missing)'}`)
  }

  return config[session]
}

export function buildCommand(workspace = workspaceRoot) {
  return {
    command: process.execPath,
    args: [resolve(workspace, 'node_modules/@slidev/cli/bin/slidev.mjs')],
  }
}

export function buildArgs(session, workspace = workspaceRoot) {
  const { entry, out } = sessionConfig(session)
  return [
    'build',
    existsSync(resolve(workspace, entry)) ? realpathSync(resolve(workspace, entry)) : resolve(workspace, entry),
    '--base',
    deckBase(session),
    '--out',
    resolve(workspace, out),
  ]
}

export function buildDeck(session, workspace = workspaceRoot) {
  const { command, args } = buildCommand(workspace)
  return spawnSync(command, [...args, ...buildArgs(session, workspace)], {
    cwd: workspace,
    stdio: 'inherit',
  })
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = buildDeck(process.argv[2])
  if (result.error) {
    throw result.error
  }

  process.exitCode = result.status ?? 1
}
