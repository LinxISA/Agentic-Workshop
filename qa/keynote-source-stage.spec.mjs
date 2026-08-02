import test from 'node:test'
import assert from 'node:assert/strict'
import { focusAt, normalizeFocuses } from '../components/keynoteSourceStageModel.mjs'

test('normalizeFocuses keeps source-relative regions inside the slide', () => {
  assert.deepEqual(normalizeFocuses([
    { x: 8, y: 18, w: 42, h: 64 },
    { x: 92, y: 90, w: 20, h: 30 },
  ]), [
    { x: 8, y: 18, w: 42, h: 64 },
    { x: 92, y: 90, w: 8, h: 10 },
  ])
})

test('focusAt cycles through normalized focus regions', () => {
  const focuses = normalizeFocuses([{ x: 10, y: 10, w: 20, h: 20 }, { x: 40, y: 40, w: 30, h: 30 }])
  assert.deepEqual(focusAt(focuses, 0), focuses[0])
  assert.deepEqual(focusAt(focuses, 3), focuses[1])
})

test('focusAt returns null when a slide has no animated focus', () => {
  assert.equal(focusAt([], 0), null)
})
