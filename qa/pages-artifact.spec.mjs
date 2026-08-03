import assert from 'node:assert/strict'
import { readFile, readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import test from 'node:test'

import { normalizeBasePath } from '../scripts/pages-paths.mjs'

const expectedBasePath = normalizeBasePath(
  process.env.SUMMERSCHOOL_EXPECTED_BASE_PATH ?? '',
)

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function uncommentedYaml(source) {
  return source
    .split('\n')
    .map((line) => {
      const commentStart = line.indexOf('#')
      return commentStart === -1 ? line : line.slice(0, commentStart).trimEnd()
    })
    .join('\n')
}

function yamlBlock(source, key, indentation) {
  const lines = source.split('\n')
  const prefix = ' '.repeat(indentation)
  const start = lines.findIndex(line => line === `${prefix}${key}:`)
  assert.notEqual(start, -1, `missing ${key} block at indentation ${indentation}`)

  let end = start + 1
  while (end < lines.length) {
    const line = lines[end]
    if (line.trim() && line.length - line.trimStart().length <= indentation) break
    end += 1
  }
  return lines.slice(start, end).join('\n')
}

async function listTree(root, relativeRoot = '') {
  const entries = await readdir(join(root, relativeRoot), { withFileTypes: true })
  const paths = []

  for (const entry of entries) {
    const relativePath = join(relativeRoot, entry.name)
    paths.push(relativePath)

    if (entry.isDirectory()) {
      paths.push(...await listTree(root, relativePath))
    }
  }

  return paths.sort()
}

test('Pages artifact uses the configured asset prefix', async () => {
  const session1Html = await readFile('dist/session-1/index.html', 'utf8')
  const session2Html = await readFile('dist/session-2/index.html', 'utf8')
  const escapedBase = escapeRegExp(expectedBasePath)

  assert.match(session1Html, new RegExp(`${escapedBase}/session-1/assets/`))
  assert.match(session2Html, new RegExp(`${escapedBase}/session-2/assets/`))
})

test('Pages artifact includes all physical numbered slide routes', async () => {
  for (const [session, count] of [['session-1', 33], ['session-2', 31]]) {
    const sessionHtml = await readFile(`dist/${session}/index.html`, 'utf8')

    for (let slide = 1; slide <= count; slide += 1) {
      const routeRoot = `dist/${session}/${slide}`
      assert.equal(
        await readFile(`${routeRoot}/index.html`, 'utf8'),
        sessionHtml,
        `${session}/${slide} must serve the deck entry point`,
      )
      assert.deepEqual(
        await listTree(routeRoot),
        ['index.html'],
        `${session}/${slide} must not duplicate deck assets`,
      )
    }
  }
})

test('Pages artifact disables Jekyll processing', async () => {
  assert.equal(await readFile('dist/.nojekyll', 'utf8'), '')
})

test('root index links to the prefixed sessions and hero image', async () => {
  const rootHtml = await readFile('dist/index.html', 'utf8')

  assert.match(rootHtml, new RegExp(`href="${escapeRegExp(expectedBasePath)}/session-1/"`))
  assert.match(rootHtml, new RegExp(`href="${escapeRegExp(expectedBasePath)}/session-2/"`))
  assert.match(
    rootHtml,
    new RegExp(`url\\('${escapeRegExp(expectedBasePath)}/generated/main-hero\\.png'\\)`),
  )
})

test('GitHub Pages workflow deploys the verified prefixed artifact from main', async () => {
  const workflow = uncommentedYaml(await readFile('.github/workflows/pages.yml', 'utf8'))
  const rootPermissions = yamlBlock(workflow, 'permissions', 0)
  const concurrency = yamlBlock(workflow, 'concurrency', 0)
  const build = yamlBlock(workflow, 'build', 2)
  const buildPermissions = yamlBlock(build, 'permissions', 4)
  const deploy = yamlBlock(workflow, 'deploy', 2)
  const deployPermissions = yamlBlock(deploy, 'permissions', 4)

  assert.match(workflow, /^on:\s*\n\s{2}push:\s*\n\s{4}branches:\s*\[main\]\s*\n\s{2}workflow_dispatch:/m)
  assert.match(rootPermissions, /^\s{2}contents:\s*read$/m)
  assert.doesNotMatch(rootPermissions, /pages:\s*write|id-token:\s*write/)
  assert.match(concurrency, /^\s{2}group:\s*pages$/m)
  assert.match(concurrency, /^\s{2}cancel-in-progress:\s*false$/m)

  assert.match(build, /actions\/checkout@v4/)
  assert.match(buildPermissions, /^\s{6}contents:\s*read$/m)
  assert.match(buildPermissions, /^\s{6}pages:\s*read$/m)
  assert.doesNotMatch(buildPermissions, /pages:\s*write|id-token:\s*write/)
  assert.match(build, /^\s{10}submodules:\s*false$/m)
  assert.match(build, /^\s{10}persist-credentials:\s*false$/m)
  assert.match(build, /actions\/setup-node@v4/)
  assert.match(build, /^\s{10}node-version:\s*22$/m)
  assert.match(build, /^\s{10}cache:\s*npm$/m)
  assert.match(build, /^\s{8}run:\s*npm ci$/m)
  assert.match(build, /^\s{8}run:\s*npm run test:web$/m)
  assert.match(build, /^\s{8}run:\s*npm run build$/m)
  assert.match(build, /^\s{8}run:\s*npm run test:pages$/m)
  assert.match(build, /^\s{10}SUMMERSCHOOL_BASE_PATH:\s*\/SummerSchool$/m)
  assert.match(build, /^\s{10}SUMMERSCHOOL_EXPECTED_BASE_PATH:\s*\/SummerSchool$/m)
  assert.match(build, /actions\/configure-pages@v5/)
  assert.match(build, /actions\/upload-pages-artifact@v4/)
  assert.match(build, /^\s{10}path:\s*dist$/m)
  assert.doesNotMatch(build, /pages:\s*write|id-token:\s*write/)

  assert.match(deploy, /^\s{4}needs:\s*build$/m)
  assert.match(deploy, /^\s{6}name:\s*github-pages$/m)
  assert.match(deploy, /^\s{6}url:\s*\$\{\{ steps\.deployment\.outputs\.page_url \}\}$/m)
  assert.match(deployPermissions, /^\s{6}contents:\s*read$/m)
  assert.match(deployPermissions, /^\s{6}pages:\s*write$/m)
  assert.match(deployPermissions, /^\s{6}id-token:\s*write$/m)
  assert.match(deploy, /actions\/deploy-pages@v4/)
})

test('numbered Pages routes are backed by the complete 33-slide and 31-slide source decks', async () => {
  const sessions = [
    ['session-1', 1, 33],
    ['session-2', 34, 31],
  ]

  for (const [session, firstSlide, count] of sessions) {
    const source = await readFile(`decks/${session}/slides.md`, 'utf8')
    const headings = [...source.matchAll(/^#\s+.+$/gm)]
    const slideIds = [...source.matchAll(/Slide-ID:\s*(S\d{2})/g)].map(match => match[1])

    assert.equal(headings.length, count, `${session} must contain ${count} actual slide headings`)
    assert.deepEqual(
      slideIds,
      Array.from({ length: count }, (_, index) => `S${String(firstSlide + index).padStart(2, '0')}`),
      `${session} must contain exactly one ordered Slide-ID per source slide`,
    )
  }
})

test('documented q_proj replay prerequisites are present in the release worktree', async () => {
  assert.ok((await stat('experiments/11_qproj_davincioo/run.py')).isFile())
  assert.ok((await stat('experiments/artifacts/11')).isDirectory())
})
