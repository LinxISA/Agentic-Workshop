import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import { normalizeBasePath } from '../scripts/pages-paths.mjs'

const expectedBasePath = normalizeBasePath(
  process.env.SUMMERSCHOOL_EXPECTED_BASE_PATH ?? '',
)

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

test('Pages artifact uses the configured asset prefix', async () => {
  const session1Html = await readFile('dist/session-1/index.html', 'utf8')
  const session2Html = await readFile('dist/session-2/index.html', 'utf8')
  const escapedBase = escapeRegExp(expectedBasePath)

  assert.match(session1Html, new RegExp(`${escapedBase}/session-1/assets/`))
  assert.match(session2Html, new RegExp(`${escapedBase}/session-2/assets/`))
})

test('Pages artifact includes all physical numbered slide routes', async () => {
  for (const session of ['session-1', 'session-2']) {
    const sessionHtml = await readFile(`dist/${session}/index.html`, 'utf8')

    for (let slide = 1; slide <= 28; slide += 1) {
      assert.equal(
        await readFile(`dist/${session}/${slide}/index.html`, 'utf8'),
        sessionHtml,
        `${session}/${slide} must serve the deck entry point`,
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
