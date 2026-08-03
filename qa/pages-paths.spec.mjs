import assert from 'node:assert/strict'
import test from 'node:test'

import { deckBase, normalizeBasePath } from '../scripts/pages-paths.mjs'

test('normalizes an empty or trailing-slash base path', () => {
  assert.equal(normalizeBasePath(''), '')
  assert.equal(normalizeBasePath('/SummerSchool/'), '/SummerSchool')
})

test('derives a trailing-slash deck base from the configured site path', () => {
  assert.equal(deckBase('session-1', ''), '/session-1/')
  assert.equal(deckBase('session-2', '/SummerSchool'), '/SummerSchool/session-2/')
})

test('rejects invalid base paths and unknown sessions', () => {
  assert.throws(() => normalizeBasePath('https://example.com'))
  assert.throws(() => deckBase('session-3', ''))
})
